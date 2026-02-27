import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/Store";
import { convertDateTime } from "../utils/helper";
import { useNotes } from "../utils/AsyncFunctions";
import TaskList from "./TaskList";
import SimpleSearch from "./SearchComponent";

// Sub-components with responsive text
interface StatCardProps {
  label: string;
  value: number | string;
  variant: "blue" | "green" | "gray";
}

const StatCard: React.FC<StatCardProps> = ({ label, value, variant }) => {
  const styles: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    gray: "bg-gray-50 text-gray-700",
  };

  return (
    <div className={`${styles[variant]} p-3 rounded-xl transition-all hover:shadow-md active:scale-95 flex flex-col items-center justify-center text-center`}>
      <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl sm:text-2xl font-bold">{value}</p>
    </div>
  );
};

export const TaskPreview: React.FC = () => {
  const previewNote = useSelector((state: RootState) => state.note.previewNote);
  const loading = useSelector((state: RootState) => state.note.loading);
  const error = useSelector((state: RootState) => state.note.error);
  const searchData = useSelector((state: RootState) => state.note.searchNote);

  const { useFetchAllNotes } = useNotes();
  const { data } = useFetchAllNotes();

  const renderDetailRow = (
    label: string,
    value: string | undefined,
    colorClass = "text-gray-600",
  ) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
      <span className="text-gray-500 text-xs sm:text-sm">{label}:</span>
      <span className={`${colorClass} text-xs sm:text-sm font-semibold truncate ml-4`}>{value || "N/A"}</span>
    </div>
  );

  // Common wrapper to handle responsive layout
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <aside className="w-full lg:w-[400px] xl:w-[450px] flex-none p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-gray-200 h-full overflow-y-auto bg-gray-50/30">
      {children}
    </aside>
  );

  if (loading) {
    return (
      <Wrapper>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <strong>Error:</strong> {error}
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <header className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">
          Task Details
        </h2>
        {previewNote && (
           <span className="lg:hidden text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">Preview Active</span>
        )}
      </header>

      {previewNote ? (
        <article className="bg-white border border-gray-200 p-4 sm:p-6 rounded-2xl shadow-sm">
          <h4 className="text-lg font-bold text-gray-900 mb-3 break-words">
            {previewNote.title}
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
            {previewNote.description || "No description provided."}
          </p>

          <div className="space-y-1">
            {renderDetailRow(
              "Status",
              previewNote.progress,
              previewNote.progress === "completed" ? "text-emerald-600" : previewNote.progress === "in-progress" ? "text-blue-600" : "text-gray-600"
            )}
            {renderDetailRow(
              "Priority",
              previewNote.priority,
              previewNote.priority === "high" ? "text-red-600" : previewNote.priority === "medium" ? "text-amber-600" : "text-green-600"
            )}
            {renderDetailRow("Due Date", previewNote.dueDate)}
            {previewNote.createdAt && (
              <div className="text-[10px] text-gray-400 mt-4 italic text-right">
                Created: {convertDateTime(previewNote.createdAt)}
              </div>
            )}
          </div>
        </article>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50">
          <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-400 text-xs font-medium">Select a task to view details</p>
        </div>
      )}

      <section className="mt-10">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
          Quick Stats
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard label="Done" value={data?.completed ?? 0} variant="green" />
          <StatCard label="Doing" value={data?.inProgress ?? 0} variant="blue" />
          <StatCard label="To Do" value={data?.notStarted ?? 0} variant="gray" />
        </div>
        <div className="mt-4 p-3 bg-white border border-gray-100 rounded-xl text-center text-xs font-bold text-gray-500 shadow-sm">
          TOTAL TASKS: <span className="text-blue-600">{data?.total ?? 0}</span>
        </div>
      </section>

      <div className="mt-8 space-y-4">
        <SimpleSearch />
        <TaskList tasks={searchData} />
      </div>
    </Wrapper>
  );
};