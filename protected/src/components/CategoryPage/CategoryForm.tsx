import { useState, useEffect } from "react";
import api from "../../api";

interface Category {
    id: number;
    name: string;
    description: string
}

interface CatProps {
    currentCat: Category | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function CategoryForm({ currentCat, onSuccess, onCancel }: CatProps) {
    const isEditing = !!currentCat;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditing && currentCat) {
            setName(currentCat.name);
            setDescription(currentCat.description || '');
        } else {
            // add mode
            setName('');
            setDescription('');
        }
    }, [currentCat, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            name: name,
            description: description,
        };

        try {
            if (isEditing && currentCat?.id) {
                await api.put(`/categories/${currentCat.id}`, payload);
            } else {
                await api.post(`/categories`, payload);
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
                <label className="block text-sm font-medium text-gray-700">Nama Kategori</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div className="flex justify-end pt-2 mt-4 space-x-2 border-t">
                <button type="button" onClick={onCancel}>Batal</button>
                <button type="submit" disabled={loading}>{loading ? 'Menyimpan' : 'Simpan'}</button>
            </div>
        </form>
    )
}