import { useEffect, useState } from 'react';
import api from '../../api';

interface User {
    id?: number;
    full_name: string;
    email: string;
    role: string;
}

interface StaffFormProps {
    currentUser?: User;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function StaffForm({ currentUser, onSuccess, onCancel }: StaffFormProps) {
    const isEditing = !!currentUser;
    const [fullName, setFullName] = useState(currentUser?.full_name || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(currentUser?.role || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditing && currentUser) {
            setFullName(currentUser.full_name);
            setEmail(currentUser.email);
            setRole(currentUser.role);
        } else {
            setFullName('');
            setEmail('');
            setPassword('');
            setRole('staff');
        }

    }, [currentUser, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload: any = {
            full_name: fullName,
            email,
            role,
        }
        if (password) payload.password = password

        try {
            if (isEditing && currentUser?.id) {
                console.log('Payload:', payload);
                await api.put(`/users/${currentUser.id}`, payload);
            } else {
                console.log('Payload:', payload);
                await api.post('/users', payload);
            }

            onSuccess();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message || 'Server error');
            }
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
                <label className="block text-sm font-medium text-gray-700">
                    Password {isEditing && <span className='text-xs text-gray-400'>(Kosongkan jika tidak ingin mengubah)</span>}
                </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder={isEditing ? 'Biarkan kosong jika tidak diubah' : ''}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500" />
            </div>
            {/* role */}
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
            <div className="flex justify-end pt-2 mt-4 space-x-2 border-t">
                <button type="button" onClick={onCancel} className="px-3 py-1 text-gray-700 rounded-lg bg-amber-700 hover:bg-amber-600">
                    Batal
                </button>
                <button type="submit" disabled={loading} className="px-3 py-1 text-white bg-green-600 rounded-lg hover:bg-green-400 disabled:opacity-50">
                    {loading ? 'Menyimpan...' : 'Simpan akun'}
                </button>
            </div>
        </form>
    )
}
