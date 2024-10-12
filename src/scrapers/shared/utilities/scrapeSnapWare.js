const puppeteer = require('puppeteer');
// https://snapwordz.com/bengali-article-rewriter

const waitHere = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Hello from waitHere function");
            resolve("done");
        }, 3000); // 3 seconds delay
    });
};

async function scrapeChatGPT(inputText) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://snapwordz.com/bengali-article-rewriter', { waitUntil: 'networkidle2' });

    // Wait for the input textarea to load and type the input text
    await page.waitForSelector('textarea[name="content_text"]');
    await page.type('textarea[name="content_text"]', inputText);

    // Click the submit button
    await page.click('input[type="submit"][name="submit_query"]'); 
 
    // Wait for the output textarea to load
    await page.waitForSelector('textarea[name="content_textz"]');
    console.log("Hllo before func")

    await waitHere()

    console.log("Hllo after func")

    // Extract the rewritten text
    const textareaValue = await page.$eval('textarea[name="content_textz"]', element => element.value);

    console.log('Rewritten Text:', textareaValue);

    // await browser.close(); // Close the browser
    return textareaValue;
}

// Example usage
scrapeChatGPT('উল্লেখ্য, গত বুধবার (৯ অক্টোবর) দুপুরে সেন্টমার্টিন দ্বীপের দক্ষিণ-পশ্চিমের মৌলভীর শিল নামের বঙ্গোপসাগর মোহনায় বাংলাদেশের মাছ ধরার ট্রলারে মিয়ানমার উপকূল থেকে গুলিবর্ষণে একজন নিহত হন। এসময় আহত হন তিন জেলে। আর ৬০ মাঝি-মাল্লাসহ চারটি ট্রলার অপহরণ করে মিয়ানমারে নিয়ে যায় দেশটির নৌবাহিনী। পরে ট্রলারসহ অন্য মাঝিদের ছেড়ে দেয় মিয়ানমার।').catch(console.error);
// মিয়ানমারের উপকূলে সেন্ট পিটার্সবার্গের দক্ষিণ-পশ্চিমে মুলভির শিল নামক বঙ্গোপসাগরের মুখে বাংলাদেশি মাছ ধরার ট্রলারে আগুন লেগে একজন নিহত হয়েছে। মার্টেন, গত বুধবার (৯ অক্টোবর) দুপুরে ড. আহত হয়েছেন তিন জেলে। আর ৬০ জন নাবিকসহ চারটি ট্রলার দেশটির নৌবাহিনী আটক করে মিয়ানমারে নিয়ে যায়। পরে ট্রলার ও অট্যান্য নাবিকদের ছেট্ে দেয় মিট্ানমার।
