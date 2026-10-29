// WishlistReviewAdmin.tsx
// Staff/admin review queue for student wishlist requests, so the tutor can decide
// what's actually worth stocking/buying.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNameContext } from "./NameContext";
import { loadAllWishlistRequests, updateWishlistStatus } from "../../utils/wishlistService";
import { loadPrizeItems } from "../../utils/pelDollarsService";
import { WISHLIST_STATUSES } from "../../utils/types";
import type { PrizeItem, WishlistItem, WishlistStatus } from "../../utils/types";

export default function WishlistReviewAdmin() {
  const navigate = useNavigate();
  const { nameOfWorker } = useNameContext();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [prizeItems, setPrizeItems] = useState<PrizeItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<WishlistStatus | "All">("All");
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    const [requests, prizes] = await Promise.all([
      loadAllWishlistRequests(statusFilter === "All" ? undefined : statusFilter),
      loadPrizeItems(true),
    ]);
    setItems(requests);
    setPrizeItems(prizes);
  };

  useEffect(() => {
    setLoading(true);
    loadAll().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (item: WishlistItem, status: WishlistStatus) => {
    await updateWishlistStatus(item.id!, status, nameOfWorker);
    await loadAll();
  };

  const handleLinkPrize = async (item: WishlistItem, prizeItemId: string) => {
    await updateWishlistStatus(item.id!, item.status, nameOfWorker, {
      linkedPrizeItemId: prizeItemId || undefined,
    });
    await loadAll();
  };

  return (
    <div className="fixed inset-0 bg-gray-50 p-6 overflow-auto z-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Wishlist Review</h1>
        <button
          onClick={() => navigate("/")}
          className="px-3 py-1.5 text-sm border rounded border-gray-400 text-gray-700 hover:!bg-gray-200"
        >
          ← Back
        </button>
      </div>

      <div className="mb-4">
        <label className="text-sm text-gray-500 mr-2">Filter by status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as WishlistStatus | "All")}
          className="px-2 py-1 border rounded"
        >
          <option value="All">All</option>
          {WISHLIST_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-400 italic">No wishlist requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded shadow p-4">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">
                Requested by {item.studentName} ({item.studentLocation})
              </p>
              {item.approxCost !== undefined && (
                <p className="text-sm text-gray-500">Approx cost: {item.approxCost} PEL</p>
              )}
              {item.link && (
                <a href={item.link} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                  View link
                </a>
              )}

              <div className="flex items-center gap-2 mt-3">
                <label className="text-xs text-gray-500">Status:</label>
                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item, e.target.value as WishlistStatus)}
                  className="px-2 py-1 border rounded text-sm"
                >
                  {WISHLIST_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <label className="text-xs text-gray-500">Link to prize list item:</label>
                <select
                  value={item.linkedPrizeItemId ?? ""}
                  onChange={(e) => handleLinkPrize(item, e.target.value)}
                  className="px-2 py-1 border rounded text-sm"
                >
                  <option value="">None</option>
                  {prizeItems.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.price} PEL)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
