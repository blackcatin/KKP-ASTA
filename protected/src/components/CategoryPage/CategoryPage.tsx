import { useState, useEffect } from "react";
import Modal from "../Layout/Modal";
import DeleteModal from "../Layout/DeleteModal";

interface Category {
    id: number;
    category_name: string;
}

export default function CategoryPage() {
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentCat, setCurrentCat] = useState<Category | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModaOpen, setIsDeleteOpen] = useState(false);

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

    const handleSuccess = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteOpen(false);

        fetchCategories();
    }

    const executeDelete = async () => {
        if (!currentCat) return;

        const CatId = currentCat.id;

        try {
            const response = await fetch(`${apiUrl}/categories/${CatId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setCategoryList(prevList => prevList.filter(category => category.id !== currentCat.id));
                console.log(categoryList);
                console.log("Kategori berhasil dihapus")
            } else {
                const errorData = await response.json();
                setError(errorData.message);
                throw new Error('Gagal menghapus kategori');
            }
        } catch (error) {
            console.error('Gagal menghapus kategori');
            setError('Server error');
        }
    }

    if (loading) return <div>Memuat daftar kategori...</div>
    if (error) return <div className="text-red-600">Error: {error}...</div>

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">Manajemen Kategori</h2>

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
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nama Kategori</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Kategori</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Stok Saat Ini</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Terkendali</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {categoryList.map((category) => (
                        <tr key={category.id}>
                            {/* <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{item.id}</td> */}
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{category.category_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{category.category_name}</td>
                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                <button onClick={() => openEditModal(item)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                <button onClick={() => openDeleteModal(item)} className="text-red-600 hover:text-red-900">Hapus</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}