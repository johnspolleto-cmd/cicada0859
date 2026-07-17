const test = require('node:test');
const assert = require('node:assert/strict');
const {
  computeGrid,
  breathPulse,
  scanBand,
  blinkEnvelope,
  nextFlipDelay,
} = require('./matrix-cicada.js');

test('computeGrid rounds cells up and guards against zero sizes', () => {
  assert.deepEqual(computeGrid(100, 50, 10), { cols: 10, rows: 5 });
  assert.deepEqual(computeGrid(101, 51, 10), { cols: 11, rows: 6 });
  assert.deepEqual(computeGrid(100, 50, 0), { cols: 0, rows: 0 });
  assert.deepEqual(computeGrid(0, 50, 10), { cols: 0, rows: 0 });
});

test('breathPulse stays within [0.82, 1]', () => {
  for (let t = 0; t < 12; t += 0.05) {
    const v = breathPulse(t);
    assert.ok(v >= 0.82 - 1e-9 && v <= 1 + 1e-9, `out of range at t=${t}: ${v}`);
  }
  assert.ok(Math.abs(breathPulse(4.6 / 4) - 1) < 1e-9);
});

test('scanBand peaks where the crest passes and stays in (0, 1]', () => {
  // period=1, width=0.1: центр достигает 0.5 при t=0.5
  const peak = scanBand(0.5, 0.5, 1, 0.1);
  assert.ok(Math.abs(peak - 1) < 1e-9);
  for (let p = 0; p <= 1; p += 0.1) {
    for (let t = 0; t < 2; t += 0.13) {
      const v = scanBand(p, t, 1, 0.1);
      assert.ok(v > 0 && v <= 1);
    }
  }
});

test('blinkEnvelope is open at the edges and closed in the middle', () => {
  assert.equal(blinkEnvelope(0), 1);
  assert.equal(blinkEnvelope(1), 1);
  assert.ok(blinkEnvelope(0.5) < 1e-6);
  assert.ok(Math.abs(blinkEnvelope(0.25) - blinkEnvelope(0.75)) < 1e-9);
});

test('nextFlipDelay maps [0,1) into [350, 2750) ms', () => {
  assert.equal(nextFlipDelay(0), 350);
  assert.ok(nextFlipDelay(0.999999) < 2750);
  assert.ok(nextFlipDelay(0.5) > 350 && nextFlipDelay(0.5) < 2750);
});
