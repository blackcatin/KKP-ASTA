import { useState, useEffect } from "react";

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

    const fetchReport = async () => {
        setLoading(true);
        setError(null);

        try {
            // laba rugi
            const pnlResponse = await fetch(`${apiUrl}/reports/laba-rugi?start_date=${startDate}&end_date=${endDate}`);
            // arus kas
            const cashResponse = await fetch(`${apiUrl}/reports/arus-kas?start_date=${startDate}&end_date=${endDate}`);

            if (!pnlResponse.ok || !cashResponse.ok) {
                throw new Error('Gagal memuat salah satu laporan, periksa data');
            }

            const pnlData = await pnlResponse.json();
            const cashData = await cashResponse.json();

            setReport({ ...pnlData, ...cashData }) // gabung data
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message || 'Server error');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    return (
        <div className="p-8 bg-white rounded-lg shadow">
            <h2 className="mb-6 text-2xl font-semibold">Laporan Keuangan</h2>

            <div className="flex p-3 mb-5 space-x-3 border rounded-lg bg-gray-50">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mulai Tanggal</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 mt-1 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Sampai Tanggal</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 mt-1 border rounded-md" />
                </div>
                <button onClick={fetchReport} disabled={loading} className="self-end px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Memuat...' : 'Tampilkan'}
                </button>
            </div>

            {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

            {report &&
                <div className="space-y-8">
                    {/* laba rugi */}
                    <div className="p-6 bg-white border rounded-lg shadow-sm">
                        <h3 className="pb-2 mb-4 text-xl font-semibold border-b">Laba Rugi</h3>
                        <div className="space-y-2">
                            <p className="flex justify-between">
                                <span>Total Penjualan</span>
                                <span className="font-medium text-green-600">Rp. {report.total_penjualan.toLocaleString('id-ID')}</span>
                            </p>
                            <p className="flex justify-between">
                                <span>Total Biaya(HPP, Gaji, Operasional)</span>
                                <span className="font-medium text-red-600">Rp. {report.total_biaya.toLocaleString('id-ID')}</span>
                            </p>
                            <div className="flex justify-between pt-2 mt-3 border-t">
                                <span className="text-lg font-bold">Laba Bersih:</span>
                                <span className={`text-lg font-bold ${report.laba_rugi >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    Rp {report.laba_rugi.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* laporan arus kas */}
                    <div className="p-6 bg-white border rounded-lg shadow-sm">
                        <h3 className="pb-2 mb-4 text-xl font-semibold border-b">Arus Kas</h3>
                        <div className="space-y-2">
                            <p className="flex justify-between">
                                <span>Kas Masuk (Penjualan, Lain-Lain):</span>
                                <span className="font-medium text-green-600">Rp {report.total_kas_masuk.toLocaleString('id-ID')}</span>
                            </p>
                            <p className="flex justify-between">
                                <span>Kas Keluar (Pembelian, Biaya, Gaji):</span>
                                <span className="font-medium text-red-600">Rp {report.total_kas_keluar.toLocaleString('id-ID')}</span>
                            </p>
                            <div className="flex justify-between pt-2 mt-3 border-t">
                                <span className="text-lg font-bold">Arus Kas Bersih:</span>
                                <span className={`text-lg font-bold ${report.laba_rugi >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    Rp {report.laba_rugi.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}