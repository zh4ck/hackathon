import React from 'react';

// For the search icon, we can use an inline SVG to keep everything in one file.
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-gray-400"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

// Main App Component
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#697bee] via-black to-[#ee8869] text-white font-sans p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12 flex items-center justify-between">
          <h1 className="text-4xl font-bold">NASA Research Hub</h1>
          <a href="/StartJourney#bottom" className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">Back</a>
        </header>
        
        <p className="text-gray-300 -mt-8 mb-8">Explore curated research about Mars and space biology.</p>
        
        {/* Search */}
        <div className="relative mb-12">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="What do you want to know more about Mars?"
              className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 rounded-full py-4 pl-12 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/* Main Content Section */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Summary Column */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-semibold mb-4">Summary</h2>
            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 md:p-8 space-y-4 backdrop-blur-md">
              <h3 className="text-xl font-bold text-gray-200">Recurring Slope Lineae (RSL)</h3>
              <p className="text-gray-300 leading-relaxed">
                RSL are narrow, dark streaks—often just a few meters wide—that appear on Martian crater walls
                and hillsides during the planet&apos;s warmer months, then fade when temperatures drop. Discovered
                by NASA&apos;s Mars Reconnaissance Orbiter in 2011, they sparked major interest because they seemed
                to indicate liquid water
              </p>
              <p className="text-gray-300 leading-relaxed">
                Early hypotheses suggested they were caused by briny (salty) water seeping from underground,
                since salts can lower water&apos;s freezing point enough to allow it to exist temporarily in Mars&apos;s thin
                atmosphere. However, later studies using high-resolution imaging and spectral data suggested
                RSL might instead be dry granular flows — essentially, sand or dust avalanches triggered by
                sublimating ice or seasonal temperature changes.
              </p>
            </div>
          </div>

          {/* References Column */}
          <div>
            <h2 className="text-3xl font-semibold mb-4">References</h2>
            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 md:p-8 backdrop-blur-md h-full">
              <ul className="space-y-4">
                {['List[0]', 'List[1]', 'List[2]', 'List[3]'].map((item, index) => (
                  <li key={index} className="text-gray-300 text-lg hover:text-white transition-colors duration-200 cursor-pointer">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </main>

        {/* Footer Section */}
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