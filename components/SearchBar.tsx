"use client";
import { useState } from "react";

interface SearchResult {
  id: string;
  title: string;
  abstract: string;
}

export default function SearchBar({ onSelect }: { onSelect: (t: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      
      // Check if the response is an error object
      if (data.error) {
        setError(`Search error: ${data.error}`);
        setResults([]);
        return;
      }
      
      // Ensure data is an array before setting it
      if (Array.isArray(data)) {
        setResults(data);
        if (data.length === 0) {
          setError("No results found. Try a different search term.");
        }
      } else {
        setError("Unexpected response format from server");
        setResults([]);
      }
    } catch (error) {
      setError("Search failed. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search NASA bioscience papers..."
        className="w-full border p-2 rounded-lg"
      />
      <button 
        onClick={handleSearch} 
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Searching..." : "Search"}
      </button>
      
      {error && (
        <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
      
      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map((r) => (
            <li
              key={r.id}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded border"
              onClick={() => onSelect(r.abstract)}
            >
              <div className="font-medium">{r.title}</div>
              <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                {r.abstract}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
