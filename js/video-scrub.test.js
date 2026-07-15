const test = require('node:test');
const assert = require('node:assert/strict');
const { computeScrubTime } = require('./video-scrub.js');

test('computeScrubTime scales progress by duration', () => {
  assert.equal(computeScrubTime(0, 10), 0);
  assert.equal(computeScrubTime(0.5, 10), 5);
  assert.equal(computeScrubTime(1, 10), 10);
});

test('computeScrubTime clamps out-of-range progress', () => {
  assert.equal(computeScrubTime(-0.2, 10), 0);
  assert.equal(computeScrubTime(1.5, 10), 10);
});
