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
 * Ensure the current directory is inside a Git work tree.
 */
export function assertGitRepo() {
  try {
    const inside = runGit(['rev-parse', '--is-inside-work-tree']);
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
 * Return the staged diff, excluding lockfiles and generated build output.
 * @param {number} [maxChars]
 * @returns {string}
 */
export function getStagedDiff(maxChars = DEFAULT_MAX_CHARS) {
  const diff = runGit([
    'diff',
    '--cached',
    '--unified=3',
    '--',
    '.',
    ...NOISE_EXCLUDES,
  ]);

  if (!diff) {
    throw new Error('No staged changes found. Stage files with "git add <files>" first.');
  }

  return truncateDiff(diff, maxChars);
}

/**
 * Return commit history plus the diff for the current branch relative to a base branch.
 * @param {string} [base]
 * @param {number} [maxChars]
 * @returns {string}
 */
export function getBranchDiff(base = 'main', maxChars = DEFAULT_MAX_CHARS) {
  let mergeBase;

  try {
    mergeBase = runGit(['merge-base', base, 'HEAD']);
  } catch {
    throw new Error(`Could not compare against base branch "${base}". Does it exist?`);
  }

  const commits = runGit([
    'log',
    '--pretty=format:%h %s',
    '--no-merges',
    `${mergeBase}..HEAD`,
  ]);

  const diff = runGit([
    'diff',
    '--unified=3',
    mergeBase,
    'HEAD',
    '--',
    '.',
    ...NOISE_EXCLUDES,
  ]);

  if (!commits && !diff) {
    throw new Error(`No committed changes found between "${base}" and HEAD.`);
  }

  return truncateDiff(
    `Commits:\n${commits || '(none)'}\n\nDiff:\n${diff || '(none)'}`,
    maxChars,
  );
}

/**
 * Create a commit using the generated message. Argument arrays keep the message
 * from being interpreted by a shell.
 * @param {string} message
 * @returns {string}
 */
export function executeCommit(message) {
  if (!message || !message.trim()) {
    throw new Error('Commit message cannot be empty.');
  }

  return execFileSync('git', ['commit', '-m', message], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}
