import React from "react";
import { ArrowUp, ArrowDown, Info } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface ReportWidgetProps {
  pnlData: { total_penjualan: number; total_biaya: number; laba_rugi: number };
  cashData: { total_kas_masuk: number; total_kas_keluar: number; arus_kas: number };
  timeframe: string;
  className?: string;
}

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

export default function ReportWidget({ pnlData, cashData, timeframe, className }: ReportWidgetProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const isProfit = pnlData.laba_rugi >= 0;
  const isPositiveFlow = cashData.arus_kas >= 0;

  const cardBg = isDark ? "bg-gray-900" : "bg-white";
  const cardBorder = isDark ? "border-gray-800" : "border-gray-200";
  const textPrimary = isDark ? "text-gray-100" : "text-gray-800";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const borderDivider = isDark ? "border-gray-700" : "border-gray-200";
  const smallCardBg = isDark ? "bg-gray-800" : "bg-gray-50";

  return (
    <div
      className={`p-6 rounded-2xl shadow-md border ${cardBorder} ${cardBg} transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl ${className ?? ""}`}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className={`text-lg font-semibold ${textPrimary}`}>Ringkasan Laporan ({timeframe})</h2>
        <Info size={18} className={`cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 ${textSecondary}`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
        <div className={`p-4 rounded-xl ${smallCardBg}`}>
          <h5 className={`mb-2 text-sm font-medium ${textSecondary}`}>Laba Bersih</h5>
          <div className="flex items-center gap-2">
            <p className={`text-2xl font-bold ${isProfit ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
              {formatRupiah(pnlData.laba_rugi)}
            </p>
            {isProfit ? <ArrowUp className="text-green-500 dark:text-green-400" size={20} /> : <ArrowDown className="text-red-500 dark:text-red-400" size={20} />}
          </div>
        </div>

        <div className={`p-4 rounded-xl ${smallCardBg}`}>
          <h5 className={`mb-2 text-sm font-medium ${textSecondary}`}>Arus Kas Bersih</h5>
          <div className="flex items-center gap-2">
            <p className={`text-2xl font-bold ${isPositiveFlow ? "text-blue-600 dark:text-blue-400" : "text-red-500 dark:text-red-400"}`}>
              {formatRupiah(cashData.arus_kas)}
            </p>
            {isPositiveFlow ? <ArrowUp className="text-blue-500 dark:text-blue-400" size={20} /> : <ArrowDown className="text-red-500 dark:text-red-400" size={20} />}
          </div>
        </div>
      </div>

      <div className={`border-t my-4 ${borderDivider}`}></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className={`text-sm font-medium ${textSecondary}`}>Penjualan Kotor:</p>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">{formatRupiah(pnlData.total_penjualan)}</p>
        </div>
        <div className="space-y-1">
          <p className={`text-sm font-medium ${textSecondary}`}>Total Pengeluaran:</p>
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">{formatRupiah(pnlData.total_biaya)}</p>
        </div>
      </div>
    </div>
  );
}
