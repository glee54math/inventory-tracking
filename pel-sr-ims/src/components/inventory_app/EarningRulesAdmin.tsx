// EarningRulesAdmin.tsx
// Admin page for managing the PEL Dollars earning-rule presets shown as buttons at
// the Scan Station. Lets the tutor add new incentive types (see the incentive
// research in the plan doc) without any code change.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNameContext } from "./NameContext";
import { createEarningRule, loadEarningRules, updateEarningRule } from "../../utils/pelDollarsService";
import { PEL_EARNING_CATEGORIES } from "../../utils/types";
import type { PelEarningCategory, PelEarningRule } from "../../utils/types";

export default function EarningRulesAdmin() {
  const navigate = useNavigate();
  const { nameOfWorker } = useNameContext();
  const [rules, setRules] = useState<PelEarningRule[]>([]);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [amountIsVariable, setAmountIsVariable] = useState(false);
  const [category, setCategory] = useState<PelEarningCategory>("Other");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAll = async () => {
    const data = await loadEarningRules(false);
    setRules(data);
  };

  useEffect(() => {
    loadAll().finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !label.trim()) return;

    setIsSubmitting(true);
    try {
      await createEarningRule(
        {
          code: code.trim(),
          label: label.trim(),
          amount: amount ? Number(amount) : 0,
          amountIsVariable,
          category,
          active: true,
          sortOrder: rules.length,
        },
        nameOfWorker
      );
      setCode("");
      setLabel("");
      setAmount("");
      setAmountIsVariable(false);
      setCategory("Other");
      await loadAll();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (rule: PelEarningRule) => {
    await updateEarningRule(rule.id!, { active: !rule.active }, nameOfWorker);
    await loadAll();
  };

  return (
    <div className="fixed inset-0 bg-gray-50 p-6 overflow-auto z-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">PEL Dollars Earning Rules</h1>
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
          <label className="block text-xs text-gray-500">Label</label>
          <input value={label} onChange={(e) => setLabel(e.target.value)} className="px-2 py-1 border rounded w-48" />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Amount</label>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={amountIsVariable}
            className="px-2 py-1 border rounded w-24 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as PelEarningCategory)}
            className="px-2 py-1 border rounded"
          >
            {PEL_EARNING_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-1 text-sm mb-1">
          <input type="checkbox" checked={amountIsVariable} onChange={(e) => setAmountIsVariable(e.target.checked)} />
          Variable amount (staff enters amount)
        </label>
        <button
          type="submit"
          disabled={isSubmitting || !code.trim() || !label.trim()}
          className="px-4 py-2 !bg-green-200 hover:!bg-green-300 rounded disabled:opacity-50"
        >
          Add Rule
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <table className="w-full bg-white rounded shadow text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Code</th>
              <th className="p-2">Label</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Category</th>
              <th className="p-2">Status</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id} className="border-b">
                <td className="p-2">{rule.code}</td>
                <td className="p-2">{rule.label}</td>
                <td className="p-2">{rule.amountIsVariable ? "Variable" : rule.amount}</td>
                <td className="p-2">{rule.category}</td>
                <td className="p-2">{rule.active ? "Active" : "Inactive"}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleToggleActive(rule)}
                    className="text-xs px-2 py-1 !bg-gray-200 hover:!bg-gray-300 rounded"
                  >
                    {rule.active ? "Deactivate" : "Reactivate"}
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
