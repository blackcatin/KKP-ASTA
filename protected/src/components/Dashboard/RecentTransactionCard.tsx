import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type_name: string;
  type_flow: string;
  created_at: number;
}

export default function RecentTransactionsCard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [transactions, setTransaction] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${apiUrl}/transactions?limit=5`);
      if (!response.ok) throw new Error("Gagal memuat transaksi terbaru");
      const data = await response.json();
      setTransaction(data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

  const formatDate = (timestamp: number) => {
    const date = timestamp < 1e12 ? new Date(timestamp * 1000) : new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-100";
  const headerText = isDark ? "text-gray-100" : "text-gray-800";
  const subText = isDark ? "text-gray-400" : "text-gray-500";

  return (
    <div
      className={`h-full p-6 ${cardBg} shadow-xl rounded-2xl border ${borderColor} transition-all duration-300 transform hover:scale-105 hover:shadow-2xl`}
    >
      <h3 className={`pb-3 mb-4 text-xl font-semibold ${headerText} border-b ${borderColor}`}>
        Aktivitas Terbaru
      </h3>

      {loading && (
        <div className="space-y-4 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center py-3">
              <div className="w-2/3">
                <div className={`h-4 rounded-md animate-pulse mb-1 ${isDark ? "bg-gray-700" : "bg-gray-200"} w-3/4`} />
                <div className={`w-1/4 h-3 rounded-md animate-pulse ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
              </div>
              <div className={`w-20 h-5 rounded-md animate-pulse ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
            </div>
          ))}
        </div>
      )}

      {!loading && transactions.length === 0 && (
        <div className={`${subText} text-center py-10`}>
          <p className="mb-2">📋</p>
          <p className="text-sm">Belum ada transaksi tercatat.</p>
        </div>
      )}

      <div className="space-y-3">
        {transactions.map((trx) => {
          const isIncome = trx.type_flow === "masuk";
          const trxBg = isIncome
            ? isDark
              ? "bg-green-500/10"
              : "bg-green-50"
            : isDark
            ? "bg-red-500/10"
            : "bg-red-50";

          const trxText = isIncome
            ? isDark
              ? "text-green-400"
              : "text-green-600"
            : isDark
            ? "text-red-400"
            : "text-red-600";

          const border = isIncome ? "border-green-500" : "border-red-500";

          return (
            <div
              key={trx.id}
              className={`
                flex items-center justify-between p-3 rounded-xl border-l-4 ${border} ${trxBg}
                transition-all duration-200 cursor-pointer transform
                hover:shadow-md hover:translate-x-1 hover:bg-opacity-30
              `}
            >
              <div className="flex flex-col flex-grow">
                <span className={`font-semibold text-sm ${headerText}`}>{trx.description || `Transaksi ${isIncome ? "Masuk" : "Keluar"}`}</span>
                <div className={`text-xs flex items-center gap-2 mt-1 ${subText}`}>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="opacity-70" />
                    {formatDate(trx.created_at)}
                  </span>
                  <span className={`font-medium px-2 py-0.5 rounded-full text-[10px] uppercase ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-500"}`}>
                    {trx.type_name}
                  </span>
                </div>
              </div>

              <div className="text-right ml-4 flex-shrink-0">
                <div className={`flex items-center justify-end gap-1 font-bold text-base ${trxText}`}>
                  {isIncome ? <ArrowUpCircle size={18} className="opacity-90" /> : <ArrowDownCircle size={18} className="opacity-90" />}
                  {formatRupiah(trx.amount)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/dashboard/transaction"
          className={`text-sm font-medium hover:underline transition-colors ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"}`}
        >
          Lihat Semua Transaksi &rarr;
        </Link>
      </div>
    </div>
  );
}
