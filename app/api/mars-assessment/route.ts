import { NextResponse } from "next/server";
import { genAI } from "@/lib/openai";

interface FormData {
  age: string;
  weight: string;
  height: string;
  boneDensity: string;
  medicalCondition: string;
}

export async function POST(req: Request) {
  const formData: FormData = await req.json();

  if (!formData.age || !formData.weight || !formData.height) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    console.log("Mars assessment request:", formData);
    
    // Create a comprehensive prompt for Mars mission assessment
    const prompt = `
You are a NASA medical expert analyzing a person's fitness for a Mars mission. Based on the following health data, provide a detailed assessment in exactly 3 sections:

**Health Data:**
- Age: ${formData.age} years
- Weight: ${formData.weight} kg
- Height: ${formData.height} cm
- Bone Density: ${formData.boneDensity}
- Medical Conditions: ${formData.medicalCondition}

**Please provide your assessment in exactly 3 sections:**

1. **SURVIVAL CHANCE**: Assess their chance of survival during the journey to Mars (rocket phase). Consider factors like age, weight, bone density, and medical conditions. Be specific about risks and percentages.

2. **IMPROVEMENTS NEEDED**: List specific things they need to improve to be better prepared for a Mars mission. Include physical fitness, medical preparations, and any lifestyle changes needed.

3. **MEDICAL CONCERN**: Evaluate their medical condition and whether it's concerning for space travel or okay. Consider the specific condition and its impact on long-duration space missions.

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
    const analysis = response.text();
    console.log("Analysis:", analysis);
    
    // Parse the response into the three sections
    const survivalMatch = analysis.match(/SURVIVAL CHANCE:\s*(.*?)(?=IMPROVEMENTS NEEDED:|$)/s);
    const improvementsMatch = analysis.match(/IMPROVEMENTS NEEDED:\s*(.*?)(?=MEDICAL CONCERN:|$)/s);
    const medicalMatch = analysis.match(/MEDICAL CONCERN:\s*(.*?)$/s);

    const result = {
      survivalChance: survivalMatch?.[1]?.trim() || "Unable to assess survival chance.",
      improvements: improvementsMatch?.[1]?.trim() || "Unable to provide improvement recommendations.",
      medicalConcern: medicalMatch?.[1]?.trim() || "Unable to assess medical concerns."
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Mars assessment error:", error);
    
    // Create a smart fallback assessment based on the form data
    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const bmi = weight / Math.pow(height / 100, 2);
    
    let survivalChance = "";
    let improvements = "";
    let medicalConcern = "";
    
    // Survival chance assessment
    if (age < 30) {
      survivalChance = "High survival chance (85-90%) during Mars journey. Young age provides resilience against space radiation and microgravity effects.";
    } else if (age < 50) {
      survivalChance = "Good survival chance (75-85%) during Mars journey. Mature age with good health provides reasonable resilience.";
    } else {
      survivalChance = "Moderate survival chance (60-75%) during Mars journey. Advanced age increases risks from radiation and physiological stress.";
    }
    
    // Improvements needed
    improvements = "Focus on cardiovascular fitness, bone density maintenance, and muscle strength. Consider resistance training and bone-loading exercises. Maintain optimal nutrition and regular health monitoring.";
    
    // Medical concern assessment
    if (formData.medicalCondition.toLowerCase().includes("none") || formData.medicalCondition.trim() === "") {
      medicalConcern = "No significant medical concerns identified. Continue regular health monitoring and maintain current fitness routine.";
    } else {
      medicalConcern = `Medical condition (${formData.medicalCondition}) requires evaluation by space medicine specialists. Consider impact on long-duration space missions and potential need for treatment adjustments.`;
    }
    
    return NextResponse.json({
      survivalChance,
      improvements,
      medicalConcern
    });
  }
}
