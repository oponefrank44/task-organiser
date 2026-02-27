import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Note } from "../interface/note";
import { useNotes } from "../utils/AsyncFunctions";
import type { AppDispatch, RootState } from "../store/Store";
import { resetNoteStatus } from "../note/noteSlice";
import { convertDateTime } from "../utils/helper";
import TaskDescription from "../pages/TaskDecription";

const INITIAL_STATE: Note = {
  title: "",
  description: "",
  priority: "low",
  progress: "not-started",
  dueDate: "",
};

export const AddTask: React.FC = () => {
  const { useCreateNote, useUpdateNote } = useNotes();
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const dispatch = useDispatch<AppDispatch>();

  const { previewNote, isEditing } = useSelector((state: RootState) => state.note);

  const [task, setTask] = useState<Note>(INITIAL_STATE);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && previewNote) {
      setTask(previewNote);
    } else {
      setTask(INITIAL_STATE);
    }
  }, [isEditing, previewNote]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDescriptionChange = (value: string) => {
    setTask((prev) => ({ ...prev, description: value }));
    if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!task.title.trim()) newErrors.title = "Task title is required";
    if (!task.dueDate) newErrors.dueDate = "Please select a due date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        if (isEditing) {
          if (!previewNote?._id) return;
          await updateNoteMutation.mutateAsync({ id: previewNote._id, updatedData: task });
          dispatch(resetNoteStatus());
          setSuccessMessage("Task updated!");
        } else {
          await createNoteMutation.mutateAsync(task);
          setSuccessMessage("Task added!");
        }
        setTimeout(() => setSuccessMessage(""), 2000);
        if (!isEditing) setTask(INITIAL_STATE);
        setErrors({});
      } catch (error) { console.error("Error saving task:", error); }
    }
  };

  const isLoading = createNoteMutation.isPending || updateNoteMutation.isPending;

  return (
    /* 1. Added responsive padding (p-4 on mobile, p-8 on larger screens) */
    <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-gray-50/30">
      {/* 2. Responsive max-width container */}
      <form onSubmit={handleAddTask} className="w-full max-w-lg lg:max-w-2xl mx-auto bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-100">

        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          {isEditing ? "✏️ Edit Task" : "➕ Add New Task"}
        </h2>

        {/* Task Title */}
        <div className="mb-5">
          <label htmlFor="title" className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            value={task.title}
            onChange={handleChange}
            type="text"
            placeholder="What needs to be done?"
            disabled={isLoading}
            className={`border ${errors.title ? "border-red-500" : "border-gray-300"} rounded-xl px-4 py-3 w-full shadow-sm focus:ring-2 focus:ring-green-500 transition-all text-base sm:text-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1 font-medium">{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">Description</label>
          <div className="rounded-xl overflow-hidden border border-gray-300">
            <TaskDescription value={task.description} onChange={handleDescriptionChange} />
          </div>
        </div>

        {/* Priority Selection - Responsive Grid */}
        <div className="mb-5">
          <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">Priority</label>
          {/* Changed to 1 column on tiny screens, 3 columns on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {["low", "medium", "high"].map((p) => (
              <label
                key={p}
                className={`relative border-2 rounded-xl p-2 sm:p-3 text-center cursor-pointer transition-all ${
                  task.priority === p
                    ? "border-green-600 bg-green-50 shadow-sm ring-2 ring-green-100"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input type="radio" name="priority" value={p} checked={task.priority === p} onChange={handleChange} disabled={isLoading} className="sr-only" />
                <span className={`capitalize text-sm sm:text-base font-bold ${task.priority === p ? "text-green-700" : "text-gray-500"}`}>
                  {p}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Date and Status - Responsive Flexbox/Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div>
            <label htmlFor="dueDate" className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={task.dueDate ? convertDateTime(task.dueDate) : ""}
              onChange={handleChange}
              disabled={isLoading}
              className={`border ${errors.dueDate ? "border-red-500" : "border-gray-300"} rounded-xl px-4 py-3 w-full shadow-sm focus:ring-2 focus:ring-green-500 text-sm sm:text-base ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            {errors.dueDate && <p className="text-red-500 text-xs mt-1 font-medium">{errors.dueDate}</p>}
          </div>

          <div>
            <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-2">Status</label>
            <select
              name="progress"
              value={task.progress}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-green-500 bg-white text-sm sm:text-base"
            >
              <option value="not-started">⭕ Not Started</option>
              <option value="in-progress">🔄 In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl shadow-md active:scale-[0.98] transition-all text-white font-bold text-base sm:text-lg ${
            isEditing ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Processing..." : successMessage || (isEditing ? "Update Task" : "Add Task")}
        </button>
      </form>
    </div>
  );
};