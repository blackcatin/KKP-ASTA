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
}