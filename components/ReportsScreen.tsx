import React, { useState } from 'react';
import type { Language, AlertReport } from '../types';
import { translations } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CloseIcon, TrashIcon, PencilIcon, CheckIcon, DocumentChartBarIcon } from '../assets/icons';

interface ReportsScreenProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const ReportsScreen: React.FC<ReportsScreenProps> = ({ isOpen, onClose, language }) => {
  const [reports, setReports] = useLocalStorage<AlertReport[]>('alert_reports', []);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const t = translations[language];

  if (!isOpen) return null;

  const formattedTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleStartEditing = (report: AlertReport) => {
    setEditingReportId(report.id);
    setNotesInput(report.notes);
  };

  const handleCancelEditing = () => {
    setEditingReportId(null);
    setNotesInput('');
  };

  const handleSaveNotes = () => {
    if (!editingReportId) return;
    setReports(prevReports =>
      prevReports.map(r =>
        r.id === editingReportId ? { ...r, notes: notesInput } : r
      )
    );
    handleCancelEditing();
  };

  const handleDeleteReport = (id: string) => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      setReports(prevReports => prevReports.filter(r => r.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl h-[90vh] max-h-[800px] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <DocumentChartBarIcon className="w-6 h-6"/>
            {t.reportsTitle}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-grow p-6 overflow-y-auto">
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <DocumentChartBarIcon className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4"/>
                <p className="text-lg text-gray-500 dark:text-gray-400">{t.noReportsMessage}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map(report => (
                <div key={report.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <p className="font-bold text-lg text-gray-800 dark:text-gray-200">
                        {new Date(report.date).toLocaleString(language, { dateStyle: 'long', timeStyle: 'short' })}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">{t.reportDurationLabel}:</span> {formattedTime(report.duration)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button 
                        onClick={() => handleStartEditing(report)} 
                        className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                        aria-label={t.editNotes}
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteReport(report.id)} 
                        className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                        aria-label={t.deleteReport}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{t.reportNotesLabel}</h4>
                    {editingReportId === report.id ? (
                        <div className="space-y-2">
                            <textarea
                                value={notesInput}
                                onChange={e => setNotesInput(e.target.value)}
                                placeholder={t.notesPlaceholder}
                                className="w-full h-24 p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />
                            <div className="flex items-center gap-2">
                                <button onClick={handleSaveNotes} className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-1 text-sm">
                                    <CheckIcon className="w-4 h-4" />
                                    {t.saveNotes}
                                </button>
                                <button onClick={handleCancelEditing} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 text-sm">
                                    {t.cancelNotes}
                                </button>
                            </div>
                        </div>
                    ) : (
                       <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                         {report.notes || <span className="text-gray-400 dark:text-gray-500 italic">No notes added.</span>}
                       </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReportsScreen;