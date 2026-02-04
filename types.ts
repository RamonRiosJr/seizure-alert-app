export type Language = 'en' | 'es';

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface AlertReport {
  id: string;
  date: string;
  duration: number; // in seconds
  notes: string;
}

export interface PatientInfo {
  name: string;
  bloodType: string;
  medicalConditions: string;
}