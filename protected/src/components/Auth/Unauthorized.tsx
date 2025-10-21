export default function Unauthorized() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-3xl font-bold text-red-600">403 - Akses Ditolak</h1>
            <p className="mt-2 text-gray-600">
                Kamu tidak punya izin untuk mengakses halaman ini 😢
            </p>
        </div>
    );
}
