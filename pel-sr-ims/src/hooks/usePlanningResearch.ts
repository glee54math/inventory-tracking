import { useCallback, useEffect, useState } from "react";
import type { PlanningCategory, PlanningItem } from "../utils/types";
import {
  subscribeToPlanningItems,
  addPlanningItem,
  togglePlanningItemComplete,
  deletePlanningItem,
} from "../utils/planningResearchService";

export function usePlanningResearch() {
  const [items, setItems] = useState<PlanningItem[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToPlanningItems(setItems);
    return () => unsubscribe();
  }, []);

  const addItem = useCallback((category: PlanningCategory, text: string, notes?: string) => {
    return addPlanningItem(category, text, notes);
  }, []);

  const toggleComplete = useCallback((id: string, completed: boolean) => {
    return togglePlanningItemComplete(id, completed);
  }, []);

  const deleteItem = useCallback((id: string) => {
    return deletePlanningItem(id);
  }, []);

  return { items, addItem, toggleComplete, deleteItem };
}
