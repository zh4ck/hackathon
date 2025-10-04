import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "placeholder-key";

export const genAI = new GoogleGenAI({ apiKey });