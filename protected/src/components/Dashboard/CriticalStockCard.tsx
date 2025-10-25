import { useTheme } from "../../context/ThemeContext";

interface Item {
  id: number;
  name: string;
  current_stock: number;
  min_stock?: number;
  is_trackable?: boolean;
}

interface CriticalStockCardProps {
  items: Item[];
  className?: string;
}

export default function CriticalStockCard({ items, className }: CriticalStockCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`
        p-6 rounded-xl shadow-md border transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl
        ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} ${className ?? ""}
      `}
    >
      <h3 className={`pb-2 mb-4 text-xl font-semibold border-b ${isDark ? "border-gray-600 text-gray-100" : "border-gray-300 text-gray-800"}`}>
        Peringatan Stok Rendah
      </h3>
      {items.length === 0 ? (
        <p className={isDark ? "text-gray-300" : "text-gray-500"}>Semua stok aman.</p>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {items.map(item => (
            <li
              key={item.id}
              className={`flex justify-between p-2 rounded-md items-center ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
            >
              <span className="font-medium">{item.name}</span>
              <span className="text-sm font-semibold text-red-500">{item.current_stock}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
