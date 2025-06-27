import React from "react";

interface MovieModalProps {
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
  toggleFavourite: (movie: { imdbID: string; Title: string; Poster: string }) => void;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({
  movie,
  isFavourite,
  toggleFavourite,
  onClose,
}) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/65 z-50">
      <div className="bg-white rounded shadow-lg p-6 flex flex-col items-center relative max-w-xs">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/120x180?text=No+Image"}
          alt={movie.Title}
          className="w-32 h-48 object-cover mb-4 rounded"
        />
        <h2 className="text-xl font-bold mb-2">{movie.Title}</h2>
        <button
          className={`mb-2 text-2xl ${isFavourite(movie.imdbID) ? "text-yellow-500" : "text-gray-300"}`}
          onClick={() =>
            toggleFavourite({
              imdbID: movie.imdbID,
              Title: movie.Title,
              Poster: movie.Poster,
            })
          }
          aria-label={isFavourite(movie.imdbID) ? "Remove from favourites" : "Add to favourites"}
        >
          ★
        </button>
        <p className="mb-1 text-gray-700"><strong>Rating:</strong> {movie.imdbRating}</p>
        <p className="mb-1 text-gray-700"><strong>Genre:</strong> {movie.Genre}</p>
        <p className="mb-1 text-gray-700">
          <strong>Year:</strong>{" "}
          {movie.Year
            ? (() => {
                const match = movie.Year?.match(/\d{4}/);
                return match ? match[0] : movie.Year;
              })()
            : ""}
        </p>
        <p className="mb-2 text-gray-700">
          <strong>Description:</strong>{" "}
          {movie.Plot && movie.Plot !== "N/A"
            ? movie.Plot
            : "This movie remains a mystery — no description found."}
        </p>
      </div>
    </div>
  );
};

export default MovieModal;
