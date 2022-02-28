import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('entry page', () => {
  test('should auto jump to entry page', async ({ page }) => {
    await expect(page).toHaveURL('/entry/login');
  });

  test('auto goto entry if not login', async ({ page }) => {
    await page.goto('/main');
    await expect(page).toHaveURL('/entry/login?redirect=%2Fmain'); // should with redirect
  });

  test('registry', async ({ page }) => {
    await page.locator('text=注册账号').click();
    await expect(page).toHaveURL('/entry/register');

    await page.locator('button:has-text("注册账号")').click();
    await expect(page.locator('p.text-red-500')).toHaveText('邮箱不能为空');

    await page.locator('[name="reg-email"]').click();
    await page.locator('[name="reg-email"]').fill('123456789');
    await page.locator('button:has-text("注册账号")').click();
    await expect(page.locator('p.text-red-500')).toHaveText('邮箱格式不正确');

    await page.locator('[name="reg-email"]').click();
    await page.locator('[name="reg-email"]').fill('test@moonrailgun.com');
    await page.locator('button:has-text("注册账号")').click();
    await expect(page.locator('p.text-red-500')).toHaveText('密码不能低于6位');

    await page.locator('[name="reg-password"]').click();
    await page.locator('[name="reg-password"]').fill('1234');
    await page.locator('button:has-text("注册账号")').click();
    await expect(page.locator('p.text-red-500')).toHaveText('密码不能低于6位');
  });
});
