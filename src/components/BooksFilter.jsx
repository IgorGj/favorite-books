import {useState} from "react";

export default function BooksFilter({filter, setSort, sort}) {
  const [query, setQuery] = useState("");
  const hanldeChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    filter(query);
  };
  const handleSortChange = (event) => {
    setSort(event.target.value);
  };
  return (
    <form className="filter" onSubmit={handleSubmit}>
      <div className="filter__options">
        <label htmlFor="sort">Sort Alphabetically by:</label>
        <select
          id="sort"
          className="filter__select"
          value={sort}
          onChange={handleSortChange}>
          <option value="author">Author</option>
          <option value="title">Title</option>
          <option value="genre">Genre</option>
        </select>
      </div>
      <div className="filter__input">
        <input
          type="text"
          className="filter__input--query"
          onChange={hanldeChange}
          placeholder="Search for your favorite book, author or genre"
        />
        <button className="filter__btn">Search</button>
      </div>
    </form>
  );
}
