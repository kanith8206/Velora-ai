import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  console.log("Testing Gemini API with key:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Hello! Tell me a 1-word greeting.",
    });
    console.log("Success! Response text:", response.text);
  } catch (err) {
    console.error("Failed:", err);
  }
}

test();
