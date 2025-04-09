import React from 'react';
import { Library } from 'lucide-react';

const Header: React.FC = () => (
  <header className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg mb-6">
    <div className="px-6 py-4 flex items-center justify-center">
      <Library className="h-8 w-8 text-white mr-3" />
      <h1 className="text-2xl font-bold text-white">Book Repository</h1>
    </div>
    <div className="bg-blue-800 bg-opacity-30 px-6 py-2 text-center">
      <p className="text-blue-100 text-sm">Manage your collection of books with ease</p>
    </div>
  </header>
);

export default Header;