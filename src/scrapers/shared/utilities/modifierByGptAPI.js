// gptApiKey
const axios = require('axios');
require('dotenv').config();

const API_KEY = ""

async function modifyArticle(originalText) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',  // This model is likely to be available under the free tier
        messages: [
          {
            role: 'system',
            content: 'You are an assistant that rewrites Bangla articles to ensure originality and accuracy.'
          },
          {
            role: 'user',
            content: `Please modify this article to be unique but accurate:\n\n${originalText}`
          }
        ],
        max_tokens: 500  // Adjust token limit based on free tier constraints
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const modifiedArticle = response.data.choices[0].message.content;
    return modifiedArticle;
  } catch (error) {
    if (error.response) {
      console.error('API error:', error.response.data);
      if (error.response.status === 429) {
        console.log('Rate limit exceeded. Please try again later.');
      }
    } else {
      console.error('Error modifying the article:', error.message);
    }
    throw error;
  }
}

// Example usage
const originalText = 'এইটি একটি উদাহরণ মূল নিবন্ধ, যা আমরা পরিবর্তন করবো।';
modifyArticle(originalText).then((modifiedText) => {
  console.log('Modified Article:', modifiedText);
}).catch(error => {
  console.error('Error in modification process:', error);
});

