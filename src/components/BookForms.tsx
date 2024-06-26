import React, { useRef, useEffect } from 'react';
import '../styles/components/BookForm.scss';
import { Book } from '../types';

interface BookFormProps {
  onAddBook: (book: { title: string; author: string; year: number }) => void;
  onEditBook: (book: Book) => void;
  editingBook: Book | null;
}

const BookForm: React.FC<BookFormProps> = ({ onAddBook, onEditBook, editingBook }) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingBook) {
      if (titleRef.current) titleRef.current.value = editingBook.title;
      if (authorRef.current) authorRef.current.value = editingBook.author;
      if (yearRef.current) yearRef.current.value = editingBook.year.toString();
    } else {
      if (titleRef.current) titleRef.current.value = '';
      if (authorRef.current) authorRef.current.value = '';
      if (yearRef.current) yearRef.current.value = '';
    }
  }, [editingBook]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const title = titleRef.current?.value || '';
    const author = authorRef.current?.value || '';
    const year = parseInt(yearRef.current?.value || '0');
    if (title && author && year) {
      if (editingBook) {
        onEditBook({ ...editingBook, title, author, year });
      } else {
        onAddBook({ title, author, year });
      }
      if (titleRef.current) titleRef.current.value = '';
      if (authorRef.current) authorRef.current.value = '';
      if (yearRef.current) yearRef.current.value = '';
    }
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <input type="text" ref={titleRef} placeholder="Title" required />
      <input type="text" ref={authorRef} placeholder="Author" required />
      <input type="number" ref={yearRef} placeholder="Publication Year" required />
      <button type="submit">{editingBook ? 'Update Book' : 'Add Book'}</button>
    </form>
  );
};

export default BookForm;
