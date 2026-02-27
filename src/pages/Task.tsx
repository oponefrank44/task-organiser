import { NotePriority, NoteProgress } from "../utils/Enum";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store/Store";
import { isEditNote } from "../note/noteSlice";
import type { RootState } from "../store/Store";
import { useNotes } from "../utils/AsyncFunctions";

interface NoteDetail {
  title: string;
  priority: string;
  status: string;
  dueDate: string;
  bgColor?: string;
}

export const Task: React.FC<NoteDetail> = ({
  title,
  priority,
  status,
  dueDate,
  bgColor,
}) => {
  const previewNote = useSelector((state: RootState) => state.note.previewNote);
  const dispatch = useDispatch<AppDispatch>();
  const { useDeleteNote} = useNotes();
  const  deleteMutation=useDeleteNote()

  const handleIsEditing = () => {
    dispatch(isEditNote());
  };

  const handleDelete =() => {
  const id = previewNote?._id;

  if (!id) return;

  if (window.confirm("Are you sure you want to delete this note?")) {
    // .mutate is the standard way to trigger the mutationFn
    deleteMutation.mutate(id);
  }
};

  return (
    <div
      className={`p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all active:scale-[0.98] md:active:scale-100 ${
        bgColor ? bgColor : "bg-white"
      }`}
    >
      {/* Header Row: Title and Actions */}
      <div className="flex justify-between items-start gap-2 mb-3">
        <h4 className="font-semibold text-gray-800 text-sm sm:text-base leading-tight break-words flex-1">
          {title}
        </h4>
        <div className="flex space-x-1 sm:space-x-2 shrink-0">
          <button
            onClick={handleIsEditing}
            className="text-blue-500 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Edit task"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete task"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer Row: Badges and Date */}
      {/* Logic: flex-wrap ensures that on tiny screens, the items stack instead of squashing */}
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          <span
            className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
              priority === NotePriority.high
                ? "bg-red-100 text-red-700"
                : priority === NotePriority.medium
                ? "bg-yellow-100 text-yellow-700"
                : priority === NotePriority.low
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            } px-2 py-0.5 rounded-md`}
          >
            {priority}
          </span>
          <span
            className={`text-[10px] sm:text-xs font-medium ${
              status === NoteProgress.Completed
                ? "bg-green-100 text-green-700"
                : status === NoteProgress.NotStarted
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600"
            } px-2 py-0.5 rounded-md`}
          >
            {status}
          </span>
        </div>
        <span className="text-[10px] sm:text-xs text-gray-400 font-medium whitespace-nowrap">
          {dueDate}
        </span>
      </div>
    </div>
  );
};