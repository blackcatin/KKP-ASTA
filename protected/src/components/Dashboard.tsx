import { Link, Outlet } from "react-router-dom";

export default function Dashboard() {
    return (
        <div className="flex min-h-screen">

            <div className="flex flex-col w-64 p-4 text-white bg-green-700">
                <div className="flex items-center mb-6">
                    <h1 className="text-2xl font-bold">Menu</h1>
                </div>
                <nav className="flex-1 space-y-2">
                    <Link to="/dashboard/staff" className="block p-2 font-semibold">Staff</Link>
                    <Link to="/dashboard/transaction" className="block p-2 font-semibold">Transaksi</Link>
                    <Link to="/dashboard/stocks" className="block p-2 font-semibold">Stok</Link>
                    <Link to="/dashboard/reports" className="block p-2 font-semibold">Laporan</Link>
                    <Link to="/logout" className="bottom-0 block p-2 font-semibold">Log Out</Link>
                </nav>
                <div className="mt-auto"></div>
            </div>

            <div className="flex-1 p-8 bg-gray-100">
                <Outlet />
            </div>
        </div>
    )
}