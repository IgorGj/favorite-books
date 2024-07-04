import React from "react";
export default function Book({title, author, genre}) {
  return (
    <div className="book__wrapper">
      <div className="book__item">
        <h2 className="book__title">{title}</h2>
        <p className="book__author">{author}</p>
        <p className="book__genre">{genre}</p>
      </div>
    </div>
  );
}
