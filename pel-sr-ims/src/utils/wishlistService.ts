import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase";
import type { Student, WishlistItem, WishlistStatus } from "./types";

function toWishlistItem(id: string, raw: any): WishlistItem {
  return {
    ...raw,
    id,
    createdAt: raw.createdAt?.toDate ? raw.createdAt.toDate() : new Date(raw.createdAt),
    updatedAt: raw.updatedAt?.toDate ? raw.updatedAt.toDate() : raw.updatedAt,
    reviewedAt: raw.reviewedAt?.toDate ? raw.reviewedAt.toDate() : raw.reviewedAt,
  } as WishlistItem;
}

// Sorts client-side rather than via Firestore orderBy, so this doesn't depend on a
// composite index existing — fine at this project's scale.
function sortByCreatedAtDesc(items: WishlistItem[]): WishlistItem[] {
  return [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// Student-facing: add an item to their own wishlist. Always starts as "Requested" —
// only staff can move it forward (see updateWishlistStatus). Firestore's addDoc
// rejects any field whose value is literally `undefined` (it must be omitted
// entirely), so optional fields left blank by the caller are stripped here rather
// than trusting every call site to omit the key itself.
export async function addWishlistItem(
  student: Student,
  item: { name: string; approxCost?: number; link?: string; photoUrl?: string }
): Promise<string> {
  if (!student.id || !student.location) throw new Error("Student is missing id/location");

  const cleanedItem = Object.fromEntries(
    Object.entries(item).filter(([, value]) => value !== undefined)
  );

  const ref = await addDoc(collection(db, "wishlistItems"), {
    studentId: student.id,
    studentLocation: student.location,
    studentName: `${student.firstName} ${student.lastName}`,
    ...cleanedItem,
    status: "Requested" as WishlistStatus,
    createdAt: new Date(),
  });
  return ref.id;
}

export async function loadWishlistForStudent(location: string, studentId: string): Promise<WishlistItem[]> {
  const q = query(
    collection(db, "wishlistItems"),
    where("studentLocation", "==", location),
    where("studentId", "==", studentId)
  );
  const snap = await getDocs(q);
  return sortByCreatedAtDesc(snap.docs.map((d) => toWishlistItem(d.id, d.data())));
}

// Staff review queue, optionally filtered to a single status (e.g. just "Requested").
export async function loadAllWishlistRequests(statusFilter?: WishlistStatus): Promise<WishlistItem[]> {
  const clauses = statusFilter ? [where("status", "==", statusFilter)] : [];
  const q = query(collection(db, "wishlistItems"), ...clauses);
  const snap = await getDocs(q);
  return sortByCreatedAtDesc(snap.docs.map((d) => toWishlistItem(d.id, d.data())));
}

export async function updateWishlistStatus(
  id: string,
  status: WishlistStatus,
  reviewedBy: string,
  options?: { staffNote?: string; linkedPrizeItemId?: string }
): Promise<void> {
  await updateDoc(doc(db, "wishlistItems", id), {
    status,
    reviewedBy,
    reviewedAt: new Date(),
    updatedAt: new Date(),
    ...(options?.staffNote !== undefined ? { staffNote: options.staffNote } : {}),
    ...(options?.linkedPrizeItemId !== undefined ? { linkedPrizeItemId: options.linkedPrizeItemId } : {}),
  });
}

// Student retracting their own still-pending request.
export async function deleteWishlistItem(id: string): Promise<void> {
  await deleteDoc(doc(db, "wishlistItems", id));
}

export function getWishlistProgress(
  item: WishlistItem,
  currentBalance: number,
  linkedPrizePrice?: number
): { pct: number; remaining: number; targetPrice: number } {
  const targetPrice = linkedPrizePrice ?? item.approxCost ?? 0;
  if (targetPrice <= 0) return { pct: 0, remaining: 0, targetPrice: 0 };

  const pct = Math.min(100, Math.round((currentBalance / targetPrice) * 100));
  const remaining = Math.max(0, targetPrice - currentBalance);
  return { pct, remaining, targetPrice };
}
