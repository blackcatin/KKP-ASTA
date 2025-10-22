// TransactionView.tsx
import { Calendar, X } from "lucide-react";
import React from "react";

interface TransactionItem {
    item_name: string;
    quantity: number;
}
interface Transaction {
    id: number;
    description: string;
    amount: number | null;
    nota_photo_url?: string | null;
    user_full_name?: string | null;
    items?: TransactionItem[];
    type_name: string;
    type_flow: "masuk" | "keluar" | string;
    created_at: number | string,
}

interface TransactionProps {
    currentTransaction: Transaction;
    onCancel: () => void;
}

const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

export default function TransactionView({ currentTransaction, onCancel }: TransactionProps) {
    const trx = currentTransaction;

    if (!trx) {
        return (
            <div className="p-4 text-sm text-gray-500">Transaksi tidak tersedia</div>
        );
    }

    const flowColor = trx.type_flow === "masuk" ? "text-green-600" : "text-orange-600";
    const flowBg = trx.type_flow === "masuk" ? "bg-green-50" : "bg-orange-50";

    const dateLabel = trx.created_at ? new Date(trx.created_at).toLocaleDateString("id-ID") : "-";

    return (
        <div className="bg-white border border-gray-100 shadow-md rounded-xl">

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <InfoBlock title="Status" value={trx.type_name} color={flowColor} bgColor={flowBg} />
                <InfoBlock title="Tanggal" value={dateLabel} icon={<Calendar size={14} />} />
                <InfoBlock title="Dibuat Oleh" value={trx.user_full_name || "N/A"} />
                <InfoBlock title="Nominal Total" value={trx.amount != null ? formatRupiah(trx.amount) : "-"} color={flowColor} />
            </div>

            {trx.items && trx.items.length > 0 && (
                <div className="mb-6">
                    <h4 className="mb-2 font-semibold text-gray-700">Item Terlibat:</h4>
                    <ul className="space-y-1 text-sm">
                        {trx.items.map((item, index) => (
                            <li key={index} className="flex justify-between pb-1 border-b">
                                <span>{item.item_name}</span>
                                <span className="font-medium">{item.quantity} unit</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="p-3 mb-6 rounded-lg bg-gray-50">
                <p className="mb-1 text-xs font-medium text-gray-500">Keterangan:</p>
                <p className="text-sm text-gray-800">{trx.description || "-"}</p>
            </div>

            {trx.nota_photo_url && (
                <div className="mb-6">
                    <h4 className="mb-2 font-semibold text-gray-700">Nota Transaksi:</h4>
                    <div className="flex justify-center mb-2">
                        <img
                            src={`${import.meta.env.VITE_API_URL?.replace(/\/$/, "")}${trx.nota_photo_url}`}
                            alt="Nota transaksi"
                            className="object-contain border rounded-lg shadow-sm max-h-64"
                        />
                    </div>
                    <div className="text-center">
                        <a
                            href={`${import.meta.env.VITE_API_URL?.replace(/\/$/, "")}${trx.nota_photo_url}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:underline"
                        >
                            Download Nota
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

type InfoBlockProps = {
    title: string;
    value: string | number | React.ReactNode;
    color?: string;
    icon?: React.ReactNode;
    bgColor?: string;
};

const InfoBlock: React.FC<InfoBlockProps> = ({ title, value, color, icon, bgColor }) => (
    <div className={`p-2 rounded-lg ${bgColor || "bg-gray-100"}`}>
        <p className="text-xs font-medium text-gray-500">{title}</p>
        <div className={`text-sm font-semibold mt-0.5 ${color || "text-gray-800"}`}>
            <span className="inline-flex items-center gap-2">
                {icon}
                <span>{value}</span>
            </span>
        </div>
    </div>
);
