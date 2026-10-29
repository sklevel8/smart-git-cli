import test from 'node:test';
import assert from 'node:assert/strict';
import {
  executeCommit,
  isValidBranchName,
  parseStatus,
  truncateDiff,
} from '../src/git.js';

test('truncateDiff leaves diffs under the limit untouched', () => {
  const diff = 'x'.repeat(100);
  assert.equal(truncateDiff(diff, 100), diff);
});

test('truncateDiff truncates oversized diffs and notes the omission', () => {
  const diff = 'x'.repeat(500);
  const result = truncateDiff(diff, 100);

  assert.ok(result.startsWith('x'.repeat(100)));
  assert.match(result, /truncated/);
  assert.ok(result.length < diff.length);
});

test('truncateDiff returns an empty string for empty input', () => {
  assert.equal(truncateDiff(''), '');
});

test('executeCommit rejects an empty message before touching git', () => {
  assert.throws(() => executeCommit('   '), /cannot be empty/i);
});

test('parseStatus separates staged, unstaged, and untracked files', () => {
  const output = [
    'A  src/new.js',
    ' M src/edited.js',
    '?? notes.txt',
    'R  src/renamed.js',
    'src/old.js',
    '',
  ].join('\0');

  const { staged, unstaged, untracked } = parseStatus(output);

  assert.deepEqual(
    staged.map((file) => [file.status, file.path]),
    [['A', 'src/new.js'], ['R', 'src/renamed.js']],
  );
  assert.equal(staged[1].originalPath, 'src/old.js');
  assert.deepEqual(
    unstaged.map((file) => [file.status, file.path]),
    [['M', 'src/edited.js']],
  );
  assert.deepEqual(untracked.map((file) => file.path), ['notes.txt']);
});

test('isValidBranchName accepts normal branches and rejects unsafe names', () => {
  assert.equal(isValidBranchName('main'), true);
  assert.equal(isValidBranchName('feature/smart-ui'), true);
  assert.equal(isValidBranchName('origin/main'), true);
  assert.equal(isValidBranchName('--help'), false);
  assert.equal(isValidBranchName('bad branch'), false);
  assert.equal(isValidBranchName('main; rm -rf /'), false);
  assert.equal(isValidBranchName(''), false);
});
