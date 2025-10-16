import { useState, useEffect } from "react";
import Modal from "../Layout/Modal";
import DeleteModal from "../Layout/DeleteModal";
import ItemForm from "./ItemForm";
import EditItemForm from "./EditItemForm";

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

export default function ItemPage() {
    const [itemList, setItemList] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentItem, setCurrentItem] = useState<Item | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [masterCategories, setMasterCategories] = useState<Category[]>([]);

    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchItems = async () => {
        try {
            const response = await fetch(`${apiUrl}/items`);
            if (!response.ok) throw new Error('Gagal mengambil daftar stok');

            const data = await response.json();
            setItemList(data);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message || 'Server error');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${apiUrl}/categories`);
            if (!response.ok) throw new Error('Gagal mengambil daftar kategori');

            const data = await response.json();
            setMasterCategories(data);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message || 'Server error');
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, []);

    const openDeleteModal = (item: Item) => {
        setCurrentItem(item);
        setIsDeleteOpen(true);
    }

    const closeDeleteModal = () => {
        setIsDeleteOpen(false);
        setCurrentItem(null);
    }

    const openAddModal = () => {
        setCurrentItem(null);
        setIsAddModalOpen(true);
    }

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    }

    const openEditModal = (item: Item) => {
        setCurrentItem(item);
        setIsEditModalOpen(true);
    }

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    }


    const handleSucces = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        closeDeleteModal();

        fetchItems();
        fetchCategories();
    }

    const executeDelete = async () => {
        if (!currentItem) return;

        const itemId = currentItem.id;

        try {
            const response = await fetch(`${apiUrl}/items/${itemId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                closeDeleteModal();
                setItemList(prevList => prevList.filter(item => item.id !== currentItem.id));
                console.log(itemList);
                console.log("Item berhasil dihapus!");
            } else {
                const errorData = await response.json();
                setError(errorData.message);
                throw new Error('Gagal menghapus item');
            }
        } catch (error) {
            console.error('Gagal menghapus item', error);
            setError('Server errror');
        }
    }

    if (loading) return <div>Memuat daftar stok...</div>
    if (error) return <div className="text-red-600">Error: {error}...</div>

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">Manajemen Stok & Item</h2>

            <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Daftar Item Inventaris</h3>
                    <button onClick={openAddModal} className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        Tambah Item Baru
                    </button>
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">ID</th> */}
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nama Item</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Kategori</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Stok Saat Ini</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Terkendali</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {itemList.map((item) => (
                            <tr key={item.id}>
                                {/* <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{item.id}</td> */}
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{item.item_name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{item.category_name}</td>
                                <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">{item.current_stock}</td>
                                <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.is_trackable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {item.is_trackable ? 'Ya' : 'Biaya'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                    <button onClick={() => openEditModal(item)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                    <button onClick={() => openDeleteModal(item)} className="text-red-600 hover:text-red-900">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal} title="Konfirmasi penghapusan Item">
                {currentItem && (
                    <DeleteModal
                        itemName={currentItem.item_name}
                        itemType="item inventaris"
                        onDelete={executeDelete}
                        onCancel={closeDeleteModal}
                    />
                )}
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Edit Item">
                {currentItem && (
                    <ItemForm
                        currentItem={currentItem}
                        masterCategories={masterCategories}
                        onSuccess={handleSucces}
                        onCancel={closeEditModal}
                    />
                )}
            </Modal>

            <Modal isOpen={isAddModalOpen} onClose={closeAddModal} title="Add Item">
                <ItemForm
                    currentItem={null}
                    masterCategories={masterCategories}
                    onSuccess={handleSucces}
                    onCancel={closeAddModal}
                />
            </Modal>


        </div>
    )
}