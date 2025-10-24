import { useState, useEffect } from "react";
import api from "../../api";
import { Tag, FileText, Loader2, X, Save } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface Category {
  id: number;
  name: string;
  description: string;
}

interface CatProps {
  currentCat: Category | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CategoryForm({ currentCat, onSuccess, onCancel }: CatProps) {
  const { theme } = useTheme();
  const isEditing = !!currentCat;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && currentCat) {
      setName(currentCat.name);
      setDescription(currentCat.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [currentCat, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { name, description };

    try {
      if (isEditing && currentCat?.id) {
        await api.put(`/categories/${currentCat.id}`, payload);
      } else {
        await api.post(`/categories`, payload);
      }
      onSuccess();
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 rounded-lg p-4 transition-colors duration-300 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
      {error && (
        <div className={`p-3 text-sm border rounded-md ${theme === "dark" ? "bg-red-700 text-red-100 border-red-600" : "bg-red-100 text-red-700 border-red-300"}`}>
          {error}
        </div>
      )}

      <div>
        <label className={`block mb-1 text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
          Nama Kategori
        </label>
        <div className="relative">
          <Tag className={`absolute w-5 h-5 left-3 top-2.5 ${theme === "dark" ? "text-gray-400" : "text-gray-400"}`} />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Masukkan nama kategori"
            className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-colors duration-300
              ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
          />
        </div>
      </div>

      <div>
        <label className={`block mb-1 text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
          Deskripsi
        </label>
        <div className="relative">
          <FileText className={`absolute w-5 h-5 left-3 top-2.5 ${theme === "dark" ? "text-gray-400" : "text-gray-400"}`} />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Masukkan deskripsi kategori"
            className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-colors duration-300
              ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 mt-6 space-x-3 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg focus:ring-2 focus:ring-offset-1 transition-colors duration-150
            ${theme === "dark" ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400" : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400"}`}
        >
          <X className="w-4 h-4 mr-2" /> Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow-md transition-all duration-150 disabled:opacity-70
            ${theme === "dark" ? "bg-[var(--color-accent)] text-white hover:brightness-90 focus:ring-[var(--color-secondary)]" : "bg-[var(--color-accent)] text-white hover:brightness-90 focus:ring-[var(--color-accent)]"}`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> {isEditing ? "Perbarui" : "Simpan"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
