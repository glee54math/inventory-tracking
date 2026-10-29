import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import type { PlanningItem, PlanningCategory } from "./types";

const COLLECTION_NAME = "planningItems";

export function subscribeToPlanningItems(onChange: (items: PlanningItem[]) => void) {
  const itemsQuery = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));

  return onSnapshot(itemsQuery, (snapshot) => {
    const items: PlanningItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        category: data.category,
        text: data.text,
        notes: data.notes,
        completed: data.completed ?? false,
        createdAt: data.createdAt?.toDate() ?? new Date(),
        completedAt: data.completedAt?.toDate(),
      });
    });
    onChange(items);
  });
}

export async function addPlanningItem(category: PlanningCategory, text: string, notes?: string) {
  await addDoc(collection(db, COLLECTION_NAME), {
    category,
    text,
    ...(notes ? { notes } : {}),
    completed: false,
    createdAt: new Date(),
  });
}

export async function togglePlanningItemComplete(id: string, completed: boolean) {
  const ref = doc(db, COLLECTION_NAME, id);
  await updateDoc(ref, {
    completed,
    completedAt: completed ? new Date() : null,
  });
}

export async function deletePlanningItem(id: string) {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}
