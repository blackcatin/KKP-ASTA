import { useEffect, useState } from 'react';

interface Item {
    id: number;
    item_name: string;
    category_name: string;
    current_stock: number;
    is_trackable: boolean;
}

interface EditFormProps {
    currentItem: Item;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function EditItemForm({ currentItem, onSuccess, onCancel }: EditFormProps) {
    const [itemName, setItemName] = useState(currentItem.item_name);
    const [categoryName, setCategoryName] = useState(currentItem.category_name);
    const [currentStock, setCurrentStock] = useState(currentItem.current_stock);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setItemName(currentItem.item_name);
        setCategoryName(currentItem.category_name);
        setCurrentStock(currentItem.current_stock);
    }, [currentItem]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const updateData = {
            item_name: itemName,
            category_name: categoryName,
            current_stock: currentStock,
        }

        try {
            const response = await fetch(`http://localhost:3000/api/items/${currentItem.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            })

            const data = await response.json();

            if (response.ok) {
                onSuccess();
            } else {
                setError(data.message || 'Gagal mengedit item');
            }
        } catch (error) {
            setError('Server error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-6'>
            {error && <div className='text-sm text-red-500'>{error}</div>}

            <div>
                <label className="block text-sm font-medium text-gray-700">Nama Item</label>
                <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500" required />
            </div>
            {/* <div>
                <label className="block text-sm font-medium text-gray-700">Stok saat ini</label>
                <input type="text" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500" required />
            </div> */}

            {/* action */}
            <div className="flex justify-end pt-2 mt-4 space-x-2 border-t">
                <button type="button" onClick={onCancel} className="px-3 py-1 text-gray-700 rounded-lg bg-amber-700 hover:bg-amber-600">
                    Batal
                </button>
                <button type="submit" disabled={loading} className="px-3 py-1 text-white bg-green-600 rounded-lg hover:bg-green-400 disabled:opacity-50">
                    {loading ? 'Menyimpan...' : 'Simpan akun'}
                </button>
            </div>
        </form>
    )
}
