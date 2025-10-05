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

    // Check for required fields (explicit checks to avoid treating 0 as missing)
    const missing: string[] = [];
    if (formData.biologicalSex === undefined || formData.biologicalSex === "") missing.push("biologicalSex");
    if (formData.age === undefined || formData.age === null) missing.push("age");
    if (formData.bmi === undefined || formData.bmi === null) missing.push("bmi");
    if (formData.sleep === undefined || formData.sleep === null) missing.push("sleep");
    if (formData.medicalCondition === undefined || formData.medicalCondition === null) missing.push("medicalCondition");

    if (missing.length > 0) {
        console.error('mars-assessment: missing or invalid fields ->', missing);
        return NextResponse.json({ error: `Missing required health fields: ${missing.join(", ")}` }, { status: 400 });
    }

    // Basic numeric validation using Number.isFinite (reject NaN/Infinity)
    const numericErrors: string[] = [];
    if (!Number.isFinite(formData.age) || formData.age <= 0) numericErrors.push("age");
    if (!Number.isFinite(formData.bmi) || formData.bmi <= 0) numericErrors.push("bmi");
    if (!Number.isFinite(formData.sleep) || formData.sleep < 0 || formData.sleep > 24) numericErrors.push("sleep");

    if (numericErrors.length > 0) {
        console.error('mars-assessment: numeric validation failed ->', numericErrors);
        return NextResponse.json({ error: `Numeric fields contain invalid values: ${numericErrors.join(", ")}` }, { status: 400 });
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

        // Robust parsing: tolerate case variations, separators like ':' or '-', and label ordering
        const labels = ["SURVIVAL CHANCE", "IMPROVEMENTS NEEDED", "MEDICAL CONCERN"];
        const parsed: Record<string, string | null> = {};

        // Helper to escape regex
        const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        for (let i = 0; i < labels.length; i++) {
            const label = labels[i];
            const nextLabels = labels.slice(i + 1).map(esc).join("|");
            const re = new RegExp(
                esc(label) + "[:\-–]*\\s*([\\s\\S]*?)(?=(?:" + (nextLabels || "$") + ")|$)",
                "i"
            );
            const m = analysis.match(re);
            parsed[label] = m?.[1]?.trim() || null;
        }

        // If parsing failed for all sections, try a fallback split by common headings (loose)
        const allNull = Object.values(parsed).every((v) => v === null);
        if (allNull) {
            console.warn("mars-assessment: initial parsing failed, attempting loose split");
            // Split by lines that look like headings (uppercase words followed by ':'), then try to map
            const loose = analysis.split(/\n(?=[A-Z\s]{3,}:)/);
            if (loose.length >= 1) {
                // attempt to find lines that start with labels
                for (const part of loose) {
                    for (const label of labels) {
                        const rx = new RegExp("^\\s*" + esc(label) + "[:\-–]?\\s*", "i");
                        if (rx.test(part)) {
                            parsed[label] = part.replace(rx, "").trim();
                        }
                    }
                }
            }
        }

        const result = {
            survivalChance: parsed["SURVIVAL CHANCE"] || "AI parse error. See fallback details.",
            improvements: parsed["IMPROVEMENTS NEEDED"] || parsed["IMPROVEMENTS"] || "AI parse error. See fallback details.",
            medicalConcern: parsed["MEDICAL CONCERN"] || "AI parse error. See fallback details."
        };

        console.log("Parsed assessment result:", result);

        return NextResponse.json(result);
  } catch (error) {
    console.error("Mars assessment error:", error);
    
    // --- Smart Fallback Assessment (Uses all 5 data points) ---
    const { age, bmi, sleep, medicalCondition } = formData;
    
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

    const survivalChance = `Internal Assessment: Your estimated survival chance is ${baseSurvival}% - ${baseSurvival + 5}%. (Note: Calculated using simple internal risk factors due to AI failure).`;
    
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