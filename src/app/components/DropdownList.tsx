import React from "react";

interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
}

interface DropdownListProps {
  results: Movie[];
  favourites: { imdbID: string }[];
  isFavourite: (imdbID: string) => boolean;
  handleSelectMovie: (movie: Movie) => void;
  showDropdown: boolean;
}

const DropdownList: React.FC<DropdownListProps> = ({
  results,
  favourites,
  isFavourite,
  handleSelectMovie,
  showDropdown,
}) => {
  if (!showDropdown || results.length === 0) return null;

  return (
    <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
      {/* Show favourites first */}
      {favourites
        .map((fav) => results.find((m) => m.imdbID === fav.imdbID))
        .filter(Boolean)
        .map((m) => (
          <li
            key={m!.imdbID}
            className="flex items-center px-4 py-2 bg-yellow-50 hover:bg-blue-100 cursor-pointer"
            onMouseDown={() => handleSelectMovie(m!)}
          >
            <img
              src={m!.Poster !== "N/A" ? m!.Poster : "https://via.placeholder.com/40x60?text=No+Image"}
              alt={m!.Title}
              className="w-10 h-16 object-cover mr-3 rounded"
            />
            <span className="flex items-center">
              {m!.Title}
              <span className="ml-2 text-yellow-500 text-lg" title="Favourite">
                ★
              </span>
            </span>
          </li>
        ))}
      {/* Then show the rest (non-favourites) */}
      {results
        .filter((m) => !isFavourite(m.imdbID))
        .map((m) => (
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
            <span className="flex items-center">
              {m.Title}
              {isFavourite(m.imdbID) && (
                <span className="ml-2 text-yellow-500 text-lg" title="Favourite">
                  ★
                </span>
              )}
            </span>
          </li>
        ))}
    </ul>
  );
};

export default DropdownList;