import React, { useState, useEffect } from 'react';
import { Book } from '../types';

interface BookFormProps {
  onAddBook: (book: Omit<Book, 'id'>) => void;
  onEditBook: (book: Book) => void;
  editingBook: Book | null;
}

const BookForm: React.FC<BookFormProps> = ({ onAddBook, onEditBook, editingBook }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setAuthor(editingBook.author);
      setYear(editingBook.year.toString());
    } else {
      setTitle('');
      setAuthor('');
      setYear('');
    }
  }, [editingBook]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      onEditBook({ id: editingBook.id, title, author, year: parseInt(year) });
    } else {
      onAddBook({ title, author, year: parseInt(year) });
    }
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        type="text"
        placeholder="Publication Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <button type="submit">{editingBook ? 'Update Book' : 'Add Book'}</button>
    </form>
  );
};

export default BookForm;
