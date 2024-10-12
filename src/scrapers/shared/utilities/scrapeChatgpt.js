const puppeteer = require('puppeteer');
const {gptEmail, gptPassword} = require("../constants/chatgpt")




async function scrapeChatGPT(inputText) {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: false }); // Set headless to true for no UI
    const page = await browser.newPage();

    // Navigate to ChatGPT
    await page.goto('https://chatgpt.com/', { waitUntil: 'networkidle2' });

    // Wait for the chat input box to load
    await page.waitForSelector('textarea'); // Adjust the selector as needed

    // Type the input text into the chat
    await page.type('textarea', inputText);
    await page.keyboard.press('Enter'); // Press Enter to submit

    // Wait for the response to load
    await page.waitForSelector('.chat-response-selector'); // Adjust to the correct response selector

    // Extract the response text
    const response = await page.$eval('.chat-response-selector', element => element.innerText);
    console.log('ChatGPT Response:', response);

    // Close the browser
    await browser.close();

    return response;
}

// Example usage
scrapeChatGPT('What is the capital of Bangladesh?').catch(console.error);
