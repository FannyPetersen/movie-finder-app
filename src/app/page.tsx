"use client";

import { useState, useEffect, useRef } from "react";
import SearchInput from "./components/SearchInput";
import DropdownList from "./components/DropdownList";
import MovieModal from "./components/MovieModal";
import FavouritesTab from "./components/FavouritesTab";

export default function Home() {
  const [movie, setMovie] = useState("");
  const [results, setResults] = useState<
    { Title: string; imdbID: string; Poster: string }[]
  >([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<{
    imdbID: string;
    Title: string;
    Poster: string;
    Year: string;
    Genre: string;
    imdbRating: string;
    Plot: string;
  } | null>(null);
  const [favourites, setFavourites] = useState<
    { imdbID: string; Title: string; Poster: string }[]
  >(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("favourites");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [showFavouritesTab, setShowFavouritesTab] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!movie) {
        setResults([]);
        setShowDropdown(false);
        return;
      }
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(
          movie
        )}`
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

  const toggleFavourite = (movieObj: {
    imdbID: string;
    Title: string;
    Poster: string;
  }) => {
    setFavourites((prev) =>
      prev.some((fav) => fav.imdbID === movieObj.imdbID)
        ? prev.filter((fav) => fav.imdbID !== movieObj.imdbID)
        : [
            ...prev,
            {
              imdbID: movieObj.imdbID,
              Title: movieObj.Title,
              Poster: movieObj.Poster,
            },
          ]
    );
  };

  const isFavourite = (imdbID: string) =>
    favourites.some((fav) => fav.imdbID === imdbID);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "'Pacifico', cursive" }}
      >
        Movie Finder 🍿
      </h1>

      <button
        className="mb-4 px-4 py-2 bg-yellow-400 text-white rounded shadow hover:bg-yellow-500 transition"
        onClick={() => setShowFavouritesTab((prev) => !prev)}
      >
        {showFavouritesTab ? "Hide Favourites" : "Show Favourites"}
      </button>

      {showFavouritesTab && (
        <FavouritesTab
          favourites={favourites}
          onRemoveFavourite={(imdbID) =>
            setFavourites((prev) => prev.filter((fav) => fav.imdbID !== imdbID))
          }
        />
      )}

      <form
        className="flex flex-col gap-4 bg-white p-8 rounded shadow-md relative"
        onSubmit={(e) => e.preventDefault()}
        autoComplete="off"
      >
        <SearchInput
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          inputRef={inputRef}
        />
        {showDropdown && results.length > 0 && (
          <DropdownList
            results={results}
            favourites={favourites}
            isFavourite={isFavourite}
            handleSelectMovie={handleSelectMovie}
            showDropdown={showDropdown}
          />
        )}
      </form>
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          isFavourite={isFavourite}
          toggleFavourite={toggleFavourite}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
