import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication Flow', () => {
    
    test('User can navigate to login and see required elements', async ({ page }) => {
        // Navigate to the homepage
        await page.goto('/');

        // Click on the Login button in the navbar
        await page.click('nav a.nav-button:has-text("Login")');

        // Verify we are on the login page
        await expect(page).toHaveURL(/.*\/login/);

        // Verify key elements are visible
        await expect(page.locator('h2')).toHaveText('Login to Rosalix');
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('User can navigate to registration and see privacy policy checkbox', async ({ page }) => {
        await page.goto('/register');

        // Verify we are on the register page
        await expect(page).toHaveURL(/.*\/register/);

        // Verify privacy policy checkbox is present
        const privacyCheckbox = page.locator('input[type="checkbox"]#privacy');
        await expect(privacyCheckbox).toBeVisible();
        
        // Verify the label text contains Privacy Policy link
        await expect(page.locator('label[for="privacy"]')).toContainText('Privacy Policy');
    });

    test('User can navigate to forgot password page', async ({ page }) => {
        await page.goto('/login');

        // Click forgot password link
        await page.click('text=Forgot password?');

        // Verify we are on forgotten password page
        await expect(page).toHaveURL(/.*\/forgot-password/);
        await expect(page.locator('h2')).toHaveText('Reset Password');
        await expect(page.locator('input[type="email"]')).toBeVisible();
    });
});
