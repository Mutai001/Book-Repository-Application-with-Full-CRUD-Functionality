import React, { useReducer, useState, useEffect } from 'react';
import { Search, BookOpen, SortAsc, SortDesc } from 'lucide-react';
import Header from './components/Header';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import Pagination from './components/Pagination';
import { useLocalStorage } from './hooks/UseLocalStorage';
import bookReducer, { initialBookState, SortOption, SortDirection } from './reducers/BookReducer';
import { Book, BookFilter } from './types/index';

const initialBooks: Book[] = [
  { id: 1, title: 'Kigogo', author: 'Paul Kea', year: 2001 },
  { id: 2, title: 'Damu Nyeusi', author: 'Ken Walibora', year: 2002 },
  { id: 3, title: 'A Dolls House', author: 'Henrick Ibsen', year: 2003 },
  { id: 4, title: 'The Physiology of Money', author: 'Morgan Househel', year: 2004 },
  { id: 5, title: 'Inheritance', author: 'Barack JK', year: 2005 },
];

const App = () => {
  // Initialize with stored data or initial books
  const [storedState, setStoredState] = useLocalStorage('bookRepository', {
    ...initialBookState,
    books: initialBooks,
  });
  
  const [state, dispatch] = useReducer(bookReducer, storedState);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [filter, setFilter] = useState<BookFilter>({ searchTerm: '' });
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  
  // Books per page
  const booksPerPage = 5;
  
  // Apply filters to books
  const filteredBooks = state.books.filter(book => {
    // Check if book title or author matches search term
    const matchesSearch = book.title.toLowerCase().includes(filter.searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(filter.searchTerm.toLowerCase());
    
    // Check year range if specified
    const matchesYearFrom = filter.yearFrom ? book.year >= filter.yearFrom : true;
    const matchesYearTo = filter.yearTo ? book.year <= filter.yearTo : true;
    
    return matchesSearch && matchesYearFrom && matchesYearTo;
  });
  
  // Get current page's books
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  
  // Handler functions
  const addBook = (book: Omit<Book, 'id'>) => {
    const newBook = { ...book, id: Date.now() };
    dispatch({ type: 'ADD_BOOK', book: newBook });
    // Reset to first page when adding a book
    setCurrentPage(1);
  };
  
  const editBook = (book: Book) => {
    dispatch({ type: 'UPDATE_BOOK', book });
    setEditingBook(null);
  };
  
  const deleteBook = (id: number) => {
    dispatch({ type: 'DELETE_BOOK', id });
    
    // If deleting the last book on the current page, go to previous page
    if (currentBooks.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    // Scroll to the top where the form is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleSort = (sortBy: SortOption) => {
    const newDirection: SortDirection = 
      state.sortBy === sortBy && state.sortDirection === 'asc' ? 'desc' : 'asc';
    
    dispatch({ 
      type: 'SET_SORT', 
      sortBy, 
      sortDirection: newDirection 
    });
  };
  
  const toggleFilterExpanded = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFilter((prev: BookFilter) => ({
      ...prev,
      [name]: name === 'yearFrom' || name === 'yearTo' 
        ? value === '' ? undefined : parseInt(value) 
        : value
    }));
    
    // Reset to first page when filter changes
    setCurrentPage(1);
  };
  
  const handleClearFilters = () => {
    setFilter({ searchTerm: '' });
    setCurrentPage(1);
  };
  
  // Sync state with localStorage
  useEffect(() => {
    setStoredState(state);
  }, [state, setStoredState]);
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        <div className="flex flex-col lg:flex-row lg:space-x-6 mb-6">
          <div className="lg:w-1/2 mb-6 lg:mb-0">
            <BookForm 
              onAddBook={addBook} 
              onEditBook={editBook} 
              editingBook={editingBook} 
            />
          </div>
          
          <div className="lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="searchTerm"
                    placeholder="Search books by title or author..."
                    value={filter.searchTerm}
                    onChange={handleFilterChange}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {filter.searchTerm && (
                    <button 
                      onClick={() => setFilter(prev => ({ ...prev, searchTerm: '' }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                    >
                      <span className="text-xl">&times;</span>
                    </button>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={toggleFilterExpanded}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {isFilterExpanded ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
                  </button>
                  
                  {Object.values(filter).some(v => v !== '' && v !== undefined) && (
                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
                
                {isFilterExpanded && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year From
                      </label>
                      <input
                        type="number"
                        name="yearFrom"
                        value={filter.yearFrom || ''}
                        onChange={handleFilterChange}
                        placeholder="Min year"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year To
                      </label>
                      <input
                        type="number"
                        name="yearTo"
                        value={filter.yearTo || ''}
                        onChange={handleFilterChange}
                        placeholder="Max year"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div>
                    Sort by:
                    <button
                      onClick={() => handleSort('title')}
                      className={`ml-2 px-2 py-1 rounded ${
                        state.sortBy === 'title' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      Title
                      {state.sortBy === 'title' && (
                        state.sortDirection === 'asc' 
                          ? <SortAsc className="inline h-3 w-3 ml-1" />
                          : <SortDesc className="inline h-3 w-3 ml-1" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSort('author')}
                      className={`ml-2 px-2 py-1 rounded ${
                        state.sortBy === 'author' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      Author
                      {state.sortBy === 'author' && (
                        state.sortDirection === 'asc' 
                          ? <SortAsc className="inline h-3 w-3 ml-1" />
                          : <SortDesc className="inline h-3 w-3 ml-1" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSort('year')}
                      className={`ml-2 px-2 py-1 rounded ${
                        state.sortBy === 'year' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      Year
                      {state.sortBy === 'year' && (
                        state.sortDirection === 'asc' 
                          ? <SortAsc className="inline h-3 w-3 ml-1" />
                          : <SortDesc className="inline h-3 w-3 ml-1" />
                      )}
                    </button>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">
                      {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {filteredBooks.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-1">No books found</h3>
                <p className="text-gray-500">
                  {filter.searchTerm || filter.yearFrom || filter.yearTo
                    ? "Try adjusting your search filters to find what you're looking for."
                    : "Your book collection is empty. Add your first book using the form."}
                </p>
              </div>
            ) : (
              <>
                <BookList
                  books={currentBooks}
                  onEditBook={handleEditBook}
                  onDeleteBook={deleteBook}
                />
                
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredBooks.length / booksPerPage)}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Book Repository - Manage your books with ease</p>
        </footer>
      </div>
    </div>
  );
};

export default App;