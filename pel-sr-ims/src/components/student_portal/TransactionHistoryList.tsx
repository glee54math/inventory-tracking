import { useEffect, useState } from "react";
import { getTransactionHistory } from "../../utils/pelDollarsService";
import type { PelTransaction, Student } from "../../utils/types";

interface TransactionHistoryListProps {
  student: Student;
}

export default function TransactionHistoryList({ student }: TransactionHistoryListProps) {
  const [transactions, setTransactions] = useState<PelTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student.id || !student.location) return;
    let cancelled = false;
    getTransactionHistory(student.location, student.id, 20)
      .then((data) => { if (!cancelled) setTransactions(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [student.id, student.location]);

  if (loading) {
    return <p className="text-sm text-gray-400">Loading activity...</p>;
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
        <p className="text-gray-400 text-sm">No PEL Dollars activity yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <ul className="divide-y divide-gray-100">
        {transactions.map((t) => (
          <li key={t.id} className="flex justify-between items-center py-2">
            <div>
              <p className={`text-sm font-medium ${t.isReversed ? "line-through text-gray-400" : "text-gray-700"}`}>
                {t.reasonLabel}
              </p>
              <p className="text-xs text-gray-400">{t.timeStamp.toLocaleDateString()}</p>
            </div>
            <span
              className={`text-sm font-bold ${
                t.isReversed ? "text-gray-400" : t.amount >= 0 ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {t.amount > 0 ? "+" : ""}
              {t.amount}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
