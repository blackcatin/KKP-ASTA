import { useState } from "react";
import Logo from "../assets/Image/Logo.jpg";
import Illustration from "../assets/Image/illustration.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { username, password });
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[#f0f0f0] p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-100 opacity-50"></div>
        <img
          src={Illustration}
          alt="Illustration"
          className="max-w-xl w-full object-contain relative z-10"
        />
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center bg-white px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-10">
            <img src={Logo} alt="Logo" className="w-24 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
              KKP-ASTA
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username / Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-6 text-sm">
            Lupa password?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Hubungi admin.
            </a>
          </div>

          <p className="text-xs text-gray-400 text-center mt-12">
            Versi 1.0.0 © 2025 KKP-ASTA
          </p>
        </div>
      </div>
    </div>
  );
}