import React from "react";

interface FavouritesTabProps {
  favourites: { imdbID: string; Title: string; Poster: string }[];
  onRemoveFavourite: (imdbID: string) => void;
}

const FavouritesTab: React.FC<FavouritesTabProps> = ({ favourites, onRemoveFavourite }) => (
  <div className="mb-6 w-full max-w-md bg-white rounded shadow p-4">
    <h2 className="text-lg font-semibold mb-2">Favourites</h2>
    {favourites.length === 0 ? (
      <p className="text-gray-500">No favourites yet.</p>
    ) : (
      <ul className="flex flex-col gap-2">
        {favourites.map((fav) => (
          <li key={fav.imdbID} className="flex items-center gap-2">
            <span>{fav.Title}</span>
            <button
              className="text-yellow-500 text-lg focus:outline-none"
              title="Remove from favourites"
              onClick={() => onRemoveFavourite(fav.imdbID)}
              aria-label="Remove from favourites"
              type="button"
            >
              ★
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default FavouritesTab;