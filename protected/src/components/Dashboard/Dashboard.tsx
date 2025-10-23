import DCard from "./DCard";
import RecentTransactionsCard from "./RecentTransactionCard";
import ReportWidget from "./ReportWidget";

export default function Dashboard() {
    return (
        <div>
            <div className="p-4">
                <h2 className="mb-8 text-3xl font-bold text-gray-800">Dashboard Utama</h2>

                {/* BARIS KPI CARDS (Dibuat Manual atau Diambil dari Report) */}
                <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Placeholder untuk Total Laba, Total Kas, dll. */}
                    <DCard title="Laba Bersih Bulan Ini" value="Rp 5.250.000" color="bg-green-500" />
                    <DCard title="Kas Bersih Hari Ini" value="Rp 850.000" color="bg-blue-500" />
                    <DCard title="Item Stok Kritis" value="3 Item" color="bg-red-500" />
                    <DCard title="Total Kategori" value="4" color="bg-indigo-500" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        {/* <ReportWidget

                        /> */}
                    </div>
                </div>

                {/* BARIS WIDGET UTAMA (Grid 2/3 vs 1/3) */}
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