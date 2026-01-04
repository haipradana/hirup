import { SliderInput } from "./SliderInput";
import { Activity } from "lucide-react";

interface SensorDataInputsProps {
  pm25Current: number;
  setPm25Current: (v: number) => void;
  pm25_1hAgo?: number;
  setPm25_1hAgo?: (v: number) => void;
  pm25_2hAgo?: number;
  setPm25_2hAgo?: (v: number) => void;
  showHistory?: boolean;
}

export const SensorDataInputs = ({
  pm25Current,
  setPm25Current,
  pm25_1hAgo,
  setPm25_1hAgo,
  pm25_2hAgo,
  setPm25_2hAgo,
  showHistory = false,
}: SensorDataInputsProps) => {
  return (
    <div className="dashboard-section space-y-5">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-foreground">
          Sensor Data {showHistory && "(History)"}
        </h3>
      </div>

      <div className="space-y-5">
        {showHistory && setPm25_2hAgo && pm25_2hAgo !== undefined && (
          <SliderInput
            label="PM2.5 (-2 hrs)"
            value={pm25_2hAgo}
            onChange={setPm25_2hAgo}
            min={0}
            max={500}
            step={0.1}
            unit="µg/m³"
          />
        )}
        
        {showHistory && setPm25_1hAgo && pm25_1hAgo !== undefined && (
          <SliderInput
            label="PM2.5 (-1 hr)"
            value={pm25_1hAgo}
            onChange={setPm25_1hAgo}
            min={0}
            max={500}
            step={0.1}
            unit="µg/m³"
          />
        )}
        
        <SliderInput
          label={showHistory ? "PM2.5 (Current)" : "Current PM2.5"}
          value={pm25Current}
          onChange={setPm25Current}
          min={0}
          max={500}
          step={0.1}
          unit="µg/m³"
        />
      </div>
    </div>
  );
};
