import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Logo from "../../assets/Image/Logo.png";
import {
  Home,
  Users,
  ShoppingCart,
  Package,
  BarChart2,
  Layers,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import axios from "axios";

const getInitialTheme = (): "light" | "dark" => {
  if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
    return localStorage.getItem("theme") as "light" | "dark";
  }
  return "light";
};

const Layout: React.FC = () => {
  const location = useLocation();
  const nav = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const role = localStorage.getItem("role");

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/users/logout`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("✅ Logout berhasil");
    } catch (error) {
      console.error("❌ Gagal logout", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      nav("/login");
    }
  };


  const menuItems = [
    { path: "/dashboard/home", label: "Home", icon: <Home className="w-5 h-5" />, roles: ['owner', 'staff'] },
    { path: "/dashboard/staff", label: "Staff", icon: <Users className="w-5 h-5" />, roles: ['owner'] },
    { path: "/dashboard/transaction", label: "Transaksi", icon: <ShoppingCart className="w-5 h-5" />, roles: ['owner', 'staff'] },
    { path: "/dashboard/items", label: "Stok Barang", icon: <Package className="w-5 h-5" />, roles: ['owner', 'staff'] },
    { path: "/dashboard/reports", label: "Laporan", icon: <BarChart2 className="w-5 h-5" />, roles: ['owner'] },
    { path: "/dashboard/categories", label: "Kategori", icon: <Layers className="w-5 h-5" />, roles: ['owner'] },
    { path: "/logout", label: "Logout", icon: <LogOut className="w-5 h-5" />, roles: ['owner', 'staff'] },
  ];

  return (
    <>
      <nav
        className="fixed top-0 z-50 flex items-center justify-between w-full px-4 py-3 border-b shadow-sm border-white/20"
        style={{ backgroundColor: "var(--color-primary)", color: "white" }}
      >
        <div className="flex items-center space-x-3">
          <img src={Logo} className="h-8 rounded-lg" alt="Logo" />
          <span className="text-xl font-semibold drop-shadow-sm">KKP-ASTA</span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 transition-colors duration-200 rounded-full hover:bg-white/20"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "light" ? (
            <Moon className="w-6 h-6 text-white" />
          ) : (
            <Sun className="w-6 h-6 text-white" />
          )}
        </button>
      </nav>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform 
        -translate-x-full border-r border-white/20 sm:translate-x-0 backdrop-blur-lg shadow-md
        bg-[var(--color-primary)]"
        style={{ backgroundColor: "var(--color-primary)", color: "white" }}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {menuItems
              .filter(item => item.roles.includes(role || ''))
              .map((item) => (
                <li key={item.path} className="relative overflow-hidden rounded-lg">
                  {item.path === "/logout" ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full p-2 text-white transition-all duration-200 rounded-lg hover:bg-red-500/30 hover:text-red-200"
                    >
                      {item.icon}
                      <span className="ms-3">{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center p-2 rounded-lg transition-all duration-200 ${location.pathname === item.path
                        ? "bg-white/30 text-white shadow-sm"
                        : "text-white hover:bg-white/20"
                        }`}
                    >
                      {item.icon}
                      <span className="ms-3">{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
          </ul>
        </div>
      </aside>

      <div
        className={`p-4 sm:ml-64 min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-white"
          }`}
      >
        <div className="p-4 border rounded-lg shadow-md glass-bg border-white/20 mt-14">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
