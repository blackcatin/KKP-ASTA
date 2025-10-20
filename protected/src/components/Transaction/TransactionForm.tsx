import { useEffect, useState } from "react";
import { Loader2, Save, Trash2, PlusCircle, X } from "lucide-react";

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
  id: number,
  description: string,
  amount: number,
  type_name: string,
  type_flow: string,
  created_at: number
}

interface TransactionProps {
  currentTransaction: Transaction | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TransactionForm({ currentTransaction, onSuccess, onCancel }: TransactionProps) {
  const [transactionType, setTransactionType] = useState("pemakaian");
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

  const handleResetForm = () => {
    setTransactionType("penjualan");
    setDescription("");
    setAmount("");
    setItems([{ itemId: null, quantity: 1 }]);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Data transaksi siap dikirim", {
      transactionType,
      description,
      amount,
      items,
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const user_id = user?.id;
    if (!description.trim || !user_id) {
      setError("Keterangan dan Id pengguna harus diisi");
      return;
    }

    const finalAmount = transactionType === 'pemakaian' ? null : calculateTotalAmount();
    const finalItems =
      transactionType === "penjualan" || transactionType === "pembelian" || transactionType === 'pemakaian'
        ? items.filter((it) => it.itemId !== null)
        : [];

    console.log(finalItems, 'p');

    if (
      (transactionType === "penjualan" || transactionType === "pembelian") &&
      finalItems.length === 0
    ) {
      setError("Harap tambahkan minimal 1 item");
    }

    const payload = {
      user_id,
      transaction_type: transactionType,
      description,
      amount: finalAmount,
      items: finalItems,
    };

    console.log(payload.items);

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

      setItems([{ itemId: null, quantity: 1 }]);
      onSuccess();
    } catch (error) {
      if (error instanceof Error) setError(error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Memuat data item...</div>;

  return (
    <form onSubmit={handleSubmit} className="p-2 bg-transparent border border-gray-200 shadow-sm md:p-4 dark:border-gray-700 rounded-xl">
      <div >
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Tipe Transaksi
        </label>
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                      className="p-2 text-red-500 hover:text-red-700"
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
              className="flex items-center gap-2 mt-3 text-sm text-blue-600 hover:underline"
            >
              <PlusCircle className="w-4 h-4" /> Tambah item
            </button>
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
          </div>
        )}

      {(transactionType === 'pemakaian') && (
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
                    className="p-2 text-red-500 hover:text-red-700"
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
            className="flex items-center gap-2 mt-3 text-sm text-blue-600 hover:underline"
          >
            <PlusCircle className="w-4 h-4" /> Tambah item
          </button>
        </div>
      )}

      {(transactionType === 'biaya_operasional' ||
        transactionType === 'gaji' ||
        transactionType === 'pajak') && (
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
        )}

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Keterangan / Catatan Transaksi
        </label>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (error) setError(null);
          }}
          rows={4}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Tuliskan catatan transaksi..."
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors duration-150 bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-400"
          style={{ color: "white" }}
        >
          <X className="w-4 h-4 mr-2" /> Batal
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white 
                        bg-[var(--color-secondary)] hover:opacity-90 rounded-lg 
                        focus:ring-2 focus:ring-[var(--color-secondary)] disabled:opacity-70"
          style={{ color: "white" }}
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
  );
}
