const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto('https://www.enpnt.com/login');
        await page.waitForTimeout(2000); // Wait for hydration

        // Dump the HTML structure of the main content to find unique containers
        const content = await page.evaluate(() => {
            const schoolBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('I am a school'));
            const dancerBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('I am a dancer'));

            // Find forms or potential containers
            const inputs = Array.from(document.querySelectorAll('input'));
            const buttons = Array.from(document.querySelectorAll('button'));

            return {
                schoolBtn: schoolBtn ? schoolBtn.outerHTML : 'Not Found',
                dancerBtn: dancerBtn ? dancerBtn.outerHTML : 'Not Found',
                totalInputs: inputs.length,
                inputDetails: inputs.map(i => ({ type: i.type, id: i.id, placeholder: i.placeholder, parentClass: i.parentElement.className })),
                totalButtons: buttons.length,
                buttonDetails: buttons.map(b => ({ text: b.innerText, class: b.className }))
            };
        });

        console.log(JSON.stringify(content, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();
