const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const {scrollToBottom, sleep} = require('./helpers')

const mainUrl = 'https://www.levelup.com'


const configureBrowser = async (url) => {
  const browser = await puppeteer.launch({})
  const page = await browser.newPage()
  await page.goto(url)
  await page.setViewport({
    width: 1200,
    height: 800
  })
  return {page, browser}
}

const getReviews = async (page) => {
  const html = await page.evaluate(() => document.body.innerHTML)
  const $ = cheerio.load(html)
  const rawReviews = $('.staff_content figurecaption > a', html)
  const reviewsArray = []
  rawReviews.each((i, review) => {
    const val = $(review).attr('href')
    reviewsArray.push('review:', val)
    console.log(val)
  })
  return reviewsArray
}

const getComments = async (link, page) => {
  await page.goto(`${mainUrl}${link}`)
  await scrollToBottom(page)
  await sleep(3000)

  const html = await page.evaluate(() => document.body.innerHTML)
  const $ = cheerio.load(html)
  const rawComments = $('.comments article .content.formattedText  p', html)
  const commentsArray = []
  rawComments.each((i, comment) => {
    const val = $(comment).text()
    commentsArray.push(val)
    console.log('coment:', val)
  })
  return commentsArray
}


(async () => {
  try {
    const SEARCH_TERM = 'halo'
    console.log(`${mainUrl}/buscar/review/q/${encodeURIComponent(SEARCH_TERM)}`)
    const manager = await configureBrowser(`${mainUrl}/buscar/review/q/${encodeURIComponent(SEARCH_TERM)}`)
    const reviewLinks = await getReviews(manager.page)
    await getComments(reviewLinks[0], manager.page)
    manager.browser.close()
  } catch (err) {
    console.log(err)
  }
})()