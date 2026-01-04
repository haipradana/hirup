import { SliderInput } from "./SliderInput";
import { Wind, CloudRain, Compass } from "lucide-react";

interface WindRainInputsProps {
  windSpeedAvg: number;
  setWindSpeedAvg: (v: number) => void;
  windSpeedMax: number;
  setWindSpeedMax: (v: number) => void;
  windDirection: number;
  setWindDirection: (v: number) => void;
  rainfall: number;
  setRainfall: (v: number) => void;
}

export const WindRainInputs = ({
  windSpeedAvg,
  setWindSpeedAvg,
  windSpeedMax,
  setWindSpeedMax,
  windDirection,
  setWindDirection,
  rainfall,
  setRainfall,
}: WindRainInputsProps) => {
  return (
    <div className="dashboard-section space-y-5">
      <div className="flex items-center gap-2">
        <Wind className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-foreground">Wind & Rain</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SliderInput
          label="Wind Speed (Avg)"
          value={windSpeedAvg}
          onChange={setWindSpeedAvg}
          min={0}
          max={10}
          step={0.1}
          unit="m/s"
        />
        <SliderInput
          label="Wind Speed (Max)"
          value={windSpeedMax}
          onChange={setWindSpeedMax}
          min={0}
          max={15}
          step={0.1}
          unit="m/s"
        />
        <SliderInput
          label="Wind Direction"
          value={windDirection}
          onChange={setWindDirection}
          min={0}
          max={360}
          step={1}
          unit="°"
        />
        <SliderInput
          label="Rainfall"
          value={rainfall}
          onChange={setRainfall}
          min={0}
          max={400}
          step={0.1}
          unit="mm"
        />
      </div>
    </div>
  );
};
