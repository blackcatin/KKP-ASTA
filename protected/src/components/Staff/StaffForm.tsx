import { useEffect, useState } from "react";
import { User, Mail, ShieldCheck } from "lucide-react";
import api from "../../api";

interface UserType {
    id?: number;
    full_name: string;
    email: string;
    role: string;
}

interface StaffFormProps {
    currentUser?: UserType | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function StaffForm({
    currentUser,
    onSuccess,
    onCancel,
}: StaffFormProps) {
    const isEditing = !!currentUser;
    const [fullName, setFullName] = useState(currentUser?.full_name || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(currentUser?.role || "staff");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditing && currentUser) {
            setFullName(currentUser.full_name);
            setEmail(currentUser.email);
            setRole(currentUser.role);
        } else {
            setFullName("");
            setEmail("");
            setPassword("");
            setRole("staff");
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
        };
        if (password) payload.password = password;

        try {
            if (isEditing && currentUser?.id) {
                await api.put(`/users/${currentUser.id}`, payload);
            } else {
                await api.post("/users", payload);
            }

            onSuccess();
        } catch (error: any) {
            setError(error?.response?.data?.message || error.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    const inputWrapperClass = "relative w-full";
    const iconClass = "absolute top-1/2 left-3 -translate-y-1/2 text-gray-400";
    const inputClass =
        "w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-sm text-red-500">{error}</div>}

            {/* Nama lengkap */}
            <div className={inputWrapperClass}>
                <User className={iconClass} size={18} />
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama lengkap"
                    className={inputClass}
                    required
                />
            </div>

            {/* Email */}
            <div className={inputWrapperClass}>
                <Mail className={iconClass} size={18} />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className={inputClass}
                    required
                />
            </div>

            {/* Password (opsional saat edit) */}
            <div className={inputWrapperClass}>
                <ShieldCheck className={iconClass} size={18} />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                        isEditing
                            ? "Kosongkan jika tidak ingin mengubah password"
                            : "Masukkan password"
                    }
                    className={inputClass}
                />
            </div>

            {/* Role */}
            <div className={inputWrapperClass}>
                <ShieldCheck className={iconClass} size={18} />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={inputClass + " appearance-none"}
                >
                    <option value="staff">Staff</option>
                    <option value="Owner">Owner</option>
                </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors duration-150 bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-400"
                >
                    X Batal
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50"
                >
                    {loading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Akun"}
                </button>
            </div>
        </form>
    );
}
