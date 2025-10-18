import { useState, useEffect } from "react";
import api from "../../api";
import {
  Package,
  Boxes,
  Layers,
  Loader2,
  X,
  Save,
} from "lucide-react";

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

export default function ItemForm({
  currentItem,
  masterCategories,
  onSuccess,
  onCancel,
}: ItemProps) {
  const isEditing = !!currentItem;
  const [name, setName] = useState("");
  const [currentStock, setCurrentStock] = useState<number | string>("");
  const [categoryId, setCategoryId] = useState<number | string>("");
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
      setName("");
      setCategoryId("");
      setCurrentStock("");
      setIsTrackable(true);
    }
  }, [currentItem, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const finalCategoryId = typeof categoryId === "string" ? null : categoryId;
    if (!name || !finalCategoryId) {
      setError("Nama item dan Kategori wajib diisi.");
      setLoading(false);
      return;
    }

    const payload = {
      item_name: name,
      category_id: finalCategoryId,
      current_stock: isEditing
        ? currentItem?.current_stock
        : parseInt(currentStock as string) || 0,
      is_trackable: isTrackable,
    };

    try {
      if (isEditing && currentItem?.id) {
        await api.put(`/items/${currentItem.id}`, payload);
      } else {
        await api.post(`/items`, payload);
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
      className="p-2 bg-transparent border border-gray-200 shadow-sm md:p-4 dark:border-gray-700 rounded-xl"
    >
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Nama Item
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Contoh: Cat Tembok, Paku, dll"
              className="pl-10 bg-transparent border border-gray-300 text-gray-900 text-sm 
              rounded-lg focus:ring-[var(--secondary)] focus:border-[var(--secondary)] 
              block w-full p-2.5 dark:bg-transparent dark:border-gray-600 
              dark:placeholder-gray-400 dark:text-white"
            />
          </div>
        </div>

        {/* Kategori */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Kategori
          </label>
          <div className="relative">
            <Layers className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <select
              value={categoryId}
              onChange={(e) =>
                setCategoryId(parseInt(e.target.value) || "")
              }
              required
              className="pl-10 bg-transparent border border-gray-300 text-gray-900 text-sm 
              rounded-lg focus:ring-[var(--secondary)] focus:border-[var(--secondary)] 
              block w-full p-2.5 dark:bg-transparent dark:border-gray-600 
              dark:placeholder-gray-400 dark:text-white"
            >
              <option value="" disabled>
                Pilih kategori
              </option>
              {masterCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!isEditing && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Stok Awal
            </label>
            <div className="relative">
              <Boxes className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                required
                placeholder="Masukkan jumlah stok awal"
                className="pl-10 bg-transparent border border-gray-300 text-gray-900 text-sm 
                rounded-lg focus:ring-[var(--secondary)] focus:border-[var(--secondary)] 
                block w-full p-2.5 dark:bg-transparent dark:border-gray-600 
                dark:placeholder-gray-400 dark:text-white"
              />
            </div>
          </div>
        )}

        <div className="flex items-center mt-2 md:col-span-2">
          <input
            type="checkbox"
            id="trackable"
            checked={isTrackable}
            onChange={(e) => setIsTrackable(e.target.checked)}
            className="w-4 h-4 text-[var(--secondary)] bg-gray-100 border-gray-300 rounded focus:ring-[var(--secondary)]"
          />
          <label
            htmlFor="trackable"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Item ini stoknya terhitung (trackable)
          </label>
        </div>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-3 pt-4 mt-6 border-t">
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
