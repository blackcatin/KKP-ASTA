import { useEffect, useState } from 'react';
import { User, Mail, ShieldCheck } from 'lucide-react';

interface UserType {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

interface EditFormProps {
  currentUser: UserType;
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

    const updateData = { full_name: fullName, email, role };

    try {
      const response = await fetch(`http://localhost:3000/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) onSuccess();
      else setError(data.message || 'Gagal mengedit akun');
    } catch {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const inputWrapperClass = "relative w-full";
  const iconClass = "absolute top-1/2 left-3 -translate-y-1/2 text-gray-400";
  const inputClass = "w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-sm text-red-500">{error}</div>}

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
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={inputClass + " appearance-none"}
        >
          <option value="staff">Staff</option>
          <option value="Owner">Owner</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-4 border-t pt-4">
         <button
          type="button"
          onClick={onCancel}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 
          rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-400 transition-colors duration-150"
           style={{ color:"white" }}
        >
          X Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-50"
          style={{ backgroundColor: "var(--color-secondary)", color:"white" }}
        >
          {loading ? "Menyimpan..." : "Simpan Akun"}
        </button>
      </div>
    </form>
  );
}
