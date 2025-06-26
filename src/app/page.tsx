"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [movie, setMovie] = useState("");
  const [results, setResults] = useState<{ Title: string; imdbID: string }[]>([]);
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;

  useEffect(() => {
    const fetchMovies = async () => {
      if (!movie) {
        setResults([]);
        return;
      }
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(movie)}`
      );
      const data = await res.json();
      if (data.Search) {
        setResults(data.Search);
      } else {
        setResults([]);
      }
    };

    const timeoutId = setTimeout(fetchMovies, 400); // debounce: 400ms
    return () => clearTimeout(timeoutId);
  }, [movie, apiKey]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <form
        className="flex flex-col gap-4 bg-white p-8 rounded shadow-md"
        onSubmit={(e) => e.preventDefault()}
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
          onChange={(e) => setMovie(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>
      <ul className="mt-8 w-full max-w-md">
        {results.map((m) => (
          <li key={m.imdbID} className="py-2 border-b border-gray-200">
            {m.Title}
          </li>
        ))}
      </ul>
    </div>
  );
}