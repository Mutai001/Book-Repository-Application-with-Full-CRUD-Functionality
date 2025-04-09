import React from 'react';
import { Book } from '../types';
import { Edit, Trash2, BookOpen } from 'lucide-react';

interface BookListProps {
  books: Book[];
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: number) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onEditBook, onDeleteBook }) => {
  if (books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-1">No books found</h3>
        <p className="text-gray-500">
          There are no books matching your criteria. Try adding a new book or adjusting your search.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white shadow-md rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{book.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{book.author}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{book.year}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEditBook(book)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3 inline-flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
                        onDeleteBook(book.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900 inline-flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookList;