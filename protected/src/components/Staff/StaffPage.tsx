import { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  ArrowUpDown,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ListFilter,
} from "lucide-react";
import Modal from "../Layout/Modal";
import DeleteModal from "../Layout/DeleteModal";
import StaffForm from "./StaffForm";
import api from "../../api";
import { useTheme } from "../../context/ThemeContext"; 

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

type SortKey = keyof User;
type SortOrder = "asc" | "desc";

export default function StaffPage() {
  const { theme } = useTheme(); 
  const [staffList, setStaffList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await api.get(`${apiUrl}/users?role=staff`);
      setStaffList(response.data.users);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error mengambil data staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const sortedStaff = [...staffList].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];

    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
    if (typeof valA === "string" && typeof valB === "string") {
      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return 0;
  });

  const filteredStaff = sortedStaff.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStaff.length / entriesPerPage);
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div
      className={`min-h-full transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h2
        className={`mb-6 text-2xl font-bold transition-colors duration-300 ${
          theme === "dark" ? "text-gray-100" : "text-gray-900"
        }`}
      >
        Kelola Akun
      </h2>

      <div
        className={`p-5 rounded-lg shadow transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        }`}
      >
        <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
          <div className="flex items-center w-full gap-2 md:w-auto">
            <div className="relative w-full md:w-60">
              <Search
                size={16}
                className="absolute text-gray-400 dark:text-gray-500 transform -translate-y-1/2 left-3 top-1/2"
              />
              <input
                type="text"
                placeholder="Cari..."
                className={`w-full px-8 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]
                  ${theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"}`}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
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
            onClick={() => setAddModal(true)}
            className="flex items-center w-full justify-center md:w-auto gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition shadow-md"
            style={{ backgroundColor: "var(--color-secondary)" }}
          >
            <Plus className="w-4 h-4" /> Tambah Akun
          </button>
        </div>

        <div
          className={`relative overflow-x-auto border rounded-lg transition-colors duration-300 
            ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
        >
          <table
            className={`w-full text-sm text-left transition-colors duration-300 
              ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
          >
        <thead
          className={`uppercase transition-colors duration-300 ${
            theme === "dark" ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-700"
          }`}
        >
          <tr>
            {["id", "full_name", "email", "role"].map((key) => (
              <th
                key={key}
                className={`px-6 py-3 cursor-pointer select-none whitespace-nowrap transition-colors duration-200
                  ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                onClick={() => handleSort(key as SortKey)}
              >
                <div className="flex items-center gap-1">
                  {key === "id" && "ID"}
                  {key === "full_name" && "Nama"}
                  {key === "email" && "Email"}
                  {key === "role" && "Role"}
                  <SortIcon column={key as SortKey} />
                </div>
              </th>
            ))}
            <th className={`px-6 py-3 uppercase whitespace-nowrap ${theme === "dark" ? "" : ""}`}>Aksi</th>
          </tr>
        </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedStaff.length > 0 ? (
                paginatedStaff.map((user) => (
                  <tr
                    key={user.id}
                    className={`transition ${
                      theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <td className="px-6 py-3 whitespace-nowrap">{user.id}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{user.full_name}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{user.role}</td>
                    <td className="flex items-center gap-2 px-6 py-3 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setCurrentUser(user);
                          setEditModal(true);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        title="Edit"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentUser(user);
                          setDeleteModal(true);
                        }}
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        title="Hapus"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-300">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>
          <span>
            {currentPage}/{totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* MODALS */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Tambah Staff">
        <StaffForm
          onSuccess={() => {
            setAddModal(false);
            fetchStaff();
          }}
          onCancel={() => setAddModal(false)}
        />
      </Modal>

      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title={`Edit: ${currentUser?.full_name}`}
      >
        {currentUser && (
          <StaffForm
            currentUser={currentUser}
            onSuccess={() => {
              setEditModal(false);
              fetchStaff();
            }}
            onCancel={() => setEditModal(false)}
          />
        )}
      </Modal>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Hapus Akun">
        {currentUser && (
          <DeleteModal
            itemId={currentUser.id}
            itemName={currentUser.full_name}
            itemType="user"
            endpoint="users"
            onDelete={() => {
              setDeleteModal(false);
              fetchStaff();
            }}
            onCancel={() => setDeleteModal(false)}
          />
        )}
      </Modal>
    </div>
  );
}
