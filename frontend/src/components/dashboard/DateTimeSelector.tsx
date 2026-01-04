import { Calendar, Clock, Edit3 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DateTimeSelectorProps {
  dateTime: string;
  setDateTime: (v: string) => void;
}

export const DateTimeSelector = ({
  dateTime,
  setDateTime,
}: DateTimeSelectorProps) => {
  // Split datetime string to date and time
  const [datePart, timePart] = dateTime.split('T');

  const handleDateChange = (newDate: string) => {
    setDateTime(`${newDate}T${timePart}`);
  };

  const handleTimeChange = (newTime: string) => {
    setDateTime(`${datePart}T${newTime}`);
  };

  return (
    <div className="dashboard-section">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-foreground">Date & Time of Observation</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Edit3 className="w-3 h-3" />
          <span>Editable</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Input */}
        <div className="group">
          <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center justify-between">
            <span>Date</span>
            <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to edit
            </span>
          </label>
          <div className="relative">
            <Input
              type="date"
              value={datePart}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full h-12 text-base pl-12 pr-10 bg-muted/30 cursor-pointer hover:bg-muted/50 hover:border-blue-500 hover:border-2 focus:border-blue-600 focus:border-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-all"
              placeholder="Select date"
            />
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Edit3 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none opacity-50 group-hover:opacity-100 group-hover:text-blue-600 transition-all" />
          </div>
        </div>

        {/* Time Input */}
        <div className="group">
          <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center justify-between">
            <span>Time</span>
            <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to edit
            </span>
          </label>
          <div className="relative">
            <Input
              type="time"
              value={timePart}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="w-full h-12 text-base pl-12 pr-10 bg-muted/30 cursor-pointer hover:bg-muted/50 hover:border-blue-500 hover:border-2 focus:border-blue-600 focus:border-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-all"
              placeholder="Select time"
            />
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Edit3 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none opacity-50 group-hover:opacity-100 group-hover:text-blue-600 transition-all" />
          </div>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
        Klik pada kolom tanggal atau waktu di atas untuk mengubahnya. Waktu lokal saat ini ditampilkan secara default.
      </p>
    </div>
  );
};
