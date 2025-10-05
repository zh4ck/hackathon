"use client";

import Link from "next/link"; // ✅ add this import

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0C1413] to-[#2E1C0B] text-white flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 text-sm">
        <div className="flex space-x-4">
          <span className="opacity-80">Team @SSE</span>
          <a href="#" className="hover:opacity-100 opacity-80">RESEARCHES</a>
          <a href="#" className="hover:opacity-100 opacity-80">ANALYTICS</a>
          <a href="#" className="hover:opacity-100 opacity-80">ABOUT US</a>
        </div>
        <span className="opacity-80">Six Scrambled Eggs Corporation</span>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center relative text-center">
        {/* circles (unchanged) */}

        <div className="mb-10 z-10 flex flex-col md:flex-row items-center justify-center space-x-0 md:space-x-10 space-y-5 md:space-y-0">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[8rem] font-extrabold">
            Explore
          </h1>

          <div className="flex flex-col items-center md:items-start space-y-2">
            {/* ✅ This is now a clickable link */}
            <Link href="/HealthForm">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-gray-400 mt-6 ml-5 mr-5 
                          hover:text-white hover:scale-[1.05] 
                          transition-all duration-300 ease-in-out cursor-pointer">
                Personalize Journey
              </p>
            </Link>

            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-gray-400 ml-5 mr-5 
                        hover:text-white hover:scale-[1.05] 
                        transition-all duration-300 ease-in-out cursor-pointer">
              Astronaut’s Journey
            </p>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-gray-400 mb-4 ml-5 mr-5 
                        hover:text-white hover:scale-[1.05] 
                        transition-all duration-300 ease-in-out cursor-pointer">
              Scrambled Eggs
            </p>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[8rem] font-extrabold">
            Mars
          </h1>
        </div>
      </section>
    </main>
  );
}
