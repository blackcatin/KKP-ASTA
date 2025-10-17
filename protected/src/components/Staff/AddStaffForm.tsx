import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface AddStaffFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddStaffForm({ onSuccess, onCancel }: AddStaffFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // toggle password

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password, role: 'staff' }),
      });

      const data = await response.json();

      if (response.ok) onSuccess();
      else setError(data.message || 'Gagal menambahkan akun');
    } catch {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const inputWrapperClass = "relative w-full";
  const iconClass = "absolute top-1/2 left-3 -translate-y-1/2 text-gray-400";
  const inputClass = "w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

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

      {/* Password */}
      <div className={inputWrapperClass}>
        <Lock className={iconClass} size={18} />
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={inputClass}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div className="flex justify-end gap-3 mt-4 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 
          rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-400 transition-colors duration-150"
          style={{color:"white"}}
        >
          X Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-50"
          style={{ backgroundColor: "var(--color-secondary)", color:"white" }}
        >
          {loading ? 'Menyimpan...' : 'Simpan Akun'}
        </button>
      </div>
    </form>
  );
}
