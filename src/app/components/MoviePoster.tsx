import React from "react";

interface MoviePosterProps {
  src: string;
  alt: string;
  className?: string;
}

const MoviePoster: React.FC<MoviePosterProps> = ({ src, alt, className = "" }) => (
  <img
    src={src !== "N/A" ? src : "https://via.placeholder.com/400x600?text=No+Image"}
    alt={alt}
    className={`w-72 h-[28rem] object-cover mb-4 rounded ${className}`}
  />
);

export default MoviePoster;