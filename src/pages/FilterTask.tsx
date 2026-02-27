import { useState } from "react";
import { useNotes } from "../utils/AsyncFunctions";

export function FilterTask() {
  const { useSearchNotes } = useNotes();
  const searchNote = useSearchNotes();

  const [filter, setFilter] = useState({
    priority: '',
    progress: ''
  });

  const handleSearch = () => {
    searchNote.mutateAsync(filter);
  };

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
         Task Filters
        </h3>

        {/* Main Responsive Wrapper:
          - Default (Mobile): flex-col (vertical stack)
          - lg Screens+: flex-row (horizontal line)
        */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">

          {/* Priority Dropdown */}
          <div className="flex-1 min-w-25">
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">
              Priority
            </label>
            <select
              value={filter.priority}
              onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex-1 min-w-25">
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">
              Status
            </label>
            <select
              value={filter.progress}
              onChange={(e) => setFilter({ ...filter, progress: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="lg:w-auto">
            <button
              onClick={handleSearch}
              disabled={searchNote.isPending}
              className="w-full lg:w-30 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              {searchNote.isPending ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              {searchNote.isPending ? "Searching..." : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}