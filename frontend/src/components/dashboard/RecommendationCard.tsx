import { Lightbulb, Info } from "lucide-react";

interface RecommendationCardProps {
  pm25Value: number;
}

export const RecommendationCard = ({ pm25Value }: RecommendationCardProps) => {
  const getISPUInfo = (value: number) => {
    if (value <= 15.5) {
      return {
        level: "Baik",
        ispu: "0 - 15.5",
        color: "#4ade80",
        bgColor: "bg-green-50 dark:bg-green-950/20",
        borderColor: "border-green-200 dark:border-green-800",
        iconColor: "text-green-600",
        explanation: "Tingkat kualitas udara yang tidak memberikan dampak bagi kesehatan manusia atau hewan dan tidak berpengaruh pada tumbuhan, bangunan ataupun nilai estetika.",
        recommendation: "Sangat baik untuk melakukan aktivitas di luar ruangan. Tidak ada batasan untuk beraktivitas."
      };
    }
    if (value <= 55.4) {
      return {
        level: "Sedang",
        ispu: "15.6 - 55.4",
        color: "#3b82f6",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
        borderColor: "border-blue-200 dark:border-blue-800",
        iconColor: "text-blue-600",
        explanation: "Tingkat kualitas udara yang tidak berpengaruh pada kesehatan manusia ataupun hewan tetapi berpengaruh pada tumbuhan yang peka dan nilai estetika.",
        recommendation: "Kelompok sensitif (anak-anak, lansia, ibu hamil) sebaiknya mulai membatasi aktivitas di luar ruangan yang terlalu lama."
      };
    }
    if (value <= 150.4) {
      return {
        level: "Tidak Sehat",
        ispu: "55.5 - 150.4",
        color: "#eab308",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        iconColor: "text-yellow-600",
        explanation: "Tingkat kualitas udara yang bersifat merugikan pada manusia ataupun kelompok hewan yang peka atau dapat menimbulkan kerusakan pada tumbuhan ataupun nilai estetika.",
        recommendation: "Kelompok sensitif harus mengurangi aktivitas di luar ruangan. Masyarakat umum sebaiknya membatasi aktivitas berat di luar ruangan dan mempertimbangkan penggunaan masker."
      };
    }
    if (value <= 250.4) {
      return {
        level: "Sangat Tidak Sehat",
        ispu: "150.5 - 250.4",
        color: "#ef4444",
        bgColor: "bg-red-50 dark:bg-red-950/20",
        borderColor: "border-red-200 dark:border-red-800",
        iconColor: "text-red-600",
        explanation: "Tingkat kualitas udara yang dapat merugikan kesehatan pada sejumlah segmen populasi yang terpapar. Dapat menyebabkan gangguan kesehatan yang serius pada kelompok sensitif.",
        recommendation: "Kelompok sensitif harus menghindari semua aktivitas di luar ruangan. Masyarakat umum harus mengurangi aktivitas di luar ruangan. Sangat dianjurkan menggunakan masker saat keluar rumah."
      };
    }
    return {
      level: "Berbahaya",
      ispu: "> 250.4",
      color: "#1f2937",
      bgColor: "bg-gray-900/10 dark:bg-gray-950/30",
      borderColor: "border-gray-800 dark:border-gray-900",
      iconColor: "text-gray-900 dark:text-gray-100",
      explanation: "Tingkat kualitas udara berbahaya yang secara umum dapat merugikan kesehatan yang serius pada populasi. Kondisi darurat kesehatan yang dapat berdampak pada seluruh populasi.",
      recommendation: "PERINGATAN KESEHATAN: Semua orang harus menghindari aktivitas di luar ruangan. Tetap berada di dalam ruangan dengan pintu dan jendela tertutup. Wajib menggunakan masker jika terpaksa keluar. Segera cari pertolongan medis jika mengalami kesulitan bernapas, batuk, atau iritasi mata, hidung, dan tenggorokan."
    };
  };

  const ispuInfo = getISPUInfo(pm25Value);

  return (
    <div className={`rounded-xl p-4 border-2 ${ispuInfo.borderColor} ${ispuInfo.bgColor}`}>
      <div className="space-y-3">
        {/* Header dengan Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${ispuInfo.bgColor}`}>
              <Info className={`w-4 h-4 ${ispuInfo.iconColor}`} />
            </div>
            <div>
              <h4 className="font-bold text-sm" style={{ color: ispuInfo.color }}>
                Kategori: {ispuInfo.level}
              </h4>
              <p className="text-xs text-muted-foreground">PM2.5: {ispuInfo.ispu} µg/m³</p>
            </div>
          </div>
        </div>

        {/* Penjelasan Kategori */}
        <div className="space-y-2">
          <div>
            <p className="text-xs font-semibold text-foreground mb-1">Penjelasan:</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {ispuInfo.explanation}
            </p>
          </div>

          {/* Rekomendasi */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              {/* <Lightbulb className={`w-3.5 h-3.5 ${ispuInfo.iconColor}`} /> */}
              <p className="text-xs font-semibold text-foreground">Rekomendasi:</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {ispuInfo.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
