const puppeteer = require('puppeteer');

const gotoPage = async (url) => {
  if (!url) {
    throw Error("Valid URL is required");
  }

  const browser = await puppeteer.launch({
    headless: true,  // Set to true to run in headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 600000,
  });

  await page.waitForSelector('html', { timeout: 600000 });

  await autoScroll(page);
  global.browser = browser
  return { page, browser };
};

const autoScroll = async (page) => {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      let distance = 100;
      const timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

module.exports = gotoPage;
