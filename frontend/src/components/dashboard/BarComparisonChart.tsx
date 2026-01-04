interface BarComparisonChartProps {
  currentValue: number;
  forecastValue: number;
}

export const BarComparisonChart = ({
  currentValue,
  forecastValue,
}: BarComparisonChartProps) => {
  const maxValue = Math.max(currentValue, forecastValue, 100) * 1.2;
  const currentHeight = (currentValue / maxValue) * 100;
  const forecastHeight = (forecastValue / maxValue) * 100;

  const getColor = (value: number) => {
    if (value > 250.4) return "#1f2937"; // Berbahaya
    if (value > 150.4) return "#ef4444"; // Sangat Tidak Sehat
    if (value > 55.4) return "#f97316"; // Tidak Sehat
    if (value > 15.5) return "#eab308"; // Sedang
    return "#4ade80"; // Baik
  };

  return (
    <div className="w-full max-w-[200px] mx-auto">
      <div className="flex items-end justify-center gap-8 h-32">
        {/* Current Bar */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-16 h-24 bg-muted/50 rounded-t-lg overflow-hidden">
            <div
              className="absolute bottom-0 w-full rounded-t-lg transition-all duration-500"
              style={{
                height: `${currentHeight}%`,
                backgroundColor: getColor(currentValue),
                opacity: 0.6,
              }}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground">Now</span>
        </div>

        {/* Forecast Bar */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-16 h-24 bg-muted/50 rounded-t-lg overflow-hidden">
            <div
              className="absolute bottom-0 w-full rounded-t-lg transition-all duration-500"
              style={{
                height: `${forecastHeight}%`,
                backgroundColor: getColor(forecastValue),
              }}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground">Forecast</span>
        </div>
      </div>
    </div>
  );
};
