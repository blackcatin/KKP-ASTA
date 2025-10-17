import { useState, useEffect } from "react";
import { Edit, Trash2, ArrowUpDown, Plus, Search } from "lucide-react";
import Modal from "../Layout/Modal";
import DeleteModal from "../Layout/DeleteModal";
import StaffForm from "./StaffForm";

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

type SortKey = keyof User;
type SortOrder = "asc" | "desc";

export default function StaffPage() {
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

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchStaff = async () => {
    try {
      const response = await fetch(`${apiUrl}/users?role=staff`);
      if (!response.ok) throw new Error("Gagal menghubungkan dengan data staff");

      const data = await response.json();
      setStaffList(data.users);
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
  };

  const sortedStaff = [...staffList].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];

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

  const filteredStaff = sortedStaff.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const executeDelete = async () => {
    if (!currentUser) return;
    const userId = currentUser.id;

    try {
      const response = await fetch(`${apiUrl}/users/${userId}`, { method: "DELETE" });
      if (response.ok) {
        setStaffList(staffList.filter((user) => user.id !== userId));
        setDeleteModal(false);
      } else {
        const err = await response.json();
        setError(err.message);
      }
    } catch {
      setError("Server error");
    }
  };

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Kelola Akun Pengguna</h2>
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90"
          style={{ backgroundColor: "var(--color-secondary)", color: "white" }}
        >
          <Plus className="w-4 h-4" /> Tambah Staff
        </button>
      </div>

      <div className="relative w-full sm:w-1/3">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari nama atau email..."
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all duration-150"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {["id", "full_name", "email", "role"].map((key) => (
                <th
                  key={key}
                  className="px-6 py-3 cursor-pointer select-none hover:bg-gray-100"
                  onClick={() => handleSort(key as SortKey)}
                >
                  <div className="flex items-center gap-1">
                    {key === "id" && "ID User"}
                    {key === "full_name" && "Nama Pengguna"}
                    {key === "email" && "Email"}
                    {key === "role" && "Role"}
                    <SortIcon column={key as SortKey} />
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-gray-700 uppercase">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((user) => (
                <tr key={user.id} className="transition hover:bg-gray-50">
                  <td className="px-6 py-4">{user.id}</td>
                  <td className="px-6 py-4">{user.full_name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="flex items-center gap-3 px-6 py-4">
                    <button
                      onClick={() => {
                        setCurrentUser(user);
                        setEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentUser(user);
                        setDeleteModal(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                      title="Hapus"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah */}
      <Modal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        title="Tambah akun staff"
      >
        <StaffForm
          onSuccess={() => {
            setAddModal(false);
            fetchStaff();
          }}
          onCancel={() => setAddModal(false)}
        />
      </Modal>

      {/* Modal Edit */}
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title={`Edit akun: ${currentUser?.full_name}`}
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

      {/* Modal Delete */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Konfirmasi Penghapusan"
      >
        {currentUser && (
          <DeleteModal
            itemId={currentUser.id}
            itemName={currentUser.full_name}
            itemType="user"
            endpoint="users"
            onDelete={() => {
              executeDelete();
              fetchStaff();
            }}
            onCancel={() => setDeleteModal(false)}
          />
        )}
      </Modal>
    </div>
  );
}
