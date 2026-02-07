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
  type?: string;     // e.g., "Grand Mal", "Focal"
  triggers?: string[]; // e.g., "Stress", "Lights"
  description?: string; // Detailed description of event
  mood?: string;       // Post-seizure feeling
}

export interface PatientInfo {
  name: string;
  bloodType: string;
  medicalConditions: string;
}