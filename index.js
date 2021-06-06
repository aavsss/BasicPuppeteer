const puppeteer = require('puppeteer');

async function findByLink(page) {
  const links = await page.$$('a')

  const propertyJSHandles = await Promise.all (
    links.map(handle => handle.getProperty('href'))
  );

  const hrefs = await Promise.all (
    propertyJSHandles.map(handle => handle.jsonValue())
  );

  var socials = [];
  for (var i = 0; i < hrefs.length; i++) {
    if (hrefs[i].includes("instagram") || 
        (hrefs[i].includes("twitter"))) {
      socials.push(hrefs[i]);
    }
  }

  return socials;
}

async function launchPupeteerWithUser(streamer) {
  puppeteer.launch({headless:false}).then(async browser => {
    const page = await browser.newPage();
    await page.goto('https://www.twitch.tv/'+streamer, {
      waitUntil: "networkidle2",
    });
    const links = await findByLink(page);
    console.log("links", links)
    await browser.close();
  });
}

(async() => {
  await launchPupeteerWithUser("shahzam");
})();
