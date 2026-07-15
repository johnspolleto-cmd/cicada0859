const test = require('node:test');
const assert = require('node:assert/strict');
const { computeCheckpointDelay } = require('./route-map.js');

test('computeCheckpointDelay spreads delays evenly across the route', () => {
  assert.equal(computeCheckpointDelay(0, 5, 1), 0);
  assert.equal(computeCheckpointDelay(4, 5, 1), 1);
  assert.equal(computeCheckpointDelay(2, 5, 1), 0.5);
});

test('computeCheckpointDelay handles a single checkpoint without dividing by zero', () => {
  assert.equal(computeCheckpointDelay(0, 1, 1), 0);
});
