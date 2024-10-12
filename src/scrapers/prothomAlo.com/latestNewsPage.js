const gotoPage = require("../shared/utilities/gotoPage")
const remoteContentText = ["আরও পড়ুন", "বিজ্ঞাপন"]

const scrapeProthomAlo = async () => {
  const { page, browser } = await gotoPage('https://www.prothomalo.com/collection/latest')
  const pageEvaluate = await page.evaluate(() => {
    let articles = [{ pageUrl: "https://www.prothomalo.com/entertainment/tollywood/hscg3knw9a" }];
    const contentContainer = document.querySelectorAll('.xkXol');
    contentContainer.forEach(article => {
      const pageUrl = article.querySelector('a')?.href

      if (pageUrl) {
        articles.push({
          pageUrl,
        });
      }
    });

    return articles
  });
  console.log("pageEvaluate =>", pageEvaluate)
  let contentList = await (await Promise.all(pageEvaluate.map(async (pageInfo) => {
    const { page, browser } = await gotoPage(pageInfo.pageUrl)
    const newsDetailsPageEvaluate = await page.evaluate(async () => {
      let articles = {}
      const title = await document.querySelector('.IiRps')?.innerText;
      const newsContainer = await document.querySelector('.story-content');
      const images = await newsContainer ? Array.from(newsContainer.querySelectorAll('img')).map(img => img?.src) : [];
      const contentBody = newsContainer.querySelector('.VzzDZ')


      if (!contentBody) { 
        return {}; 
      }


      const pList = contentBody.querySelectorAll("p");

      let htmlDescription = "";
      pList.forEach(p => {
        htmlDescription += p.outerHTML;
      });
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlDescription;
      const planeTextDescription = tempDiv.innerText;
      if (title && images?.length && contentBody) {
        articles = { title, htmlDescription, planeTextDescription, images }
      }

      return articles
    })

    // await browser.close();
    return newsDetailsPageEvaluate
  }))).filter((content) => Object.keys(content).length > 0)
  console.log("contentList ==>>", contentList[0])
  await global.browser.close();
}



module.exports = scrapeProthomAlo();