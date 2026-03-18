import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Use environment variables for credentials to avoid hardcoding secrets in the repo.
  // We provide a fallback just in case, but it's best practice to set these in .env
  const email = (process.env.TEST_USER_EMAIL || '').trim();
  const password = (process.env.TEST_USER_PASSWORD || '').trim(); 

  console.log(`Debug: Loading account ${email}`);
  console.log(`Debug: Password length is ${password.length}`);

  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL or TEST_USER_PASSWORD not found in .env file. Please check your .env format.');
  }

  await page.goto('/login');

  await page.fill('input[id="email"]', email);
  await page.fill('input[id="password"]', password);

  await page.click('button[type="submit"]');

  // Check if an error message appears immediately (using a faster check)
  const errorLocator = page.locator('.auth-error');
  if (await errorLocator.isVisible()) {
    const errorText = await errorLocator.textContent();
    throw new Error(`Login failed with error: "${errorText}" for user ${email}`);
  }

  // 1. Wait for URL to be /catalog (proving login worked)
  await expect(page).toHaveURL(/.*\/catalog/, { timeout: 15000 });

  // 2. Wait for Sign Out button in Navbar
  await expect(page.getByRole('link', { name: 'Sign Out' })).toBeVisible({ timeout: 10000 });

  // Save storage state into the file.
  await page.context().storageState({ path: authFile });
});
