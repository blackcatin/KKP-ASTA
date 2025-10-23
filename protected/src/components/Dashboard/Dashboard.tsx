import { useEffect, useState } from "react";
import DCard from "./DCard";
import RecentTransactionsCard from "./RecentTransactionCard";
import ReportWidget from "./ReportWidget";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";

interface ReportData {
    total_penjualan: number;
    total_biaya: number;
    laba_rugi: number;
    arus_kas: number;
    total_kas_masuk: number;
}

export default function Dashboard() {

    const [report, setReport] = useState<ReportData | null>(null);
    const [itemCount, setItemCount] = useState(0);
    const [criticalStockCount, setCriticalStockCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

    // Fungsi fetch utama
    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // 1. Ambil Laporan Keuangan (Arus Kas dan Laba Rugi Bulan Ini)
            const pnlResponse = await fetch(`${apiUrl}/reports/laba-rugi`);
            const cashResponse = await fetch(`${apiUrl}/reports/arus-kas`);
            const itemResponse = await fetch(`${apiUrl}/items`);

            const pnlData = await pnlResponse.json();
            const cashData = await cashResponse.json();
            const itemData = await itemResponse.json();

            setReport({ ...pnlData, ...cashData });

            // 2. Hitung Stok Kritis (Contoh: stok di bawah 10)
            const criticalItems = itemData.filter(item => item.current_stock < 10 && item.is_trackable);
            setCriticalStockCount(criticalItems.length);
            setItemCount(itemData.length);

        } catch (error) {
            console.error("Gagal memuat data dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Placeholder data jika loading
    const defaultReport = report || { laba_rugi: 0, arus_kas: 0, total_kas_masuk: 0, total_biaya: 0 };
    return (
        <div>
            <div className="p-4">
                <h2 className="mb-8 text-3xl font-bold text-gray-800">Dashboard Utama</h2>


                <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">

                    {/* 1. Laba Bersih */}
                    <DCard
                        title="Laba Bersih"
                        value={loading ? 'Memuat...' : formatRupiah(defaultReport.laba_rugi)}
                        color={defaultReport.laba_rugi >= 0 ? 'bg-green-600' : 'bg-red-600'}
                        icon={<TrendingUp />}
                    />

                    {/* 2. Kas Masuk */}
                    <DCard
                        title="Total Kas Masuk"
                        value={loading ? 'Memuat...' : formatRupiah(defaultReport.total_kas_masuk)}
                        color="bg-blue-600"
                        icon={<DollarSign />}
                    />

                    {/* 3. Stok Kritis */}
                    <DCard
                        title="Item Stok Kritis"
                        value={loading ? 'Memuat...' : `${criticalStockCount} Item`}
                        color={criticalStockCount > 0 ? 'bg-red-500' : 'bg-yellow-500'}
                        icon={<AlertTriangle />}
                    />

                    {/* 4. Total Kategori */}
                    <DCard
                        title="Total Item Terdaftar"
                        value={loading ? 'Memuat...' : `${itemCount}`}
                        color="bg-indigo-500"
                        icon={<Package />}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        {/* <ReportWidget

                        /> */}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Kolom Kiri: WIDGET TRANSAKSI BARU (2/3 Lebar) */}
                    <div className="lg:col-span-2">
                        <RecentTransactionsCard /> {/* Menggunakan komponen yang sudah dimodifikasi */}
                    </div>

                    {/* Kolom Kanan: WIDGET STOK KRITIS (1/3 Lebar) */}
                    <div className="p-6 bg-white shadow-md lg:col-span-1 rounded-xl">
                        <h3 className="pb-2 mb-4 text-xl font-semibold border-b">Peringatan Stok Rendah</h3>
                        {/* Placeholder untuk list item dengan stok rendah */}
                        <p className="text-gray-500">List stok kritis akan muncul di sini.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}   