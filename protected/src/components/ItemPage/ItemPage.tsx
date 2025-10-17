import { useState, useEffect } from "react";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import Modal from "../Layout/Modal";
import DeleteModal from "../Layout/DeleteModal";
import ItemForm from "./ItemForm";

interface Item {
  id: number;
  item_name: string;
  category_id: number;
  category_name: string;
  current_stock: number;
  is_trackable: boolean;
}

interface Category {
  id: number;
  name: string;
}

type SortKey = "item_name" | "category_name" | "current_stock" | "is_trackable";
type SortOrder = "asc" | "desc";

export default function ItemPage() {
  const [itemList, setItemList] = useState<Item[]>([]);
  const [filteredList, setFilteredList] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [masterCategories, setMasterCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("item_name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const itemsPerPage = 8;
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchItems = async () => {
    try {
      const response = await fetch(`${apiUrl}/items`);
      if (!response.ok) throw new Error("Gagal mengambil daftar stok");
      const data = await response.json();
      setItemList(data);
      setFilteredList(data);
    } catch (error) {
      if (error instanceof Error) setError(error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${apiUrl}/categories`);
      if (!response.ok) throw new Error("Gagal mengambil daftar kategori");
      const data = await response.json();
      setMasterCategories(data);
    } catch (error) {
      if (error instanceof Error) setError(error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = itemList.filter((item) =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredList(filtered);
    setCurrentPage(1);
  }, [searchTerm, itemList]);

  const sortData = (data: Item[]) => {
    return [...data].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (typeof valA === "boolean" && typeof valB === "boolean") {
        return sortOrder === "asc"
          ? Number(valA) - Number(valB)
          : Number(valB) - Number(valA);
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return 0;
    });
  };

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedData = sortData(filteredList);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openDeleteModal = (item: Item) => {
    setCurrentItem(item);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setCurrentItem(null);
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (item: Item) => {
    setCurrentItem(item);
    setIsEditModalOpen(true);
  };

  const handleSuccess = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    closeDeleteModal();
    fetchItems();
  };

  const executeDelete = async () => {
    if (!currentItem) return;
    const itemId = currentItem.id;

    try {
      const response = await fetch(`${apiUrl}/items/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        closeDeleteModal();
        setItemList((prev) =>
          prev.filter((item) => item.id !== currentItem.id)
        );
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        throw new Error("Gagal menghapus item");
      }
    } catch (error) {
      console.error("Gagal menghapus item", error);
      setError("Server error");
    }
  };

  if (loading) return <div>Memuat daftar stok...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const SortIcon = ({ column }: { column: SortKey }) => (
    <ArrowUpDown
      size={16}
      className={`inline-block ml-1 transition-transform ${sortKey === column
        ? sortOrder === "asc"
          ? "rotate-180 text-blue-600"
          : "text-blue-600"
        : "text-gray-400"
        }`}
    />
  );

  return (
    <div className="p-4">
      <h2 className="mb-6 text-2xl font-bold">Manajemen Stok & Item</h2>

      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex flex-col gap-2 mb-4 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Cari item..."
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-blue-700"
            style={{
              backgroundColor: "var(--color-secondary)",
              color: "white",
            }}
          >
            + Tambah Item
          </button>
        </div>

        <div className="relative overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort("item_name")}
                  className="px-6 py-3 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    Nama Item <SortIcon column="item_name" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("category_name")}
                  className="px-6 py-3 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    Kategori <SortIcon column="category_name" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("current_stock")}
                  className="px-6 py-3 text-center cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center justify-center">
                    Stok <SortIcon column="current_stock" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("is_trackable")}
                  className="px-6 py-3 text-center cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center justify-center">
                    Terkendali <SortIcon column="is_trackable" />
                  </div>
                </th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr
                    key={item.id}
                    className="transition bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.item_name}
                    </td>
                    <td className="px-6 py-4">{item.category_name}</td>
                    <td className="px-6 py-4 text-center">
                      {item.current_stock}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 inline-flex text-xs font-semibold rounded-full ${item.is_trackable
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item.is_trackable ? "Ya" : "Tidak"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 italic text-center text-gray-500"
                  >
                    Tidak ada item ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Halaman {currentPage} dari {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        title="Konfirmasi penghapusan Item"
      >
        {currentItem && (
          <DeleteModal
            itemId={currentItem.id}
            itemName={currentItem.item_name}
            itemType="item inventaris"
            endpoint="items"
            onDelete={handleSuccess}
            onCancel={closeDeleteModal}
          />
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={handleSuccess} title="Edit Item">
        {currentItem && (
          <ItemForm
            currentItem={currentItem}
            masterCategories={masterCategories}
            onSuccess={handleSuccess}
            onCancel={closeDeleteModal}
          />
        )}
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={handleSuccess} title="Add Item">
        <ItemForm
          currentItem={null}
          masterCategories={masterCategories}
          onSuccess={handleSuccess}
          onCancel={closeAddModal}
        />
      </Modal>
    </div>
  );
}
