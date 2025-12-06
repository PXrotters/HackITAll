import React, { useEffect, useRef } from 'react';

interface RetroPieChartProps {
    data: { label: string; value: number; color: string }[];
    width?: number;
    height?: number;
}

const RetroPieChart: React.FC<RetroPieChartProps> = ({ data, width = 200, height = 150 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        const total = data.reduce((acc, item) => acc + item.value, 0);
        if (total === 0) return;

        // Configuration for 3D effect
        const centerX = width / 2;
        const centerY = height / 2 - 20; // Move up specifically
        const radiusX = width / 2.5; // Ellipse radius X
        const radiusY = height / 4;  // Ellipse radius Y (flattened for 3D look)
        const depth = 20;            // Height of the 3D cylinder part



        // Draw the 3D "sides" (depth) first
        // We simulate this by drawing layers or just the arc sides.
        // Simple Painter's algorithm: Draw the back slices first? 
        // Actually, creating a true 3D pie slice in 2D canvas is complex.
        // A simpler "retro" hack: Draw the full cylinder for the pie, then draw the top.
        // But for multi-colored slices, we need to draw the side of EACH slice.

        // To keep it simple and authentic looking:
        // iterate slices. If a slice is in the "front" (angle 0 to PI), we see its side.
        // If it's in the back, we don't mostly, but technically we see the outer edge.
        // The standard Win98 chart usually had only 2 colors (used/free).
        // For multiple categories, we'll try our best.

        // Helper to draw a slice side
        const drawSliceSide = (start: number, end: number, color: string) => {
            // Darken color for side
            ctx.fillStyle = darkenColor(color, 40);
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, start, end);
            ctx.lineTo(centerX + radiusX * Math.cos(end), centerY + depth + radiusY * Math.sin(end));
            ctx.ellipse(centerX, centerY + depth, radiusX, radiusY, 0, end, start, true);
            ctx.lineTo(centerX + radiusX * Math.cos(start), centerY + radiusY * Math.sin(start));
            ctx.fill();
            ctx.stroke();
        };

        // Helper to draw slice top
        const drawSliceTop = (start: number, end: number, color: string) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, start, end);
            ctx.lineTo(centerX, centerY);
            ctx.fill();
            ctx.stroke();
        };

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';

        // 1. Draw the "Sides" (Deep part)
        // We draw the bottom ellipse fully first maybe? No, must correspond to slices.
        // Correct painter's algo for 3D pie is tricky.
        // Win98 simplified: It usually drew the full depth cylinder, then the top slices.
        // But we want multicolor.

        // Let's just draw the sides for angles between 0 and PI (the front facing part).
        let currentAngle = 0;
        data.forEach(slice => {
            const sliceAngle = (slice.value / total) * 2 * Math.PI;
            const endAngle = currentAngle + sliceAngle;

            // Only draw side if the slice is visible in the front half (roughly 0 to PI)
            // This is a naive approximation but works for simple 3/4 view
            // Actually, simply drawing ALL sides then ALL tops usually works "okay" for flat 3D styling if depth isn't huge.
            // Let's try drawing all sides lowered by 'depth', then connecting lines?
            // No, easiest is: Draw the bottom-most layers first.

            // Simplified approach: Draw the "bottom" ellipse fully colored by slices? No.
            // Let's try drawing the Thickness for all slices first.
            drawSliceSide(currentAngle, endAngle, slice.color);

            currentAngle += sliceAngle;
        });

        // 2. Draw the "Top" slices
        currentAngle = 0;
        data.forEach(slice => {
            const sliceAngle = (slice.value / total) * 2 * Math.PI;
            const endAngle = currentAngle + sliceAngle;
            drawSliceTop(currentAngle, endAngle, slice.color);
            currentAngle += sliceAngle;
        });

    }, [data, width, height]);

    // Simple hex darken helper
    const darkenColor = (color: string, percent: number) => {
        // Assume hex color like #RRGGBB
        if (color.startsWith('#')) {
            const num = parseInt(color.slice(1), 16);
            let r = (num >> 16) - percent;
            let g = ((num >> 8) & 0x00FF) - percent;
            let b = (num & 0x0000FF) - percent;
            r = r < 0 ? 0 : r;
            g = g < 0 ? 0 : g;
            b = b < 0 ? 0 : b;
            return `rgb(${r},${g},${b})`;
        }
        return color; // Fallback
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <canvas ref={canvasRef} width={width} height={height} />
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px', gap: '10px', fontSize: '12px' }}>
                {data.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 12, height: 12, background: item.color, marginRight: 4, border: '1px solid black' }}></div>
                        {item.label}: {item.value.toFixed(2)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RetroPieChart;
