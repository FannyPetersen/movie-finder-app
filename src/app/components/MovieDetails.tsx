import React from "react";

interface MovieDetailsProps {
  movie: {
    imdbID: string;
    Title: string;
    Poster: string;
    Year?: string;
    Genre?: string;
    imdbRating?: string;
    Plot?: string;
  };
  isFavourite: (imdbID: string) => boolean;
  toggleFavourite: (movie: {
    imdbID: string;
    Title: string;
    Poster: string;
  }) => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({
  movie,
  isFavourite,
  toggleFavourite,
}) => (
  <div className="flex-1 flex flex-col">
    <h2 className="text-2xl font-bold mb-2">{movie.Title}</h2>
    <button
      className={`mb-4 text-2xl self-start ${
        isFavourite(movie.imdbID) ? "text-yellow-500" : "text-gray-300"
      }`}
      onClick={() =>
        toggleFavourite({
          imdbID: movie.imdbID,
          Title: movie.Title,
          Poster: movie.Poster,
        })
      }
      aria-label={
        isFavourite(movie.imdbID)
          ? "Remove from favourites"
          : "Add to favourites"
      }
    >
      ★
    </button>
    <p className="mb-1 text-gray-700">
      <strong>Rating:</strong> {movie.imdbRating}
    </p>
    <p className="mb-1 text-gray-700">
      <strong>Genre:</strong> {movie.Genre}
    </p>
    <p className="mb-1 text-gray-700">
      <strong>Year:</strong>{" "}
      {movie.Year
        ? (() => {
            const match = movie.Year?.match(/\d{4}/);
            return match ? match[0] : movie.Year;
          })()
        : ""}
    </p>
    <div className="mt-8 w-full">
      <p className="mb-2 text-gray-700">
        <strong>Description:</strong>{" "}
        {movie.Plot && movie.Plot !== "N/A"
          ? movie.Plot
          : "This movie remains a mystery — no description found."}
      </p>
    </div>
  </div>
);

export default MovieDetails;