"use client";
import { useState, useEffect } from "react";

interface AssessmentResult {
  survivalChance: string;
  improvements: string;
  medicalConcern: string;
}

export default function JourneyEvaluation() {
  // Hard-coded default assessment for a trained astronaut
  const defaultResult: AssessmentResult = {
    survivalChance:
      "High — Based on the trained astronaut profile, your physiological metrics, sleep pattern, and absence of chronic conditions indicate strong resilience to Mars mission stressors. Continued adherence to training and countermeasures should maintain a high survival probability.",
    improvements:
      "Maintain current conditioning with focused aerobic and resistance training, follow a nutrient-rich regimen with emphasis on protein and iron monitoring, and continue regular sleep hygiene practices. Minor enhancements: add targeted vestibular training and periodic bone density monitoring.",
    medicalConcern:
      "Low — No immediate medical concerns. Continue routine monitoring for orthostatic intolerance and bone density changes; be mindful of radiation exposure countermeasures.",
  };

  const [result, setResult] = useState<AssessmentResult>(defaultResult);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("marsAssessmentResult");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AssessmentResult>;
        // shallow-merge parsed over default to ensure missing keys handled
        setResult({ ...defaultResult, ...parsed });
      }
    } catch (e) {
      console.error("Failed to read assessment from sessionStorage", e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#697bee] via-black to-[#ee8869] text-white font-sans p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Journey Evaluation</h1>
          <a
            href="/StartJourney#bottom"
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-colors"
          >
            Back
          </a>
        </header>
        <p className="text-gray-300 -mt-8 mb-8">
          Your personalized assessment (defaults shown if none available).
        </p>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-2xl font-semibold mb-4">Survival Chance</h2>
            <p className="text-gray-200 whitespace-pre-line">
              {result.survivalChance}
            </p>
          </div>
          <div className="bg-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-2xl font-semibold mb-4">Improvements Needed</h2>
            <p className="text-gray-200 whitespace-pre-line">
              {result.improvements}
            </p>
          </div>
          <div className="bg-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-2xl font-semibold mb-4">Medical Concern</h2>
            <p className="text-gray-200 whitespace-pre-line">
              {result.medicalConcern}
            </p>
          </div>
        </main>

        <footer className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-400">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <span className="font-semibold">Team @SSE</span>
            <a href="#" className="hover:text-white">
              ANALYTICS
            </a>
            <a href="#" className="hover:text-white">
              RESEARCHES
            </a>
            <a href="/AboutUs" className="hover:text-white">
              ABOUT US
            </a>
          </div>
          <div>
            <p>Team: 6 Scrambled Eggs</p>
          </div>
        </footer>
      </div>
    </div>
  );
}