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
  <div className="w-full flex items-center justify-end mt-2 mb-6">
    <div className="relative w-full max-w-lg">
      <input
        id="movie"
        name="movie"
        type="text"
        placeholder="Search for a movie"
        value={value}
        ref={inputRef}
        onFocus={onFocus}
        onChange={onChange}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full pr-10"
        autoComplete="off"
      />
      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
        {/* Magnifying glass SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
          <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </span>
    </div>
  </div>
);

export default SearchInput;