// src/components/ReportWidget.tsx
import { ArrowUp, ArrowDown, Info } from 'lucide-react';

interface ReportWidgetProps {
    pnlData: { total_penjualan: number; total_biaya: number; laba_rugi: number; };
    cashData: { total_kas_masuk: number; total_kas_keluar: number; arus_kas: number; };
    timeframe: string;
}

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);


export default function ReportWidget({ pnlData, cashData, timeframe }: ReportWidgetProps) {
    const isProfit = pnlData.laba_rugi >= 0;
    const pnlAmount = formatRupiah(pnlData.laba_rugi);
    const flowAmount = formatRupiah(cashData.arus_kas);

    return (
        <div className="h-full max-w-full p-4 bg-white shadow-sm rounded-xl md:p-6">
            <div className="flex justify-between mb-5">
                <div className="grid grid-cols-2 gap-4">
                    {/* Statistik 1: LABA BERSIH */}
                    <div>
                        <h5 className="inline-flex items-center mb-2 font-normal leading-none text-gray-500">
                            Laba Bersih ({timeframe})
                            <Info size={14} className="ml-1 text-gray-400 cursor-pointer hover:text-gray-900" />
                        </h5>
                        <p className={`text-2xl leading-none font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                            {pnlAmount}
                        </p>
                    </div>
                    {/* Statistik 2: ARUS KAS BERSIH */}
                    <div>
                        <h5 className="inline-flex items-center mb-2 font-normal leading-none text-gray-500">
                            Arus Kas Bersih ({timeframe})
                            <Info size={14} className="ml-1 text-gray-400 cursor-pointer hover:text-gray-900" />
                        </h5>
                        <p className={`text-2xl leading-none font-bold ${cashData.arus_kas >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {flowAmount}
                        </p>
                    </div>
                </div>
                {/* Dropdown Waktu (Diabaikan untuk React murni, gunakan filter dari parent) */}
            </div>

            {/* Detail Tambahan di bagian bawah */}
            <div className="grid grid-cols-2 items-center border-gray-200 border-t justify-between mt-2.5 pt-4">
                <div className="pt-2">
                    <p className="text-sm font-medium text-gray-500">Penjualan Kotor:</p>
                    <p className="font-bold text-green-600 text-md">{formatRupiah(pnlData.total_penjualan)}</p>
                </div>
                <div className="pt-2">
                    <p className="text-sm font-medium text-gray-500">Total Pengeluaran:</p>
                    <p className="font-bold text-red-600 text-md">{formatRupiah(pnlData.total_biaya)}</p>
                </div>
            </div>
        </div>
    );
}

// ... (KPICard component helpers) ...