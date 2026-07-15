const test = require('node:test');
const assert = require('node:assert/strict');
const { isValidEmail } = require('./waitlist-form.js');

test('isValidEmail accepts a well-formed address', () => {
  assert.equal(isValidEmail('agent@cikada0859.ru'), true);
});

test('isValidEmail rejects addresses without a domain', () => {
  assert.equal(isValidEmail('agent@'), false);
});

test('isValidEmail rejects strings without an @', () => {
  assert.equal(isValidEmail('agent.cikada0859.ru'), false);
});
