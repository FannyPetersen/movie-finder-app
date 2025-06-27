import React from "react";

interface FavouritesTabProps {
  favourites: { imdbID: string; Title: string; Poster: string }[];
  onRemoveFavourite: (imdbID: string) => void;
  onSelectMovie: (movie: { imdbID: string; Title: string; Poster: string }) => void;
}

const FavouritesTab: React.FC<FavouritesTabProps> = ({
  favourites,
  onRemoveFavourite,
  onSelectMovie,
}) => (
  <div className="mb-6 w-full h-full bg-white rounded shadow p-4">
  <h2 className="text-lg font-semibold mb-4">My Collection</h2>
  {favourites.length === 0 ? (
    <p className="text-gray-500">No movies in your collection yet.</p>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {favourites.map((fav) => (
        <div key={fav.imdbID} className="relative group">
          <img
            src={fav.Poster !== "N/A" ? fav.Poster : "https://via.placeholder.com/240x360?text=No+Image"}
            alt={fav.Title}
            className="w-full h-72 object-cover rounded cursor-pointer transition-transform group-hover:scale-105"
            onClick={() => onSelectMovie(fav)}
          />
          <button
            className="absolute top-2 right-2 text-yellow-500 text-2xl bg-white bg-opacity-80 rounded-full px-2 py-1 shadow hover:text-yellow-600"
            title="Remove from My Collection"
            onClick={() => onRemoveFavourite(fav.imdbID)}
            aria-label="Remove from My Collection"
            type="button"
          >
            ★
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-sm p-2 rounded-b">
            {fav.Title}
          </div>
        </div>
      ))}
    </div>
  )}
</div>
);

export default FavouritesTab;