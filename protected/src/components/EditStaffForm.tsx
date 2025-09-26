import { useEffect, useState } from 'react';

interface User {
    id: number;
    full_name: string;
    email: string;
    role: string;
}

interface EditFormProps {
    currentUser: User;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function EditStaffForm({ currentUser, onSuccess, onCancel }: EditFormProps) {
    const [fullName, setFullName] = useState(currentUser.full_name);
    const [email, setEmail] = useState(currentUser.email);
    const [role, setRole] = useState(currentUser.role);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFullName(currentUser.full_name);
        setEmail(currentUser.email);
        setRole(currentUser.role);
    }, [currentUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const updateData = {
            full_name: fullName,
            email: email,
            role: role
        }

        try {
            const response = await fetch(`http://localhost:3000/api/users/${currentUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            })

            const data = await response.json();

            if (response.ok) {
                onSuccess();
            } else {
                setError(data.message || 'Gagal mengedit akun');
            }
        } catch (error) {
            setError('Server error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-6'>
            {error && <div className='text-sm text-red-500'>{error}</div>}

            <div>
                <label className="block text-sm font-medium text-gray-700">Nama lengkap</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500" required />
            </div>
            {/* input email */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500" required />
            </div>
            {/* input password */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                    value={role} onChange={(e) => setRole(e.target.value)}
                    className='w-full px-3 py-2 border rounded-lg focus:ring-blue-500'
                >
                    <option value="staff">Staff</option>
                    <option value="Owner">Owner</option>
                </select>
            </div>

            {/* action */}
            <div className="flex justify-end pt-2 mt-4 border-t space-x2">
                <button type="button" onClick={onCancel} className="px-4 text-gray-700 rounded-lg bg-amber-700 hover:bg-amber-600">
                    Batal
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-400 disabled:opacity-50">
                    {loading ? 'Menyimpan...' : 'Simpan akun'}
                </button>
            </div>
        </form>
    )
}
