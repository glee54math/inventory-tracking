import { useEffect, useState } from "react";
import {
  addWishlistItem,
  deleteWishlistItem,
  getWishlistProgress,
  loadWishlistForStudent,
} from "../../utils/wishlistService";
import type { Student, WishlistItem } from "../../utils/types";

interface WishlistPanelProps {
  student: Student;
}

const STATUS_BADGE_CLASSES: Record<WishlistItem["status"], string> = {
  Requested: "bg-gray-100 text-gray-600",
  UnderReview: "bg-amber-100 text-amber-700",
  Approved: "bg-blue-100 text-blue-700",
  Stocked: "bg-emerald-100 text-emerald-700",
  Declined: "bg-red-100 text-red-600",
};

export default function WishlistPanel({ student }: WishlistPanelProps) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [approxCost, setApproxCost] = useState("");
  const [link, setLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadItems = async () => {
    if (!student.id || !student.location) return;
    const data = await loadWishlistForStudent(student.location, student.id);
    setItems(data);
  };

  useEffect(() => {
    setLoading(true);
    loadItems().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student.id, student.location]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await addWishlistItem(student, {
        name: name.trim(),
        approxCost: approxCost ? Number(approxCost) : undefined,
        link: link.trim() || undefined,
      });
      setName("");
      setApproxCost("");
      setLink("");
      await loadItems();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteWishlistItem(id);
    await loadItems();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <form onSubmit={handleAdd} className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Something you want..."
          className="flex-1 min-w-[150px] px-3 py-2 border rounded-xl text-sm"
        />
        <input
          type="number"
          min={0}
          value={approxCost}
          onChange={(e) => setApproxCost(e.target.value)}
          placeholder="~Cost (PEL)"
          className="w-28 px-3 py-2 border rounded-xl text-sm"
        />
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Link (optional)"
          className="flex-1 min-w-[150px] px-3 py-2 border rounded-xl text-sm"
        />
        <button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="px-4 py-2 !bg-emerald-500 text-white rounded-xl text-sm font-medium hover:!bg-emerald-600 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-gray-400">Loading wishlist...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          Nothing on your wishlist yet. Add something to work toward!
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const { pct, remaining, targetPrice } = getWishlistProgress(item, student.pelBalance ?? 0);
            return (
              <li key={item.id} className="border rounded-xl p-3">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noreferrer" className="font-medium text-sm text-blue-600 hover:underline">
                        {item.name}
                      </a>
                    ) : (
                      <p className="font-medium text-sm">{item.name}</p>
                    )}
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${STATUS_BADGE_CLASSES[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                  {item.status === "Requested" && (
                    <button
                      onClick={() => handleDelete(item.id!)}
                      className="text-xs text-gray-400 hover:text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {targetPrice > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {remaining > 0 ? `${remaining} more PEL to go` : "You can afford this!"}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
