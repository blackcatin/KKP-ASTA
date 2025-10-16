import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // ikon mata
import Logo from "../../assets/Image/Logo.png";
import Background from "../../assets/Image/Loginbgg.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nav = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        console.log("Login berhasil:", data.message, data.user);

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        nav("/dashboard");
      } else {
        setError(data.message || "Login gagal, silakan coba lagi.");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      setError("Tidak dapat terhubung ke server. Periksa koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-end w-screen min-h-screen bg-center bg-cover"
      style={{
        backgroundImage: `url(${Background})`,
      }}
    >
      <div className="flex justify-center w-full mr-0 md:w-1/2 lg:w-1/3 md:mr-12 lg:mr-24">
        <div className="w-full max-w-md p-8 m-6 bg-white shadow-2xl rounded-2xl">
          <div className="flex flex-col items-center mb-8">
            <img src={Logo} alt="Logo" className="w-20 mb-3" />
            <h1 className="text-2xl font-bold tracking-wide text-center text-gray-800">
              Selamat Datang di KKP-ASTA
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="text-sm text-center text-red-500">{error}</div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email kamu"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password kamu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[var(--color-primary)]"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white transition rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-primary)", color: "white"
              }}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <div className="mt-5 text-sm text-center">
            Lupa password?{" "}
            <a
              href="#"
              className="font-medium text-[var(--color-primary)] transition duration-200 ease-in-out hover:underline hover:decoration-[var(--color-primary)] underline-offset-4"
            >
              Hubungi admin
            </a>
          </div>


          <p className="mt-10 text-xs text-center text-gray-500">
            © 2025 KKP-ASTA — Versi 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
