import React from "react";
import MoviePoster from "./MoviePoster";
import MovieDetails from "./MovieDetails";

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
  toggleFavourite: (movie: {
    imdbID: string;
    Title: string;
    Poster: string;
  }) => void;
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
      <div className="bg-white rounded shadow-lg p-8 flex flex-row items-start relative w-full max-w-4xl overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex-shrink-0 flex flex-col items-center justify-start w-72 mr-8">
          <div className="flex-shrink-0 flex flex-col items-center justify-start w-72 mr-8">
            <MoviePoster src={movie.Poster} alt={movie.Title} />
          </div>
        </div>
        <MovieDetails
          movie={movie}
          isFavourite={isFavourite}
          toggleFavourite={toggleFavourite}
        />
      </div>
    </div>
  );
};

export default MovieModal;
