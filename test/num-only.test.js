import { expect, test } from 'bun:test';

import reoptions from '..';

test('TRUE equals TRUE after reoptions run', () => {
  reoptions();

  expect(true).toBe(true);
});
