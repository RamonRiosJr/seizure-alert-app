import React from 'react';

interface GForceMeterProps {
  value: number;
  threshold: number;
  max?: number;
}

/**
 * Circular G-Force meter with color-coded zones
 * Green (0-threshold), Yellow (threshold-threshold*1.5), Red (threshold*1.5+)
 */
export const GForceMeter: React.FC<GForceMeterProps> = ({ value, threshold, max = 30 }) => {
  // Calculate rotation angle (0-270 degrees, leaving bottom 90 degrees open)
  const percentage = Math.min(value / max, 1);
  const rotation = percentage * 270 - 135; // -135 to 135 degrees

  // Determine color based on value
  const getColor = () => {
    if (value < threshold) return '#10b981'; // Green
    if (value < threshold * 1.5) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const color = getColor();

  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Background circle */}
      <svg className="w-full h-full" viewBox="0 0 200 200">
        {/* Outer ring */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-300 dark:text-gray-600"
        />

        {/* Color zones */}
        <path
          d="M 100 100 L 100 10 A 90 90 0 0 1 190 100"
          fill="none"
          stroke="#10b981"
          strokeWidth="20"
          opacity="0.2"
        />
        <path
          d="M 190 100 A 90 90 0 0 1 100 190"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="20"
          opacity="0.2"
        />
        <path
          d="M 100 190 A 90 90 0 0 1 10 100"
          fill="none"
          stroke="#ef4444"
          strokeWidth="20"
          opacity="0.2"
        />

        {/* Threshold marker */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="20"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeDasharray="4,4"
          transform={`rotate(${(threshold / max) * 270 - 135} 100 100)`}
        />

        {/* Needle */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${rotation} 100 100)`}
          className="transition-transform duration-100"
        />

        {/* Center dot */}
        <circle cx="100" cy="100" r="8" fill={color} />
      </svg>

      {/* Value display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold" style={{ color }}>
          {value.toFixed(1)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">m/s²</div>
      </div>

      {/* Scale labels */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-xs text-gray-400">
        {max}
      </div>
      <div className="absolute bottom-0 left-2 text-xs text-gray-400">0</div>
      <div className="absolute bottom-0 right-2 text-xs text-gray-400">0</div>
    </div>
  );
};
