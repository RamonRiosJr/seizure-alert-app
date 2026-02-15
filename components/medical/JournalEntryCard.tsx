import React from 'react';
import { Clock, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface StructuredJournalData {
    symptoms: string[];
    severity: 'Low' | 'Medium' | 'High' | 'Emergency';
    notes: string;
    timestamp: number;
}

interface JournalEntryCardProps {
    transcript: string;
    data?: StructuredJournalData;
    isProcessing?: boolean;
    onSave?: () => void;
    onDiscard?: () => void;
}

export const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
    transcript,
    data,
    isProcessing = false,
    onSave,
    onDiscard
}) => {
    const severityColor = {
        Low: 'text-green-500 bg-green-100 dark:bg-green-900/30',
        Medium: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
        High: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
        Emergency: 'text-red-500 bg-red-100 dark:bg-red-900/30',
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-500 font-medium">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                {data && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${severityColor[data.severity]}`}>
                        <Activity className="w-3 h-3" />
                        {data.severity.toUpperCase()}
                    </span>
                )}
            </div>

            {/* Transcript / Content */}
            <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Voice Transcript</h3>
                <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                    "{transcript}"
                </p>
            </div>

            {/* Structured Data Preview (if available) */}
            {data && (
                <div className="mb-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                    <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Aura Analysis</h3>

                    <div className="space-y-3">
                        <div>
                            <span className="text-xs text-slate-500 block mb-1">Detected Symptoms</span>
                            <div className="flex flex-wrap gap-2">
                                {data.symptoms.map((symptom, idx) => (
                                    <span key={idx} className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-1 rounded-md font-medium">
                                        {symptom}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {data.notes && (
                            <div>
                                <span className="text-xs text-slate-500 block mb-1">Clinical Note</span>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{data.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-2">
                <button
                    onClick={onDiscard}
                    className="flex-1 py-3 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    Discard
                </button>
                <button
                    onClick={onSave}
                    disabled={isProcessing}
                    className="flex-1 py-3 px-4 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? (
                        'Processing...'
                    ) : (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            Save Entry
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
