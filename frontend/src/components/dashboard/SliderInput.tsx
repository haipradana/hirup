import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export const SliderInput = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
}: SliderInputProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
      </div>
      <div className="flex items-center gap-4">
        <Slider
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          min={min}
          max={max}
          step={step}
          className="flex-1"
        />
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={value}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (inputValue === '') return; // Allow empty for editing
              const v = parseFloat(inputValue);
              if (!isNaN(v) && v >= min && v <= max) {
                onChange(v);
              }
            }}
            min={min}
            max={max}
            step={step}
            className="w-20 h-9 text-center text-sm font-medium focus-visible:ring-blue-500 focus-visible:ring-2"
          />
          {unit && (
            <span className="text-xs text-muted-foreground w-10">{unit}</span>
          )}
        </div>
      </div>
    </div>
  );
};
