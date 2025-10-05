"use client";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0C1413] to-[#2E1C0B] text-white font-sans p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <h1 className="text-4xl font-bold">The Team</h1>
          <a href="/" className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">Home</a>
        </header>

        <main>
          <div className="bg-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-2xl font-semibold mb-4">Our Crew</h2>
            <ol className="mt-6 list-decimal list-inside space-y-2 text-gray-100">
              <li>
                <strong>Aldebaran Rahman</strong>
                <div className="text-sm text-gray-300">King of Leetcode</div>
              </li>
              <li>
                <strong>Abdurrahman Ammar</strong>
                <div className="text-sm text-gray-300">UI/UX and Front-end Developer</div>
              </li>
              <li>
                <strong>Fahmi Milan</strong>
                <div className="text-sm text-gray-300">MUN Delegates</div>
              </li>
              <li>
                <strong>Randuichi Touya</strong>
                <div className="text-sm text-gray-300">The guy who works on the Research API for 48 hours</div>
              </li>
              <li>
                <strong>Zayyan Ramadzaki</strong>
                <div className="text-sm text-gray-300">Freaky Bogorians</div>
              </li>
              <li>
                <strong>Zhillan Baniaksa</strong>
                <div className="text-sm text-gray-300">Kin of UI/UX bro</div>
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
