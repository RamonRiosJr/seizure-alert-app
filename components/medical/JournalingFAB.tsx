import { motion } from 'framer-motion';

interface JournalingFABProps {
  onStartRecording: () => void;
  isRecording: boolean;
  className?: string; // Allow positioning overrides
}

export const JournalingFAB: React.FC<JournalingFABProps> = ({
  onStartRecording,
  isRecording,
  className = '',
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onStartRecording}
      className={`fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-xl flex items-center justify-center z-50 transition-colors duration-300 ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary-600 hover:bg-primary-700'} text-white ${className}`}
      aria-label={isRecording ? 'Stop Recording' : 'Start Voice Journal'}
    >
      {isRecording ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2" strokeWidth={2} />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      )}
    </motion.button>
  );
};
