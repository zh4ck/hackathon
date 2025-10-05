"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface FormData {
  biologicalSex: "Male" | "Female" | "";
  age: string;
  heightMass: string;
  sleep: string;
  medicalCondition: string;
}

interface AssessmentResult {
  survivalChance: string;
  improvements: string;
  medicalConcern: string;
}


const questions = [
  {
    id: "biologicalSex",
    label: "Biological Sex",
    subLabel: "Personalize Your Journey", // New subLabel for the main title
    placeholder: "Choose your biological sex",
    type: "select",
    options: ["Male", "Female"]
  },
  {
    id: "age",
    label: "Age",
    subLabel: "Personalize Your Journey",
    placeholder: "Enter your age in years (18-80)",
    type: "number",
    min: 18,
    max: 80,
  },
  {
    id: "heightMass",
    label: "Height & Mass",
    subLabel: "Personalize Your Journey",
    placeholder: "Enter height in cm, then mass in kg (e.g., 175, 70)",
    type: "text"
  },
  {
    id: "sleep",
    label: "Hours of Sleep/Day",
    subLabel: "Personalize Your Journey",
    placeholder: "Average hours of sleep per day (0-24)",
    type: "number",
    min: 0,
    max: 24,
  },
  {
    id: "medicalCondition",
    label: "Medical Condition",
    subLabel: "Personalize Your Journey",
    placeholder: "Describe any medical conditions (or 'none' if none)",
    type: "text"
  }
];

export default function MarsHealthForm() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [formData, setFormData] = useState<FormData>({
    biologicalSex: "",
    age: "",
    heightMass: "",
    sleep: "",
    medicalCondition: "",
  });
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AssessmentResult | null>(null);

  const handleStartJourney = () => {
    router.push("/StartJourney");
  };

  const handleInputChange = (value: string) => {
    const questionId = questions[currentQuestion].id as keyof FormData;
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateBMI = (heightMass: string) => {
    const parts = heightMass.split(',').map(s => parseInt(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && parts[0] > 0 && !isNaN(parts[1]) && parts[1] > 0) {
      const height_m = parts[0] / 100;
      const mass = parts[1];
      return mass / (height_m * height_m);
    }
    return null;
  };

  const currentQuestionData = questions[currentQuestion];
  const currentValue = formData[currentQuestionData.id as keyof FormData];

  const validation = useMemo(() => {
    let valid = currentValue.trim() !== "";
    let message: string | null = null;

    if (!valid) {
      return { valid: false, message: null };
    }

    if (currentQuestionData.id === "age") {
      const age = parseInt(currentValue, 10);
      const min = currentQuestionData.min!;
      const max = currentQuestionData.max!;
      if (isNaN(age)) { valid = false; message = "Age must be a number."; }
      else if (age < min || age > max) { valid = false; message = `Age must be between ${min} and ${max}.`; }
    }
    else if (currentQuestionData.id === "sleep") {
      const sleep = parseFloat(currentValue);
      const min = currentQuestionData.min!;
      const max = currentQuestionData.max!;
      if (isNaN(sleep)) { valid = false; message = "Sleep hours must be a number."; }
      else if (sleep < min || sleep > max) { valid = false; message = `Sleep hours must be between ${min} and ${max}.`; }
    }
    else if (currentQuestionData.id === "heightMass") {
      const parts = currentValue.split(',').map(s => s.trim());
      if (parts.length !== 2) {
        valid = false;
        message = "Please enter two values separated by a comma (Height, Mass).";
      } else {
        const height = parseInt(parts[0]);
        const mass = parseInt(parts[1]);
        if (isNaN(height) || height <= 0) {
          valid = false;
          message = "Height (first value) must be a positive integer in cm.";
        } else if (isNaN(mass) || mass <= 0) {
          valid = false;
          message = "Mass (second value) must be a positive integer in kg.";
        }
      }
    }

    return { valid, message };
  }, [currentValue, currentQuestionData.id]);

  const canProceed = validation.valid;


  const handleSubmit = async () => {
    setIsAnalyzing(true);

    // --- THIS IS THE FIX ---
    // Perform a final check on all form data before submitting.
    for (const key in formData) {
      if (formData[key as keyof FormData].trim() === "") {
        setResults({
          survivalChance: "Error",
          improvements: `The field '${key}' was left empty. Please go back and complete all questions.`,
          medicalConcern: "Incomplete form submission."
        });
        setIsAnalyzing(false);
        return; // Stop the submission
      }
    }
    // --- END OF FIX ---

    try {
      const bmi = calculateBMI(formData.heightMass);

      if (bmi === null) {
        throw new Error("Invalid Height and Mass format for BMI calculation.");
      }

      const submissionData = {
        biologicalSex: formData.biologicalSex,
        age: parseInt(formData.age, 10),
        bmi: parseFloat(bmi.toFixed(1)),
        sleep: parseFloat(formData.sleep),
        medicalCondition: formData.medicalCondition,
      };

      const response = await fetch("/api/mars-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! Status: ${response.status}`, errorText);
        throw new Error(`Assessment failed with status ${response.status}.`);
      }

      const data = await response.json();
      setResults(data);
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("marsAssessmentResult", JSON.stringify(data));
        } catch (e) {
          console.error("Failed to store assessment in sessionStorage", e);
        }
      }
    } catch (error) {
      console.error("Assessment failed:", error);
      setResults({
        survivalChance: "Error",
        improvements: "Could not complete the assessment due to a server error or invalid input. Please try again.",
        medicalConcern: (error as Error).message || "Unknown error."
      });
    } finally {
      setIsAnalyzing(false);
      router.push("/StartJourney");
    }
  };

  const handleNext = () => {
    if (!canProceed) return;

    if (currentQuestion < questions.length - 1) {
      setDirection(1);
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const resetForm = () => {
    setCurrentQuestion(0);
    setFormData({
      biologicalSex: "",
      age: "",
      heightMass: "",
      sleep: "",
      medicalCondition: "",
    });
    setResults(null);
  };

  // --- I've omitted the JSX for brevity as it remains unchanged. ---
  // --- Paste this logic into your existing file. ---
  // --- The `return (...)` part of your component is correct. ---


  return (

    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tl from-orange-800 to-black opacity-30 z-0"></div>

      <div className="relative z-10 p-8 max-w-4xl w-full mx-auto">
        <div className="flex items-center space-x-6">
          {/* Large Question Number */}
          <div className="text-[10rem] font-bold leading-none text-white opacity-100 select-none">
            {currentQuestion + 1}
          </div>

          <div className="h-100 w-2 bg-white opacity-100 self-center"></div>

          <div className="flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentQuestion}
                custom={direction}
                initial={(dir: 1 | -1) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.98 })}
                animate={{ x: 0, opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" } }}
                exit={(dir: 1 | -1) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.98, transition: { duration: 0.25, ease: "easeIn" } })}
              >
                {/* Sub-label / Main Title */}
                <p className="text-gray-300 text-3xl font-light mb-2">
                  {currentQuestionData.subLabel}
                </p>
                {/* Question Label */}
                <h2 className="text-7xl font-bold text-white mb-8">
                  {currentQuestionData.label}
                </h2>

                {/* Input Field */}
                <div className="w-96"> {/* Container to control width for both types */}

                  {/* 🚀 GRADIENT BORDER WRAPPER (Outer div) */}
                  <div className="p-[4px] rounded-lg bg-gradient-to-r from-red-500 via-blue-500 to-orange-500">

                    {currentQuestionData.type === "select" ? (
                      <select
                        value={currentValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        // Inner element has white background and dark text
                        className="w-full p-4 pr-10 text-xl bg-white text-gray-900 rounded-lg focus:outline-none appearance-none text-left"
                        // Custom arrow needs to be dark for the white background
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%231F2937'%3e%3cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
                      >
                        <option value="" disabled className="text-gray-500">{currentQuestionData.placeholder}</option>
                        {currentQuestionData.options?.map((option) => (
                          <option key={option} value={option} className="text-gray-900">
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={currentQuestionData.type === "number" ? "number" : "text"}
                        value={currentValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder={currentQuestionData.placeholder}
                        // Inner element has white background and dark text
                        className="w-full p-4 text-xl bg-white text-gray-900 rounded-lg placeholder-gray-500 focus:outline-none transition-all duration-300"
                        {...(currentQuestionData.type === "number" && { step: "any" })}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Validation Error Display */}
        {validation.message && (
          <p className="text-red-400 text-sm mt-4 text-center">
            ⚠️ {validation.message}
          </p>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-16">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || isAnalyzing}
            className="px-8 py-4 bg-gray-800 text-gray-300 text-lg rounded-lg hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            ← Previous
          </button>

          {isAnalyzing ? (
        <div className="flex items-center space-x-3 px-10 py-4 bg-red-600 text-white text-lg rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
          <span>Analyzing...</span>
        </div>
      ) : (
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="px-10 py-4 bg-red-600 text-white text-lg font-bold rounded-lg hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          {currentQuestion === questions.length - 1 ? "Take Off" : "Next →"}
        </button>
      )}
        </div>
      </div>
    </motion.div>
  );
}