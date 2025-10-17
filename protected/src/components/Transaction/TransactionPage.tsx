import { useEffect, useState } from "react";
import { Loader2, Save, Trash2, PlusCircle } from "lucide-react";
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

export default function TransactionPage() {
  const [transactionType, setTransactionType] = useState("penjualan");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [items, setItems] = useState<TransactionItem[]>([
    { itemId: null, quantity: 1 },
  ]);

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

  useEffect(() => {
    setLoading(true);
    fetchMasterItems();
  }, []);

  const calculateTotalAmount = () => amount || 0;

  const addItem = () => setItems([...items, { itemId: null, quantity: 1 }]);

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = <Q extends keyof TransactionItem>(
    index: number,
    field: Q,
    value: TransactionItem[Q]
  ) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Data transaksi siap dikirim", {
      transactionType,
      description,
      amount,
      items,
    });

    const user_id = 1;
    if (!description || !user_id) {
      setError("Keterangan dan Id pengguna harus diisi");
      return;
    }

    const finalAmount = calculateTotalAmount();
    const finalItems =
      transactionType === "penjualan" || transactionType === "pembelian"
        ? items.filter((it) => it.itemId !== null)
        : [];

    if (
      (transactionType === "penjualan" || transactionType === "pembelian") &&
      finalItems.length === 0
    ) {
      setError("Harap tambahkan minimal 1 item");
      return;
    }

    const payload = {
      user_id,
      transactionType,
      description,
      amount: finalAmount,
      items: finalItems,
    };

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mencatat transaksi");
      }

      alert("Transaksi berhasil dicatat!");
      setItems([{ itemId: null, quantity: 1 }]);
      setDescription("");
      setAmount("");
    } catch (error) {
      if (error instanceof Error) setError(error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Memuat data item...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-transparent">
      <h2 className="mb-8 text-3xl font-semibold text-gray-800">
        Pencatatan Transaksi
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Tipe Transaksi
          </label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="penjualan">Penjualan (Kas Masuk)</option>
            <option value="pembelian">Pembelian (Stok Masuk / Biaya)</option>
            <option value="biaya_operasional">Biaya Operasional</option>
            <option value="gaji">Gaji</option>
            <option value="pajak">Pajak</option>
          </select>
        </div>

        {(transactionType === "penjualan" ||
          transactionType === "pembelian") && (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Daftar Item
            </h3>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <select
                    value={item.itemId || ""}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "itemId",
                        parseInt(e.target.value)
                      )
                    }
                    className="flex-1 bg-white border border-gray-300 text-gray-900 text-sm 
                               rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  >
                    <option value="" disabled>
                      Pilih item
                    </option>
                    {masterItems.map((mItem) => (
                      <option key={mItem.id} value={mItem.id}>
                        {mItem.item_name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        parseInt(e.target.value)
                      )
                    }
                    min="1"
                    className="w-28 bg-white border border-gray-300 text-gray-900 text-sm 
                               rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                    placeholder="Qty"
                  />

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItem}
              className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <PlusCircle className="w-4 h-4" /> Tambah item
            </button>
          </div>
        )}


        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Jumlah Total (Rp)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            placeholder="Contoh: 50000"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                       rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Keterangan / Catatan Transaksi
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Tuliskan catatan transaksi..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 
          rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-400 transition-colors duration-150"
          style={{ color:"white" }}
          >
          X Batal
        </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white 
                       bg-[var(--secondary)] hover:opacity-90 rounded-lg 
                       focus:ring-2 focus:ring-[var(--secondary)] disabled:opacity-70"
            style={{ backgroundColor: "var(--color-secondary)", color:"white" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Catat Transaksi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
