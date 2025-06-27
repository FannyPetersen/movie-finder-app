import React from "react";

interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
}

interface SuggestionsProps {
  suggestions: Movie[];
  isFavourite: (imdbID: string) => boolean;
  handleSelectMovie: (movie: Movie) => void;
}

const Suggestions: React.FC<SuggestionsProps> = ({
  suggestions,
  isFavourite,
  handleSelectMovie,
}) => (
  <div className="w-full max-w-4xl">
    <h2 className="text-xl font-semibold mb-4">Latest Movie Suggestions</h2>
    {suggestions.length === 0 ? (
      <p className="text-gray-500">No suggestions available.</p>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {suggestions.map((movie) => (
          <div
            key={movie.imdbID}
            className="relative group cursor-pointer"
            onClick={() => handleSelectMovie(movie)}
          >
            <img
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/240x360?text=No+Image"
              }
              alt={movie.Title}
              className="w-full h-72 object-cover rounded transition-transform group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-sm p-2 rounded-b">
              {movie.Title}{" "}
              {movie.Year && `(${movie.Year.match(/\d{4}/)?.[0] ?? ""})`}
            </div>
            {isFavourite(movie.imdbID) && (
              <span className="absolute top-2 right-2 flex items-center justify-center w-9 h-9 bg-white bg-opacity-80 rounded-full shadow">
                <span className="text-yellow-500 text-2xl">★</span>
              </span>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default Suggestions;