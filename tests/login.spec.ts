import { test, expect } from '@playwright/test';

test('Verify Login with Valid Credentials', async ({ page }) => {
    // 1. Go to login page
    await page.goto('https://www.enpnt.com/login');

    // Zoom out to ensure elements are visible (User request)
    await page.evaluate(() => {
        (document.body.style as any).zoom = '0.75';
    });

    // // 2. Select Dancer Login
    // await page.click('button:has-text("I am a dancer")');

    // Wait for the form to be interactive
    await page.waitForTimeout(1000);

    // 3. Fill in credentials
    const email = process.env.LOGIN_EMAIL || 'aldoautomation@yopmail.com';
    const password = process.env.LOGIN_PASSWORD || 'Rubix2012!';

    // Scope to the Dancer form container specifically
    // Use the unique button inside the form to identify the correct container
    const dancerForm = page.locator('form').filter({ has: page.locator('button[class*="bg-[#f3d9fc]"]') });
    const emailInput = dancerForm.locator('input[type="email"]');
    const passwordInput = dancerForm.locator('input[type="password"]');

    // We can also find the button inside this form - use submit button to avoid the "login here" link
    const loginButton = dancerForm.locator('button[type="submit"]');

    await emailInput.fill(email);
    await passwordInput.fill(password);

    // 4. Submit
    console.log('Submitting login...');
    console.log('Button count:', await loginButton.count()); // Debug
    await loginButton.click();

    // Wait for network idle to ensure request is sent
    // await page.waitForLoadState('networkidle'); 
    await page.waitForTimeout(5000);

    // 5. Expectation: Login successful
    // Check for URL change or specific success element
    await expect(page).not.toHaveURL('https://www.enpnt.com/login', { timeout: 20000 });
});
