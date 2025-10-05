"use client";

import React, { useState } from 'react';

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
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [topic, setTopic] = useState<string>("");

  const doSearch = async (q: string) => {
    if (!q || q.trim() === "") return;
    setLoading(true);
    setAnswer(null);
    setSources([]);
    setTopic(q);

    try {
      const res = await fetch("https://clearerthanmoist-exploremarsapi.hf.space/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, k: 3 }),
      });

      if (!res.ok) throw new Error(`Search API failed with status ${res.status}`);

      const data = await res.json();
      // API expected to return { answer: string, sources: string[] }
      setAnswer(data.answer ?? "No answer returned.");
      setSources(Array.isArray(data.sources) ? data.sources : []);
    } catch (err) {
      console.error("Search failed:", err);
      setAnswer("Search failed. Please try again.");
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); doSearch(query); } }}
              className="w-full bg-white/10 text-white placeholder-gray-400 rounded-full py-4 pl-12 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

  {/* Main Content Section */}
  <main className="grid grid-cols-1 lg:grid-cols-3 gap-12 min-h-0">
          
          {/* Summary Column */}
          <div className="lg:col-span-2 flex flex-col h-full min-h-0">
            <h2 className="text-3xl font-semibold mb-4">Summary</h2>
            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 md:p-8 space-y-4 backdrop-blur-md flex-1 min-h-0 overflow-auto">
              <h3 className="text-xl font-bold text-gray-200">{topic}</h3>
              <div className="text-gray-300 leading-relaxed">
                {loading ? (
                  <p>Searching...</p>
                ) : (
                  <p>{answer ?? 'No results yet. Type a query and press Enter.'}</p>
                )}
              </div>
            </div>
          </div>

          {/* References Column */}
          <div className="flex flex-col h-full min-h-0">
            <h2 className="text-3xl font-semibold mb-4">References</h2>
            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 md:p-8 backdrop-blur-md h-full flex-1 min-h-0 overflow-auto">
              <ul className="space-y-4">
                {sources.length > 0 ? (
                  sources.map((s, i) => {
                    let content: React.ReactNode;
                    if (typeof s === 'string') {
                      content = s;
                    } else if (s && typeof s === 'object') {
                      // Common shapes: { pdf: 'url', page: 3 } or { url: '', title: '' }
                      const url = s.pdf ?? s.url ?? s.link;
                      if (url && typeof url === 'string') {
                        const label = s.title ?? url;
                        content = (
                          <a href={url} target="_blank" rel="noreferrer" className="underline">
                            {label}
                          </a>
                        );
                      } else {
                        // Fallback: render a readable JSON blob
                        content = (
                          <pre className="whitespace-pre-wrap break-words text-sm text-gray-300">{JSON.stringify(s)}</pre>
                        );
                      }
                    } else {
                      content = String(s);
                    }

                    return (
                      <li key={i} className="text-gray-300 text-lg hover:text-white transition-colors duration-200 cursor-pointer">
                        {content}
                      </li>
                    );
                  })
                ) : (
                  <li className="text-gray-400">No sources yet. Search to populate sources.</li>
                )}
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