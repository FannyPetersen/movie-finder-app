"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [movie, setMovie] = useState("");
  const [results, setResults] = useState<{ Title: string; imdbID: string }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!movie) {
        setResults([]);
        setShowDropdown(false);
        return;
      }
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(movie)}`
      );
      const data = await res.json();
      if (data.Search) {
        setResults(data.Search);
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    };

    const timeoutId = setTimeout(fetchMovies, 400); // debounce: 400ms
    return () => clearTimeout(timeoutId);
  }, [movie, apiKey]);

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <form
        className="flex flex-col gap-4 bg-white p-8 rounded shadow-md relative"
        onSubmit={(e) => e.preventDefault()}
        autoComplete="off"
      >
        <label htmlFor="movie" className="text-lg font-medium">
          Enter a movie name:
        </label>
        <input
          id="movie"
          name="movie"
          type="text"
          placeholder="Movie name"
          value={movie}
          ref={inputRef}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          onChange={(e) => setMovie(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="off"
        />
        {showDropdown && results.length > 0 && (
          <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
            {results.map((m) => (
              <li
                key={m.imdbID}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                onMouseDown={() => {
                  setMovie(m.Title);
                  setShowDropdown(false);
                }}
              >
                {m.Title}
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
}