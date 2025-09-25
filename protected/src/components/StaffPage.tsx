import { useState, useEffect } from "react";
import Modal from "./Modal";
import AddStaffForm from "./AddStaffForm";

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

    const fetchStaff = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/users?role=staff");

            if (!response.ok) {
                throw new Error("Failed to fetch staff data");
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

    const refreshStaffList = () => {
        setModalOpen(false);
        fetchStaff();
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


    const handleDelete = async (userId: number) => {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setStaffList(staffList.filter(user => user.id !== userId));
                console.log(`Pengguna dengan ID ${userId} berhasil dihapus`);
            } else {
                const errorData = await response.json();
                console.error("Gagal menghapus user:", errorData.message);
                setError(errorData.message);
            }
        } catch (error) {
            console.error("Gagal menghapus user", error);
            setError('Server error');
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
            <h2 className="mb-3 text-2xl font-bold">Kelola akun pengguna/staff</h2>

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
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase" >Nama</th>
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
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    className="text-blue-600 hover:text-blue-900"
                                    onClick={() => openEditModal(user)}>Edit</button>
                                <button
                                    className="text-red-600 hover:text-red-900"
                                    onClick={() => handleDelete(user.id)}> Hapus</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal isOpen={modalOpen} onClose={closeModal} title="Tambah akun staff">
                <AddStaffForm onSuccess={refreshStaffList} onCancel={closeModal} />
            </Modal>

            <Modal
                isOpen={editModal}
                onClose={closeEditModal}
                title={`Edit akun: ${currentUser?.full_name}`}
            >
                {
                    currentUser && (
                        <p>sdf</p>
                    )
                }
            </Modal>
        </div >
    )
}