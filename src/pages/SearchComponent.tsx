import React, { useState } from 'react';
import { useNotes } from '../utils/AsyncFunctions';

const SimpleSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { useSearchNotesByContent } = useNotes();
  const searchFunction = useSearchNotesByContent();

  const handleSearch = () => {
    searchFunction.mutateAsync(searchTerm);
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="p-3 sm:p-4 border-b border-gray-100 bg-gray-50/50">
      {/* On very small screens (xs), we stack vertically.
        From small screens (sm) up, we use a flex row.
      */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">

        {/* Input Wrapper */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 sm:py-2 border border-gray-300 rounded-xl sm:rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={searchFunction.isPending}
          className="inline-flex items-center justify-center px-5 py-2.5 sm:py-2 border border-transparent text-sm font-bold sm:font-medium rounded-xl sm:rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
        >
          {searchFunction.isPending ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : (
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
          <span className="inline">{searchFunction.isPending ? 'Searching...' : 'Search'}</span>
        </button>
      </div>
    </div>
  );
};

export default SimpleSearch;