import { test, expect } from '@playwright/test';

test.describe('Catalog Access (Authenticated)', () => {

    test('User can access the catalog successfully', async ({ page }) => {
        await page.goto('/catalog');
        
        // Verify we are not blocked by auth middleware
        await expect(page).toHaveURL(/.*\/catalog/);
        
        // Verify the catalog header
        await expect(page.locator('h1').first()).toContainText(/Product Catalog/i);
    });
});
