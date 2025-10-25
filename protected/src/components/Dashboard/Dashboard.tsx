import { useEffect, useState } from "react";
import DCard from "../Dashboard/DCard";
import ChartCard from "./ChartCard";
import DonutChart from "./DonutChart";
import ColumnAreaChart from "./ColumnAreaChart";
import RecentTransactionsCard from "../Dashboard/RecentTransactionCard";
import ReportWidget from "../Dashboard/ReportWidget";
import CriticalStockCard from "../Dashboard/CriticalStockCard"; // <-- import yang baru
import api from "../../api";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

type ReportResp = {
  laba_rugi?: number;
  total_kas_masuk?: number;
  monthly_revenue?: number[];
};

type Item = {
  id: number;
  name: string;
  sku?: string;
  current_stock: number;
  min_stock?: number;
  is_trackable?: boolean;
};

export default function DashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [report, setReport] = useState<ReportResp | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [criticalItems, setCriticalItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const formatRupiah = (v = 0) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(v);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const [rRes, itemsRes] = await Promise.all([
          api.get("/reports/dashboard").then((r: any) => r.data).catch(() => null),
          api.get("/items").then((r: any) => r.data).catch(() => []),
        ]);

        let finalReport = rRes;
        if (!finalReport) {
          try {
            const pnl = await api.get("/reports/laba-rugi").then((r: any) => r.data);
            const cash = await api.get("/reports/arus-kas").then((r: any) => r.data);
            finalReport = { ...pnl, ...cash };
          } catch {
            finalReport = null;
          }
        }

        if (!mounted) return;
        setReport(finalReport);
        setItems(itemsRes);

        const crit = (itemsRes || []).filter(
          (it: Item) => it.is_trackable !== false && (it.current_stock ?? 0) < (it.min_stock ?? 10)
        );
        setCriticalItems(crit);
      } catch (err) {
        console.error("Gagal load dashboard data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  const safeReport = report ?? { laba_rugi: 0, total_kas_masuk: 0, monthly_revenue: [] };

  return (
    <div className="p-6">
      <h2 className={`mb-8 text-3xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
        Dashboard Koperasi KKP-ASTA
      </h2>

      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <DCard
          title="Laba Bersih"
          value={loading ? "Memuat..." : formatRupiah(safeReport.laba_rugi)}
          color={safeReport.laba_rugi! >= 0 ? "bg-green-600" : "bg-red-600"}
          icon={<TrendingUp />}
          className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
        />
        <DCard
          title="Total Kas Masuk"
          value={loading ? "Memuat..." : formatRupiah(safeReport.total_kas_masuk)}
          color="bg-blue-600"
          icon={<DollarSign />}
          className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
        />
        <DCard
          title="Item Stok Kritis"
          value={loading ? "Memuat..." : `${criticalItems.length} Item`}
          color={criticalItems.length > 0 ? "bg-red-500" : "bg-yellow-500"}
          icon={<AlertTriangle />}
          className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
        />
        <DCard
          title="Total Item Terdaftar"
          value={loading ? "Memuat..." : `${items.length}`}
          color="bg-indigo-500"
          icon={<Package />}
          className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
        <ChartCard
          title="Overview Kategori"
          subtitle="Distribusi pengeluaran & biaya"
          className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
        >
          <DonutChart donutSeries={[55, 25, 20]} />
        </ChartCard>

        <ChartCard
          title="Revenue Updates"
          subtitle="Pendapatan per bulan"
          className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
        >
          <ColumnAreaChart
            type="column"
            columnSeries={
              safeReport.monthly_revenue?.length
                ? [{ name: "Pendapatan", data: safeReport.monthly_revenue.map((v) => Math.round(v / 1000)) }]
                : undefined
            }
            height={200}
          />
        </ChartCard>

        <ChartCard
          title="Aktivitas Mingguan"
          subtitle="Ringkasan aktivitas harian"
          className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
        >
          <ColumnAreaChart type="area" gridSeries={[31, 40, 28, 51, 42, 109, 100]} height={200} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <ReportWidget
            pnlData={{
              total_penjualan: safeReport.monthly_revenue?.reduce((a, b) => a + b, 0) ?? 0,
              total_biaya: 0,
              laba_rugi: safeReport.laba_rugi ?? 0,
            }}
            cashData={{
              total_kas_masuk: safeReport.total_kas_masuk ?? 0,
              total_kas_keluar: 0,
              arus_kas: safeReport.total_kas_masuk ?? 0,
            }}
            timeframe="Bulan Ini"
            className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
          />

          <CriticalStockCard
            items={criticalItems}
            className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
          />
        </div>

        <RecentTransactionsCard />
      </div>
    </div>
  );
}
