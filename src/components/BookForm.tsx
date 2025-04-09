import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { PlusCircle, Save } from 'lucide-react';

interface BookFormProps {
  onAddBook: (book: Omit<Book, 'id'>) => void;
  onEditBook: (book: Book) => void;
  editingBook: Book | null;
}

const BookForm: React.FC<BookFormProps> = ({ onAddBook, onEditBook, editingBook }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [errors, setErrors] = useState<{title?: string; author?: string; year?: string}>({});

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setAuthor(editingBook.author);
      setYear(editingBook.year.toString());
      setErrors({});
    } else {
      setTitle('');
      setAuthor('');
      setYear('');
      setErrors({});
    }
  }, [editingBook]);

  const validateForm = () => {
    const newErrors: {title?: string; author?: string; year?: string} = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!author.trim()) newErrors.author = 'Author is required';
    
    if (!year.trim()) {
      newErrors.year = 'Year is required';
    } else if (isNaN(parseInt(year)) || parseInt(year) < 0) {
      newErrors.year = 'Please enter a valid year';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (editingBook) {
      onEditBook({ id: editingBook.id, title, author, year: parseInt(year) });
    } else {
      onAddBook({ title, author, year: parseInt(year) });
    }
    
    // Only clear form if we're not editing
    if (!editingBook) {
      setTitle('');
      setAuthor('');
      setYear('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {editingBook ? 'Edit Book' : 'Add New Book'}
      </h2>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
            Book Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="author">
            Author
          </label>
          <input
            id="author"
            type="text"
            placeholder="Enter author name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.author ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.author && <p className="mt-1 text-sm text-red-500">{errors.author}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="year">
            Publication Year
          </label>
          <input
            id="year"
            type="text"
            placeholder="Enter publication year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.year ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year}</p>}
        </div>
        
        <button
          type="submit"
          className={`w-full flex items-center justify-center py-2 px-4 rounded-md text-white font-medium transition-colors ${
            editingBook 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {editingBook ? (
            <>
              <Save className="mr-2 h-5 w-5" />
              Update Book
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Book
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookForm;