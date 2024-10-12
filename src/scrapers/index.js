// require("./prothomAlo.com/latestNewsPage")

const scrapePerplexity = require("./shared/utilities/scrapePerplexity")

 
// require("./prothomAlo.com/latestNewsPage")
// require("./shared/utilities/useChatgpt")
// require("./shared/utilities/gptContentModifier")
// require("./shared/utilities/scrapePerplexity")
 
const hel = async () => {
    const modifyText = await scrapePerplexity("জুলাইয়ের শুরুর দিকে রাজধানীর মিরপুরের পশ্চিম কাজীপাড়া মসজিদ সড়কের সংস্কারকাজ শুরু করে ঢাকা উত্তর সিটি করপোরেশন। এর পর থেকে তিন মাস এ সড়কে যান চলাচল বন্ধ রয়েছে। এর কারণ সড়কের কিছু জায়গা কাটা হয়েছে। আবার কিছু অংশে ফেলে রাখা হয়েছে নালা নির্মাণের জন্য আনা কংক্রিটের পাইপ। পরিস্থিতি এমন যে এখন হাঁটাও কঠিন হয়ে পড়েছে এ সড়কে।")
console.log("modifyText ==>>", modifyText)
}

hel()