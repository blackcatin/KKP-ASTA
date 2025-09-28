import { useState, useEffect } from "react";
import Modal from "../Layout/Modal";
import AddStaffForm from "./AddStaffForm";
import EditStaffForm from "./EditStaffForm";
import DeleteStaff from "./DeleteStaff";

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
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const fetchStaff = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/users?role=staff");

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

    const handleAddSuccess = () => {
        setModalOpen(false);
        fetchStaff();
    }

    const handleEditSuccess = () => {
        setEditModal(false);
        setCurrentUser(null);
        fetchStaff();
    }

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

    const openModal = () => {
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    const executeDelete = async () => {
        if (!currentUser) return;

        const userId = currentUser.id;

        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                closeDeleteModal();
                setStaffList(staffList.filter(user => user.id !== userId));
                console.log(`Pengguna dengan ID ${userId} berhasil dihapus`);
            } else {
                const errorData = await response.json();
                console.error("Gagal menghapus user:", errorData.message);
                setError(errorData.message);
                throw new Error(errorData.message); // lempar errror agar modal delete tahu
            }
        } catch (error) {
            console.error("Gagal menghapus user", error);
            setError('Server error');
            throw error;
        }
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
                        onClick={openModal}
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

            <Modal isOpen={modalOpen} onClose={closeModal} title="Tambah akun staff">
                <AddStaffForm onSuccess={handleAddSuccess} onCancel={closeModal} />
            </Modal>

            <Modal isOpen={editModal} onClose={closeEditModal} title={`Edit akun: ${currentUser?.full_name}`}>
                {
                    currentUser && (
                        <EditStaffForm
                            currentUser={currentUser}
                            onSuccess={handleEditSuccess}
                            onCancel={closeEditModal}
                        />
                    )
                }
            </Modal>

            <Modal isOpen={deleteModal} onClose={closeDeleteModal} title="Konfirmasi Penghapusan">
                {
                    currentUser && (
                        <DeleteStaff
                            user={currentUser}
                            onDelete={executeDelete}
                            onCancel={closeDeleteModal}
                        />
                    )
                }
            </Modal>
        </div >
    )
}