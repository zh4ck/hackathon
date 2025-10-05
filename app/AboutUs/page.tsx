"use client";

import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0C1413] to-[#2E1C0B] text-white font-sans p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <h1 className="text-4xl font-bold">The Team</h1>
          <Link href="/" className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">Home</Link>
        </header>

        <main>
          <div className="bg-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-2xl font-semibold mb-4">Our Crew</h2>
            <p className="text-gray-300">
              Information about the team members will be added here soon.
            </p>

            <ol className="mt-6 list-decimal list-inside space-y-2 text-gray-100">
              <li>
                <strong>Aldebaran</strong>
                <div className="text-sm text-gray-300">Leetcode Specialist</div>
              </li>
              <li>
                <strong>Ammar</strong>
                <div className="text-sm text-gray-300">Front-end Developer, UI UX Engineer</div>
              </li>
              <li>
                <strong>Fahmi</strong>
                <div className="text-sm text-gray-300">Front-end Developer, UI UX Engineer, Rocket Specialist, Planetery Gods</div>
              </li>
              <li>
                <strong>Touya</strong>
                <div className="text-sm text-gray-300">The Monolithic God of API</div>
              </li>
              <li>
                <strong>Zayyan</strong>
                <div className="text-sm text-gray-300">Git commit git branch git commit git branch</div>
              </li>
              <li>
                <strong>Zhillan</strong>
                <div className="text-sm text-gray-300">The King of UI/UX</div>
              </li>
            </ol>

          </div>
        </main>

        <footer className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-400">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <span className="font-semibold">Team @SSE</span>
            <a href="/ResearchHub" className="hover:text-white">RESEARCHES</a>
            <a href="/Analytics" className="hover:text-white">ANALYTICS</a>
          </div>
          <div>
            <p>Team: 6 Scrambled Eggs</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
