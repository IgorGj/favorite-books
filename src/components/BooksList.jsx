import React, {useEffect, useState} from "react";
import Papa from "papaparse";
import Book from "./Book";

export default function BooksList({filter, sort}) {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCSVAndJSON();
  }, []);

  useEffect(() => {
    handleSortChange();
  }, [sort]);

  useEffect(() => {
    if (filter) {
      const lowercasedFilter = filter.toLowerCase();
      const filteredData = books.filter((book) => {
        return Object.keys(book).some((key) =>
          String(book[key]).toLowerCase().includes(lowercasedFilter)
        );
      });
      setFilteredBooks(filteredData);
    } else {
      setFilteredBooks(books);
    }
  }, [filter, books]);

  useEffect(() => {
    console.log(filteredBooks);
  }, [filteredBooks]);

  const fetchCSVAndJSON = async () => {
    try {
      const [csvResponse, jsonResponse] = await Promise.all([
        fetch("/books.csv"),
        fetch("/books.json"),
      ]);

      const csvText = await csvResponse.text();
      const jsonData = await jsonResponse.json();

      const parsedCSVData = await new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          complete: (results) => resolve(results.data),
          header: true,
          error: (error) => reject(error),
        });
      });

      const combinedData = [...parsedCSVData, ...jsonData];
      const uniqueBooks = filterUniqueBooks(combinedData);

      setBooks(uniqueBooks);
      setFilteredBooks(uniqueBooks); // Initialize filteredBooks with all books
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
    }
  };

  const filterUniqueBooks = (data) => {
    const bookSet = new Set();
    const uniqueBooks = [];

    data.forEach((book) => {
      if (Object.keys(book).length !== 0 && book.id !== "") {
        const normalizedBook = {
          ...book,
          id: String(book.id),
        };

        const bookKey = JSON.stringify(normalizedBook);
        if (!bookSet.has(bookKey)) {
          bookSet.add(bookKey);
          uniqueBooks.push(normalizedBook);
        }
      }
    });

    return uniqueBooks;
  };

  const highlightText = (text, highlight) => {
    if (!highlight) {
      return text;
    } else {
      const regex = new RegExp(`(${highlight})`, "gi");
      console.log(text);
      return text.split(regex).map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} style={{fontWeight: "bold", color: "red"}}>
            {part}
          </span>
        ) : (
          part
        )
      );
    }
  };
  const handleSortChange = () => {
    setFilteredBooks(sortBooks([...filteredBooks], sort));
  };
  const sortBooks = (booksArray, option = sort) => {
    switch (option) {
      case "title":
        return booksArray.sort((a, b) => a.title.localeCompare(b.title));
      case "author":
        return booksArray.sort((a, b) => a.author.localeCompare(b.author));
      case "genre":
        return booksArray.sort((a, b) => a.genre.localeCompare(b.genre));
      default:
        return booksArray;
    }
  };

  return (
    <div className="books">
      <div className="books__container">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <Book
              key={book.title + book.id}
              title={highlightText(book.title, filter)}
              author={highlightText(book.author, filter)}
              genre={highlightText(book.genre, filter)}
            />
          ))
        ) : (
          <p className="error__state">No results Found</p>
        )}
      </div>
    </div>
  );
}
