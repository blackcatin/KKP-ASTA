import ReactApexChart from "react-apexcharts";
import { useTheme } from "../../context/ThemeContext";

type Props = {
  donutSeries?: number[];
};

export default function DonutChart({ donutSeries }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const textColor = isDark ? "#E5E7EB" : "#374151";
  const bgColor = isDark ? "#1F2937" : "#FFFFFF";

  const series = donutSeries ?? [55, 25, 20];
  const labels = ["Bahan Dapur", "Biaya Bulanan", "Gaji"];

  const options: any = {
    chart: { type: "donut", fontFamily: "Inter, sans-serif", background: bgColor },
    title: { text: "Overview Kategori", align: "center", style: { color: textColor, fontWeight: 600 } },
    colors: ["#3B82F6", "#10B981", "#F59E0B"],
    labels,
    legend: { position: "bottom", labels: { colors: textColor } },
    dataLabels: { enabled: true, style: { colors: [textColor], fontWeight: 600 } },
    tooltip: { theme: isDark ? "dark" : "light" },
    plotOptions: { pie: { donut: { size: "65%" } } },
  };

  return (
    <div className={`p-4 rounded-2xl shadow-xl transition-colors duration-300 ${isDark ? "bg-gray-800" : "bg-white"}`}>
      <ReactApexChart options={options} series={series} type="donut" height={280} />
    </div>
  );
}
