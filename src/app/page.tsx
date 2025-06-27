"use client";

import { useState, useEffect, useRef } from "react";
import SearchInput from "./components/SearchInput";
import DropdownList from "./components/DropdownList";
import MovieModal from "./components/MovieModal";
import FavouritesTab from "./components/FavouritesTab";
import SidebarMenu from "./components/SidebarMenu";
import Suggestions from "./components/Suggestions";

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
  const [suggestions, setSuggestions] = useState<
    { Title: string; imdbID: string; Poster: string; Year: string }[]
  >([]);
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

  // Fetch suggestions (latest/popular movies) on mount
  useEffect(() => {
    // Example IMDb IDs for popular/recent movies
    const suggestionIds = [
      "tt1517268", // Barbie (2023)
      "tt15398776", // Oppenheimer (2023)
      "tt1745564", // John Wick: Chapter 4 (2023)
      "tt9362722", // Spider-Man: Across the Spider-Verse (2023)
      "tt6791350", // Guardians of the Galaxy Vol. 3 (2023)
      "tt10676048", // Wonka (2023)
      "tt9603212", // Sound of Freedom (2023)
      "tt10366206", // The Marvels (2023)
    ];

    const fetchSuggestions = async () => {
      const movies = await Promise.all(
        suggestionIds.map(async (id) => {
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`
          );
          return await res.json();
        })
      );
      setSuggestions(movies.filter((m) => m && m.Response !== "False"));
    };

    fetchSuggestions();
  }, [apiKey]);

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

  const handleSetActiveMenu = (menu: string) => {
    setActiveMenu(menu as "home" | "favourites");
    if (menu === "home") {
      setMovie("");  
      setShowDropdown(false); 
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <SidebarMenu
        activeMenu={activeMenu}
        setActiveMenu={handleSetActiveMenu}
      />

      <main className="flex-1 flex flex-col items-center p-8">
        {activeMenu === "home" && (
          <>
            <form
              className="flex flex-col gap-4 bg-white p-8 rounded shadow-md relative w-full max-w-lg mb-8"
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

            <Suggestions
              suggestions={suggestions}
              isFavourite={isFavourite}
              handleSelectMovie={handleSelectMovie}
            />
          </>
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
