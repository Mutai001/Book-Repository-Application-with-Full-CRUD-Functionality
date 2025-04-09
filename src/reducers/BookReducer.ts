import { Book } from '../types';

export type SortOption = 'title' | 'author' | 'year';
export type SortDirection = 'asc' | 'desc';

export interface BookState {
  books: Book[];
  sortBy: SortOption;
  sortDirection: SortDirection;
}

type Action =
  | { type: 'ADD_BOOK'; book: Book }
  | { type: 'UPDATE_BOOK'; book: Book }
  | { type: 'DELETE_BOOK'; id: number }
  | { type: 'SET_BOOKS'; books: Book[] }
  | { type: 'SET_SORT'; sortBy: SortOption; sortDirection: SortDirection };

const sortBooks = (books: Book[], sortBy: SortOption, sortDirection: SortDirection): Book[] => {
  return [...books].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === 'author') {
      comparison = a.author.localeCompare(b.author);
    } else if (sortBy === 'year') {
      comparison = a.year - b.year;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
};

export const initialBookState: BookState = {
  books: [],
  sortBy: 'title',
  sortDirection: 'asc'
};

const bookReducer = (state: BookState, action: Action): BookState => {
  switch (action.type) {
    case 'ADD_BOOK':
      // eslint-disable-next-line no-case-declarations
      const newBooks = [...state.books, action.book];
      return {
        ...state,
        books: sortBooks(newBooks, state.sortBy, state.sortDirection)
      };
      
    case 'UPDATE_BOOK':
      // eslint-disable-next-line no-case-declarations
      const updatedBooks = state.books.map((book) => 
        book.id === action.book.id ? action.book : book
      );
      return {
        ...state,
        books: sortBooks(updatedBooks, state.sortBy, state.sortDirection)
      };
      
    case 'DELETE_BOOK':
      return {
        ...state,
        books: state.books.filter((book) => book.id !== action.id)
      };
      
    case 'SET_BOOKS':
      return {
        ...state,
        books: sortBooks(action.books, state.sortBy, state.sortDirection)
      };
      
    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.sortBy,
        sortDirection: action.sortDirection,
        books: sortBooks(state.books, action.sortBy, action.sortDirection)
      };
      
    default:
      return state;
  }
};

export default bookReducer;