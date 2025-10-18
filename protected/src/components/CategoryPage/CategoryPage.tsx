import { useState, useEffect } from "react";
import { Search, ArrowUpDown, Plus, Pencil, Trash2 } from "lucide-react";
import Modal from "../Layout/Modal";
import DeleteModal from "../Layout/DeleteModal";
import CategoryForm from "./CategoryForm";

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function CategoryPage() {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCat, setCurrentCat] = useState<Category | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Category; direction: "asc" | "desc" } | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${apiUrl}/categories`);
      if (!response.ok) throw new Error("Gagal mengambil data");
      const data = await response.json();
      setCategoryList(data);
    } catch (error) {
      if (error instanceof Error) setError(error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setCurrentCat(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setCurrentCat(category);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setCurrentCat(category);
    setIsDeleteOpen(true);
  };

  const closeAddModal = () => setIsAddModalOpen(false);
  const closeEditModal = () => setIsEditModalOpen(false);
  const closeDeleteModal = () => setIsDeleteOpen(false);

  const handleSuccess = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteOpen(false);
    fetchCategories();
  };

  const filteredCategories = categoryList.filter((cat) => {
    const name = cat.name?.toLowerCase() || "";
    const desc = cat.description?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return name.includes(term) || desc.includes(term);
  });

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Category) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  if (loading) return <div>Memuat daftar kategori...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Kategori</h2>
      </div>

      {deleteError && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
          <strong>Gagal: {deleteError}</strong>
        </div>
      )}

      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
          />
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          style={{ backgroundColor: "var(--color-secondary)", color: "white" }}
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Nama
                  <ArrowUpDown className="w-4 h-4 text-gray-400" />
                </div>
              </th>
              <th
                className="px-6 py-3 cursor-pointer select-none"
                onClick={() => handleSort("description")}
              >
                <div className="flex items-center gap-1">
                  Deskripsi
                  <ArrowUpDown className="w-4 h-4 text-gray-400" />
                </div>
              </th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sortedCategories.length > 0 ? (
              sortedCategories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                  <td className="px-6 py-4">{category.description}</td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(category)}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(category)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-500">
                  Tidak ada kategori ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={closeAddModal} title="Tambah Kategori">
        <CategoryForm
          currentCat={null}
          onSuccess={handleSuccess}
          onCancel={closeAddModal}
        />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Edit Kategori">
        {currentCat && (
          <CategoryForm
            currentCat={currentCat}
            onSuccess={handleSuccess}
            onCancel={closeEditModal}
          />
        )}
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Hapus Kategori">
        {currentCat && (
          <DeleteModal
            itemId={currentCat.id}
            itemName={currentCat.name}
            itemType="kategori"
            endpoint="categories"
            onDelete={handleSuccess}
            onCancel={closeDeleteModal}
          />
        )}
      </Modal>
    </div>
  );
}
