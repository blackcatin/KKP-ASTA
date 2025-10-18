import { useState, useEffect } from "react";
import api from "../../api";
import { Tag, FileText, Loader2,  X, Save, } from "lucide-react";

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
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white rounded-lg"
    >
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Nama Kategori
        </label>
        <div className="relative">
          <Tag className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Masukkan nama kategori"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Deskripsi
        </label>
        <div className="relative">
          <FileText className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Masukkan deskripsi kategori"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
          />
        </div>
      </div>
      <div className="flex justify-end pt-4 mt-6 space-x-3 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors duration-150 bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-400"
          style={{ color: "white" }}
        >
          <X className="w-4 h-4 mr-2" /> Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium 
          text-white bg-[var(--secondary)] hover:brightness-90 active:scale-[0.98]
          rounded-lg shadow-md focus:ring-2 focus:ring-offset-1 
          focus:ring-[var(--secondary)] transition-all duration-150 disabled:opacity-70"
          style={{ backgroundColor: "var(--color-secondary)", color: "white" }}
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
