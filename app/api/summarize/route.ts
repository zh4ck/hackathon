import { NextResponse } from "next/server";
import { genAI } from "@/lib/openai";

// You can also add other AI providers here
// import OpenAI from 'openai';
// import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  // Check if Gemini is properly configured
  console.log("Environment check:");
  console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
  console.log("GOOGLE_API_KEY exists:", !!process.env.GOOGLE_API_KEY);
  console.log("GEMINI_API_KEY value:", process.env.GEMINI_API_KEY);
  console.log("GOOGLE_API_KEY value:", process.env.GOOGLE_API_KEY);
  console.log(
    "Is placeholder:",
    (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) === "placeholder-key"
  );

  // Check if we have a valid API key
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey === "placeholder-key") {
    console.log("No valid API key found, using mock AI");
    // Return a mock AI summary for testing when no API key is configured
    const generateMockSummary = (text: string) => {
      const words = text.toLowerCase();
      let topic = "space biology";
      let keyFindings = "significant biological adaptations";
      let implications = "future space missions";

      if (words.includes("plant") || words.includes("growth")) {
        topic = "plant biology in space";
        keyFindings = "altered growth patterns and gene expression";
        implications = "space agriculture development";
      } else if (words.includes("radiation") || words.includes("cell")) {
        topic = "radiation effects on biological systems";
        keyFindings = "cellular damage and DNA repair mechanisms";
        implications = "radiation protection strategies";
      } else if (words.includes("microbial") || words.includes("bacteria")) {
        topic = "microbial ecology in closed systems";
        keyFindings = "complex microbial interactions and nutrient cycling";
        implications = "life support system design";
      } else if (words.includes("sleep") || words.includes("circadian")) {
        topic = "human physiology in space";
        keyFindings = "sleep disruption and circadian rhythm changes";
        implications = "crew health and performance optimization";
      } else if (words.includes("bone") || words.includes("density")) {
        topic = "bone physiology in microgravity";
        keyFindings = "significant bone density loss and countermeasures";
        implications = "long-term space mission health protocols";
      } else if (words.includes("psychological") || words.includes("isolation")) {
        topic = "psychological adaptation in space";
        keyFindings = "isolation effects and coping strategies";
        implications = "crew selection and support systems";
      }

      return `🤖 AI Summary: This research focuses on ${topic}. The study reveals ${keyFindings} in space environments. These findings have important implications for ${implications}. The research contributes to our understanding of biological systems in space and informs future space exploration strategies.`;
    };

    return NextResponse.json({
      summary: generateMockSummary(text),
    });
  }

  try {
    console.log("Attempting to use Google Gemini API...");
    console.log("API Key present:", !!apiKey);
    console.log("API Key value:", apiKey?.substring(0, 10) + "...");

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Summarize this NASA bioscience publication concisely:\n\n${text}`,
    });

    console.log("Gemini API call successful");
    return NextResponse.json({ summary: response.text });
  } catch (error: unknown) {
    console.error("Gemini API error:", error);
    const errMsg =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : JSON.stringify(error);
    console.error("Error details:", errMsg);
    console.error("Full error:", JSON.stringify(error, null, 2));

    // Check if it's an API key issue
    if (errMsg.includes("API key") || errMsg.includes("authentication")) {
      return NextResponse.json({
        summary: `API Key Error: ${errMsg}. Please verify your Google API key is correct and has the necessary permissions.`,
      });
    }

    // Return a more helpful error message
    return NextResponse.json({
      summary: `Error generating summary: ${errMsg}. Please check your Google API key configuration.`,
    });
  }
}
