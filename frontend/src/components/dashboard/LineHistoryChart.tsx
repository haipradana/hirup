import { useMemo } from "react";

interface LineHistoryChartProps {
  pm25_2h_ago: number;
  pm25_1h_ago: number;
  pm25_current: number;
  forecast: number;
}

export const LineHistoryChart = ({
  pm25_2h_ago,
  pm25_1h_ago,
  pm25_current,
  forecast,
}: LineHistoryChartProps) => {
  const getColor = (value: number) => {
    if (value > 250.4) return "#1f2937"; // Berbahaya
    if (value > 150.4) return "#ef4444"; // Sangat Tidak Sehat
    if (value > 55.4) return "#f97316"; // Tidak Sehat
    if (value > 15.5) return "#eab308"; // Sedang
    return "#4ade80"; // Baik
  };

  const { points, path, areaPath, maxY, lineColor } = useMemo(() => {
    const values = [pm25_2h_ago, pm25_1h_ago, pm25_current, forecast];
    const maxY = Math.max(...values) * 1.3;
    const minY = 0;
    const lineColor = getColor(forecast);
    
    const chartWidth = 260;
    const chartHeight = 100;
    const padding = 20;
    
    const xStep = (chartWidth - padding * 2) / 3;
    
    const points = values.map((v, i) => ({
      x: padding + i * xStep,
      y: chartHeight - padding - ((v - minY) / (maxY - minY)) * (chartHeight - padding * 2),
      value: v,
    }));
    
    const path = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    const areaPath = `${path} L ${points[3].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

    return { points, path, areaPath, maxY, lineColor };
  }, [pm25_2h_ago, pm25_1h_ago, pm25_current, forecast]);

  const labels = ["-2h", "-1h", "Now", "+1h"];

  return (
    <div className="w-full max-w-[280px] mx-auto">
      <svg viewBox="0 0 280 140" className="w-full">
        {/* Gradient fill */}
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <path
          d={areaPath}
          fill="url(#areaGradient)"
          className="transition-all duration-500"
        />
        
        {/* Line */}
        <path
          d={path}
          fill="none"
          stroke={lineColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500"
        />
        
        {/* Points */}
        {points.map((point, i) => (
          <g key={i}>
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill="hsl(var(--background))"
              stroke={lineColor}
              strokeWidth="3"
              className="transition-all duration-500"
            />
            <text
              x={point.x}
              y={125}
              textAnchor="middle"
              className="text-xs fill-muted-foreground"
              style={{ fontSize: "10px" }}
            >
              {labels[i]}
            </text>
            <text
              x={point.x}
              y={point.y - 12}
              textAnchor="middle"
              className="fill-foreground font-medium"
              style={{ fontSize: "10px" }}
            >
              {point.value.toFixed(0)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
