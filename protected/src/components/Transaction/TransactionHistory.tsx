import { Currency, Calendar, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "../Layout/Modal";
import TransactionForm from "./TransactionForm";

interface Transaction {
    id: number,
    description: string,
    amount: number,
    type_name: string,
    type_flow: string,
    created_at: number
}

export default function TransactionHistory() {
    const [transactions, setTransaction] = useState<Transaction[]>([]);
    const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`${apiUrl}/transactions`);

            if (!response.ok) throw new Error('Gagal memuat transaksi');
            const data = await response.json();

            setTransaction(data);
        } catch (error) {
            if (error instanceof Error) setError(error.message || "Server error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTransactions();
    }, []);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(value);

    const handleSuccess = () => {
        closeAddModal();
        fetchTransactions();
    }

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">Daftar Transaksi</h2>

            {loading && <p className="text-gray-500">Memuat data..</p>}
            {error && (
                <div className="p-4 mb-4 text-red-700 bg-red-300 border border-red-500 rounded-lg">
                    {error}
                </div>
            )}

            <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex flex-col items-center gap-2 mb-4 md:flex-row md: md:justify-between">
                    <input
                        type="text"
                        placeholder="Cari transaksi"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    // value={ }
                    // onChange={(e) => }
                    />
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-blue-700"
                        style={{
                            backgroundColor: "var(--color-secondary)",
                            color: "white",
                        }}
                    >
                        + Tambah Transaksi
                    </button>
                </div>

                {!loading && transactions.length === 0 && (
                    <p className="text-gray-500">Belum ada transaksi tercatat</p>
                )}

                {transactions.length > 0 && (
                    <div className="relative overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-gray-700 bg-gray-100">
                                <tr>
                                    <th className="p-3 border-b">Tanggal</th>
                                    <th className="p-3 border-b">Deskripsi</th>
                                    <th className="p-3 border-b">Tipe</th>
                                    <th className="p-3 text-right border-b">Nominal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((trx) => (
                                    <tr key={trx.id} className="hover:bg-gray-50">
                                        <td className="p-3 border-b">
                                            <Calendar size={14} className="inline mr-1 text-gray-500" />
                                            {new Date(trx.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="p-3 border-b">{trx.description || '-'}</td>
                                        <td className={`p-3 border-b font-medium ${trx.type_flow === 'masuk' ? 'text-green-700' : 'text-red-700'}`}>
                                            {trx.type_name}
                                        </td>
                                        <td className={`p-3 border-b text-right ${trx.type_flow === 'masuk' ? 'text-green-700' : 'text-red-700'}`}>
                                            {formatRupiah(trx.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>

            <Modal isOpen={isAddModalOpen} onClose={handleSuccess} title="Add transaction">
                <TransactionForm
                    currentTransaction={null}
                    onSuccess={handleSuccess}
                    onCancel={closeAddModal}
                />
            </Modal>
        </div>

    )
}