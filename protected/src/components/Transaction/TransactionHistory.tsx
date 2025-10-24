import { Calendar, Eye, Plus, Search, ListFilter, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "../Layout/Modal";
import TransactionForm from "./TransactionForm";
import TransactionView from "./TransactionView";
import { useTheme } from "../../context/ThemeContext";
interface TransactionItem {
  item_name: string;
  quantity: number;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  nota_photo_url: string | null;
  user_full_name: string;
  items: TransactionItem[];
  type_name: string;
  type_flow: string;
  created_at: number | string;
}

type SortKey = keyof Pick<Transaction, "id" | "description" | "type_name" | "amount" | "created_at">;
type SortOrder = "asc" | "desc";

export default function TransactionHistory() {
  const { theme } = useTheme();
  const [transactions, setTransaction] = useState<Transaction[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/transactions`);
      if (!response.ok) throw new Error("Gagal memuat transaksi");
      const data = await response.json();
      setTransaction(data);
    } catch (error) {
      if (error instanceof Error) setError(error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

  const handleSuccess = () => {
    setIsAddModalOpen(false);
    fetchTransactions();
  };

  const filtered = transactions.filter((trx) =>
    trx.description?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let valA: any = a[sortKey];
    let valB: any = b[sortKey];

    if (sortKey === "created_at") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }

    if (typeof valA === "string" && typeof valB === "string") {
      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }

    return 0;
  });

  const totalPages = Math.ceil(sorted.length / entries);
  const startIndex = (page - 1) * entries;
  const displayed = sorted.slice(startIndex, startIndex + entries);

  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => (
    <ArrowUpDown
      size={16}
      className={`inline-block ml-1 transition-transform ${sortKey === column
          ? sortOrder === "asc"
            ? "rotate-180 text-[var(--color-secondary)]"
            : "text-[var(--color-secondary)]"
          : "text-gray-400 dark:text-gray-500"
        }`}
    />
  );

  return (
    <div className={theme === "dark" ? "bg-gray-900 text-gray-100 min-h-full" : "bg-gray-50 text-gray-900 min-h-full"}>
      <h2 className="mb-6 text-2xl font-bold transition-colors">{`Transaksi`}</h2>

      {loading && <p className="text-gray-500">Memuat data...</p>}
      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-200 border border-red-400 rounded-lg dark:bg-red-900/30 dark:border-red-700">
          {error}
        </div>
      )}

      <div className={`p-5 rounded-lg shadow transition-colors ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        }`}>
        <div className="flex flex-col items-center justify-between gap-2 mb-4 md:flex-row">
          <div className="flex items-center w-full gap-2 md:w-auto">
            <div className="relative w-full md:w-60">
              <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-gray-400"}`} />
              <input
                type="text"
                placeholder="Cari..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className={`w-full px-8 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] ${theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
              />
            </div>

            <div className={`flex items-center gap-1 px-2 py-1 border rounded-lg text-sm ${theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-100" : "border-gray-300 bg-gray-50 text-gray-700"
              }`}>
              <ListFilter size={16} className={`${theme === "dark" ? "text-gray-300" : "text-gray-500"}`} />
              <select
                value={entries}
                onChange={(e) => {
                  setEntries(Number(e.target.value));
                  setPage(1);
                }}
                className={`bg-transparent border-none focus:outline-none cursor-pointer ${theme === "dark" ? "bg-gray-700 text-gray-100" : "bg-gray-50 text-gray-900"
                  }`}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n} className={theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition rounded-lg shadow-md hover:opacity-90"
            style={{ backgroundColor: "var(--color-secondary)" }}
          >
            <Plus className="w-4 h-4" /> Tambah Transaksi
          </button>
        </div>

        <div className={`relative overflow-x-auto rounded-lg transition-colors ${theme === "dark" ? "border border-gray-700" : "border border-gray-200"
          }`}>
          <table className={`w-full text-sm text-left transition-colors ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
            <thead className={`uppercase transition-colors ${theme === "dark" ? "bg-gray-700 text-gray-100 border-b border-gray-600" : "bg-gray-100 text-gray-700 border-b border-gray-300"
              }`}>
              <tr>
                {["Tanggal", "Deskripsi", "Tipe", "Nominal", "Aksi"].map((title, idx) => (
                  <th
                    key={title}
                    className={`p-3 border-b cursor-pointer select-none whitespace-nowrap transition-colors ${theme === "dark" ? "hover:bg-gray-600 border-gray-600" : "hover:bg-gray-200 border-gray-300"
                      }`}
                    onClick={() => {
                      if (idx === 0) handleSort("created_at");
                      else if (idx === 1) handleSort("description");
                      else if (idx === 2) handleSort("type_name");
                      else if (idx === 3) handleSort("amount");
                    }}
                  >
                    <div className={`flex items-center gap-1 ${theme === "dark" ? "text-gray-100" : "text-gray-700"}`}>
                      {title}
                      {idx !== 4 && (
                        <SortIcon
                          column={
                            idx === 0
                              ? "created_at"
                              : idx === 1
                                ? "description"
                                : idx === 2
                                  ? "type_name"
                                  : "amount"
                          }
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className={`transition-colors ${theme === "dark" ? "divide-y divide-gray-700" : "divide-y divide-gray-200"
              }`}>
              {displayed.length > 0 ? (
                displayed.map((trx) => (
                  <tr key={trx.id} className={`transition ${theme === "dark" ? "hover:bg-gray-700 border-b border-gray-600" : "hover:bg-gray-100 border-b border-gray-200"
                    }`}>
                    <td className="p-3 border-b whitespace-nowrap">
                      <Calendar size={14} className="inline mr-1 text-gray-500" />
                      {new Date(trx.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-3 border-b">{trx.description || "-"}</td>
                    <td className={`p-3 border-b font-medium ${trx.type_flow === "masuk" ? "text-green-700" : "text-red-700"
                      }`}>{trx.type_name}</td>
                    <td className={`p-3 border-b text-right ${trx.type_flow === "masuk" ? "text-green-700" : "text-red-700"
                      }`}>{formatRupiah(trx.amount)}</td>
                    <td className="p-3 text-right border-b">
                      <button
                        onClick={() => {
                          setCurrentTransaction(trx);
                          setIsViewModalOpen(true);
                        }}
                        className="p-1 text-gray-600 transition-colors rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500 dark:text-gray-400">
                    Belum ada transaksi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        <div className={`flex items-center justify-center gap-4 mt-4 text-sm transition-colors ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          <button
            onClick={prevPage}
            disabled={page === 1}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>
          <span>{page}/{totalPages || 1}</span>
          <button
            onClick={nextPage}
            disabled={page === totalPages || totalPages === 0}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={handleSuccess} title="Tambah Transaksi">
        <TransactionForm
          currentTransaction={null}
          onSuccess={handleSuccess}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Detail #${currentTransaction?.id}`}
      >
        {currentTransaction && (
          <TransactionView
            currentTransaction={currentTransaction}
            onCancel={() => setIsViewModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}
