import test from 'node:test';
import assert from 'node:assert/strict';
import { executeCommit, truncateDiff } from '../src/git.js';

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
