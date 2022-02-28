import { BrowserContext, expect, Page } from '@playwright/test';

const storagePath = './auth.json';

/**
 * 登录到测试账号
 *
 * 需要提前注册
 */
export async function loginToDemoUser(page: Page, context: BrowserContext) {
  await page.goto('/entry/login');
  await page
    .locator('input[name="login-email"]')
    .fill('tailchat-demo@msgbyte.com');
  await page.locator('input[name="login-password"]').fill('tailchat-demo');
  await page.locator('button:has-text("登录")').click();

  await expect(page).toHaveURL('/main/personal/friends'); // should with redirect

  await context.storageState({
    path: storagePath,
  });
}
