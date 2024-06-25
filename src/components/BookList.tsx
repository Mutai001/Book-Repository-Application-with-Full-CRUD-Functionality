import React from 'react';
// import './BookList.scss';
import '../styles/components/BookList.scss';

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
}

interface BookListProps {
  books: Book[];
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: number) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onEditBook, onDeleteBook }) => {
  return (
    <table className="book-list">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Year</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book.id}>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.year}</td>
            <td>
              <button onClick={() => onEditBook(book)}>Edit</button>
              <button onClick={() => onDeleteBook(book.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookList;
