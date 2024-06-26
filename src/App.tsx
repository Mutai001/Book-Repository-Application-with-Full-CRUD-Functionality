import React, { useReducer, useState, useEffect } from 'react';
import Header from './components/Header';
import BookList from './components/BookList';
import BookForm from './components/BookForms';
import Pagination from './components/Pigination ';
import { useLocalStorage } from './hooks/UseLocalStorage';
import bookReducer from './reducers/BookReducer';
import { Book } from './types';




const initialBooks: Book[] = [
  { id: 1, title: 'Kigogo', author: 'Paul Kea', year: 2001 },
  { id: 2, title: 'Damu Nyeusi', author: 'Ken Walibora', year: 2002 },
  { id: 3, title: 'A Dolls House', author: 'Henrick Ibsen', year: 2003 },
  { id: 4, title: 'The Physiology of Money', author: 'Morgan Househel', year: 2004 },
  { id: 5, title: 'Inherritannce', author: 'Barack jK', year: 2005 },
];

const App: React.FC = () => {
  const [storedBooks, setStoredBooks] = useLocalStorage('books', initialBooks);
  const [state, dispatch] = useReducer(bookReducer, storedBooks);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const booksPerPage = 2;
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const filteredBooks = state.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const addBook = (book: { title: string; author: string; year: number }) => {
    const newBook = { ...book, id: Date.now() };
    dispatch({ type: 'ADD_BOOK', book: newBook });
  };

  const editBook = (book: Book) => {
    dispatch({ type: 'UPDATE_BOOK', book });
    setEditingBook(null);
  };

  const deleteBook = (id: number) => {
    dispatch({ type: 'DELETE_BOOK', id });
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setStoredBooks(state);
  }, [state, setStoredBooks]);

  return (
    <div className="app">
      <div className="container">
        <Header/>
        <BookForm onAddBook={addBook} onEditBook={editBook} editingBook={editingBook} />
        <input 
          type="text" 
          className="search-input"
          placeholder="Search by title" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <BookList books={currentBooks} onEditBook={handleEditBook} onDeleteBook={deleteBook} />
        <Pagination 
          currentPage={currentPage} 
          totalPages={Math.ceil(filteredBooks.length / booksPerPage)} 
          onPageChange={handlePageChange} 
        />
      </div>
    </div>
  );
};

export default App;
