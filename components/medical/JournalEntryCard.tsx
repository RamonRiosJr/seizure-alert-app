import React, { useState } from 'react';

interface JournalEntryCardProps {
  transcript: string;
  isRecording: boolean;
  onSave?: (entry: string) => void;
  onDiscard?: () => void;
  className?: string;
}

export const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
  transcript,
  isRecording,
  onSave,
  onDiscard,
  className = '',
}) => {
  const [editedTranscript, setEditedTranscript] = useState(transcript);

  // Sync edited transcript when prop updates (if needed, but usually we just want initial)
  React.useEffect(() => {
    if (transcript && !isRecording) {
      setEditedTranscript(transcript);
    }
  }, [transcript, isRecording]);

  if (!transcript && !isRecording) return null;

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-4 animate-in fade-in slide-in-from-bottom-4 border border-slate-200 dark:border-slate-700 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          {isRecording ? (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Recording...
            </>
          ) : (
            'New Journal Entry'
          )}
        </h3>
        {isRecording && (
          <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
            {/* Timer could go here */}
            Live
          </span>
        )}
      </div>

      <div className="mb-6">
        {isRecording ? (
          <p className="text-lg text-slate-600 dark:text-slate-300 min-h-[3rem] italic">
            {transcript || 'Listening...'}
          </p>
        ) : (
          <textarea
            value={editedTranscript}
            onChange={(e) => setEditedTranscript(e.target.value)}
            className="w-full min-h-[120px] p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none transition-all"
            placeholder="Edit your entry..."
          />
        )}
      </div>

      {!isRecording && (
        <div className="flex justify-end gap-3">
          <button
            onClick={onDiscard}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Discard
          </button>
          <button
            onClick={() => onSave?.(editedTranscript)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save to Vault
          </button>
        </div>
      )}
    </div>
  );
};
