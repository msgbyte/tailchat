import { loginToDemoUser } from './utils/user';
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page, context }) => {
  await loginToDemoUser(page, context);
});

test.describe('Main Process', () => {
  test('Check Personal Route', () => {
    console.log('TODO');
  });
});
