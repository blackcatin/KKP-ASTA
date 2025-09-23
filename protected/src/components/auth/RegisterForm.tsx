import { useState } from "react";
import Logo from "../../assets/Image/Logo.jpg";

interface RegisterFormProps {
    onToggleForm: () => void;
}

export default function RegisterForm({ onToggleForm }: RegisterFormProps) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("staff"); // Default role
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Password tidak cocok.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ full_name: fullName, email, password, role }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Registrasi berhasil:", data.message, data.user);
                // Setelah registrasi berhasil, bisa langsung navigasi ke halaman login
                onToggleForm();
            } else {
                setError(data.message || "Registrasi gagal, silakan coba lagi.");
            }
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            setError("Tidak dapat terhubung ke server. Periksa koneksi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-full px-4 bg-white md:w-1/2">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-10">
                    <img src={Logo} alt="Logo" className="w-24 mb-4" />
                    <h1 className="text-3xl font-bold tracking-wide text-gray-800">
                        Daftar Akun
                    </h1>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    {error && (
                        <div className="text-sm text-center text-red-500">{error}</div>
                    )}
                    {/* Input untuk Nama Lengkap */}
                    <div>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nama Lengkap"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    {/* Input untuk Email */}
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    {/* Input untuk Password */}
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    {/* Input untuk Konfirmasi Password */}
                    <div>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Konfirmasi Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    {/* Pilihan Role */}
                    <div>
                        <label className="block mb-1 text-sm text-gray-700">Daftar sebagai:</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="staff">Staff</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 font-semibold text-white transition bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Loading..." : "Daftar"}
                    </button>
                </form>

                <div className="mt-6 text-sm text-center">
                    Sudah punya akun?{" "}
                    <a href="#" onClick={onToggleForm} className="text-blue-600 hover:underline">
                        Login di sini.
                    </a>
                </div>

                <p className="mt-12 text-xs text-center text-gray-400">
                    Versi 1.0.0 © 2025 KKP-ASTA
                </p>
            </div>
        </div>
    );
}