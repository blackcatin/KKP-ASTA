import { useState, useEffect } from "react";
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
    const [isDeleteModaOpen, setIsDeleteOpen] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${apiUrl}/categories`)

            if (!response.ok) throw new Error('Gagal mengambil data');

            const data = await response.json();
            setCategoryList(data);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message || 'Server error');
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const openAddModal = () => {
        setCurrentCat(null);
        setIsAddModalOpen(true);
    }

    const openEditModal = (categories: Category) => {
        setCurrentCat(categories);
        setIsEditModalOpen(true);
    }

    const openDeleteModal = (category: Category) => {
        setCurrentCat(category);
        setIsDeleteOpen(true);
    }

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    }

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    }

    const closeDeleteModal = () => {
        setIsDeleteOpen(false);
    }

    const handleSuccess = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteOpen(false);

        fetchCategories();
    }

    const executeDelete = async () => {
        if (!currentCat) return;

        const CatId = currentCat.id;
        let isConflict = false;

        setDeleteError(null);

        try {
            const response = await fetch(`${apiUrl}/categories/${CatId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.status === 409) {
                isConflict = true;
                setDeleteError(data.message);
            } else if (!response.ok) {
                setDeleteError(data.message || 'Gagal menghapus kategori');
            }

            if (response.ok) {
                closeDeleteModal();
                setCategoryList(prevList => prevList.filter(category => category.id !== currentCat.id));
            }
        } catch (error) {
            console.error('Gagal terhubung ke server, coba lagi');
        } finally {
            if (isConflict) {
                closeDeleteModal();
            }
        }
    }

    if (loading) return <div>Memuat daftar kategori...</div>
    if (error) return <div className="text-red-600">Error: {error}...</div>

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">Manajemen Kategori</h2>
            {deleteError && (
                <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
                    <strong>Gagal: {deleteError}</strong>
                </div>
            )}

            <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Daftar Kategori</h3>
                    <button onClick={openAddModal} className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        Tambah Kategori Baru
                    </button>
                </div>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {/* <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">ID</th> */}
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nama</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Deskripsi</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {categoryList.map((category) => (
                        <tr key={category.id}>
                            {/* <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{category.id}</td> */}
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{category.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{category.description}</td>
                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                <button onClick={() => openEditModal(category)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                <button onClick={() => openDeleteModal(category)} className="text-red-600 hover:text-red-900">Hapus</button>
                            </td>
                        </tr>
                    ))}
                    {categoryList.length === 0 && !loading && (
                        <tr><td colSpan={3} className="py-4 text-center text-gray-500">Belum ada data kategori.</td></tr>
                    )}
                </tbody>
            </table>

            <Modal isOpen={isAddModalOpen} onClose={closeAddModal} title="Tambah Kategori">
                <CategoryForm
                    currentCat={null}
                    onSuccess={handleSuccess}
                    onCancel={closeAddModal}
                />
            </ Modal>

            <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Edit Kategori">
                {currentCat && (
                    <CategoryForm
                        currentCat={currentCat}
                        onSuccess={handleSuccess}
                        onCancel={closeEditModal}
                    />
                )}
            </Modal>

            <Modal isOpen={isDeleteModaOpen} onClose={closeDeleteModal} title="Hapus Kategori">
                {currentCat && (
                    <DeleteModal
                        itemName={currentCat.name}
                        itemType="kategori"
                        onDelete={executeDelete}
                        onCancel={closeDeleteModal}
                    />
                )}
            </Modal>
        </div>
    )
}