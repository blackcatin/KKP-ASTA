import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";
import Logo from "../../assets/Image/Logo.png";
import Background from "../../assets/Image/Loginbg.jpg";
import VectorLight from "../../assets/Image/vector.png";
import VectorDark from "../../assets/Image/vector2.png";

type Theme = "light" | "dark";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>("light");

  const nav = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        nav("/dashboard");
      } else {
        setError(data.message || "Login gagal, silakan coba lagi.");
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
      setError("Tidak dapat terhubung ke server. Periksa koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-center w-screen min-h-screen transition-all duration-500 relative ${
        theme === "dark" ? "bg-[#0f172a]" : "bg-cover bg-center"
      }`}
      style={{
        backgroundImage: theme === "light" ? `url(${Background})` : "none",
      }}
    >
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-full z-10 transition text-white bg-black/50 hover:bg-black/60 dark:text-gray-700 dark:bg-white/90 dark:hover:bg-white"
        aria-label={theme === "light" ? "Ubah ke mode gelap" : "Ubah ke mode terang"}
      >
        {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
      </button>

      <div className="hidden md:flex w-1/2 h-screen items-center justify-center">
        <img
          src={theme === "dark" ? VectorDark : VectorLight}
          alt="Vector Illustration"
          className="w-[85%] max-w-3xl object-contain drop-shadow-2xl ml-20 transition-all duration-500"
        />
      </div>

      <div className="flex justify-start w-full md:w-1/2 h-screen items-center p-4 md:pl-24 lg:pl-32">
        <div className="w-full max-w-md p-8 m-6 bg-[var(--color-secondary)] text-white dark:bg-white dark:text-gray-800 bg-opacity-95 backdrop-blur-md rounded-2xl shadow-2xl border border-transparent dark:border-gray-200 transition-all duration-500">
          <div className="flex flex-col items-center mb-6">
            <img src={Logo} alt="Logo" className="w-20 mb-3" />
            <h1 className="text-2xl font-bold tracking-wide text-center">
              Selamat Datang di KKP-ASTA
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && <div className="text-sm text-center text-red-500">{error}</div>}

            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-semibold text-white dark:text-gray-700 hover:text-gray-200 dark:hover:text-gray-900 transition-colors duration-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email kamu"
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] hover:border-[var(--color-primary)] bg-white text-gray-900 dark:bg-white dark:text-gray-900 transition-all duration-300"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-semibold text-white dark:text-gray-700 hover:text-gray-200 dark:hover:text-gray-900 transition-colors duration-300"
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
                  className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] hover:border-[var(--color-primary)] pr-10 bg-white text-gray-900 dark:bg-white dark:text-gray-900 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-[var(--color-primary)] transition-colors duration-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg hover:shadow-[var(--color-secondary)/50] hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--color-primary)", color:"white" }}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <div className="mt-5 text-sm text-center">
            <span className="text-white dark:text-gray-700">Lupa password? </span>
            <a
              href="#"
              className="font-medium text-white hover:text-gray-200 dark:text-[var(--color-primary)] dark:hover:text-blue-600 underline-offset-4"
            >
              Hubungi admin
            </a>
          </div>

          <p className="mt-10 text-xs text-center text-white dark:text-gray-500">
            © 2025 KKP-ASTA — Versi 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}