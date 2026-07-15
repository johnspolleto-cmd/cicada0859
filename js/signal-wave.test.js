const test = require('node:test');
const assert = require('node:assert/strict');
const { generateSignalGroups } = require('./signal-wave.js');

test('generateSignalGroups returns the requested count of groups', () => {
  const groups = generateSignalGroups(5, 6);
  assert.equal(groups.length, 5);
});

test('generateSignalGroups formats digits in pairs separated by spaces', () => {
  const [group] = generateSignalGroups(1, 6);
  assert.match(group, /^\d{2} \d{2} \d{2}$/);
});
