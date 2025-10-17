import { useState, useEffect } from "react";
import Modal from "../Layout/Modal";
import DeleteModal from "../Layout/DeleteModal";
import StaffForm from "./StaffForm";

interface User {
    id: number;
    full_name: string;
    email: string;
    role: string;
}

export default function StaffPage() {
    const [staffList, setStaffList] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editModal, setEditModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [addModal, setAddModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchStaff = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${apiUrl}/users?role=staff`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("Gagal menghubungkan dengan data staff");
            }
            const data = await response.json();
            setStaffList(data.users);
            setError(null);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Error mengambil data staff");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        fetchStaff();
    }, []);

    const openDeleteModal = (user: User) => {
        setCurrentUser(user);
        setDeleteModal(true);
    }

    const closeDeleteModal = () => {
        setDeleteModal(false);
        setCurrentUser(null);
    }

    const openEditModal = (user: User) => {
        setCurrentUser(user);
        setEditModal(true);
    }

    const closeEditModal = () => {
        setEditModal(false);
        setCurrentUser(null);
    }

    const openAddModal = () => {
        setCurrentUser(null);
        setAddModal(true);
    }

    const closeAddModal = () => {
        setAddModal(false);
        setCurrentUser(null);
    }

    const handleSuccess = () => {
        setAddModal(false);
        setEditModal(false);
        setDeleteModal(false);

        setCurrentUser(null);
        fetchStaff();
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div>
            <h2 className="mb-3 text-2xl font-bold">Kelola Akun Pengguna</h2>

            <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Daftar staff</h3>
                    <button
                        onClick={openAddModal}
                        className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
                        Tambah akun staff
                    </button>
                </div>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase" >ID User</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase" >Nama Pengguna</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase" >Email</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase" >Role</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase" >Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {staffList.map((user) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.full_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap space-x-2.5">
                                <button
                                    className="px-3 py-1 text-gray-200 bg-blue-600 rounded-md hover:bg-blue-900"
                                    onClick={() => openEditModal(user)}>Edit</button>
                                <button
                                    className="px-3 py-1 text-gray-200 bg-red-500 rounded-md hover:bg-red-900"
                                    onClick={() => openDeleteModal(user)}>Hapus</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal isOpen={addModal} onClose={closeAddModal} title="Tambah akun staff">
                <StaffForm
                    onSuccess={handleSuccess}
                    onCancel={closeAddModal}
                />
            </Modal>

            <Modal isOpen={editModal} onClose={closeEditModal} title={`Edit akun: ${currentUser?.full_name}`}>
                {
                    currentUser && (
                        <StaffForm
                            currentUser={currentUser}
                            onSuccess={handleSuccess}
                            onCancel={closeEditModal}
                        />
                    )
                }
            </Modal>

            <Modal isOpen={deleteModal} onClose={closeDeleteModal} title="Konfirmasi Penghapusan">
                {
                    currentUser && (
                        <DeleteModal
                            itemId={currentUser.id}
                            itemName={currentUser.full_name}
                            itemType="user"
                            endpoint="users"
                            onDelete={handleSuccess}
                            onCancel={closeDeleteModal}
                        />
                    )
                }
            </Modal>
        </div >
    )
}