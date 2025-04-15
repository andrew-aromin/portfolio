import metascraper from 'metascraper';
import metascraperLogo from 'metascraper-logo';
import metascraperClearbit from 'metascraper-clearbit';
import getHTML from 'html-get';
import browserlessPkg from 'browserless';
import { cleanAndValidate } from '../helpers.js';

const browserless = browserlessPkg();
const scraper = metascraper([
  metascraperLogo(),
  metascraperClearbit()
]);

export async function findLogos(siteUrl) {

  const getContent = async url => {
    // create a browser context inside the main Chromium process
    const browserContext = browserless.createContext()
    const promise = getHTML(url, { getBrowserless: () => browserContext })
    // close browser resources before return the result
    promise.then(() => browserContext).then(browser => browser.destroyContext())
    return promise
  }

  try {

    if(!siteUrl) return Promise.resolve(null);

    if(!cleanAndValidate(siteUrl)) {
      return Promise.reject("Error: invalid URL");
    }

    const html = await getContent(siteUrl);

    console.log(html);

    const metadata = await scraper({html, url: siteUrl});

    console.log(metadata);

    return Promise.resolve(metadata);

  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}
