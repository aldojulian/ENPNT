import { test, expect } from '@playwright/test';

test('Verify Login with Valid Credentials', async ({ page }) => {
    // 1. Go to login page
    await page.goto('https://www.enpnt.com/login');

    // 2. Select Dancer Login
    await page.click('button:has-text("I am a dancer")');

    // 3. Fill in credentials
    const email = process.env.LOGIN_EMAIL || 'aldoautomation@yopmail.com';
    const password = process.env.LOGIN_PASSWORD || 'Rubix2012!';

    await page.fill('#email', email);
    await page.fill('#password', password);

    // 4. Submit
    // Using the specific text for the login button inside the form
    await page.click('button:has-text("Login")');

    // 5. Expectation: Login successful
    // Wait for navigation away from login page
    await expect(page).not.toHaveURL('https://www.enpnt.com/login', { timeout: 20000 });
});
