"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, X, Loader2 } from "lucide-react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  onGeoLocation: () => void;
  isLoading: boolean;
}

const POPULAR_CITIES = [
  "New York", "London", "Tokyo", "Paris", "Sydney",
  "Dubai", "Singapore", "Mumbai", "Berlin", "Toronto",
  "Los Angeles", "Chicago", "Shanghai", "Seoul", "São Paulo",
];

export default function SearchBar({ onSearch, onGeoLocation, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length >= 2) {
      const filtered = POPULAR_CITIES.filter((city) =>
        city.toLowerCase().startsWith(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setSuggestions([]);
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (city: string) => {
    setQuery(city);
    onSearch(city);
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div
          className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${
            isFocused
              ? "bg-white/20 backdrop-blur-xl border border-white/40 shadow-2xl shadow-black/20"
              : "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl shadow-black/10"
          }`}
        >
          <Search className="w-5 h-5 text-white/70 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search for a city..."
            className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-lg font-light"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-white/70 animate-spin flex-shrink-0" />
          ) : (
            <button
              type="button"
              onClick={onGeoLocation}
              title="Use my location"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-white/70 hover:text-white flex-shrink-0"
            >
              <MapPin className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden backdrop-blur-xl bg-slate-900/80 border border-white/10 shadow-2xl z-50">
          {suggestions.map((city, index) => (
            <button
              key={city}
              onClick={() => handleSuggestionClick(city)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-white/10 transition-colors duration-150 ${
                index !== suggestions.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="text-white font-medium">{city}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
