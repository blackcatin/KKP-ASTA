import { Link, Outlet } from "react-router-dom";

export default function dashboard() {
    return (
        <div className="flex">
            <div className="w-64 h-screen p-4 text-white bg-green-600">
                <nav>
                    <Link to="/dashboard" className="block py-2"></Link>
                    <Link to="/dashboard/staff" className="block py-2">Staff</Link>
                    <Link to="/dashboard/transactions" className="block py-2">Transaksi</Link>
                    <Link to="/dashboard/stocks" className="block py-2">Stok</Link>
                    <Link to="/dashboard/report" className="block py-2">Laporan</Link>
                </nav>
            </div>

            <div className="flex-1 p-8">

            </div>
        </div >
    )
}