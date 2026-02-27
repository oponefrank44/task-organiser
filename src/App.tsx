import Priority from "./pages/Priority";
import { AddTask } from "./pages/AddTask";
import { TaskPreview } from "./pages/TaskPreview";// adjust path based on your store location




import React, { useState } from "react";

export const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* MOBILE HEADER: Only shows on small screens */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-50">
        <h1 className="font-bold text-blue-600"> Task Manager</h1>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Toggle Add Task"
        >
          {/* Hamburger Icon */}
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] lg:min-h-screen">

        {/* LEFT COLUMN: Priority & Preview
            On Mobile: Stacked vertically
            On Desktop: Fixed sidebar width
        */}
        <aside className="w-full lg:w-80 xl:w-96 flex-none border-r border-gray-200 bg-white flex flex-col">
          <div className="p-2 lg:p-0">
            <Priority />
          </div>

        </aside>

        {/* CENTER/MAIN AREA: AddTask
            On Mobile: Hidden in a slide-over/hamburger drawer
            On Desktop: Main center content
        */}

        {/* Mobile Drawer Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* AddTask Container */}
        <main className={`
          flex-1 p-4 lg:p-8 transition-transform duration-300 ease-in-out
          fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-50 lg:static lg:z-0 lg:w-auto lg:bg-transparent
          ${isMenuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}>
          <div className="lg:hidden flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">New Task</h2>
            <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 text-2xl">&times;</button>
          </div>

          <div className="max-w-3xl mx-auto">
            <AddTask />
          </div>
        </main>
         <div className="border-t border-gray-100 p-2 lg:p-0">
            {/* Requirement met: Preview shows below Priority on mobile */}
            <TaskPreview />
          </div>

      </div>
    </div>
  );
};

export default App;