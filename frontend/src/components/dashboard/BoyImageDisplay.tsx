import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface BoyImageDisplayProps {
  value: number;
  className?: string;
}

export const BoyImageDisplay = ({ value, className }: BoyImageDisplayProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const getBoyImage = (pm25: number) => {
    if (pm25 <= 15.5) {
      return {
        image: "/boy-warna/hijau-trans.png",
        label: "Baik",
        bgColor: "bg-green-50 dark:bg-green-950/20",
        borderColor: "border-green-200 dark:border-green-800",
        textColor: "text-green-700 dark:text-green-400",
      };
    }
    if (pm25 <= 55.4) {
      return {
        image: "/boy-warna/biru-trans.png",
        label: "Sedang",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
        borderColor: "border-blue-200 dark:border-blue-800",
        textColor: "text-blue-700 dark:text-blue-400",
      };
    }
    if (pm25 <= 150.4) {
      return {
        image: "/boy-warna/kuning-trans.png",
        label: "Tidak Sehat",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        textColor: "text-yellow-700 dark:text-yellow-400",
      };
    }
    if (pm25 <= 250.4) {
      return {
        image: "/boy-warna/merah-trans.png",
        label: "Sangat Tidak Sehat",
        bgColor: "bg-red-50 dark:bg-red-950/20",
        borderColor: "border-red-200 dark:border-red-800",
        textColor: "text-red-700 dark:text-red-400",
      };
    }
    return {
      image: "/boy-warna/hitam-trans.png",
      label: "Berbahaya",
      bgColor: "bg-gray-50 dark:bg-gray-950/20",
      borderColor: "border-gray-200 dark:border-gray-800",
      textColor: "text-gray-700 dark:text-gray-400",
    };
  };

  const boyInfo = getBoyImage(value);

  return (
    <div className={cn("flex flex-col items-center justify-center py-4", className)}>
      {/* Image Container with Pop-up Animation */}
      <div
        className={cn(
          "relative transition-all duration-700 ease-out",
          show
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-50 translate-y-10"
        )}
      >
        {/* Background Circle */}
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-2xl opacity-30 transition-all duration-700",
            boyInfo.bgColor
          )}
          style={{
            width: "220px",
            height: "220px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Boy Image */}
        <img
          src={boyInfo.image}
          alt={boyInfo.label}
          className={cn(
            "relative w-48 h-48 object-contain drop-shadow-2xl transition-all duration-700",
            show && "animate-bounce-subtle"
          )}
        />
      </div>

      {/* Label with Animation */}
      <div
        className={cn(
          "mt-4 px-6 py-2 rounded-full border-2 transition-all duration-700 delay-200",
          boyInfo.bgColor,
          boyInfo.borderColor,
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <p className={cn("text-lg font-semibold", boyInfo.textColor)}>
          {boyInfo.label}
        </p>
      </div>
    </div>
  );
};
