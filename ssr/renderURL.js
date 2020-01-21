const chromium = require('chrome-aws-lambda');

// In-memory cache of rendered pages. Note: this will be cleared whenever the
// server process stops. If you need true persistence, use something like
// Google Cloud Storage (https://firebase.google.com/docs/storage/web/start).
const RENDER_CACHE = new Map();

async function renderURL(url) {
  if (RENDER_CACHE.has(url)) {
    return { html: RENDER_CACHE.get(url), ttRenderMs: 0 };
  }

  const start = Date.now();

  const browser = await getBrowser()
  const page = await browser.newPage();

  try {
    await page.goto(url);
    await page.waitForFunction('window.routify === "ready"')
  } catch (err) {
    console.error(err);
    throw new Error('page.goto/waitForSelector timed out.');
  }

  const html = await page.content(); // serialized HTML of page DOM.
  await page.close();

  const ttRenderMs = Date.now() - start;
  console.info(`Headless rendered page in: ${ttRenderMs}ms`);

  RENDER_CACHE.set(url, html); // cache rendered page.

  return { html, ttRenderMs };
}

let browser = null
async function getBrowser() {
    browser = browser || await chromium.puppeteer.launch({
      executablePath: await chromium.executablePath
    });
  return browser
}

module.exports = renderURL