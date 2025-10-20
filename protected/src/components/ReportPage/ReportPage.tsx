import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";

interface ReportData {
    total_penjualan: number;
    total_biaya: number;
    laba_rugi: number;
    total_kas_masuk: number;
    total_kas_keluar: number;
    arus_kas: number;
}

export default function ReportPage() {
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
            const [pnlResponse, cashResponse] = await Promise.all([
                fetch(`${apiUrl}/reports/laba-rugi?start_date=${startDate}&end_date=${endDate}`),
                fetch(`${apiUrl}/reports/arus-kas?start_date=${startDate}&end_date=${endDate}`)
            ])

            if (!pnlResponse.ok || !cashResponse.ok) throw new Error('Gagal memuat salah satu laporan');

            const pnlData = await pnlResponse.json();
            const cashData = await cashResponse.json();

            setReport({ ...pnlData, ...cashData });
        } catch (error) {
            if (error instanceof Error) setError(error.message || 'Server error');
        } finally {
            setLoading(false);
        }
    };

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
        <div className="min-h-screen p-8 bg-gray-50">
            <h2 className="flex items-center gap-2 mb-6 text-3xl font-bold text-gray-800">
                Laporan Transaksi
            </h2>

            <div className="flex flex-wrap items-end gap-4 p-4 mb-6 bg-white border shadow-sm rounded-xl">
                <div className="flex items-center gap-2">
                    <Calendar className="text-gray-500" size={18} />
                    <div>
                        <label className="block text-xs text-gray-600">Mulai</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="text-gray-500" size={18} />
                    <div>
                        <label className="block text-xs text-gray-600">Sampai</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>
                <button
                    onClick={fetchReport}
                    disabled={loading}
                    className="px-5 py-2 text-sm font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    style={{ backgroundColor: "var(--color-secondary)", color: "white" }}
                >
                    {loading ? 'Memuat...' : 'Tampilkan'}
                </button>
            </div>

            {!loading && !report && !error && (
                <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-300 rounded-lg">
                    Tidak ada data dalam periode ini.
                </div>
            )}

            {error && (
                <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-300 rounded-lg">
                    {error}
                </div>
            )}

            {report && (
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="p-6 transition bg-white border shadow-sm rounded-xl hover:shadow-md">
                        <div className="flex items-center gap-2 pb-2 mb-4 border-b">
                            <TrendingUp className="text-green-600" />
                            <h3 className="text-xl font-semibold text-gray-800">Laba Rugi</h3>
                        </div>
                        <div className="space-y-2 text-gray-700">
                            <p className="flex justify-between">
                                <span>Total Penjualan:</span>
                                <span className="font-medium text-green-600">{formatRupiah(report.total_penjualan)}</span>
                            </p>
                            <p className="flex justify-between">
                                <span>Total Biaya (HPP, Gaji, Operasional):</span>
                                <span className="font-medium text-red-600">{formatRupiah(report.total_biaya)}</span>
                            </p>
                            <div className="flex justify-between pt-3 mt-4 font-semibold border-t">
                                <span>Laba Bersih:</span>
                                <span className={`text-lg ${report.laba_rugi >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    {formatRupiah(report.laba_rugi)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 transition bg-white border shadow-sm rounded-xl hover:shadow-md">
                        <div className="flex items-center gap-2 pb-2 mb-4 border-b">
                            <DollarSign className="text-yellow-600" />
                            <h3 className="text-xl font-semibold text-gray-800">Arus Kas</h3>
                        </div>
                        <div className="space-y-2 text-gray-700">
                            <p className="flex justify-between">
                                <span>Kas Masuk (Pemasukan, Lain-Lain):</span>
                                <span className="font-medium text-green-600">{formatRupiah(report.total_kas_masuk)}</span>
                            </p>
                            <p className="flex justify-between">
                                <span>Kas Keluar (Pembelian, Biaya, Gaji):</span>
                                <span className="font-medium text-red-600">{formatRupiah(report.total_kas_keluar)}</span>
                            </p>
                            <div className="flex justify-between pt-3 mt-4 font-semibold border-t">
                                <span>Arus Kas Bersih:</span>
                                <span className={`text-lg ${report.arus_kas >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    {formatRupiah(report.arus_kas)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
