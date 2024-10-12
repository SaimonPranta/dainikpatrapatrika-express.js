const puppeteer = require('puppeteer');

// Function to wait for a specified time
const waitHere = (seconds) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Waited for ${seconds} seconds`);
            resolve("done");
        }, seconds * 1000); // Convert seconds to milliseconds
    });
};

async function scrapePerplexity(inputText) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.perplexity.ai/search/ullekhy-gt-budhbaar-9-aktteaab-i59mLVY2RJSZ0a70bRatWg', { waitUntil: 'networkidle2' });
    const inputFieldId = 'textarea[data-1p-ignore="true"]';
    const submitButtonId = 'button[aria-label="Submit"]';

    const inputValue = `Modify or rewrite this article, don't change its original language:- (${inputText})`
    await page.waitForSelector(inputFieldId);
    await page.type(inputFieldId, inputValue);

    await waitHere(3);
    console.log("Input submitted. Preparing to click submit...");

    await page.click(submitButtonId);

    await page.waitForSelector('div.prose');
    console.log("Output section loaded. Waiting for 3 seconds...");

    await waitHere(30);

    // Extract the last output text
    const outputText = await page.evaluate(() => {
        const proseElements = document.querySelectorAll('div.prose');
        const lastProseElement = proseElements[proseElements.length - 1]; // Get the last div with class prose
        const firstSpan = lastProseElement.querySelector('span'); // Get the first span within that div
        return firstSpan ? firstSpan.innerText : 'No span found'; // Return the text or a message if no span is found
    });


    // console.log('Rewritten Text:', outputText);

    // await browser.close(); // Close the browser
    return outputText;
}

// Example usage
// scrapePerplexity( ট্রলারসহ অন্য মাঝিদের ছেড়ে দেয় মিয়ানমার।').catch(console.error);
