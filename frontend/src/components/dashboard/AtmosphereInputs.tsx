import { SliderInput } from "./SliderInput";
import { Thermometer, Droplets, Gauge, Sun } from "lucide-react";

interface AtmosphereInputsProps {
  temperature: number;
  setTemperature: (v: number) => void;
  humidity: number;
  setHumidity: (v: number) => void;
  pressure: number;
  setPressure: (v: number) => void;
  solarRadiation: number;
  setSolarRadiation: (v: number) => void;
}

export const AtmosphereInputs = ({
  temperature,
  setTemperature,
  humidity,
  setHumidity,
  pressure,
  setPressure,
  solarRadiation,
  setSolarRadiation,
}: AtmosphereInputsProps) => {
  return (
    <div className="dashboard-section space-y-5">
      <div className="flex items-center gap-2">
        <Thermometer className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-foreground">Atmosphere</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SliderInput
          label="Temperature"
          value={temperature}
          onChange={setTemperature}
          min={0}
          max={50}
          step={0.1}
          unit="°C"
        />
        <SliderInput
          label="Humidity"
          value={humidity}
          onChange={setHumidity}
          min={0}
          max={100}
          step={1}
          unit="%"
        />
        <SliderInput
          label="Pressure"
          value={pressure}
          onChange={setPressure}
          min={900}
          max={1100}
          step={1}
          unit="hPa"
        />
        <SliderInput
          label="Solar Radiation"
          value={solarRadiation}
          onChange={setSolarRadiation}
          min={0}
          max={1500}
          step={0.1}
          unit="W/m²"
        />
      </div>
    </div>
  );
};
