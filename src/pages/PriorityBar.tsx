import { useEffect, useState } from "react";
import { getVisitorId } from "../utils/helper";

export const TaskByPriority: React.FC = () => {
  const [priorityNote, setPriorityNote] = useState({
    high: 0,
    medium: 0,
    low: 0
  });
  const visitorIdPromise = getVisitorId(); // Get visitor ID once and reuse

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const [highRes, mediumRes, lowRes] = await Promise.all([
          fetch("http://localhost:8000/note/priority?priority=high", { method: "POST" , headers: {
            "Content-Type": "application/json",
            "visitor-id": await visitorIdPromise
          },}).then(res => res.json()),
          fetch("http://localhost:8000/note/priority?priority=medium", { method: "POST" , headers: {
            "Content-Type": "application/json",
            "visitor-id": await visitorIdPromise
          },}).then(res => res.json()),
          fetch("http://localhost:8000/note/priority?priority=low", { method: "POST" , headers: {
            "Content-Type": "application/json",
            "visitor-id": await visitorIdPromise
          },}).then(res => res.json())
        ]);

        setPriorityNote({
          high: Array.isArray(highRes) ? highRes.length : 0,
          medium: Array.isArray(mediumRes) ? mediumRes.length : 0,
          low: Array.isArray(lowRes) ? lowRes.length : 0
        });
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <h3 className="text-sm md:text-lg font-semibold text-gray-700 mb-4 flex items-center">
        <span className="w-2 h-5 bg-blue-500 rounded-full mr-2"></span>
        Priority Overview
      </h3>

      {/* Responsive Grid Layout:
          - Default (Mobile): 1 column (vertical stack)
          - sm Screens: 3 columns (horizontal row)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        {/* High Priority Card */}
        <div className="flex sm:flex-col items-center justify-between sm:justify-center p-3 bg-red-50/50 hover:bg-red-50 rounded-xl border border-red-100 transition-all cursor-pointer">
          <div className="flex items-center sm:mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-3 sm:mr-0 sm:mb-1"></div>
            <span className="text-xs font-bold text-red-700 uppercase tracking-tight sm:block hidden lg:hidden xl:block">High</span>
            <span className="text-xs font-bold text-red-700 uppercase tracking-tight hidden sm:block xl:hidden">H</span>
            <span className="text-sm font-medium text-gray-700 sm:hidden">High Priority</span>
          </div>
          <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {priorityNote.high}
          </span>
        </div>

        {/* Medium Priority Card */}
        <div className="flex sm:flex-col items-center justify-between sm:justify-center p-3 bg-yellow-50/50 hover:bg-yellow-50 rounded-xl border border-yellow-100 transition-all cursor-pointer">
          <div className="flex items-center sm:mb-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 sm:mr-0 sm:mb-1"></div>
            <span className="text-xs font-bold text-yellow-700 uppercase tracking-tight sm:block hidden lg:hidden xl:block">Med</span>
            <span className="text-xs font-bold text-yellow-700 uppercase tracking-tight hidden sm:block xl:hidden">M</span>
            <span className="text-sm font-medium text-gray-700 sm:hidden">Medium Priority</span>
          </div>
          <span className="bg-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {priorityNote.medium}
          </span>
        </div>

        {/* Low Priority Card */}
        <div className="flex sm:flex-col items-center justify-between sm:justify-center p-3 bg-green-50/50 hover:bg-green-50 rounded-xl border border-green-100 transition-all cursor-pointer">
          <div className="flex items-center sm:mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3 sm:mr-0 sm:mb-1"></div>
            <span className="text-xs font-bold text-green-700 uppercase tracking-tight sm:block hidden lg:hidden xl:block">Low</span>
            <span className="text-xs font-bold text-green-700 uppercase tracking-tight hidden sm:block xl:hidden">L</span>
            <span className="text-sm font-medium text-gray-700 sm:hidden">Low Priority</span>
          </div>
          <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {priorityNote.low}
          </span>
        </div>

      </div>
    </div>
  );
};