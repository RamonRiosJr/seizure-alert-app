import { useLocalStorage } from './useLocalStorage';
import type { AlertReport, PatientInfo } from '../types';

import { activeProfile } from '../config';

export const useContextAwarePrompt = () => {
  const profile = activeProfile;
  const [patientInfo] = useLocalStorage<PatientInfo>('patient_info', {
    name: '',
    bloodType: '',
    medicalConditions: '',
  });

  const [reports] = useLocalStorage<AlertReport[]>('alert_reports', []);

  const getContextString = (): string => {
    let context = '\n[CONTEXT-AWARE DATA]:\n';
    let hasData = false;

    // 1. Patient Profile
    if (patientInfo.name || patientInfo.medicalConditions) {
      context += `Patient Profile: ${patientInfo.name || 'Unknown'}`;
      if (patientInfo.bloodType) context += ` (Blood Type: ${patientInfo.bloodType})`;
      if (patientInfo.medicalConditions)
        context += `. Conditions: ${patientInfo.medicalConditions}`;
      context += '\n';
      hasData = true;
    }

    // 2. Recent Seizures (Last 3)
    if (reports.length > 0) {
      context += `Recent ${profile.terminology.event} History:\n`;
      // Sort by date descending just in case, though they should be stored that way
      const recentReports = [...reports]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);

      recentReports.forEach((report) => {
        const date = new Date(report.date).toLocaleDateString();
        const duration = Math.floor(report.duration / 60);
        context += `- ${date}: ${report.type || 'Unknown Type'} (Duration: ${duration} min)`;
        if (report.triggers && report.triggers.length > 0) {
          context += ` [Triggers: ${report.triggers.join(', ')}]`;
        }
        context += '\n';
      });
      hasData = true;
    }

    context += '[END DATA]\n';

    return hasData ? context : '';
  };

  return { getContextString };
};
