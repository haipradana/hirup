import { useMemo } from "react";

interface GaugeChartProps {
  value: number;
  maxValue?: number;
}

export const GaugeChart = ({ value, maxValue = 500 }: GaugeChartProps) => {
  const { color, rotation, segments } = useMemo(() => {
    const percentage = Math.min(value / maxValue, 1);
    const rotation = -90 + percentage * 180;
    
    // PM2.5 color ranges
    let color = "#4ade80"; // Baik (0-15.5)
    if (value > 250.4) color = "#1f2937"; // Berbahaya (>250.4)
    else if (value > 150.4) color = "#ef4444"; // Sangat Tidak Sehat (150.5-250.4)
    else if (value > 55.4) color = "#f97316"; // Tidak Sehat (55.5-150.4)
    else if (value > 15.5) color = "#eab308"; // Sedang (15.5-55.4)

    const segments = [
      { start: 0, end: 36, color: "#4ade80" }, // Baik: 0-15.5
      { start: 36, end: 72, color: "#eab308" }, // Sedang: 15.5-55.4
      { start: 72, end: 108, color: "#f97316" }, // Tidak Sehat: 55.5-150.4
      { start: 108, end: 144, color: "#ef4444" }, // Sangat Tidak Sehat: 150.5-250.4
      { start: 144, end: 180, color: "#1f2937" }, // Berbahaya: >250.4
    ];

    return { color, rotation, segments };
  }, [value, maxValue]);

  const createArc = (startAngle: number, endAngle: number, radius: number) => {
    const startRad = ((startAngle - 180) * Math.PI) / 180;
    const endRad = ((endAngle - 180) * Math.PI) / 180;
    
    const x1 = 100 + radius * Math.cos(startRad);
    const y1 = 100 + radius * Math.sin(startRad);
    const x2 = 100 + radius * Math.cos(endRad);
    const y2 = 100 + radius * Math.sin(endRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  return (
    <div className="relative w-full max-w-[220px] mx-auto">
      <svg viewBox="0 0 200 120" className="w-full">
        {/* Background segments */}
        {segments.map((segment, i) => (
          <path
            key={i}
            d={createArc(segment.start, segment.end, 80)}
            fill="none"
            stroke={segment.color}
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.2"
          />
        ))}
        
        {/* Active arc */}
        <path
          d={createArc(0, Math.min((value / maxValue) * 180, 180), 80)}
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        
        {/* Needle */}
        <g
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "100px 100px",
            transition: "transform 0.5s ease-out",
          }}
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="35"
            stroke="hsl(var(--foreground))"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="8" fill="hsl(var(--foreground))" />
          <circle cx="100" cy="100" r="4" fill="hsl(var(--background))" />
        </g>
      </svg>
    </div>
  );
};
