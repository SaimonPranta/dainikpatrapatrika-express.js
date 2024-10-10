const puppeteer = require('puppeteer');

const gotoPage = async (url) => {
  if (!url) {
    throw Error("Valid URL is required");
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // Enable request interception
  await page.setRequestInterception(true);

  // Block images and other unnecessary resources
  page.on('request', (request) => {
    const resourceType = request.resourceType();
    if (resourceType === 'image' || resourceType === 'stylesheet' || resourceType === 'font') {
      request.abort(); // Block the request
    } else {
      request.continue(); // Continue with the request
    }
  });

  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 600000,
  });

  await page.waitForSelector('html', { timeout: 600000 });

  await autoScroll(page);

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
};

module.exports = gotoPage;
