import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";

interface QualityBadgeProps {
  value: number;
  className?: string;
}

export const QualityBadge = ({ value, className }: QualityBadgeProps) => {
  const getQualityInfo = (pm25: number) => {
    if (pm25 <= 15.5) {
      return {
        label: "Baik",
        className: "quality-good",
        icon: CheckCircle2,
        color: "bg-green-500 text-white",
      };
    }
    if (pm25 <= 55.4) {
      return {
        label: "Sedang",
        className: "quality-moderate",
        icon: AlertCircle,
        color: "bg-blue-500 text-white",
      };
    }
    if (pm25 <= 150.4) {
      return {
        label: "Tidak Sehat",
        className: "quality-unhealthy",
        icon: AlertTriangle,
        color: "bg-yellow-500 text-white",
      };
    }
    if (pm25 <= 250.4) {
      return {
        label: "Sangat Tidak Sehat",
        className: "quality-danger",
        icon: AlertTriangle,
        color: "bg-red-500 text-white",
      };
    }
    return {
      label: "Berbahaya",
      className: "quality-hazardous",
      icon: AlertTriangle,
      color: "bg-gray-900 text-white",
    };
  };

  const quality = getQualityInfo(value);
  const Icon = quality.icon;

  return (
    <div className={cn("quality-badge px-4 py-2 rounded-full font-semibold flex items-center gap-2", quality.color, className)}>
      <Icon className="w-4 h-4" />
      <span>{quality.label}</span>
    </div>
  );
};
