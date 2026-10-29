import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import express from 'express';

import {
  executeCommit,
  getBranchDiff,
  getRepoStatus,
  getStagedDiff,
  getStagedDiffRaw,
  getStagedDiffStats,
  isValidBranchName,
  runGit,
  stageAll,
  truncateDiff,
} from './git.js';
import { MODEL, generateCommitMessage, generatePRDescription } from './ai.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const WEB_DIR = path.join(ROOT, 'web');
const PACKAGE = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const PORT = Number(process.env.PORT) || 4173;
const HOST = '127.0.0.1';
const MAX_DIFF_CHARS = 12_000;

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '64kb' }));
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'no-store');
  }
  next();
});

const route = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function requireString(value, field, { max = 4096 } = {}) {
  if (typeof value !== 'string' || !value.trim()) {
    throw httpError(400, `"${field}" is required.`);
  }

  const trimmed = value.trim();
  if (trimmed.length > max) {
    throw httpError(400, `"${field}" is too long.`);
  }

  return trimmed;
}

function resolveRepo(input) {
  const raw = requireString(input, 'path', { max: 1024 });
  const resolved = path.resolve(raw);

  let stat;
  try {
    stat = fs.statSync(resolved);
  } catch {
    throw httpError(400, `Directory not found: ${resolved}`);
  }

  if (!stat.isDirectory()) {
    throw httpError(400, 'The path must be a directory.');
  }

  try {
    return getRepoStatus(resolved);
  } catch (error) {
    throw httpError(400, error.message);
  }
}

function repoFromBody(req) {
  return resolveRepo(req.body?.path);
}

function stagedDiffOrThrow(repoPath) {
  try {
    return getStagedDiff(MAX_DIFF_CHARS, repoPath);
  } catch (error) {
    throw httpError(400, error.message);
  }
}

function branchDiffOrThrow(repoPath, base) {
  try {
    return getBranchDiff(base, MAX_DIFF_CHARS, repoPath);
  } catch (error) {
    throw httpError(400, error.message);
  }
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    name: PACKAGE.name,
    version: PACKAGE.version,
    model: MODEL,
    defaultPath: process.cwd(),
    home: os.homedir(),
    platform: process.platform,
  });
});

app.post('/api/repo', route(async (req, res) => {
  res.json(repoFromBody(req));
}));

app.get('/api/directories', route(async (req, res) => {
  const requested = typeof req.query.path === 'string' && req.query.path.trim()
    ? req.query.path.trim()
    : os.homedir();
  const target = path.resolve(requested);

  let stat;
  try {
    stat = fs.statSync(target);
  } catch {
    throw httpError(400, `Directory not found: ${target}`);
  }

  if (!stat.isDirectory()) {
    throw httpError(400, 'The path must be a directory.');
  }

  let directories = [];
  try {
    directories = fs.readdirSync(target, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .filter((entry) => entry.name !== 'node_modules' && entry.name !== '.git')
      .filter((entry) => !entry.name.startsWith('.'))
      .map((entry) => {
        const fullPath = path.join(target, entry.name);
        return {
          name: entry.name,
          path: fullPath,
          isGitRepo: fs.existsSync(path.join(fullPath, '.git')),
        };
      })
      .sort((a, b) => Number(b.isGitRepo) - Number(a.isGitRepo) || a.name.localeCompare(b.name));
  } catch (error) {
    throw httpError(403, `Cannot read this directory: ${error.message}`);
  }

  res.json({
    path: target,
    parent: path.dirname(target) === target ? null : path.dirname(target),
    isGitRepo: fs.existsSync(path.join(target, '.git')),
    directories: directories.slice(0, 500),
  });
}));

app.get('/api/branches', route(async (req, res) => {
  const repo = resolveRepo(req.query.path);
  const output = runGit(['branch', '--all', '--format=%(refname:short)'], {
    cwd: repo.path,
  });

  const branches = [...new Set(
    output.split('\n')
      .map((name) => name.trim().replace(/^remotes\//, ''))
      .filter((name) => name && !name.includes('HEAD')),
  )].sort((a, b) => a.localeCompare(b));

  res.json({ branches, current: repo.branch });
}));

app.post('/api/diff', route(async (req, res) => {
  const repo = repoFromBody(req);
  const raw = getStagedDiffRaw(repo.path);

  res.json({
    diff: truncateDiff(raw, MAX_DIFF_CHARS),
    truncated: raw.length > MAX_DIFF_CHARS,
    stats: getStagedDiffStats(repo.path),
  });
}));

app.post('/api/stage', route(async (req, res) => {
  const repo = repoFromBody(req);
  res.json(stageAll(repo.path));
}));

app.post('/api/commit/generate', route(async (req, res) => {
  const repo = repoFromBody(req);
  const diff = stagedDiffOrThrow(repo.path);
  const stats = getStagedDiffStats(repo.path);

  console.log(`[ai] commit message · ${repo.path} · ${stats.files} files · ${diff.length} chars`);
  const startedAt = Date.now();
  const message = await generateCommitMessage(diff);
  console.log(`[ai] commit message ready in ${((Date.now() - startedAt) / 1000).toFixed(1)}s`);

  res.json({ message, stats });
}));

app.post('/api/commit', route(async (req, res) => {
  const repo = repoFromBody(req);
  const message = requireString(req.body?.message, 'message', { max: 5000 });

  if (!getStagedDiffRaw(repo.path)) {
    throw httpError(400, 'No staged changes to commit.');
  }

  console.log(`[git] commit · ${repo.path}`);
  const output = executeCommit(message, repo.path);
  const status = getRepoStatus(repo.path);
  res.json({ output, status, commit: status.head });
}));

app.post('/api/pr/generate', route(async (req, res) => {
  const repo = repoFromBody(req);
  const base = requireString(req.body?.base ?? 'main', 'base', { max: 255 });

  if (!isValidBranchName(base)) {
    throw httpError(400, 'Invalid base branch name.');
  }

  const branchData = branchDiffOrThrow(repo.path, base);

  console.log(`[ai] PR description · ${repo.path} · ${repo.branch} → ${base}`);
  const startedAt = Date.now();
  const description = await generatePRDescription(branchData);
  console.log(`[ai] PR description ready in ${((Date.now() - startedAt) / 1000).toFixed(1)}s`);

  res.json({ description, base });
}));

app.use(express.static(WEB_DIR, { extensions: ['html'], maxAge: 0, index: 'index.html' }));

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found.' });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.status ?? 500;
  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({ error: error.message || 'Unexpected server error.' });
});

function openBrowser(url) {
  const [command, args] = process.platform === 'win32'
    ? ['cmd', ['/c', 'start', '', url]]
    : process.platform === 'darwin'
      ? ['open', [url]]
      : ['xdg-open', [url]];

  const child = spawn(command, args, { detached: true, stdio: 'ignore' });
  child.unref();
}

const server = app.listen(PORT, HOST, () => {
  const url = `http://${HOST}:${PORT}`;
  console.log('');
  console.log('  smart-git studio');
  console.log(`  Local   ${url}`);
  console.log(`  Model   ${MODEL}`);
  console.log(`  Root    ${ROOT}`);
  console.log('');
  console.log('  Press Ctrl+C to stop.');

  if (process.argv.includes('--open')) {
    openBrowser(url);
  }
});

// AI requests can legitimately take a couple of minutes.
server.timeout = 0;
server.keepAliveTimeout = 65_000;

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try: PORT=4174 npm run web`);
    process.exit(1);
  }

  throw error;
});
