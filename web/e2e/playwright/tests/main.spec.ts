import { loginToDemoUser } from './utils/user';
import { test, expect, Page } from '@playwright/test';

test.beforeEach(async ({ page, context }) => {
  await loginToDemoUser(page, context);
});

test.describe('Main Process', () => {
  test('Check All Route', async ({ page }) => {
    // Click text=已发送
    await page.locator('text=已发送').click();
    // Click text=待处理
    await page.locator('text=待处理').click();
    // Click text=添加好友
    await page.locator('text=添加好友').click();
    // Click [aria-label="Copy"]
    await page.locator('[aria-label="Copy"]').click();
    // Click text=插件中心
    await page.locator('text=插件中心').click();
    await expect(page).toHaveURL(
      'http://localhost:11011/main/personal/plugins'
    );
    // Click text=已安装
    await page.locator('text=已安装').click();
    // Click text=手动安装
    await page.locator('text=手动安装').click();
    // Click svg[role="img"] >> nth=1
    await page.locator('svg[role="img"]').nth(1).click();
    // Click text=系统设置
    await page.locator('text=系统设置').click();
    // Click text=服务状态
    await page.locator('text=服务状态').click();
    // Click text=性能统计
    await page.locator('text=性能统计').click();
    // Click text=关于
    await page.locator('text=关于').click();

    // Click 关闭
    await page.locator('.text-2xl.border-2').click();
  });

  test.describe('Group', () => {
    /**
     * 创建群组
     */
    async function createGroup(page: Page) {
      // Click [data-testid="create-group"]
      await page.locator('[data-testid="create-group"]').click();
      // Click text=默认群组
      await page.locator('text=默认群组').click();
      // Click input[type="text"]
      await page.locator('input[type="text"]').click();
      // Fill input[type="text"]
      await page.locator('input[type="text"]').fill('Test');
      // Press Enter
      await page.locator('input[type="text"]').press('Enter');
      // Click button:has-text("确认创建")
      await page.locator('button:has-text("确认创建")').click();
      await expect(page).toHaveURL(/\/main\/group\/\S{24}\/\S{24}/);
    }

    /**
     * 删除测试群组
     */
    async function deleteGroup(page: Page) {
      // Click text=Test
      await page.locator('[data-testid="group-header"]').click();
      // Click text=退出群组
      await page.locator('text=退出群组').click();
      // Click button:has-text("OK")
      await Promise.all([
        page.waitForNavigation(/*{ url: 'http://localhost:11011/main/personal/friends' }*/),
        page.locator('button:has-text("OK")').click(),
      ]);
    }

    test('Create Group', async ({ page }) => {
      await createGroup(page);
      await deleteGroup(page);
    });

    test('Group Profile', async ({ page }) => {
      await createGroup(page);

      await page.locator('[data-testid="group-header"]').click();
      // Click text=查看详情
      await page.locator('text=查看详情').click();
      // Click text=群组名称Test >> button
      await page.locator('text=群组名称Test >> button').click();
      // Click text=T群组名称 >> input[type="text"]
      await page.locator('text=T群组名称 >> input[type="text"]').click();
      // Fill text=T群组名称 >> input[type="text"]
      await page
        .locator('text=T群组名称 >> input[type="text"]')
        .fill('Test123');
      // Click button >> nth=4
      await page.locator('button').nth(4).click();
      await expect(page.locator('[data-testid="toast"]')).toHaveText(
        '修改群组名成功'
      );

      // Click text=面板
      await page.locator('text=面板').click();
      // Click button:has-text("创建面板")
      await page.locator('button:has-text("创建面板")').click();
      // Click input[name="name"]
      await page.locator('input[name="name"]').click();
      // Fill input[name="name"]
      await page.locator('input[name="name"]').fill('Test');
      // Click button:has-text("提 交")
      await page.locator('button:has-text("提 交")').click();
      // Click .ant-tree-treenode.ant-tree-treenode-switcher-open
      await page
        .locator('.ant-tree-treenode.ant-tree-treenode-switcher-open')
        .click();
      // Click [data-testid="full-modal-close"] svg[role="img"]
      await page
        .locator('[data-testid="full-modal-close"] svg[role="img"]')
        .click();

      await deleteGroup(page);
    });
  });
});
