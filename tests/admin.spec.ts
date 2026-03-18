import { test, expect } from '@playwright/test';

test.describe('Admin Panel (Authenticated)', () => {

    test('Admin can view the dashboard and settings successfully', async ({ page }) => {
        await page.goto('/admin');
        
        // Assert we are NOT redirected to login
        await expect(page).toHaveURL(/.*\/admin/);
        
        // Verify dashboard title
        const header = page.locator('h1').first();
        await expect(header).toContainText(/Dashboard Overview/i);
        
        // Verify management links are present (in Sidebar)
        // Use more robust role-based locators
        await expect(page.getByRole('link', { name: 'Categories', exact: true })).toBeVisible({ timeout: 10000 });
        await expect(page.getByRole('link', { name: 'Products', exact: true })).toBeVisible({ timeout: 10000 });
        
        await page.screenshot({ path: 'test-results/admin-debug.png' });
    });
});
