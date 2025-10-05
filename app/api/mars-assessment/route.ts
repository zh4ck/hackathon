import { NextResponse } from "next/server";
import { genAI } from "@/lib/openai";

// Updated interface for data received by the server
// NOTE: BMI is calculated on the client side and sent here
interface APIRequestData {
  biologicalSex: "Male" | "Female" | "";
  age: number;
  bmi: number; // New: Calculated from Height and Mass
  sleep: number; // New: Sleep hours
  medicalCondition: string; // Re-added
}

export async function POST(req: Request) {
  const formData: APIRequestData = await req.json();

  // Check for required fields
  if (!formData.age || !formData.bmi || !formData.sleep || !formData.biologicalSex || formData.medicalCondition === undefined) {
    return NextResponse.json({ error: "Missing required health fields." }, { status: 400 });
  }
  
  // Basic numeric validation
  if (formData.age <= 0 || formData.bmi <= 0 || formData.sleep < 0 || formData.sleep > 24) {
    return NextResponse.json({ error: "Numeric fields contain invalid values." }, { status: 400 });
  }

  try {
    console.log("Mars assessment request:", formData);
    
    // Update the prompt to use all five new data points
    const prompt = `
You are a NASA medical expert analyzing a person's fitness for a Mars mission. Based on the following health data, provide a detailed assessment in exactly 3 sections:

**Health Data:**
- Biological Sex: ${formData.biologicalSex}
- Age: ${formData.age} years
- BMI: ${formData.bmi} (calculated from height and mass)
- Average Sleep per Day: ${formData.sleep} hours
- Medical Conditions: ${formData.medicalCondition}

**Please provide your assessment in exactly 3 sections:**

1. **SURVIVAL CHANCE**: Assess their chance of survival during the journey to Mars. Consider age, sex, BMI, and the impact of the sleep pattern and medical condition on mission resilience. Give a specific risk assessment and percentage.

2. **IMPROVEMENTS NEEDED**: List specific things they need to improve to be better prepared for a Mars mission. Include physical fitness, nutritional adjustments (based on BMI), psychological readiness (based on sleep), and any necessary medical preparations.

3. **MEDICAL CONCERN**: Evaluate their stated medical condition and whether it poses a significant risk for long-duration space travel (radiation, microgravity, isolation). If the condition is 'none', state that, but still advise on necessary precautions.

Format your response exactly like this:
SURVIVAL CHANCE: [your assessment here]
IMPROVEMENTS NEEDED: [your recommendations here]
MEDICAL CONCERN: [your medical evaluation here]

Be detailed, professional, and specific in your analysis.`;

    console.log("Sending request to Gemini API...");
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    console.log("Gemini API response received");
    
    const analysis = response.text; 
    
    console.log("Analysis:", analysis);
    
    if (!analysis || typeof analysis !== 'string') {
        console.error("AI analysis text is missing or invalid. Falling back to internal assessment.");
        throw new Error("AI failed to generate a valid text response.");
    }
    
    // Parse the response into the three sections
    const survivalMatch = analysis.match(/SURVIVAL CHANCE:\s*(.*?)(?=IMPROVEMENTS NEEDED:|$)/);
    const improvementsMatch = analysis.match(/IMPROVEMENTS NEEDED:\s*(.*?)(?=MEDICAL CONCERN:|$)/);
    const medicalMatch = analysis.match(/MEDICAL CONCERN:\s*(.*?)$/);

    const result = {
      survivalChance: survivalMatch?.[1]?.trim() || "AI parse error. See fallback details.",
      improvements: improvementsMatch?.[1]?.trim() || "AI parse error. See fallback details.",
      medicalConcern: medicalMatch?.[1]?.trim() || "AI parse error. See fallback details."
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Mars assessment error:", error);
    
    // --- Smart Fallback Assessment (Uses all 5 data points) ---
    const { age, bmi, sleep, medicalCondition, biologicalSex } = formData;
    
    let baseSurvival = 80;
    
    // Adjust survival chance based on specific factors
    if (age >= 50) baseSurvival -= 15;
    else if (age >= 40) baseSurvival -= 5;
    
    if (bmi < 18.5 || bmi > 27) baseSurvival -= 10; 
    else if (bmi < 20 || bmi > 25) baseSurvival -= 3;
    
    if (sleep < 6 || sleep > 9) baseSurvival -= 8;
    
    if (medicalCondition.toLowerCase().includes("none") || medicalCondition.trim() === "") {
        baseSurvival += 0;
    } else {
        baseSurvival -= 15; 
    }
    
    // Ensure it's between 20% and 95%
    baseSurvival = Math.max(20, Math.min(95, baseSurvival));

    let survivalChance = `Internal Assessment: Your estimated survival chance is ${baseSurvival}% - ${baseSurvival + 5}%. (Note: Calculated using simple internal risk factors due to AI failure).`;
    
    let improvements = "Focus on bone density and muscle strength. ";
    if (bmi < 18.5) improvements += "**Critical: Increase muscle mass and healthy caloric intake.** ";
    else if (bmi > 25) improvements += "**Critical: Reduce body fat to optimize BMI.** ";

    if (sleep < 7) improvements += `**Improve sleep routine (currently ${sleep}h).** A minimum of 7-8 hours is essential for cognitive function and stress resilience.`;
    else improvements += "Maintain current sleep and fitness routines.";
    
    let medicalConcern = `Medical profile (Age: ${age}, BMI: ${bmi.toFixed(1)}, Sleep: ${sleep}h). `;

    if (medicalCondition.toLowerCase().includes("none") || medicalCondition.trim() === "") {
      medicalConcern += "No specific medical conditions reported. Continue standard health screenings.";
    } else {
      medicalConcern += `**SERIOUS CONCERN**: Condition '${medicalCondition}' requires immediate evaluation by space medicine specialists. This significantly impacts mission readiness.`;
    }
    medicalConcern += " (Error: AI connection failed, this is a simplified assessment)";
    
    return NextResponse.json({
      survivalChance,
      improvements,
      medicalConcern
    });
  }
}