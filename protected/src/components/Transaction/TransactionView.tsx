import { Calendar } from "lucide-react";
import React from "react";
import { useTheme } from "../../context/ThemeContext"; 

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
    created_at: number | string;
}

interface TransactionProps {
    currentTransaction: Transaction;
    onCancel: () => void;
}

const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

export default function TransactionView({ currentTransaction }: TransactionProps) {
    const { theme } = useTheme(); 
    const trx = currentTransaction;

    if (!trx) {
        return (
            <div className={`p-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Transaksi tidak tersedia
            </div>
        );
    }

    const flowColor = trx.type_flow === "masuk" ? "text-green-600" : "text-orange-600";
    const flowBg = trx.type_flow === "masuk" ? "bg-green-50" : "bg-orange-50";
    const darkFlowBg = trx.type_flow === "masuk" ? "bg-green-900/30" : "bg-orange-900/30";
    const darkFlowColor = trx.type_flow === "masuk" ? "text-green-400" : "text-orange-400";

    const dateLabel = trx.created_at ? new Date(trx.created_at).toLocaleDateString("id-ID") : "-";

    return (
        <div className={`rounded-xl shadow-md p-4 space-y-4 transition-colors ${
            theme === "dark" ? "bg-gray-800 border border-gray-700 text-gray-100" : "bg-white border border-gray-100 text-gray-900"
        }`}>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <InfoBlock 
                    title="Status" 
                    value={trx.type_name} 
                    color={theme === "dark" ? darkFlowColor : flowColor} 
                    bgColor={theme === "dark" ? darkFlowBg : flowBg} 
                />
                <InfoBlock title="Tanggal" value={dateLabel} icon={<Calendar size={14} />} />
                <InfoBlock title="Dibuat Oleh" value={trx.user_full_name || "N/A"} />
                <InfoBlock 
                    title="Nominal Total" 
                    value={trx.amount != null ? formatRupiah(trx.amount) : "-"} 
                    color={theme === "dark" ? darkFlowColor : flowColor} 
                />
            </div>

            {trx.items && trx.items.length > 0 && (
                <div>
                    <h4 className={`mb-2 font-semibold text-sm ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>Item Terlibat:</h4>
                    <ul className="space-y-1 text-sm">
                        {trx.items.map((item, index) => (
                            <li 
                                key={index} 
                                className={`flex justify-between pb-1 border-b ${
                                    theme === "dark" ? "border-gray-700" : "border-gray-300"
                                }`}
                            >
                                <span>{item.item_name}</span>
                                <span className="font-medium">{item.quantity} unit</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={`p-3 rounded-lg text-sm transition-colors ${
                theme === "dark" ? "bg-gray-700 text-gray-100" : "bg-gray-50 text-gray-800"
            }`}>
                <p className={`mb-1 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Keterangan:</p>
                <p>{trx.description || "-"}</p>
            </div>

            {trx.nota_photo_url && (
                <div>
                    <h4 className={`mb-2 font-semibold text-sm ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>Nota Transaksi:</h4>
                    <div className="flex justify-center mb-2">
                        <img
                            src={`${import.meta.env.VITE_API_URL?.replace(/\/$/, "")}${trx.nota_photo_url}`}
                            alt="Nota transaksi"
                            className="object-contain border rounded-lg shadow-sm max-h-64"
                        />
                    </div>
                    <div className="text-center">
                        <button
                            onClick={() => {
                                const link = document.createElement("a");
                                link.href = `${import.meta.env.VITE_API_URL?.replace(/\/$/, "")}${trx.nota_photo_url}`;
                                link.download = trx.nota_photo_url?.split("/").pop() || "nota.jpg";
                                link.target = "_blank";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                theme === "dark" ? "bg-gray-600 text-gray-100 hover:bg-[var(--color-secondary)]" : "bg-gray-500 text-white hover:bg-[var(--color-secondary)]"
                            }`}
                        >
                            Download Nota
                        </button>
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

const InfoBlock: React.FC<InfoBlockProps> = ({ title, value, color, icon, bgColor }) => {
    const { theme } = useTheme();
    return (
        <div className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "bg-gray-700" : bgColor || "bg-gray-100"}`}>
            <p className={`text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{title}</p>
            <div className={`text-sm font-semibold mt-0.5 ${theme === "dark" ? "text-gray-100" : color || "text-gray-800"}`}>
                <span className="inline-flex items-center gap-2">
                    {icon}
                    <span>{value}</span>
                </span>
            </div>
        </div>
    );
};
