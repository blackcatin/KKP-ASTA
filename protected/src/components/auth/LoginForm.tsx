import { useState } from "react";
import Logo from "../../assets/Image/Logo.jpg";

interface LoginFormProps {
  onToggleForm: () => void;
}

export default function LoginForm({ onToggleForm }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login berhasil:", data.message, data.user);
        onToggleForm();
      } else {
        setError(data.message || "Login gagal, silahkan coba lagi");
      }
    } catch (error) {
      console.error("Terjadi kesalahan: ", error);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center w-full px-4 bg-white md:w-1/2">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-10">
            <img src={Logo} alt="Logo" className="w-24 mb-4" />
            <h1 className="text-3xl font-bold tracking-wide text-gray-800">
              KKP-ASTA
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="text-sm text-center text-red-500">
                {error}
              </div>
            )}
            <div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username / Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text- focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white transition bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-sm text-center">
            Lupa password?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Hubungi admin.
            </a>
          </div>

          <p className="mt-12 text-xs text-center text-gray-400">
            Versi 1.0.0 © 2025 KKP-ASTA
          </p>
        </div>
      </div>
    </div>
  );
}