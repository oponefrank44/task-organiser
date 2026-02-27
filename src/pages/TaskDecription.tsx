import React, { useState } from 'react';

interface TaskDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({ value, onChange }) => {
  const [previewMode, setPreviewMode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const insertText = (syntax: string) => {
    onChange(value + (value.endsWith('\n') || value === '' ? '' : '\n') + syntax);
  };

  const renderPreview = () => {
    if (!value) return <p className="text-gray-400 italic">No description provided...</p>;

    const lines = value.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={index} className="ml-5 list-disc text-gray-700">{line.substring(2)}</li>;
      }
      else if (/^\d+\.\s/.test(line)) {
        return <li key={index} className="ml-5 list-decimal text-gray-700">{line.replace(/^\d+\.\s/, '')}</li>;
      }
      else if (line.startsWith('# ')) {
        return <h3 key={index} className="text-xl font-bold mt-3 mb-1 text-gray-900">{line.substring(2)}</h3>;
      }
      else if (line.startsWith('## ')) {
        return <h4 key={index} className="text-lg font-semibold mt-2 mb-1 text-gray-800">{line.substring(3)}</h4>;
      }
      else if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }
      else {
        return <p key={index} className="mb-2 text-gray-700 leading-relaxed">{line}</p>;
      }
    });
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Responsive Toolbar */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-0 border border-gray-300 rounded-t-xl p-2 bg-gray-50/80">

        {/* Formatting Group */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => insertText('- ')}
            className="p-2 sm:px-3 sm:py-1 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
            title="Bullet List"
          >
            <span className="font-bold">•</span>
            <span className="hidden sm:inline">Bullet</span>
          </button>

          <button
            type="button"
            onClick={() => insertText('1. ')}
            className="p-2 sm:px-3 sm:py-1 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
            title="Numbered List"
          >
            <span className="font-bold">1.</span>
            <span className="hidden sm:inline">Number</span>
          </button>

          <button
            type="button"
            onClick={() => insertText('# ')}
            className="p-2 sm:px-3 sm:py-1 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            title="Header"
          >
            <span className="font-bold">H</span>
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-w-2"></div>

        {/* Preview/Edit Toggle */}
        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className={`px-3 py-2 sm:py-1 text-xs sm:text-sm font-semibold border rounded-lg transition-all shadow-sm ${
            previewMode
              ? 'bg-green-600 text-white border-green-700'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
        >
          {previewMode ? 'Edit Mode' : 'View Preview'}
        </button>
      </div>

      {/* Editor/Preview Area */}
      <div className="relative">
        {previewMode ? (
          <div className="border border-t-0 border-gray-300 rounded-b-xl p-4 min-h-37.5 bg-white prose-sm max-w-none wrap-break-words overflow-x-auto">
            {renderPreview()}
          </div>
        ) : (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder="Describe the task... (# for header, - for bullets)"
            className="border border-t-0 border-gray-300 rounded-b-xl px-4 py-3 w-full shadow-inner focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500/30 transition-all text-base sm:text-lg min-h-[150px] font-mono leading-relaxed resize-y"
          />
        )}
      </div>
    </div>
  );
};

export default TaskDescription;