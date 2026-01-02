const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        console.log('Navigating to login...');
        await page.goto('https://www.enpnt.com/login');

        // Zoom out
        await page.evaluate(() => document.body.style.zoom = '0.75');

        console.log('Selecting "I am a dancer"...');
        await page.click('button:has-text("I am a dancer")');
        // Short wait to ensure tab switch
        await page.waitForTimeout(1000);

        console.log('Filling credentials...');
        await page.fill('#email', 'aldoautomation@yopmail.com');
        await page.fill('#password', 'Rubix2012!');

        console.log('Clicking Login...');
        await page.click('button:has-text("Login")');

        console.log('Waiting 5s for reaction...');
        await page.waitForTimeout(5000);

        const url = page.url();
        console.log('Current URL:', url);

        // Capture specific error areas if possible, or just body text
        const bodyText = await page.innerText('body');
        if (url.includes('login')) {
            console.log('--- Page Text Dump (Failed to Redirect) ---');
            // Filter empty lines to keep it readable
            const lines = bodyText.split('\n').filter(line => line.trim() !== '').slice(0, 50); // First 50 lines
            console.log(lines.join('\n'));
        } else {
            console.log('Login Successful! Redirected.');
        }

    } catch (e) {
        console.error('Error in debug script:', e);
    } finally {
        // Keep browser open for a moment if run manually, or close
        await browser.close();
    }
})();
