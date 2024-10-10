const puppeteer = require('puppeteer');
const axios = require('axios');

const gotoPage = async (url) => {
  if(!url){
    throw Error("Valid url are required")
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Go to the website
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  return page
}

async function scrapeProthomAlo() {
  // Extract the news items and return logs
  const page = await gotoPage('https://www.prothomalo.com/collection/latest')
  const news = await page.evaluate(() => {
    let articles = [];
    let logData = [];

    const contentContainer = document.querySelectorAll('.xkXol');
    logData.push(`Found ${contentContainer.length} articles`);
    contentContainer.forEach(article => {
      const pageUrl = article.querySelector('a')?.href

      if (pageUrl) {
        articles.push({
          pageUrl,
        });
      }
    });

    // Return the articles and logs
    return { articles, logData };
  });

  // Log the returned data
  console.log("Browser Logs:", news.logData);
  console.log("Extracted News:", news.articles);

  // await browser.close();
  await page.close();
}

scrapeProthomAlo();

// const myData = async () => {
//   try {
//     const data = await axios.get("https://www.prothomalo.com/collection/latest")
//     console.log("data ==>>", data)
//   } catch (error) {
//     console.log("error ==>>", error)
//   }
// }


// myData()
