import axios from 'axios';

async function test() {
  console.log("Testing local endpoint /api/recommend...");
  try {
    const response = await axios.post('http://localhost:3000/api/recommend', {
      messages: [
        {
          role: 'assistant',
          content: "Hello! I am Velora AI, your personal intelligence-driven shopping companion. What kind of product are you searching for today?"
        },
        {
          role: 'user',
          content: "I want an ergonomic office chair for around $500."
        }
      ]
    });
    console.log("SUCCESS! Endpoint response:", JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.error("ENDPOINT FAILED:", err.response ? {
      status: err.response.status,
      data: err.response.data
    } : err.message);
  }
}

test();
