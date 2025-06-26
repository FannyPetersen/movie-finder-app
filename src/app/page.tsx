"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [movie, setMovie] = useState("");
  const [results, setResults] = useState<{ Title: string; imdbID: string; Poster: string }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<{ Title: string; Poster: string, Year: string, Genre: string, imdbRating: string, Plot: string } | null>(null);
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

   // Fetch full movie details when imdbID is set
  const handleSelectMovie = async (movieObj: { imdbID: string }) => {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${apiKey}&i=${movieObj.imdbID}&plot=short`
    );
    const data = await res.json();
    setSelectedMovie(data);
    setShowDropdown(false);
  };

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
                className="flex items-center px-4 py-2 hover:bg-blue-100 cursor-pointer"
                onMouseDown={() => handleSelectMovie(m)}
              >
                <img
                  src={m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/40x60?text=No+Image"}
                  alt={m.Title}
                  className="w-10 h-16 object-cover mr-3 rounded"
                />
                {m.Title}
              </li>
            ))}
          </ul>
        )}
      </form>
      {/* Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/65 z-50">
          <div className="bg-white rounded shadow-lg p-6 flex flex-col items-center relative max-w-xs">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setSelectedMovie(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src={selectedMovie.Poster !== "N/A" ? selectedMovie.Poster : "https://via.placeholder.com/120x180?text=No+Image"}
              alt={selectedMovie.Title}
              className="w-32 h-48 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-bold mb-2">{selectedMovie.Title}</h2>
            <p className="mb-1 text-gray-700"><strong>Rating:</strong> {selectedMovie.imdbRating}</p>
            <p className="mb-1 text-gray-700"><strong>Genre:</strong> {selectedMovie.Genre}</p>
            <p className="mb-1 text-gray-700">
  <strong>Year:</strong>{" "}
  {selectedMovie.Year
    ? (() => {
        const match = selectedMovie.Year.match(/\d{4}/);
        return match ? match[0] : selectedMovie.Year;
      })()
    : ""}
</p>
            <p className="mb-2 text-gray-700"><strong>Description:</strong>{" "}
  {selectedMovie.Plot && selectedMovie.Plot !== "N/A"
    ? selectedMovie.Plot
    : "This movie remains a mystery — no description found."}</p>
          </div>
        </div>
      )}
    </div>
  );

}