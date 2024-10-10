const puppeteer = require('puppeteer');

const gotoPage = async (url) => {
  if(!url){
    throw Error("Valid url are required")
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 600000,
  });

  return {page, browser}
}

  module.exports = gotoPage