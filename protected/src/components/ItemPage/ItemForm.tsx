import { useState, useEffect } from "react";

interface Item {
    id: number;
    item_name: string;
    category_id: number;
    current_stock: number;
    is_trackable: boolean;
}

interface Category {
    id: number;
    name: string;
}

interface ItemProps {
    currentItem: Item | null;
    masterCategories: Category[];
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ItemForm({ currentItem, masterCategories, onSuccess, onCancel }: ItemProps) {
    const isEditing = !!currentItem;
    const [name, setName] = useState('');
    const [currentStock, setCurrentStock] = useState<number | string>('');
    const [categoryId, setCategoryId] = useState<number | string>('');
    const [isTrackable, setIsTrackable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditing && currentItem) {
            setName(currentItem.item_name);
            setCategoryId(currentItem.category_id);
            setCurrentStock(currentItem.current_stock);
            setIsTrackable(currentItem.is_trackable);
        } else {
            // add mode
            setName('');
            setCategoryId('');
            setIsTrackable(true);
        }
    }, [currentItem, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const finalStock = (typeof currentStock === 'string') ? parseInt(currentStock) || 0 : currentStock;
        const method = isEditing ? 'PUT' : 'POST';
        const url = `http://localhost:3000/api/items${isEditing ? `/${currentItem?.id}` : ''}`;

        const payload = {
            item_name: name,
            category_id: typeof categoryId === 'string' ? null : categoryId,
            current_stock: isEditing ? currentItem?.current_stock : finalStock,
            is_trackable: isTrackable,
            ...(!isEditing && { current_stock: parseInt(currentStock as string) || 0 }),
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menyimpan item')
            }
            onSuccess();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message || 'Server error');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nama Item</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <select value={categoryId} onChange={(e) => setCategoryId(parseInt(e.target.value) || '')} required>
                    <option value="" disabled>Pilih Kategori</option>
                    {masterCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>
            {
                !isEditing && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stok terkini</label>
                        <input type="number" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} required />
                    </div>
                )
            }

            <div>
                <input type="checkbox" checked={isTrackable} onChange={(e) => setIsTrackable(e.target.checked)} />
                <label className="ml-2 text-sm font-medium text-gray-700">Stok Terhitung</label>
            </div>

            <div className="flex justify-end pt-2 mt-4 space-x-2 border-t">
                <button type="button" onClick={onCancel}>Batal</button>
                <button type="submit" disabled={loading}>{loading ? 'Menyimpan' : 'Simpan'}</button>
            </div>
        </form>
    )
}