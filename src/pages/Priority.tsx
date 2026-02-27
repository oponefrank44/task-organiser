import { useState } from "react";
import { Task } from "./Task";
import type { RootState } from "../store/Store";
import { useSelector } from "react-redux";
import { useNotes } from "../utils/AsyncFunctions";
import { FilterTask } from "./FilterTask";
import { TaskByPriority } from "./PriorityBar";
import type { Note } from "../interface/note";

export default function Priority() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { useFetchAllNotes, useFetchNoteById } = useNotes();
  const { isLoading: isFetchingAll, error, data } = useFetchAllNotes();

  useFetchNoteById(selectedId || "");
  const { notes, loading: reduxLoading } = useSelector((state: RootState) => state.note);

  const isLoading = isFetchingAll || reduxLoading;

  const bgColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handlePreview = (id: string) => {
    setSelectedId(id);
  };

  /* Responsive Loading & Error States */
  if (isLoading || error) {
    return (
      <div className="w-full md:w-80 lg:w-96 flex-none bg-gray-50 border-r border-gray-200 flex flex-col min-h-screen items-center justify-center p-6">
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </>
        ) : (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg w-full">
            Error: {error?.message}
          </div>
        )}
      </div>
    );
  }

  return (
    /* 1. Changed w-64 to w-full on mobile and md:w-80 on desktop.
       2. Changed h-screen to min-h-screen so it stretches but doesn't cut off on small phones.
    */
    <div className="w-full md:w-80 lg:w-96 flex-none bg-gray-50 border-r border-gray-200 flex flex-col min-h-screen shadow-sm">

      {/* Sidebar Header */}
      <div className="p-5 border-b border-gray-200 bg-white">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Task Manager</h2>
        <p className="text-gray-500 text-xs md:text-sm mt-1">
          Organize your day efficiently
        </p>
      </div>

      {/* Filter Section - This will now stack correctly inside this container */}
      <FilterTask />

      {/* Priorities Bar Section */}
      <div className="px-2">
        <TaskByPriority />
      </div>

      {/* Tasks Section */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-base md:text-lg font-semibold text-gray-700 flex items-center">
            <span className="w-2 h-5 bg-purple-500 rounded-full mr-2"></span>
            Recent Tasks
          </h3>
          <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
            {notes?.length || 0}
          </span>
        </div>

       {/* Task List Scroll Area */}
<div className="flex-1 flex flex-col min-h-0 bg-gray-50/30">
  <div
    className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 custom-scrollbar"
    /* This calculation ensures it fills the screen height minus the header/search space */
    style={{ maxHeight: 'calc(100vh - 120px)' }}
  >
    {!notes || notes.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm">
        <div className="p-3 bg-gray-50 rounded-full mb-3">
          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-500 font-semibold text-sm">No tasks available</p>
        <p className="text-gray-400 text-xs mt-1">Add a new task to get started</p>
      </div>
    ) : (
      (data?.notes || notes).map((task: Note) => (
        <button
          key={task._id}
          onClick={() => handlePreview(task._id || "")}
          className={`w-full text-left transition-all duration-200 transform hover:translate-x-1 active:scale-[0.98] md:active:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-2xl bg-white shadow-sm border ${
            selectedId === task._id
              ? 'border-blue-500 ring-1 ring-blue-50 shadow-md'
              : 'border-gray-100 hover:border-blue-200'
          }`}
        >
          <div className="p-1">
            <Task
              title={task.title}
              description={task.description}
              priority={task.priority}
              status={task.progress}
              bgColor={bgColor(task.priority)}
              dueDate={task.dueDate || ""}
            />
          </div>
        </button>
      ))
    )}

    {/* Extra bottom padding for mobile browsers/home indicators */}
    <div className="h-20 md:h-10" />
  </div>
</div>
      </div>
    </div>
  );
}