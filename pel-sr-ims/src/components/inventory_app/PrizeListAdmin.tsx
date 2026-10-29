// PrizeListAdmin.tsx
// Admin page for managing the purchase/price list shown as buttons at the Scan
// Station's Spend panel.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNameContext } from "./NameContext";
import { createPrizeItem, loadPrizeItems, updatePrizeItem } from "../../utils/pelDollarsService";
import type { PrizeItem } from "../../utils/types";

export default function PrizeListAdmin() {
  const navigate = useNavigate();
  const { nameOfWorker } = useNameContext();
  const [items, setItems] = useState<PrizeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAll = async () => {
    const data = await loadPrizeItems(false);
    setItems(data);
  };

  useEffect(() => {
    loadAll().finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !price) return;

    setIsSubmitting(true);
    try {
      await createPrizeItem(
        {
          code: code.trim(),
          name: name.trim(),
          price: Number(price),
          category: category.trim() || undefined,
          active: true,
          sortOrder: items.length,
        },
        nameOfWorker
      );
      setCode("");
      setName("");
      setPrice("");
      setCategory("");
      await loadAll();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (item: PrizeItem) => {
    await updatePrizeItem(item.id!, { active: !item.active }, nameOfWorker);
    await loadAll();
  };

  return (
    <div className="fixed inset-0 bg-gray-50 p-6 overflow-auto z-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">PEL Dollars Prize List</h1>
        <button
          onClick={() => navigate("/")}
          className="px-3 py-1.5 text-sm border rounded border-gray-400 text-gray-700 hover:!bg-gray-200"
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleAdd} className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-2 items-end">
        <div>
          <label className="block text-xs text-gray-500">Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} className="px-2 py-1 border rounded w-28" />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="px-2 py-1 border rounded w-48" />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Price (PEL)</label>
          <input
            type="number"
            min={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="px-2 py-1 border rounded w-24"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Category (optional)</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} className="px-2 py-1 border rounded w-32" />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !code.trim() || !name.trim() || !price}
          className="px-4 py-2 !bg-blue-200 hover:!bg-blue-300 rounded disabled:opacity-50"
        >
          Add Prize
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <table className="w-full bg-white rounded shadow text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Code</th>
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Category</th>
              <th className="p-2">Status</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.code}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.price}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2">{item.active ? "Active" : "Inactive"}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleToggleActive(item)}
                    className="text-xs px-2 py-1 !bg-gray-200 hover:!bg-gray-300 rounded"
                  >
                    {item.active ? "Deactivate" : "Reactivate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
