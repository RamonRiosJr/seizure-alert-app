import React, { useEffect, useRef } from 'react';

interface GForceGraphProps {
    history: number[];
    threshold: number;
    max?: number;
}

/**
 * Real-time scrolling line graph of G-force readings
 */
export const GForceGraph: React.FC<GForceGraphProps> = ({
    history,
    threshold,
    max = 30
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw background
        ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('--bg-color') || '#1f2937';
        ctx.fillRect(0, 0, width, height);

        // Draw grid lines
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = (height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw threshold line
        const thresholdY = height - (threshold / max) * height;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, thresholdY);
        ctx.lineTo(width, thresholdY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw G-force line
        if (history.length > 1) {
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.beginPath();

            const pointSpacing = width / Math.max(history.length - 1, 1);

            history.forEach((value, index) => {
                const x = index * pointSpacing;
                const y = height - (value / max) * height;

                // Change color if above threshold
                if (value > threshold) {
                    ctx.strokeStyle = '#ef4444';
                } else {
                    ctx.strokeStyle = '#10b981';
                }

                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            ctx.stroke();
        }

        // Draw labels
        ctx.fillStyle = '#9ca3af';
        ctx.font = '10px sans-serif';
        ctx.fillText(`${max}`, 5, 12);
        ctx.fillText('0', 5, height - 5);
        ctx.fillText(`Threshold: ${threshold}`, width - 80, thresholdY - 5);

    }, [history, threshold, max]);

    return (
        <div className="bg-gray-800 dark:bg-gray-900 rounded-lg p-4">
            <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className="w-full"
                style={{ '--bg-color': '#1f2937' } as React.CSSProperties}
            />
        </div>
    );
};
