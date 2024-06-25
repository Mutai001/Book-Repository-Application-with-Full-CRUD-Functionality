import React, { useReducer, useCallback, useEffect, useState } from 'react';
import BookForm from './components/BookForms';
import BookList from './components/BookList';
import Pagination from './components/Pigination ';
import { useLocalStorage } from './hooks/UseLocalStorage';
import bookReducer from './reducers/BookReducer';
import { Book } from './types';
import './styles/App.scss';

const App: React.FC = () => {
  const [books, dispatch] = useReducer(bookReducer, []);
  const [storedBooks, setStoredBooks] = useLocalStorage('books', []);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const booksPerPage = 5;
  const totalPages = Math.ceil(books.length / booksPerPage);

  useEffect(() => {
    if (storedBooks.length > 0) {
      dispatch({ type: 'INITIAL_LOAD', books: storedBooks });
    }
  }, [storedBooks]);

  useEffect(() => {
    setStoredBooks(books);
  }, [books, setStoredBooks]);

  const addBook = (book: { title: string; author: string; year: number }) => {
    const newBook = { ...book, id: Date.now() };
    dispatch({ type: 'ADD_BOOK', book: newBook });
  };

  const editBook = (updatedBook: Book) => {
    dispatch({ type: 'UPDATE_BOOK', book: updatedBook });
  };

  const deleteBook = (id: number) => {
    dispatch({ type: 'DELETE_BOOK', id });
  };

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="app">
      <div className="container">
        <h1>Book Repository</h1>
        <BookForm onAddBook={addBook} />
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <BookList books={paginatedBooks} onEditBook={editBook} onDeleteBook={deleteBook} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default App;
