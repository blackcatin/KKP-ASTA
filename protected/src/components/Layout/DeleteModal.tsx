import { useState } from "react";
import api from "../../api";

interface DeleteConfirmationProps {
    itemId: number;
    itemName: string;
    itemType: string;
    endpoint: string;
    onDelete: () => void;
    onCancel: () => void;
}

export default function DeleteModal({ itemId, itemName, itemType, endpoint, onDelete, onCancel }: DeleteConfirmationProps) {
    const [loading, setLoading] = useState(false);

    const handleDeleteClick = async () => {
        setLoading(true);

        try {
            await api.delete(`/${endpoint}/${itemId}`);

            onDelete();
        } catch (error) {
            console.error('Gagal menghapus', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4">
            <p className="mb-6 text-gray-700">
                Apakah Anda yakin ingin menghapus {itemType}, {itemName}?
            </p>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-3 py-1 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                    disabled={loading}
                >
                    Batal
                </button>
                <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="px-3 py-1 text-gray-200 bg-red-700 rounded-lg hover:bg-red-800"
                    disabled={loading}
                >
                    {loading ? 'Menghapus..' : 'Hapus'}
                </button>
            </div>
        </div>
    )
}