import { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  ArrowUpDown,
  Search,
  ListFilter,
  Plus, 
  ChevronLeft, 
  ChevronRight, 
} from "lucide-react";
import Modal from "../Layout/Modal";
import DeleteModal from "../Layout/DeleteModal";
import ItemForm from "./ItemForm";
import { useTheme } from "../../context/ThemeContext";

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
  const { theme } = useTheme();

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
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("item_name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const role = localStorage.getItem("role");
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/items`);
      if (!response.ok) throw new Error("Gagal mengambil daftar stok");
      const data = await response.json();
      setItemList(data);
      setFilteredList(data);
      setError(null);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
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
      if (error instanceof Error) setError(error.message);
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
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
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
  const totalPages = Math.ceil(sortedData.length / entriesPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
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

  if (loading) return <div>Memuat daftar stok...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const SortIcon = ({ column }: { column: SortKey }) => (
    <ArrowUpDown
      size={16}
      className={`inline-block ml-1 transition-transform ${
        sortKey === column
          ? sortOrder === "asc"
            ? "rotate-180 text-[var(--color-secondary)]"
            : "text-[var(--color-secondary)]"
          : "text-gray-400 dark:text-gray-500"
      }`}
    />
  );

  return (
    <div className={`min-h-full transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <h2 className={`mb-6 text-2xl font-bold transition-colors duration-300 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
        Kelola Item 
      </h2>

      <div className={`p-5 rounded-lg shadow transition-colors duration-300 ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
        <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row"> 
          <div className="flex items-center w-full gap-2 md:w-auto"> 
            <div className="relative w-full md:w-60">
              <Search size={16} className="absolute text-gray-400 dark:text-gray-500 transform -translate-y-1/2 left-3 top-1/2"/>
              <input
                type="text"
                placeholder="Cari item..."
                className={`w-full px-8 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]
                    ${theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 border rounded-lg text-sm ${
              theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-100" : "border-gray-300 bg-gray-50 text-gray-700"
            }`}>
              <ListFilter size={16} className={`${theme === "dark" ? "text-gray-300" : "text-gray-500"}`} />
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className={`bg-transparent border-none focus:outline-none cursor-pointer ${
                  theme === "dark" ? "bg-gray-700 text-gray-100" : "bg-gray-50 text-gray-900"
                }`}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n} className={theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center w-full justify-center md:w-auto gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition shadow-md"
            style={{ backgroundColor: "var(--color-secondary)" }}
          >
            <Plus className="w-4 h-4" /> Tambah Item 
          </button>
        </div>


        <div
            className={`relative overflow-x-auto border rounded-lg transition-colors duration-300 
                ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
        >
          <table
            className={`w-full text-sm text-left transition-colors duration-300 ${
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}
          >
            <thead
              className={`uppercase transition-colors duration-300 ${
                theme === "dark" ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-700"
              }`} 
            >
              <tr>
                <th
                  onClick={() => handleSort("item_name")}
                  className={`px-6 py-3 cursor-pointer select-none whitespace-nowrap transition-colors duration-200 ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                >
                  <div className="flex items-center gap-1">Nama Item <SortIcon column="item_name"/></div>
                </th>
                <th
                  onClick={() => handleSort("category_name")}
                  className={`px-6 py-3 cursor-pointer select-none whitespace-nowrap transition-colors duration-200 ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                >
                  <div className="flex items-center gap-1">Kategori <SortIcon column="category_name"/></div>
                </th>
                <th
                  onClick={() => handleSort("current_stock")}
                  className={`px-6 py-3 cursor-pointer select-none whitespace-nowrap transition-colors duration-200 text-center ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                >
                  <div className="flex items-center justify-center gap-1">Stok <SortIcon column="current_stock"/></div>
                </th>
                <th
                  onClick={() => handleSort("is_trackable")}
                  className={`px-6 py-3 cursor-pointer select-none whitespace-nowrap transition-colors duration-200 text-center ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                >
                  <div className="flex items-center justify-center gap-1">Terkendali <SortIcon column="is_trackable"/></div>
                </th>
                {role === "owner" && <th className="px-6 py-3 uppercase whitespace-nowrap text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition ${
                      theme === "dark"
                        ? "hover:bg-gray-700" 
                        : "hover:bg-gray-100" 
                    }`}
                  >
                    <td className="px-6 py-3 font-medium whitespace-nowrap">{item.item_name}</td> 
                    <td className="px-6 py-3 whitespace-nowrap">{item.category_name}</td> 
                    <td className="px-6 py-3 text-center whitespace-nowrap">{item.current_stock}</td> 
                    <td className="px-6 py-3 text-center whitespace-nowrap"> 
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                        item.is_trackable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {item.is_trackable ? "Ya" : "Tidak"}
                      </span>
                    </td>
                    {role === "owner" && (
                      <td className="px-6 py-3 text-center whitespace-nowrap"> 
                        <div className="flex justify-center gap-3">
                          <button onClick={() => openEditModal(item)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"> 
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => openDeleteModal(item)} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"> 
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center italic text-gray-500 dark:text-gray-400"> 
                    Tidak ada item ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-300">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40"
          >
            <ChevronLeft size={18} /> 
          </button>
          <span>{currentPage}/{totalPages || 1}</span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40"
          >
            <ChevronRight size={18} /> 
          </button>
        </div>
      </div>

      <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal} title="Konfirmasi penghapusan Item">
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

      <Modal isOpen={isAddModalOpen} onClose={handleSuccess} title="Tambah Item">
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