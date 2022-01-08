const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

const mainUrl = 'https://www.levelup.com/buscar/review/'


const configureBrowser = async (url) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)
  await page.setViewport({
    width: 1200,
    height: 800
  });
  return {page, browser}
}

const getReviews = async (page) => {
  const html = await page.evaluate(() => document.body.innerHTML)
  const $ = cheerio.load(html)
  const rawReviews = $('.staff_content figurecaption > a', html)
  const reviewsArray = []
  rawReviews.each((i, review) => {
    const val = $(review).attr('href')
    reviewsArray.push(val)
    console.log(val)
  })
  return reviewsArray
}

const getComments = async (page) => {
  
}

async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 100);
      });
  });
}

(async () => {
  const SEARCH_TERM = 'halo'
  const manager = await configureBrowser(`${mainUrl}q/${SEARCH_TERM}`)
  const reviewLinks = await getReviews(manager.page)

  manager.browser.close()
})()