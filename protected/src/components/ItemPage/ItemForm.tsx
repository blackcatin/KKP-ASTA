import { useState, useEffect } from "react";
import api from "../../api";

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

        const finalCategoryId = typeof categoryId === 'string' ? null : categoryId;

        if (!name || !finalCategoryId) {
            setError('Nama item dan Kategori wajib diisi.');
            setLoading(false);
            return;
        }
        // untuk add
        const basePayload = {
            item_name: name,
            category_id: finalCategoryId,
            is_trackable: isTrackable,
        };
        // untuk edit
        const payload = isEditing
            ? basePayload
            : {
                ...basePayload,
                current_stock: parseInt(currentStock as string) || 0,
            };

        try {
            if (isEditing && currentItem?.id) {
                await api.put(`/items/${currentItem.id}`, payload);
            } else {
                await api.post(`/items`, basePayload);
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