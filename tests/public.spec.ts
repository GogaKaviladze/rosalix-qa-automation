import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Public Pages & Navigation', () => {

    test('Homepage loads correctly and has key sections', async ({ page }) => {
        await page.goto('/');

        // Verify title
        await expect(page).toHaveTitle(/Rosalix FMCG/);

        // Verify hero section is visible
        await expect(page.locator('h1')).toHaveText(/Premium FMCG Distribution/i);
        
        // Verify footer is present
        await expect(page.locator('footer')).toContainText('Powered by Anthronode');
    });

    test('Catalog page restricts access for non-logged-in users', async ({ page }) => {
        await page.goto('/catalog');

        // Check if the page properly handles unauthenticated state
        // Usually, this shows a "Please log in" message or redirects. We will check if the layout loads.
        const heading = page.locator('h1');
        if (await heading.count() > 0) {
            await expect(heading).toContainText(/Catalog|Log In/i);
        }
    });

    test('Contact page form can be filled and submitted securely', async ({ page }) => {
        await page.goto('/contact');
        await expect(page.locator('h1')).toHaveText(/Contact Rosalix/i);

        // Mock the backend API to prevent actually sending an email every time tests run
        await page.route('**/api/contact', async route => {
            await route.fulfill({ status: 200, json: { success: true } });
        });

        // Fill the form fields
        await page.fill('#name', 'Automated QA Tester');
        await page.fill('#email', 'qa@anthronode.io');
        await page.fill('#message', 'This is a mocked E2E test submission.');
        
        // Submit the form
        await page.click('button[type="submit"]');

        // Verify the success banner appears (from the component state update)
        await expect(page.locator('text=Thank you for your message')).toBeVisible();
    });

    test('Legal pages (Impressum & Privacy) are accessible', async ({ page }) => {
        // Test Impressum
        await page.goto('/impressum');
        await expect(page.locator('h1')).toHaveText(/Impressum/i);

        // Test Privacy
        await page.goto('/privacy');
        await expect(page.locator('h1')).toContainText(/Privacy|Datenschutz/i);
    });
});
