import { useState } from "react"

interface AddStaffFormProps {
    onSuccess: () => void; // berhasil => close
    onCancel: () => void; // refresh list
}

export default function AddStaffForm({ onSuccess, onCancel }: AddStaffFormProps) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!fullName || !email || !password) {
            setError('Semua field wajib diisi');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // tambah authorizaiton setelah sistem token dibuat
                },
                body: JSON.stringify({
                    full_name: fullName,
                    email: email,
                    password: password,
                    role: 'staff', // defult staf
                }),
            });

            const data = await response.json();

            if (response.ok) {
                onSuccess(); // refresh list & tutup modal
            } else {
                setError(data.message || 'Gagal menambahkan akun');
            }
        } catch (error) {
            setError('Server error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-sm text-red-500">{error}</div>}

            {/* input nama lengap */}
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
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500" required />
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