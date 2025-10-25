import { useState } from "react";
import api from "../../api";
import { useTheme } from "../../context/ThemeContext";

interface DeleteConfirmationProps {
    itemId: number;
    itemName: string;
    itemType: string;
    endpoint: string;
    onDelete: () => void;
    onCancel: () => void;
}

export default function DeleteModal({ itemId, itemName, itemType, endpoint, onDelete, onCancel }: DeleteConfirmationProps) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [loading, setLoading] = useState(false);

    const handleDeleteClick = async () => {
        setLoading(true);
        try {
            await api.delete(`/${endpoint}/${itemId}`);
            onDelete();
        } catch (error) {
            console.error("Gagal menghapus", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`p-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            <p className="mb-6">
                Apakah Anda yakin ingin menghapus {itemType}, {itemName}?
            </p>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className={`
                        px-3 py-1 rounded-lg 
                        ${isDark 
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }
                    `}
                    disabled={loading}
                >
                    Batal
                </button>

                <button
                    type="button"
                    onClick={handleDeleteClick}
                    className={`
                        px-3 py-1 rounded-lg 
                        ${isDark 
                            ? "bg-red-600 text-gray-100 hover:bg-red-500" 
                            : "bg-red-700 text-gray-200 hover:bg-red-800"
                        }
                    `}
                    disabled={loading}
                >
                    {loading ? "Menghapus.." : "Hapus"}
                </button>
            </div>
        </div>
    );
}
