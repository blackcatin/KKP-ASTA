import ReactApexChart from "react-apexcharts";
import { useTheme } from "../../context/ThemeContext";

interface Props {
  type: "column" | "area";
  columnSeries?: any[];
  gridSeries?: number[];
  height?: number;
}

export default function ColumnAreaChart({ type, columnSeries, gridSeries, height }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const textColor = isDark ? "#E5E7EB" : "#374151";
  const bgColor = isDark ? "#1F2937" : "#FFFFFF";
  const gridColor = isDark ? "#374151" : "#E5E7EB";

  if (type === "column") {
    const series = columnSeries ?? [{ name: "Pendapatan", data: [300, 450, 600, 400, 550, 700, 600, 500, 650, 800, 750, 900] }];

    const options: any = {
      colors: ["#3B82F6"],
      chart: { type: "bar", height: height ?? 320, fontFamily: "Inter, sans-serif", toolbar: { show: false }, background: bgColor },
      plotOptions: { bar: { horizontal: false, columnWidth: "65%", borderRadius: 8 } },
      tooltip: { theme: isDark ? "dark" : "light" },
      stroke: { show: true, width: 4, colors: ["transparent"] },
      grid: { show: true, borderColor: gridColor, padding: { left: 10, right: 10 } },
      dataLabels: { enabled: false },
      xaxis: { categories: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"], labels: { style: { colors: textColor } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { colors: textColor }, formatter: (val: number) => val.toLocaleString('id-ID') } },
      fill: { opacity: 0.9 },
      legend: { show: false },
    };

    return <div className={`h-full transition-colors duration-300 p-6`}><ReactApexChart options={options} series={series} type="bar" height={height ?? 320} /></div>;
  }

  const s = [{ name: "Aktivitas", data: gridSeries ?? [31, 40, 28, 51, 42, 109, 100] }];

  const optionsArea: any = {
    chart: { type: "area", height: height ?? 200, toolbar: { show: false }, fontFamily: "Inter, sans-serif", background: bgColor },
    colors: ["#3B82F6"],
    stroke: { curve: "smooth", width: 3 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90, 100] } },
    xaxis: { categories: ["Sen","Sel","Rab","Kam","Jum","Sab","Min"], labels: { style: { colors: textColor, fontSize: "12px" } }, axisTicks: { show: false }, axisBorder: { show: false } },
    yaxis: { show: false },
    grid: { show: true, borderColor: gridColor, padding: { left: 0, right: 0 } },
    dataLabels: { enabled: false },
    tooltip: { theme: isDark ? "dark" : "light" },
  };

  return (
    <div className={`p-6 rounded-2xl shadow-xl transition-colors duration-300 h-full ${isDark ? "bg-gray-800" : "bg-white"}`}>
      {type === "area" && <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-gray-200" : "text-gray-800"}`}>Aktivitas Mingguan</h3>}
      <ReactApexChart options={optionsArea} series={s} type="area" height={height ?? 200} />
    </div>
  );
}
