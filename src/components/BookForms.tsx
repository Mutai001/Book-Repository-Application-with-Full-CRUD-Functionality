import React, { useRef } from 'react';
import '../styles/components/BookForm.scss';

interface BookFormProps {
  onAddBook: (book: { title: string; author: string; year: number }) => void;
}

const BookForm: React.FC<BookFormProps> = ({ onAddBook }) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const title = titleRef.current?.value || '';
    const author = authorRef.current?.value || '';
    const year = parseInt(yearRef.current?.value || '0');
    if (title && author && year) {
      onAddBook({ title, author, year });
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
      <button type="submit">Add Book</button>
    </form>
  );
};

export default BookForm;
