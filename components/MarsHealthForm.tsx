"use client";
import { useState } from "react";

interface FormData {
  age: string;
  weight: string;
  height: string;
  boneDensity: string;
  medicalCondition: string;
}

interface AssessmentResult {
  survivalChance: string;
  improvements: string;
  medicalConcern: string;
}

const questions = [
  {
    id: "age",
    label: "What is your age?",
    placeholder: "Enter your age in years",
    type: "number"
  },
  {
    id: "weight",
    label: "What is your weight?",
    placeholder: "Enter your weight in kg",
    type: "number"
  },
  {
    id: "height",
    label: "What is your height?",
    placeholder: "Enter your height in cm",
    type: "number"
  },
  {
    id: "boneDensity",
    label: "What is your bone density level?",
    placeholder: "Select your bone density level",
    type: "select",
    options: ["Low", "Average", "High"]
  },
  {
    id: "medicalCondition",
    label: "Do you have any medical conditions?",
    placeholder: "Describe any medical conditions (or 'none' if none)",
    type: "text"
  }
];

export default function MarsHealthForm() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    age: "",
    weight: "",
    height: "",
    boneDensity: "Average",
    medicalCondition: ""
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AssessmentResult | null>(null);

  const handleInputChange = (value: string) => {
    const questionId = questions[currentQuestion].id as keyof FormData;
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch("/api/mars-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Assessment failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setCurrentQuestion(0);
    setFormData({
      age: "",
      weight: "",
      height: "",
      boneDensity: "Average",
      medicalCondition: ""
    });
    setResults(null);
  };

  const currentQuestionData = questions[currentQuestion];
  const currentValue = formData[currentQuestionData.id as keyof FormData];
  const canProceed = currentValue.trim() !== "";

  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🚀 Mars Mission Health Assessment
            </h1>
            <p className="text-purple-300 text-lg">
              Your personalized Mars mission readiness report
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl p-6 border border-purple-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                🛸 Survival Chance
              </h3>
              <p className="text-purple-100 leading-relaxed">
                {results.survivalChance}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl p-6 border border-purple-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                💪 Improvements Needed
              </h3>
              <p className="text-purple-100 leading-relaxed">
                {results.improvements}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl p-6 border border-purple-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                🏥 Medical Assessment
              </h3>
              <p className="text-purple-100 leading-relaxed">
                {results.medicalConcern}
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={resetForm}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              🔄 Take Another Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🚀 Mars Mission Health Assessment
          </h1>
          <p className="text-purple-300 text-lg">
            Answer a few questions to get your personalized Mars mission readiness report
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-purple-700">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-purple-300 text-sm">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-purple-300 text-sm">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {currentQuestionData.label}
            </h2>

            {currentQuestionData.type === "select" ? (
              <div className="space-y-3">
                {currentQuestionData.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleInputChange(option)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      currentValue === option
                        ? "border-purple-500 bg-purple-900 text-white"
                        : "border-gray-600 bg-gray-700 text-gray-300 hover:border-purple-400 hover:bg-gray-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type={currentQuestionData.type}
                value={currentValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentQuestionData.placeholder}
                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
              />
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              ← Previous
            </button>

            {isAnalyzing ? (
              <div className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </div>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                {currentQuestion === questions.length - 1 ? "Get Assessment" : "Next →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
