// src/components/RecentTransactionsCard.tsx

import { Link } from 'react-router-dom';
import { Currency, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Transaction {
    id: number,
    description: string,
    amount: number,
    type_name: string,
    type_flow: string,
    created_at: number
}

export default function RecentTransactionsCard() {
    const [transactions, setTransaction] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`${apiUrl}/transactions?limit=5`);
            if (!response.ok) throw new Error('Gagal memuat transaksi terbaru');
            const data = await response.json();
            setTransaction(data);
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
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

    return (
        <div className="h-full p-5 bg-white shadow-md rounded-xl">
            <h3 className="pb-2 mb-4 text-xl font-semibold border-b">Aktivitas Terbaru</h3>

            {loading && <p className="text-gray-500">Memuat...</p>}

            {!loading && transactions.length === 0 && (
                <p className="text-gray-500">Belum ada transaksi tercatat.</p>
            )}

            <div className="space-y-3">
                {transactions.map((trx) => (
                    <div key={trx.id} className="flex items-center justify-between pb-2 border-b">
                        {/* Kiri: Deskripsi & Tanggal */}
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-800">{trx.description || '—'}</span>
                            <span className="text-xs text-gray-500">
                                <Calendar size={12} className="inline mr-1" />
                                {new Date(trx.created_at).toLocaleDateString('id-ID')}
                            </span>
                        </div>
                        {/* Kanan: Nominal & Flow */}
                        <span className={`font-semibold text-right text-sm 
                            ${trx.type_flow === 'masuk' ? 'text-green-700' : 'text-red-700'}`}
                        >
                            {formatRupiah(trx.amount)}
                            <p className="text-xs font-normal opacity-70">({trx.type_name})</p>
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-center">
                <Link to="/dashboard/transactions" className="text-sm text-blue-600 hover:underline">
                    Lihat Semua Transaksi →
                </Link>
            </div>
        </div>
    );
}