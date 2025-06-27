import React, { RefObject } from "react";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  inputRef?: RefObject<HTMLInputElement | null>;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onFocus,
  inputRef,
}) => (
  <div className="flex flex-col gap-2">
    <label htmlFor="movie" className="text-lg font-medium">
      Enter a movie name:
    </label>
    <input
      id="movie"
      name="movie"
      type="text"
      placeholder="Movie name"
      value={value}
      ref={inputRef}
      onFocus={onFocus}
      onChange={onChange}
      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      autoComplete="off"
    />
  </div>
);

export default SearchInput;