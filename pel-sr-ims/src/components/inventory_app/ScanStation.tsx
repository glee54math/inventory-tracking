// ScanStation.tsx
// Staff-facing PEL Dollars scan station. A USB 2D-imager barcode/QR scanner acts as
// a keyboard wedge (types the scanned studentCode + Enter into whatever input has
// focus), so this just needs a persistently-focused text input — no scanner SDK.
// Manual typing + Enter works identically, which is how this gets tested/used
// before physical cards/scanner hardware exist.

import { useEffect, useRef, useState } from "react";
import {
  creditStudent,
  canReverseTransaction,
  debitStudent,
  findStudentByCode,
  getTransactionHistory,
  loadEarningRules,
  loadPrizeItems,
  reverseTransaction,
} from "../../utils/pelDollarsService";
import type { PelEarningRule, PelTransaction, PrizeItem, Student } from "../../utils/types";

interface ScanStationProps {
  workerInitials: string;
}

const SCAN_DEBOUNCE_MS = 1500;

export default function ScanStation({ workerInitials }: ScanStationProps) {
  const [codeInput, setCodeInput] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [lookupError, setLookupError] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);

  const [earningRules, setEarningRules] = useState<PelEarningRule[]>([]);
  const [prizeItems, setPrizeItems] = useState<PrizeItem[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<PelTransaction[]>([]);

  const [variableRule, setVariableRule] = useState<PelEarningRule | null>(null);
  const [variableAmount, setVariableAmount] = useState("");
  const [actionError, setActionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastScan = useRef<{ code: string; at: number }>({ code: "", at: 0 });

  useEffect(() => {
    loadEarningRules(true).then(setEarningRules);
    loadPrizeItems(true).then(setPrizeItems);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [student]);

  const refreshStudentState = async (s: Student) => {
    const history = await getTransactionHistory(s.location!, s.id!, 10);
    setRecentTransactions(history);
  };

  const handleScanSubmit = async (rawCode: string) => {
    const code = rawCode.trim();
    if (!code) return;

    const now = Date.now();
    if (code === lastScan.current.code && now - lastScan.current.at < SCAN_DEBOUNCE_MS) {
      setCodeInput("");
      return; // likely scanner double-fire or an accidental double-enter
    }
    lastScan.current = { code, at: now };

    setCodeInput("");
    setLookupError("");
    setActionError("");
    setIsLookingUp(true);
    try {
      const found = await findStudentByCode(code);
      if (!found) {
        setLookupError(`No student found for code "${code}".`);
        setStudent(null);
        return;
      }
      setStudent(found);
      await refreshStudentState(found);
    } catch (err) {
      console.error(err);
      setLookupError("Error looking up student. Please try again.");
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleScanSubmit(codeInput);
    }
  };

  const handleClearStudent = () => {
    setStudent(null);
    setRecentTransactions([]);
    setLookupError("");
    setActionError("");
    setVariableRule(null);
    setVariableAmount("");
  };

  const runCredit = async (rule: PelEarningRule, amount: number) => {
    if (!student) return;
    setActionError("");
    setIsSubmitting(true);
    try {
      await creditStudent({
        student,
        amount,
        reasonCode: rule.code,
        reasonLabel: rule.label,
        workerInitials,
      });
      const refreshed = { ...student, pelBalance: (student.pelBalance ?? 0) + amount };
      setStudent(refreshed);
      await refreshStudentState(refreshed);
      setVariableRule(null);
      setVariableAmount("");
    } catch (err) {
      console.error(err);
      setActionError("Failed to credit student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEarnClick = (rule: PelEarningRule) => {
    if (rule.amountIsVariable) {
      setVariableRule(rule);
      setVariableAmount("");
      return;
    }
    runCredit(rule, rule.amount);
  };

  const handleVariableConfirm = () => {
    const amount = Number(variableAmount);
    if (!variableRule || !Number.isFinite(amount) || amount <= 0) {
      setActionError("Enter a valid positive amount.");
      return;
    }
    runCredit(variableRule, amount);
  };

  const handleSpendClick = async (prize: PrizeItem) => {
    if (!student) return;
    setActionError("");
    setIsSubmitting(true);
    try {
      const result = await debitStudent({
        student,
        amount: prize.price,
        reasonCode: prize.code,
        reasonLabel: prize.name,
        workerInitials,
      });
      if (!result.ok) {
        setActionError(`Insufficient balance for ${prize.name} (needs ${prize.price} PEL).`);
        return;
      }
      const refreshed = { ...student, pelBalance: result.newBalance };
      setStudent(refreshed);
      await refreshStudentState(refreshed);
    } catch (err) {
      console.error(err);
      setActionError("Failed to process purchase. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUndo = async (transactionId: string) => {
    if (!student) return;
    setActionError("");
    setIsSubmitting(true);
    try {
      const ok = await reverseTransaction(transactionId, workerInitials);
      if (!ok) {
        setActionError("This transaction can no longer be undone (older than 4 hours, or already reversed).");
        return;
      }
      const refreshedStudent = await findStudentByCode(student.studentCode ?? "");
      if (refreshedStudent) {
        setStudent(refreshedStudent);
        await refreshStudentState(refreshedStudent);
      }
    } catch (err) {
      console.error(err);
      setActionError("Failed to undo transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2">
      <h2 className="font-bold mb-2 text-center w-full">PEL Dollars Scan Station</h2>

      <div className="mb-4">
        <label htmlFor="scan-input" className="block text-xs text-gray-600 mb-1">
          Scan student card, or type code and press Enter:
        </label>
        <input
          id="scan-input"
          ref={inputRef}
          type="text"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Scan or type student code..."
          disabled={isLookingUp}
          autoFocus
          className="w-full px-3 py-2 border-2 rounded text-lg tracking-widest text-center"
        />
        {lookupError && <p className="text-red-600 text-sm mt-1">{lookupError}</p>}
      </div>

      {student && (
        <div className="border rounded p-3 bg-white">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-bold text-lg">
                {student.firstName} {student.lastName}
              </p>
              <p className="text-2xl font-bold text-green-700">{student.pelBalance ?? 0} PEL</p>
            </div>
            <button
              onClick={handleClearStudent}
              className="text-sm px-2 py-1 !bg-gray-200 hover:!bg-gray-300 rounded"
            >
              Done / Next Student
            </button>
          </div>

          {actionError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-3">
              {actionError}
            </div>
          )}

          {/* Earn panel */}
          <div className="mb-4">
            <p className="font-semibold text-sm mb-2">Earn</p>
            <div className="flex flex-wrap gap-2">
              {earningRules.map((rule) => (
                <button
                  key={rule.id}
                  disabled={isSubmitting}
                  onClick={() => handleEarnClick(rule)}
                  className="px-3 py-2 !bg-green-100 hover:!bg-green-300 rounded text-sm disabled:opacity-50"
                >
                  {rule.label} {!rule.amountIsVariable && `(+${rule.amount})`}
                </button>
              ))}
              {earningRules.length === 0 && (
                <p className="text-xs text-gray-500">No earning rules configured yet.</p>
              )}
            </div>
            {variableRule && (
              <div className="flex gap-2 items-center mt-2">
                <span className="text-sm">{variableRule.label}:</span>
                <input
                  type="number"
                  min={1}
                  value={variableAmount}
                  onChange={(e) => setVariableAmount(e.target.value)}
                  className="w-24 px-2 py-1 border rounded text-sm"
                  autoFocus
                />
                <button
                  onClick={handleVariableConfirm}
                  disabled={isSubmitting}
                  className="px-3 py-1 !bg-green-300 hover:!bg-green-400 rounded text-sm"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setVariableRule(null)}
                  className="px-3 py-1 !bg-gray-200 hover:!bg-gray-300 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Spend panel */}
          <div className="mb-4">
            <p className="font-semibold text-sm mb-2">Spend</p>
            <div className="flex flex-wrap gap-2">
              {prizeItems.map((prize) => (
                <button
                  key={prize.id}
                  disabled={isSubmitting}
                  onClick={() => handleSpendClick(prize)}
                  className="px-3 py-2 !bg-blue-100 hover:!bg-blue-300 rounded text-sm disabled:opacity-50"
                >
                  {prize.name} (-{prize.price})
                </button>
              ))}
              {prizeItems.length === 0 && (
                <p className="text-xs text-gray-500">No prize items configured yet.</p>
              )}
            </div>
          </div>

          {/* Recent activity */}
          <div>
            <p className="font-semibold text-sm mb-2">Recent Activity</p>
            <ul className="text-sm space-y-1 max-h-40 overflow-auto">
              {recentTransactions.map((t) => (
                <li key={t.id} className="flex justify-between items-center border-b py-1">
                  <span className={t.isReversed ? "line-through text-gray-400" : ""}>
                    {t.reasonLabel}: {t.amount > 0 ? "+" : ""}
                    {t.amount} (bal {t.balanceAfter})
                  </span>
                  {!t.isReversed && canReverseTransaction(t) && (
                    <button
                      onClick={() => handleUndo(t.id!)}
                      disabled={isSubmitting}
                      className="text-xs px-2 py-0.5 !bg-gray-200 hover:!bg-gray-300 rounded"
                    >
                      Undo
                    </button>
                  )}
                </li>
              ))}
              {recentTransactions.length === 0 && (
                <p className="text-xs text-gray-500">No transactions yet.</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
