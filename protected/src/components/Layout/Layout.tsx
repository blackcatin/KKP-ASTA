import { Link, Outlet, useLocation } from "react-router-dom";
import React from "react";
import Logo from "../../assets/Image/Logo.png";
import {
  Home,
  Users,
  ShoppingCart,
  Package,
  BarChart2,
  Layers,
  LogOut,
} from "lucide-react";

const Layout: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard/home", label: "Home", icon: <Home className="w-5 h-5" /> },
    { path: "/dashboard/staff", label: "Staff", icon: <Users className="w-5 h-5" /> },
    { path: "/dashboard/transaction", label: "Transaksi", icon: <ShoppingCart className="w-5 h-5" /> },
    { path: "/dashboard/items", label: "Stok Barang", icon: <Package className="w-5 h-5" /> },
    { path: "/dashboard/reports", label: "Laporan", icon: <BarChart2 className="w-5 h-5" /> },
    { path: "/dashboard/categories", label: "Kategori", icon: <Layers className="w-5 h-5" /> },
    { path: "/logout", label: "Logout", icon: <LogOut className="w-5 h-5" /> },
  ];

  return (
    <>
<nav
  className="fixed top-0 z-50 w-full border-b border-white/20 shadow-sm 
    flex items-center justify-between px-4 py-3"
  style={{ backgroundColor: "var(--color-primary)", color: "white" }}
>
  <div className="flex items-center space-x-3">
    <img src={Logo} className="h-8 rounded-lg" alt="Logo" />
    <span className="text-xl font-semibold drop-shadow-sm">
      KKP-ASTA
    </span>
  </div>
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
      {menuItems.map((item) => (
        <li key={item.path} className="relative overflow-hidden rounded-lg">
          <Link
            to={item.path}
            className={`flex items-center p-2 rounded-lg group transition-all duration-200
              ${
                location.pathname === item.path
                  ? "bg-white/30 text-white shadow-sm"
                  : "text-white hover:bg-white/20"
              }`}
          >
            {item.icon}
            <span className="ms-3">{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
</aside>

      <div className="p-4 sm:ml-64">
        <div className="p-4 glass-bg border border-white/20 rounded-lg shadow-md mt-14">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
