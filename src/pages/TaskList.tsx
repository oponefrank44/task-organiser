import type { Note } from '../interface/note';
import { useNotes } from '../utils/AsyncFunctions';
import { useState } from 'react';

interface TaskListProps {
  tasks: Note[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { useFetchNoteById } = useNotes();

  useFetchNoteById(selectedId || "");

  const handlePreview = (id: string) => {
    setSelectedId(id);
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    /* 1. Changed max-w-2xl to a responsive scale: full width on mobile,
          constrained on larger screens.
       2. Changed h-full to h-[calc(100vh-2rem)] to fit modern viewports nicely.
    */
    <div className="flex flex-col w-full max-w-full lg:max-w-4xl xl:max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">

      {/* Scrollable List Container */}
      <div
        className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 custom-scrollbar"
        style={{ height: 'auto', maxHeight: 'calc(100vh - 100px)' }}
      >
        {tasks?.length > 0 ? (
          /* Using a grid here allows us to switch from 1 column to 2 columns
             if the list is on a very wide screen */
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
            {tasks.map((task) => (
              <button
                key={task._id}
                onClick={() => handlePreview(task._id || "")}
                className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all active:scale-[0.98] md:active:scale-[1.0]"
              >
                <div className={`p-4 rounded-xl border-2 transition-all bg-white group ${
                  selectedId === task._id
                  ? 'border-blue-500 shadow-md ring-1 ring-blue-50'
                  : 'border-gray-50 hover:border-blue-200'
                }`}>
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1 text-base sm:text-lg">
                      {task.title}
                    </h3>
                    <span className={`shrink-0 text-[10px] uppercase font-bold px-2 py-1 rounded-md border ${getPriorityStyles(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                        task.progress === 'completed' ? 'bg-green-500' : 'bg-blue-400'
                      }`}></span>
                      <span className="capitalize font-medium text-gray-600">
                        {task.progress.replace('-', ' ')}
                      </span>
                    </div>

                    {task.dueDate && (
                      <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                        <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">
                          {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4 text-gray-300">
               <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <p className="text-gray-500 font-medium">No tasks found matching your search.</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;