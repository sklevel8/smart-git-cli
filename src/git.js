import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DEFAULT_MAX_CHARS = 12_000;

// Lockfiles and generated artifacts add noise without helping the model.
const NOISE_EXCLUDES = [
  ':!package-lock.json',
  ':!yarn.lock',
  ':!pnpm-lock.yaml',
  ':!**/*.min.js',
  ':!**/*.min.css',
  ':!dist/**',
  ':!build/**',
  ':!coverage/**',
];

const STATUS_LABELS = {
  M: 'Modified',
  A: 'Added',
  D: 'Deleted',
  R: 'Renamed',
  C: 'Copied',
  U: 'Unmerged',
  T: 'Type changed',
};

/**
 * Run a git command safely using an argument array instead of a shell string.
 * @param {string[]} args
 * @param {import('node:child_process').ExecFileSyncOptionsWithStringEncoding} [options]
 * @returns {string}
 */
export function runGit(args, options = {}) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    ...options,
  }).trim();
}

/**
 * Run a git command and preserve leading/trailing whitespace (needed for porcelain output).
 * @param {string[]} args
 * @param {import('node:child_process').ExecFileSyncOptionsWithStringEncoding} [options]
 * @returns {string}
 */
export function runGitRaw(args, options = {}) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    ...options,
  });
}

/**
 * Resolve the root of the Git work tree containing `cwd`.
 * @param {string} [cwd]
 * @returns {string}
 */
export function getRepoRoot(cwd = process.cwd()) {
  try {
    return path.resolve(runGit(['rev-parse', '--show-toplevel'], { cwd }));
  } catch {
    throw new Error('This path is not inside a Git repository.');
  }
}

/**
 * Ensure the given directory is inside a Git work tree.
 * @param {string} [cwd]
 */
export function assertGitRepo(cwd = process.cwd()) {
  try {
    const inside = runGit(['rev-parse', '--is-inside-work-tree'], { cwd });
    if (inside !== 'true') {
      throw new Error('not inside a work tree');
    }
  } catch {
    throw new Error('This command must be run inside a Git repository.');
  }
}

/**
 * Keep diffs within a predictable character budget before sending them to the LLM.
 * @param {string} diff
 * @param {number} [maxChars]
 * @returns {string}
 */
export function truncateDiff(diff, maxChars = DEFAULT_MAX_CHARS) {
  if (!diff) return '';
  if (diff.length <= maxChars) return diff;

  const omitted = diff.length - maxChars;
  return `${diff.slice(0, maxChars)}\n\n... [diff truncated: ${omitted.toLocaleString('en-US')} characters omitted] ...`;
}

/**
 * Return the raw staged diff, excluding lockfiles and generated build output.
 * @param {string} [cwd]
 * @returns {string}
 */
export function getStagedDiffRaw(cwd = process.cwd()) {
  return runGit(
    ['diff', '--cached', '--unified=3', '--', '.', ...NOISE_EXCLUDES],
    { cwd },
  );
}

/**
 * Return the staged diff, excluding lockfiles and generated build output.
 * @param {number} [maxChars]
 * @param {string} [cwd]
 * @returns {string}
 */
export function getStagedDiff(maxChars = DEFAULT_MAX_CHARS, cwd = process.cwd()) {
  const diff = getStagedDiffRaw(cwd);

  if (!diff) {
    throw new Error('No staged changes found. Stage files with "git add <files>" first.');
  }

  return truncateDiff(diff, maxChars);
}

/**
 * Summarize the staged diff (files, insertions, deletions).
 * @param {string} [cwd]
 * @returns {{ files: number, insertions: number, deletions: number }}
 */
export function getStagedDiffStats(cwd = process.cwd()) {
  const output = runGit(
    ['diff', '--cached', '--numstat', '--', '.', ...NOISE_EXCLUDES],
    { cwd },
  );

  let files = 0;
  let insertions = 0;
  let deletions = 0;

  for (const line of output.split('\n')) {
    if (!line.trim()) continue;

    const [added, removed] = line.split('\t');
    files += 1;
    if (added !== '-') insertions += Number(added) || 0;
    if (removed !== '-') deletions += Number(removed) || 0;
  }

  return { files, insertions, deletions };
}

/**
 * Return commit history plus the diff for the current branch relative to a base branch.
 * @param {string} [base]
 * @param {number} [maxChars]
 * @param {string} [cwd]
 * @returns {string}
 */
export function getBranchDiff(
  base = 'main',
  maxChars = DEFAULT_MAX_CHARS,
  cwd = process.cwd(),
) {
  let mergeBase;

  try {
    mergeBase = runGit(['merge-base', base, 'HEAD'], { cwd });
  } catch {
    throw new Error(`Could not compare against base branch "${base}". Does it exist?`);
  }

  const commits = runGit(
    ['log', '--pretty=format:%h %s', '--no-merges', `${mergeBase}..HEAD`],
    { cwd },
  );

  const diff = runGit(
    ['diff', '--unified=3', mergeBase, 'HEAD', '--', '.', ...NOISE_EXCLUDES],
    { cwd },
  );

  if (!commits && !diff) {
    throw new Error(`No committed changes found between "${base}" and HEAD.`);
  }

  return truncateDiff(
    `Commits:\n${commits || '(none)'}\n\nDiff:\n${diff || '(none)'}`,
    maxChars,
  );
}

/**
 * Parse `git status --porcelain=v1 -z` output.
 * @param {string} output
 * @returns {{ staged: object[], unstaged: object[], untracked: object[] }}
 */
export function parseStatus(output) {
  const entries = output.split('\0');
  const staged = [];
  const unstaged = [];
  const untracked = [];

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    if (!entry) continue;

    const x = entry[0];
    const y = entry[1];
    const filePath = entry.slice(3);
    let originalPath;

    if (x === 'R' || x === 'C') {
      originalPath = entries[index + 1];
      index += 1;
    }

    if (x === '?' && y === '?') {
      untracked.push({ path: filePath, status: '?', label: 'Untracked' });
      continue;
    }

    if (x !== ' ' && x !== '?' && x !== '!') {
      staged.push({
        path: filePath,
        originalPath,
        status: x,
        label: STATUS_LABELS[x] ?? x,
      });
    }

    if (y !== ' ' && y !== '?' && y !== '!') {
      unstaged.push({
        path: filePath,
        originalPath,
        status: y,
        label: STATUS_LABELS[y] ?? y,
      });
    }
  }

  return { staged, unstaged, untracked };
}

/**
 * Describe the current state of a repository.
 * @param {string} [cwd]
 * @returns {object}
 */
export function getRepoStatus(cwd = process.cwd()) {
  const root = getRepoRoot(cwd);

  let branch = '(detached)';
  try {
    branch = runGit(['branch', '--show-current'], { cwd: root }) || '(detached)';
  } catch {
    // Keep the detached fallback.
  }

  const statusOutput = runGitRaw(
    ['status', '--porcelain=v1', '-z', '--untracked-files=all'],
    { cwd: root },
  );
  const { staged, unstaged, untracked } = parseStatus(statusOutput);

  let head = null;
  try {
    const raw = runGit(
      ['log', '-1', '--pretty=format:%h%x00%s%x00%an%x00%ar'],
      { cwd: root },
    );
    const [hash, subject, author, relativeDate] = raw.split('\0');
    if (hash) head = { hash, subject, author, relativeDate };
  } catch {
    // An empty repository has no HEAD commit.
  }

  let upstream = null;
  let ahead = 0;
  let behind = 0;

  try {
    upstream = runGit(
      ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}'],
      { cwd: root },
    );
    const counts = runGit(
      ['rev-list', '--left-right', '--count', 'HEAD...@{upstream}'],
      { cwd: root },
    );
    const [aheadCount, behindCount] = counts.split(/\s+/).map(Number);
    ahead = aheadCount || 0;
    behind = behindCount || 0;
  } catch {
    upstream = null;
  }

  return {
    path: root,
    name: path.basename(root),
    branch,
    head,
    upstream,
    ahead,
    behind,
    staged,
    unstaged,
    untracked,
    clean: staged.length === 0 && unstaged.length === 0 && untracked.length === 0,
  };
}

/**
 * Stage every change in the repository and return the fresh status.
 * @param {string} [cwd]
 * @returns {object}
 */
export function stageAll(cwd = process.cwd()) {
  runGit(['add', '-A'], { cwd });
  return getRepoStatus(cwd);
}

/**
 * Create a commit using the generated message. Argument arrays keep the message
 * from being interpreted by a shell.
 * @param {string} message
 * @param {string} [cwd]
 * @returns {string}
 */
export function executeCommit(message, cwd = process.cwd()) {
  if (!message || !message.trim()) {
    throw new Error('Commit message cannot be empty.');
  }

  try {
    return execFileSync('git', ['commit', '-m', message], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch (error) {
    const detail = error.stderr?.toString().trim() || error.message;
    throw new Error(`Git commit failed: ${detail}`);
  }
}

/**
 * Validate a branch name before passing it to git.
 * @param {string} name
 * @returns {boolean}
 */
export function isValidBranchName(name) {
  if (typeof name !== 'string') return false;

  const trimmed = name.trim();
  if (!trimmed || trimmed.startsWith('-') || trimmed.length > 255) return false;

  return /^[A-Za-z0-9._/-]+$/.test(trimmed);
}
