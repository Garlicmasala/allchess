import test from 'node:test';
import assert from 'node:assert/strict';
import { VARIANTS, LOCALES, filterVariants, hashPassword, verifyPassword } from './core.js';

test('catalog contains the historical, modern, and dimensional worlds', () => {
  assert.ok(VARIANTS.some((variant) => variant.id === 'ur'));
  assert.ok(VARIANTS.some((variant) => variant.id === 'shogi'));
  assert.ok(VARIANTS.some((variant) => variant.id === '4d'));
  assert.ok(VARIANTS.some((variant) => variant.id === '5d'));
  assert.ok(VARIANTS.some((variant) => variant.id === 'shatranj'));
  assert.ok(VARIANTS.some((variant) => variant.id === 'hexagonal'));
  assert.ok(VARIANTS.length >= 35);
});

test('variant filtering is case-insensitive and supports eras', () => {
  assert.equal(filterVariants('SHOGI')[0].id, 'shogi');
  assert.ok(filterVariants('', 'Experimental').every((variant) => variant.era === 'Experimental'));
});

test('password hashing is salted, deterministic per salt, and verifiable', async () => {
  const first = await hashPassword('a secure local password', 'salt-a');
  const second = await hashPassword('a secure local password', 'salt-b');
  assert.notEqual(first, second);
  assert.equal(await verifyPassword('a secure local password', 'salt-a', first), true);
  assert.equal(await verifyPassword('wrong password', 'salt-a', first), false);
});

test('every locale has the core navigation contract', () => {
  for (const locale of Object.values(LOCALES)) assert.deepEqual(Object.keys(locale).length, Object.keys(LOCALES.en).length);
});