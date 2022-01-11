async function scrollToBottom(page){
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0
      var distance = 100
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight
        window.scrollBy(0, distance)
        totalHeight += distance

        if(totalHeight >= scrollHeight){
          clearInterval(timer)
          resolve()
        }
      }, 100)
    })
  })
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  scrollToBottom,
  sleep
}