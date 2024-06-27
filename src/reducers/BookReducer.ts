import { Book } from '../types';

type Action =
  | { type: 'ADD_BOOK'; book: Book }
  | { type: 'UPDATE_BOOK'; book: Book }
  | { type: 'DELETE_BOOK'; id: number }
  | { type: 'SET_BOOKS'; books: Book[] };

const bookReducer = (state: Book[], action: Action): Book[] => {
  switch (action.type) {
    case 'ADD_BOOK':
      return [...state, action.book];
    case 'UPDATE_BOOK':
      return state.map((book) => (book.id === action.book.id ? action.book : book));
    case 'DELETE_BOOK':
      return state.filter((book) => book.id !== action.id);
    case 'SET_BOOKS':
      return action.books;
    default:
      return state;
  }
};

export default bookReducer;
