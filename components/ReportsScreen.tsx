import React, { useState } from 'react';
import type { AlertReport } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  X,
  Trash2,
  Pencil,
  Check,
  ClipboardList,
  FileDown,
  Plus,
  Activity,
  Zap,
} from 'lucide-react';
import { generateSeizureReport } from '../utils/pdfGenerator';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

interface ReportsScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

const seizureTypeMapping: Record<string, string> = {
  'Grand Mal (Tonic-Clonic)': 'seizureTypes.grandMal',
  'Focal (Partial)': 'seizureTypes.focal',
  'Absence (Petit Mal)': 'seizureTypes.absence',
  'Atonic (Drop Attack)': 'seizureTypes.atonic',
  Myoclonic: 'seizureTypes.myoclonic',
  'Unknown/ Other': 'seizureTypes.unknown',
};

const triggerMapping: Record<string, string> = {
  Stress: 'triggers.stress',
  'Missed Meds': 'triggers.missedMeds',
  'Lack of Sleep': 'triggers.sleep',
  'Flashing Lights': 'triggers.lights',
  Alcohol: 'triggers.alcohol',
  'Heat/Dehydration': 'triggers.heat',
  'Menstrual Cycle': 'triggers.menstrual',
  'Illness/Fever': 'triggers.illness',
};

import { useConfig } from '../config';

const ReportsScreen: React.FC<ReportsScreenProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [reports, setReports] = useLocalStorage<AlertReport[]>('alert_reports', []);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
    duration: 0,
    type: 'Grand Mal (Tonic-Clonic)',
    triggers: [] as string[],
    notes: '',
  });

  const profile = useConfig();
  const showTypes = profile.features.seizureTypes;
  const showTriggers = profile.features.triggers;

  const seizureTypes = Object.keys(seizureTypeMapping);
  const commonTriggers = Object.keys(triggerMapping);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const durationSeconds = Math.max(0, newEntry.duration * 60); // Convert minutes to seconds for consistency
    const report: AlertReport = {
      id: Date.now().toString(),
      date: newEntry.date,
      duration: durationSeconds,
      notes: newEntry.notes,
      type: newEntry.type,
      triggers: newEntry.triggers,
      description: 'Manual Entry',
    };
    setReports([report, ...reports]);
    setIsManualEntryOpen(false);
    // Reset form
    setNewEntry({
      date: new Date().toISOString().slice(0, 16),
      duration: 0,
      type: 'Grand Mal (Tonic-Clonic)',
      triggers: [],
      notes: '',
    });
  };

  const toggleTrigger = (trigger: string) => {
    setNewEntry((prev) => ({
      ...prev,
      triggers: prev.triggers.includes(trigger)
        ? prev.triggers.filter((t) => t !== trigger)
        : [...prev.triggers, trigger],
    }));
  };

  if (!isOpen) return null;

  const handleExportClick = () => {
    setIsExportModalOpen(true);
  };

  const generateFilteredReport = (months: number | 'prev_year' | 'all') => {
    let filteredReports = reports;
    const now = new Date();

    if (months === 'prev_year') {
      const prevYear = now.getFullYear() - 1;
      filteredReports = reports.filter((r) => {
        const d = new Date(r.date);
        return d.getFullYear() === prevYear;
      });
    } else if (typeof months === 'number') {
      const cutoff = new Date();
      cutoff.setMonth(now.getMonth() - months);
      filteredReports = reports.filter((r) => new Date(r.date) >= cutoff);
    }

    generateSeizureReport(filteredReports, language, profile);
    setIsExportModalOpen(false);
  };

  const formattedTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // ... (handlers remain the same) ...
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
    setReports((prevReports) =>
      prevReports.map((r) => (r.id === editingReportId ? { ...r, notes: notesInput } : r))
    );
    handleCancelEditing();
  };
  const handleDeleteReport = (id: string) => {
    if (window.confirm(t('deleteReport') + '?')) {
      setReports((prevReports) => prevReports.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl h-[90vh] max-h-[800px] flex flex-col relative">
        {/* Export Modal Overlay */}
        {isExportModalOpen && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 rounded-lg">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-sm space-y-4 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('selectRange')}
                </h3>
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => generateFilteredReport(1)}
                  className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg text-left font-medium transition-colors"
                >
                  {t('lastMonth')}
                </button>
                <button
                  onClick={() => generateFilteredReport(3)}
                  className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg text-left font-medium transition-colors"
                >
                  {t('past3Months')}
                </button>
                <button
                  onClick={() => generateFilteredReport(6)}
                  className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg text-left font-medium transition-colors"
                >
                  {t('past6Months')}
                </button>
                <button
                  onClick={() => generateFilteredReport(9)}
                  className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg text-left font-medium transition-colors"
                >
                  {t('past9Months')}
                </button>
                <button
                  onClick={() => generateFilteredReport(12)}
                  className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg text-left font-medium transition-colors"
                >
                  {t('pastYear')}
                </button>
                <button
                  onClick={() => generateFilteredReport('prev_year')}
                  className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg text-left font-medium transition-colors"
                >
                  {t('prevYear')} ({new Date().getFullYear() - 1})
                </button>
                <button
                  onClick={() => generateFilteredReport('all')}
                  className="p-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-center font-bold mt-2 shadow-sm transition-colors"
                >
                  {t('exportAllTime')}
                </button>
              </div>
            </div>
          </div>
        )}

        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            {t('reportsTitle')}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsManualEntryOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t('logEvent')}</span>
            </button>
            {reports.length > 0 && (
              <button
                onClick={handleExportClick}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
                title="Export as PDF"
              >
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">{t('exportPDF')}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Manual Entry Modal */}
        {isManualEntryOpen && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 rounded-lg overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-lg space-y-4 border border-gray-200 dark:border-gray-700 my-auto">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('logPastSeizure')}
                </h3>
                <button onClick={() => setIsManualEntryOpen(false)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('dateTime')}
                    </label>
                    <input
                      type="datetime-local"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('durationMinutes')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={newEntry.duration}
                      onChange={(e) =>
                        setNewEntry({ ...newEntry, duration: parseFloat(e.target.value) })
                      }
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                </div>

                {showTypes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('seizureType')}
                    </label>
                    <select
                      value={newEntry.type}
                      onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                    >
                      {seizureTypes.map((type) => (
                        <option key={type} value={type}>
                          {t(seizureTypeMapping[type] || 'seizureTypes.unknown')}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {showTriggers && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('triggersLabel')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {commonTriggers.map((trig) => (
                        <button
                          key={trig}
                          type="button"
                          onClick={() => toggleTrigger(trig)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                            newEntry.triggers.includes(trig)
                              ? 'bg-indigo-100 border-indigo-500 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                              : 'bg-gray-100 border-gray-300 text-gray-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {t(triggerMapping[trig] || trig)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('reportNotesLabel')}
                  </label>
                  <textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    placeholder={t('notesPlaceholder')}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
                >
                  {t('saveEntry')}
                </button>
              </form>
            </div>
          </div>
        )}

        <main className="flex-grow p-6 overflow-y-auto">
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ClipboardList className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-lg text-gray-500 dark:text-gray-400">{t('noReportsMessage')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <p className="font-bold text-lg text-gray-800 dark:text-gray-200">
                        {new Date(report.date).toLocaleString(language, {
                          dateStyle: 'long',
                          timeStyle: 'short',
                        })}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">{t('reportDurationLabel')}:</span>{' '}
                        {formattedTime(report.duration)}
                      </p>
                    </div>
                  </div>

                  {/* Medical Details Badges */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {report.type && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        <Activity className="w-3 h-3" />
                        {t(seizureTypeMapping[report.type] || 'seizureTypes.unknown')}
                      </span>
                    )}
                    {report.triggers &&
                      report.triggers.map((trig, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                        >
                          <Zap className="w-3 h-3" />
                          {t(triggerMapping[trig] || trig)}
                        </span>
                      ))}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleStartEditing(report)}
                      className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                      aria-label={t('editNotes')}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                      aria-label={t('deleteReport')}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    {/* Notes Section - Intentionally keeping user logic same */}
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {t('reportNotesLabel')}
                    </h4>
                    {editingReportId === report.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={notesInput}
                          onChange={(e) => setNotesInput(e.target.value)}
                          placeholder={t('notesPlaceholder')}
                          className="w-full h-24 p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSaveNotes}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-1 text-sm"
                          >
                            <Check className="w-4 h-4" />
                            {t('saveNotes')}
                          </button>
                          <button
                            onClick={handleCancelEditing}
                            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 text-sm"
                          >
                            {t('cancelNotes')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                        {report.notes || (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            No notes added.
                          </span>
                        )}
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
