import "./App.css";
import Header from "./components/Header";
import BooksList from "./components/BooksList";
import BooksFilter from "./components/BooksFilter";
import {useEffect, useState} from "react";

function App() {
  const [filter, setFilter] = useState();
  const [sort, setSort] = useState("author");
  return (
    <>
      <Header />
      <BooksFilter filter={setFilter} setSort={setSort} />
      <BooksList filter={filter} sort={sort} />
    </>
  );
}

export default App;
