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
  const [activeMenu, setActiveMenu] = useState<"home" | "favourites">("home");
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

  const handleSelectMovie = async (movieObj: { imdbID: string }) => {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${apiKey}&i=${movieObj.imdbID}&plot=short`
    );
    const data = await res.json();
    setSelectedMovie(data);
    setShowDropdown(false);
  };

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
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar menu */}
      <nav className="w-48 bg-white shadow-lg flex flex-col py-8 px-4">
        <h1
          className="text-2xl font-bold mb-10 text-center"
          style={{ fontFamily: "'Pacifico', cursive" }}
        >
          Movie Finder 🍿
        </h1>
        <button
          className={`mb-4 px-4 py-2 rounded transition text-left ${
            activeMenu === "home"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setActiveMenu("home")}
        >
          Home
        </button>
        <button
          className={`px-4 py-2 rounded transition text-left ${
            activeMenu === "favourites"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setActiveMenu("favourites")}
        >
          Favourite Movies
        </button>
      </nav>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        {activeMenu === "home" && (
          <form
            className="flex flex-col gap-4 bg-white p-8 rounded shadow-md relative w-full max-w-lg"
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
        )}

        {activeMenu === "favourites" && (
          <div className="w-full h-full flex-1 flex items-start justify-center">
            <FavouritesTab
              favourites={favourites}
              onRemoveFavourite={(imdbID) =>
                setFavourites((prev) =>
                  prev.filter((fav) => fav.imdbID !== imdbID)
                )
              }
              onSelectMovie={async (movie) => {
                const res = await fetch(
                  `https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}&plot=short`
                );
                const data = await res.json();
                setSelectedMovie(data);
              }}
            />
          </div>
        )}

        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            isFavourite={isFavourite}
            toggleFavourite={toggleFavourite}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </main>
    </div>
  );
}
