"use client";

import { useState } from "react";

export default function Home() {
  const [movie, setMovie] = useState("");

  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movie) return;
    const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(movie)}`);
    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        className="flex flex-col gap-4 bg-white p-8 rounded shadow-md"
        onSubmit={handleSubmit}
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
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>
    </div>
  );
}