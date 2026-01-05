import { cn } from "@/lib/utils";

export const AirQualityLegend = () => {
  const categories = [
    {
      image: "/boy-warna/hijau-trans.png",
      label: "Baik",
      range: "0 - 15.5",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-300 dark:border-green-700",
    },
    {
      image: "/boy-warna/biru-trans.png",
      label: "Sedang",
      range: "15.6 - 55.4",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-300 dark:border-blue-700",
    },
    {
      image: "/boy-warna/kuning-trans.png",
      label: "Tidak Sehat",
      range: "55.5 - 150.4",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      borderColor: "border-yellow-300 dark:border-yellow-700",
    },
    {
      image: "/boy-warna/merah-trans.png",
      label: "Sangat Tidak Sehat",
      range: "150.5 - 250.4",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-red-300 dark:border-red-700",
    },
    {
      image: "/boy-warna/hitam-trans.png",
      label: "Berbahaya",
      range: "> 250.4",
      bgColor: "bg-gray-50 dark:bg-gray-950/20",
      borderColor: "border-gray-300 dark:border-gray-700",
    },
  ];

  return (
    <div className="py-4">
      <p className="text-sm text-center text-muted-foreground mb-4">
        Kategori Kualitas Udara
      </p>
      <div className="flex flex-col gap-3">
        {/* Row 1: Baik, Sedang, Tidak Sehat */}
        <div className="flex gap-3 justify-center">
          {categories.slice(0, 3).map((category, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border backdrop-blur-sm",
                category.bgColor,
                category.borderColor,
                "opacity-80 hover:opacity-100 transition-opacity"
              )}
            >
              <img
                src={category.image}
                alt={category.label}
                className="w-8 h-8 object-contain opacity-90"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground leading-none">
                  {category.label}
                </span>
                <span className="text-[11px] text-muted-foreground leading-tight mt-1">
                  {category.range}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Row 2: Sangat Tidak Sehat, Berbahaya */}
        <div className="flex gap-3 justify-center">
          {categories.slice(3).map((category, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border backdrop-blur-sm",
                category.bgColor,
                category.borderColor,
                "opacity-80 hover:opacity-100 transition-opacity"
              )}
            >
              <img
                src={category.image}
                alt={category.label}
                className="w-8 h-8 object-contain opacity-90"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground leading-none">
                  {category.label}
                </span>
                <span className="text-[11px] text-muted-foreground leading-tight mt-1">
                  {category.range}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
