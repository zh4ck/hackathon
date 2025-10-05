"use client";
import { useEffect, useState } from "react";

interface AssessmentResult {
  survivalChance: string;
  improvements: string;
  medicalConcern: string;
}

export default function JourneyEvaluation() {
  const [result, setResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("marsAssessmentResult");
      if (raw) setResult(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to read assessment from sessionStorage", e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#697bee] via-black to-[#ee8869] text-white font-sans p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Journey Evaluation</h1>
          <a href="/StartJourney#bottom" className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">Back</a>
        </header>
        <p className="text-gray-300 -mt-8 mb-8">Personalized results from your HealthForm.</p>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-2xl font-semibold mb-4">Survival Chance</h2>
            <p className="text-gray-200 whitespace-pre-line">{result?.survivalChance ?? "No result yet. Complete the HealthForm to see your analysis."}</p>
          </div>
          <div className="bg-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-2xl font-semibold mb-4">Improvements Needed</h2>
            <p className="text-gray-200 whitespace-pre-line">{result?.improvements ?? "No result yet. Complete the HealthForm to see your analysis."}</p>
          </div>
          <div className="bg-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-2xl font-semibold mb-4">Medical Concern</h2>
            <p className="text-gray-200 whitespace-pre-line">{result?.medicalConcern ?? "No result yet. Complete the HealthForm to see your analysis."}</p>
          </div>
        </main>

        <footer className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-400">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <span className="font-semibold">Team @SSE</span>
            <a href="#" className="hover:text-white">ANALYTICS</a>
            <a href="#" className="hover:text-white">RESEARCHES</a>
            <a href="#" className="hover:text-white">ABOUT US</a>
          </div>
          <div>
            <p>Team: 6 Scrambled Eggs</p>
          </div>
        </footer>
      </div>
    </div>
  );
}