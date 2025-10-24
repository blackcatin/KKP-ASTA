import { useEffect, useState } from "react";
import { Loader2, Save, Trash2, PlusCircle, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext"; 

interface TransactionItem {
  itemId: number | null;
  quantity: number;
  price?: number;
}

interface MasterItem {
  id: number;
  item_name: string;
  category: string;
  current_stock: number;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  nota__photo_url: string | null;
  type_name: string;
  type_flow: string;
  created_at: number;
}

interface TransactionProps {
  currentTransaction: Transaction | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TransactionForm({ onSuccess, onCancel }: TransactionProps) {
  const { theme } = useTheme();
  const [transactionType, setTransactionType] = useState("pemakaian");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [items, setItems] = useState<TransactionItem[]>([{ itemId: null, quantity: 1 }]);
  const [nota, setNota] = useState<File | null>(null);
  const [masterItems, setMasterItems] = useState<MasterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchMasterItems = async () => {
    try {
      const response = await fetch(`${apiUrl}/items`);
      if (!response.ok) throw new Error("Gagal menghubungkan dengan data item");
      const data = await response.json();
      setMasterItems(data);
      setError(null);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMasterItems(); }, []);

  const calculateTotalAmount = () => amount || 0;
  const addItem = () => setItems([...items, { itemId: null, quantity: 1 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const handleItemChange = <Q extends keyof TransactionItem>(index: number, field: Q, value: TransactionItem[Q]) =>
    setItems(items.map((item, i) => i === index ? { ...item, [field]: value } : item));
  const handleNotaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNota(file);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = user?.id;
    if (!description.trim() || !user_id) { setError("Keterangan dan Id pengguna harus diisi"); return; }

    const finalAmount = transactionType === 'pemakaian' ? null : calculateTotalAmount();
    const finalItems =
      (transactionType === "penjualan" || transactionType === "pembelian" || transactionType === 'pemakaian')
        ? items.filter(it => it.itemId !== null)
        : [];

    if ((transactionType === "penjualan" || transactionType === "pembelian") && finalItems.length === 0) {
      setError("Harap tambahkan minimal 1 item"); return;
    }

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('transaction_type', transactionType);
    formData.append('description', description);
    if (finalAmount !== null) formData.append('amount', String(finalAmount));
    if (nota) formData.append('nota', nota);
    formData.append('items', JSON.stringify(finalItems));

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/transactions`, { method: "POST", body: formData });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mencatat transaksi");
      }

      setItems([{ itemId: null, quantity: 1 }]);
      setNota(null);
      onSuccess();
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || "Server error");
    } finally { setLoading(false); }
  };

  if (loading) return <div className={`text-center py-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Memuat data item...</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-4 rounded-xl shadow-lg max-w-3xl mx-auto space-y-4 text-sm transition-colors ${
        theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {error && (
        <div className={`p-2 rounded border ${
          theme === "dark" ? "bg-red-900/30 border-red-700 text-red-200" : "bg-red-200 border-red-400 text-red-700"
        }`}>{error}</div>
      )}

      <div className="relative">
        <label className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>Tipe Transaksi</label>
        <div className="flex items-center gap-2 mt-1">
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className={`w-full pl-2 p-2 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm border ${
              theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-300 text-gray-900"
            }`}
          >
            <option value="pemakaian">Pemakaian</option>
            <option value="penjualan">Penjualan (Kas Masuk)</option>
            <option value="pembelian">Pembelian (Stok Masuk / Biaya)</option>
            <option value="operasional">Biaya Operasional</option>
            <option value="pemasukan">Pemasukan Dana</option>
            <option value="gaji">Gaji</option>
            <option value="pajak">Pajak</option>
          </select>
        </div>
      </div>

      {(transactionType === "penjualan" || transactionType === "pembelian" || transactionType === "pemakaian") && (
        <div className={`p-2 rounded-lg space-y-2 transition-colors ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
          <h3 className={`font-medium flex items-center gap-1 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>Daftar Item</h3>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                <select
                  value={item.itemId || ""}
                  onChange={(e) => handleItemChange(index, "itemId", parseInt(e.target.value))}
                  className={`flex-1 p-2 rounded-lg border text-sm ${
                    theme === "dark" ? "bg-gray-800 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="" disabled>Pilih item</option>
                  {masterItems.map(mItem => <option key={mItem.id} value={mItem.id}>{mItem.item_name}</option>)}
                </select>

                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  placeholder="Qty"
                  onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                  className={`w-20 p-2 rounded-lg border text-sm ${
                    theme === "dark" ? "bg-gray-800 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"
                  }`}
                />

                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} className="p-1 text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button type="button" onClick={addItem} className={`flex items-center gap-1 text-sm hover:underline ${
            theme === "dark" ? "text-blue-400" : "text-blue-600"
          }`}>
            <PlusCircle className="w-4 h-4" /> Tambah item
          </button>

          <div>
            <label className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>Jumlah Total (Rp)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              placeholder="Contoh: 50000"
              className={`w-full p-2 mt-1 rounded-lg border text-sm ${
                theme === "dark" ? "bg-gray-800 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>Upload Nota</label>
            <label className={`inline-flex items-center px-2 py-1 rounded-lg cursor-pointer text-sm transition ${
              theme === "dark" ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-300 text-gray-700 hover:bg-gray-200"
            }`}>
              Pilih File
              <input type="file" accept="image/*" onChange={handleNotaChange} className="hidden" />
            </label>
            {nota && <p className={`${theme === "dark" ? "text-gray-200" : "text-gray-700"} mt-1 text-sm`}>{nota.name}</p>}
          </div>
        </div>
      )}

      <div>
        <label className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>Keterangan / Catatan Transaksi</label>
        <textarea
          value={description}
          onChange={(e) => { setDescription(e.target.value); if (error) setError(null); }}
          rows={3}
          placeholder="Tuliskan catatan transaksi..."
          className={`w-full p-2 mt-1 rounded-lg border text-sm resize-none ${
            theme === "dark" ? "bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
      </div>

      <div className="flex flex-col md:flex-row justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          <X className="w-4 h-4" /> Batal
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-white bg-[var(--color-accent)] rounded-lg hover:opacity-90 disabled:opacity-90 transition"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4" /> Catat Transaksi</>}
        </button>
      </div>
    </form>
  );
}
