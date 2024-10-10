const gotoPage = require("../shared/utilities/gotoPage")

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

  await pageEvaluate.forEach(async (pageInfo) => {
    const { page, browser } = await gotoPage(pageInfo.pageUrl)
    const newsDetailsPageEvaluate = await page.evaluate(async () => {
      let articles = [];
      const title = document.querySelector('.IiRps')?.innerText;
      const newsContainer = document.querySelector('.story-content');
      // const images = newsContainer.querySelectorAll('img')?.forEach((img) => { return img.src })
      const pictures = newsContainer.querySelectorAll(".qt-image")
      const footer = newsContainer.querySelectorAll(".print-footer-row2")
      await pictures.forEach((element) => {
        const img = element.querySelector("img")
        if (img?.src) {
          articles.push(`${img.src}`)

        }
      })

      articles.push({ title, length: footer.length })
      // contentContainer.forEach(article => {
      //   const pageUrl = article.querySelector('a')?.href

      //   if (pageUrl) {
      //     articles.push({
      //       pageUrl,
      //     });
      //   }
      // });

      return articles
    });

    console.log("innerDetails ==>>", newsDetailsPageEvaluate)
    await browser.close();

  })

  await browser.close();
}



module.exports = scrapeProthomAlo();


