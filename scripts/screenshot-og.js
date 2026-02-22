const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    const htmlPath = path.resolve(__dirname, 'gen-og-image.html');
    await page.goto('file:///' + htmlPath.replace(/\\/g, '/'));
    await page.waitForTimeout(1000);
    const card = page.locator('.card');
    await card.screenshot({ path: path.resolve(__dirname, '..', 'public', 'og-image.png') });
    await browser.close();
    console.log('og-image.png created!');
})();
