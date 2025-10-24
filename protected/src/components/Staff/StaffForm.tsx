import { useEffect, useState } from "react";
import { User, Mail, ShieldCheck, Eye, EyeOff, Briefcase, X } from "lucide-react";
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

export default function StaffForm({ currentUser, onSuccess, onCancel }: StaffFormProps) {
  const isEditing = !!currentUser;
  const [fullName, setFullName] = useState(currentUser?.full_name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(currentUser?.role || "staff");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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

    const payload: any = { full_name: fullName, email, role };
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
  const iconClass = "absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"; // perbaikan warna icon agar stabil
  const inputClass = `
    w-full pl-10 pr-3 py-2 border rounded-lg transition
    bg-[var(--color-netral)] text-[var(--color-text-main)]
    placeholder-[var(--color-text-main)]/60
    border-[var(--color-secondary)]
    focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]
  `;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-2xl shadow-md space-y-6 border border-[var(--color-secondary)] bg-[var(--color-bg-main)] text-[var(--color-text-main)] transition-colors"
    >
      <h3 className="text-lg font-semibold text-[var(--color-text-main)] dark:text-[var(--color-text-main)]/90"> {isEditing ? "Edit Data Staff" : "Tambah Staff Baru"}
      </h3>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-2">
          {error}
        </div>
      )}

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

      <div className={inputWrapperClass}>
        <ShieldCheck className={iconClass} size={18} />
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={
            isEditing
              ? "Kosongkan jika tidak ingin mengubah password"
              : "Masukkan password"
          }
          className={`${inputClass} pr-10`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[var(--color-accent)]"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div className={inputWrapperClass}>
        <Briefcase className={iconClass} size={18} />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={`${inputClass} appearance-none pr-8`}
        >
          <option value="staff">Staff</option>
          <option value="Owner">Owner</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-[var(--color-secondary)]">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-400 transition"
        >
          <X className="w-4 h-4 mr-2" /> Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 text-sm font-medium text-white bg-[var(--color-accent)] rounded-lg hover:opacity-90 focus:ring-2 focus:ring-[var(--color-accent)] transition disabled:opacity-50"
        >
          {loading
            ? "Menyimpan..."
            : isEditing
            ? "Simpan Perubahan"
            : "Tambah Akun"}
        </button>
      </div>
    </form>
  );
}
