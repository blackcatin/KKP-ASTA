import { useEffect, useState } from "react";

// item yg akan dicatat
interface TransactionItem {
    itemId: number | null;
    quantity: number;
    price?: number;
}

// data master sebelumnya
interface MasterItem {
    id: number;
    item_name: string;
    category: string;
    current_stock: number;
}

export default function TransactionPage() {
    const [transactionType, setTransactionType] = useState('penjualan');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState<number | ''>('');
    const [items, setItems] = useState<TransactionItem[]>([{ itemId: null, quantity: 1 }]);

    const [masterItems, setMasterItems] = useState<MasterItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMasterItems = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/items');
            if (!response.ok) {
                throw new Error('Gagal menghubungkan dengan data item')
            }

            const data = await response.json();
            setMasterItems(data);
            setError(null);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        fetchMasterItems();
    }, []);

    const calculateTotalAmount = () => {
        if (transactionType !== 'penjualan' && transactionType !== 'pembelian') {
            return amount || 0;
        }
        return amount || 0;
    }

    const addItem = () => {
        setItems([...items, { itemId: null, quantity: 1 }]);
    }

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    }

    const handleItemChange = <q extends keyof TransactionItem>(
        // biar sesuai field
        index: number,
        field: q,
        value: TransactionItem[q]
    ) => {
        const newItems = items.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: value };
            }
            return item;
        })
        setItems(newItems);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Data transaksi siap dikirim', { transactionType, description, amount, items });

        const user_id = 1;
        if (!description || !user_id) {
            setError('Keterangan daan Id pengguna harus diisi');
            return;
        }

        // prepare payload
        const finalAmount = calculateTotalAmount();
        const finalItems = (transactionType === 'penjualan' || transactionType === 'pembelian')
            ? items.filter(items => items.itemId !== null) : [];

        // item-based tapi ga milih, batalkkan
        if ((transactionType === 'penjualan' || transactionType === 'pembelian') && finalItems.length === 0) {
            setError('Harap tambahkan minimal 1 item');
            return;
        }

        // isi payload
        const payload = {
            user_id: user_id,
            transactionType: transactionType,
            description: description,
            amount: finalAmount,
            items: finalItems,
        }

        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mencatat transaksi');
            }

            alert('Transaksi berhasil dicatat!');
            setItems([{ itemId: null, quantity: 1 }]);
            setDescription('');
            setAmount('');

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message || 'Server error');
            }
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div>Memuat data item</div>
    if (error) return <div className="text-red-600">Error: {error}</div>

    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
            <h2 className="mb-6 text-2xl font-bold">Pencatatan Transaksi</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* tipe transaksi */}
                <div>
                    <label className="block font-medium text-gray-700 text-l">Tipe Transaksi</label>
                    <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}
                        className="block w-full px-2 py-2 mt-1 border border-gray-300 rounded-md shadow-sm">
                        <option value="penjualan">Penjualan (Kas Masuk)</option>
                        <option value="pembelian">Pembelian (Stok Masuk / Biaya)</option>
                        <option value="biaya_operasional">Biaya Operasional</option>
                        <option value="gaji">Gaji</option>
                        <option value="pajak">Pajak</option>
                    </select>
                </div>

                {/* item (hanya untuk penjualan dan pembelian)*/}
                {(transactionType === 'penjualan' || transactionType === 'pembelian') && (
                    <div className="p-4 space-y-4 border rounded-md">
                        <h3 className="font-semibold text-gray-700">Daftar Item</h3>
                        {items.map((item, index) => (
                            <div className="flex items-center space-x-3" key={index}>
                                {/* input item */}
                                <select
                                    value={item.itemId || ''}
                                    onChange={(e) => handleItemChange(index, 'itemId', parseInt(e.target.value))}
                                    className="flex-1 px-3 py-2 border rounded-md">
                                    <option value="" disabled>Pilih item</option>
                                    {masterItems.map(mItem => (
                                        <option key={mItem.id} value={mItem.id}>{mItem.item_name}</option>
                                    ))}
                                </select>
                                {/* input kuantitas */}
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                    className="w-24 px-3 py-2 border rounded-md"
                                    placeholder="Qty"
                                    min='1'
                                />
                                {/* hapus baris */}
                                {items.length > 1 && (
                                    <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">
                                        Hapus
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addItem}>
                            + Tambah item
                        </button>
                    </div>
                )}

                {/* biaya/jumlah (muncul jika tidak ada item atau biaya operasional) */}
                {/* {((transactionType !== 'penjualan' && transactionType !== 'pembelian') || (items.length === 0)) && ( */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Jumlah Total (Rp)</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))}
                        className="block w-full px-3 py-1 mt-1 border rounded-md shadow-sm" placeholder="Contoh: 50000" />
                </div>
                {/* )} */}

                {/* keternagnan & submit */}
                <div>
                    <label className="block font-medium text-gray-700 text-l">Keterangan/Catatan Transaksi</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                        rows={4} className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm"></textarea>
                </div>

                <button type="submit" className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-800">
                    Catat Transaksi
                </button>
            </form>
        </div>
    )
}