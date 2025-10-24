import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, Calendar } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface CashFlowData {
    total_kas_masuk: number;
    total_kas_keluar: number;
    arus_kas: number;
}
interface ReportData {
    budget: { category_name: string; total_pengeluaran: number }[];
    cash: CashFlowData[];
}

export default function ReportPage() {
    const { theme } = useTheme();
    const [report, setReport] = useState<ReportData | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

    const fetchReport = async () => {
        setLoading(true);
        setError(null);

        try {
            const [budgetResponse, cashResponse] = await Promise.all([
                fetch(`${apiUrl}/reports/realisasi-anggaran?start_date=${startDate}&end_date=${endDate}`),
                fetch(`${apiUrl}/reports/arus-kas?start_date=${startDate}&end_date=${endDate}`)
            ]);

            if (!budgetResponse.ok || !cashResponse.ok) {
                throw new Error('Gagal memuat laporan');
            }

            const budgetData = await budgetResponse.json();
            const cashData = await cashResponse.json();

            setReport({ budget: budgetData, cash: cashData })
        } catch (error) {
            if (error instanceof Error) setError(error.message || "Server error");
        } finally {
            setLoading(false);
        }
    }

    const cashSummary = report?.cash
        ? (Array.isArray(report.cash) ? report.cash[0] : report.cash)
        : { total_kas_masuk: 0, total_kas_keluar: 0, arus_kas: 0 }

    useEffect(() => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1)
            .toISOString().split('T')[0];
        const end = today.toISOString().split('T')[0];

        setStartDate(start);
        setEndDate(end);
    }, []);

    useEffect(() => {
        if (startDate && endDate) fetchReport();
    }, [startDate, endDate]);

    return (
        <div className={`min-h-screen p-8 transition-colors duration-300
            ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
            <h2 className={`flex items-center gap-2 mb-6 text-3xl font-bold transition-colors duration-300
                ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>
                Laporan Transaksi
            </h2>

            <div className={`flex flex-wrap items-end gap-4 p-4 mb-6 transition-colors duration-300
                ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"} rounded-xl shadow-sm`}>
                <div className="flex items-center gap-2">
                    <Calendar className="text-gray-400 dark:text-gray-300" size={18} />
                    <div>
                        <label className={`block text-xs transition-colors duration-300
                            ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            Mulai
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className={`p-2 mt-1 border rounded-lg transition-colors duration-300
                                ${theme === "dark"
                                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)]"
                                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)]"}`}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Calendar className="text-gray-400 dark:text-gray-300" size={18} />
                    <div>
                        <label className={`block text-xs transition-colors duration-300
                            ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            Sampai
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className={`p-2 mt-1 border rounded-lg transition-colors duration-300
                                ${theme === "dark"
                                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)]"
                                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)]"}`}
                        />
                    </div>
                </div>

                <button
                    onClick={fetchReport}
                    disabled={loading}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors duration-300
                        ${theme === "dark" ? "bg-[var(--color-netral)] text-white hover:brightness-110 disabled:opacity-50"
                            : "bg-[var(--color-secondary)] text-white hover:brightness-90 disabled:opacity-50"}`}
                >
                    {loading ? 'Memuat...' : 'Tampilkan'}
                </button>
            </div>

            {!loading && !report && !error && (
                <div className={`p-4 mb-4 border rounded-lg transition-colors duration-300
                    ${theme === "dark" ? "bg-gray-700 text-gray-200 border-gray-600" : "bg-red-100 text-red-700 border-red-300"}`}>
                    Tidak ada data dalam periode ini.
                </div>
            )}

            {error && (
                <div className={`p-4 mb-4 border rounded-lg transition-colors duration-300
                    ${theme === "dark" ? "bg-gray-700 text-red-300 border-gray-600" : "bg-red-100 text-red-700 border-red-300"}`}>
                    {error}
                </div>
            )}

            {report && (
                <div className="grid gap-8 md:grid-cols-2">

                    {/* Kolom 1: Realisasi Pengeluaran */}
                    <div className={`p-6 transition-colors duration-300 rounded-xl border shadow-sm hover:shadow-md
                        ${theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-900"}`}>
                        <div className="flex items-center gap-2 pb-2 mb-4 border-b">
                            <TrendingUp className="text-green-600" />
                            <h3 className="text-xl font-semibold">Realisasi Pengeluaran (Per Kategori)</h3>
                        </div>
                        <div className="space-y-2">
                            {/* PERBAIKAN: Gunakan report.budget (Array) */}
                            {report.budget.map((item, index) => (
                                <div key={index} className="flex justify-between pb-1 border-b border-dashed">
                                    <span>{item.category_name}</span>
                                    <span className="font-medium text-red-600">{formatRupiah(item.total_pengeluaran)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Kolom 2: Arus Kas */}
                    <div className={`p-6 transition-colors duration-300 rounded-xl border shadow-sm hover:shadow-md
                        ${theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-900"}`}>
                        {/* ... (Header Arus Kas) ... */}
                        <div className="space-y-2">
                            <p className="flex justify-between">
                                <span>Kas Masuk (Pemasukan, Lain-Lain):</span>
                                {/* PERBAIKAN: Gunakan cashSummary */}
                                <span className="font-medium text-green-600">{formatRupiah(cashSummary.total_kas_masuk)}</span>
                            </p>
                            <p className="flex justify-between">
                                <span>Kas Keluar (Pembelian, Biaya, Gaji):</span>
                                {/* PERBAIKAN: Gunakan cashSummary */}
                                <span className="font-medium text-red-600">{formatRupiah(cashSummary.total_kas_keluar)}</span>
                            </p>
                            <div className="flex justify-between pt-3 mt-4 font-semibold border-t">
                                <span>Arus Kas Bersih:</span>
                                {/* PERBAIKAN: Gunakan cashSummary */}
                                <span className={`text-lg ${cashSummary.arus_kas >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    {formatRupiah(cashSummary.arus_kas)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
