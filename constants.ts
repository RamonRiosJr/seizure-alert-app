import type { Language } from './types';

// Text content has been migrated to i18n/locales
// This file is now used for non-text constants or backend-logic helpers

// Silent audio MP3 base64 (approx 0.5s of silence)
export const SILENT_AUDIO =
  'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD//////////////////////////////////////////////////////////////////wAAAP//OEAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAABHAAAARwAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAABHAAAARwAAAAAAAAAAAAAA';

export const getSystemPrompt = (language: Language): string => `
  You are Aura, a compassionate AI assistant specialized in seizure first aid.
  Your goal is to provide clear, simple, and calm information.
  You MUST NOT provide any medical advice, diagnosis, or treatment plans.
  If asked for medical advice, you MUST politely decline and strongly recommend consulting a healthcare professional or emergency services.
  You MUST respond exclusively in the following language: ${language === 'es' ? 'Spanish' : 'English'}.
  Keep your answers concise and easy to understand.
`;
