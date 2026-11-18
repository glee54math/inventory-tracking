// LabOrder.tsx
// Student-portal pieces for lab order (see utils/labOrder.ts):
//   - useLabStatuses: which labs this student has finished.
//   - LabNudge: "This lab is easier after …" shown before a lab whose needs
//     aren't finished. It never blocks: "Start this lab" always works.
//   - TeacherLabPanel: Mr. Lee's PIN, then mark labs finished / not finished.

import { useCallback, useEffect, useState } from "react";
import {
  LAB_BY_ID,
  TEACHER_PIN,
  hasModuleTest,
  loadLabStatuses,
  setTeacherFinished,
  type LabInfo,
  type LabStatusMap,
} from "../../utils/labOrder";

/** null while loading. On a load error every lab counts as not finished (nudges only, so that's safe). */
export function useLabStatuses(location: string | null | undefined, studentId: string | null | undefined, labIds: string[]) {
  const [statuses, setStatuses] = useState<LabStatusMap | null>(null);
  const key = labIds.join("|");

  const refresh = useCallback(async () => {
    if (!location || !studentId || labIds.length === 0) {
      setStatuses({});
      return;
    }
    try {
      setStatuses(await loadLabStatuses(location, studentId, labIds));
    } catch {
      setStatuses({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, studentId, key]);

  useEffect(() => {
    setStatuses(null);
    refresh();
  }, [refresh]);

  return { statuses, refresh };
}

const labName = (lab: LabInfo) => `${lab.label} (${lab.level})`;

export function LabNudge({
  lab,
  unmet,
  onStart,
  onTeacher,
}: {
  lab: LabInfo;
  unmet: LabInfo[];
  onStart: () => void;
  onTeacher: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-5">
      <div className="text-4xl" aria-hidden="true">
        🧭
      </div>
      <h2 className="text-lg font-bold text-gray-800">{lab.label}</h2>
      <div className="space-y-2">
        <p className="text-gray-600">This lab is easier after:</p>
        <ul className="space-y-2">
          {unmet.map((n) => (
            <li key={n.id} className="inline-block mx-1 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-semibold">
              {labName(n)}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-400">Not sure? Ask your teacher.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onStart}
          className="px-6 py-3 rounded-xl font-semibold text-white !bg-tertiary-600 hover:!bg-tertiary-700 transition-all duration-200"
        >
          Start this lab
        </button>
      </div>
      <button onClick={onTeacher} className="text-xs font-medium text-gray-400 hover:text-gray-600 underline">
        Teacher
      </button>
    </div>
  );
}

/** Mr. Lee only: PIN, then a list of labs with Finished / Not finished. */
export function TeacherLabPanel({
  location,
  studentId,
  studentName,
  labIds,
  statuses,
  onChanged,
  onClose,
}: {
  location: string;
  studentId: string;
  studentName?: string;
  labIds: string[];
  statuses: LabStatusMap;
  onChanged: () => void | Promise<void>;
  onClose: () => void;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === TEACHER_PIN) {
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect PIN.");
      setPin("");
    }
  };

  const toggle = async (id: string, finished: boolean) => {
    setBusy(id);
    setError("");
    try {
      await setTeacherFinished(location, studentId, id, finished);
      await onChanged();
    } catch {
      setError("Couldn't save. Check the connection and try again.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Teacher: lab order">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-800">Teacher: lab order{studentName ? ` · ${studentName}` : ""}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none !bg-transparent" aria-label="Close">
            ×
          </button>
        </div>

        {!unlocked ? (
          <form onSubmit={submit} className="space-y-3">
            <p className="text-sm text-gray-500">Enter your PIN to mark labs finished for this student.</p>
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                setError("");
              }}
              maxLength={4}
              placeholder="••••"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 text-xl text-center tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {error && <p className="text-danger-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={pin.length !== 4}
              className="w-full !bg-gray-800 text-white py-2 rounded-xl font-semibold text-sm disabled:opacity-40 hover:!bg-gray-700"
            >
              Unlock
            </button>
          </form>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              A lab is finished when its Module Test is passed. You can also mark it finished here (e.g. the student already
              knows it). This only changes the "try this first" tips; no lab is ever locked.
            </p>
            {error && <p className="text-danger-500 text-sm">{error}</p>}
            <ul className="divide-y divide-gray-100">
              {labIds.map((id) => {
                const lab = LAB_BY_ID[id];
                if (!lab) return null;
                const s = statuses[id];
                const byTest = s?.by === "test";
                return (
                  <li key={id} className="py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-sm">
                        {lab.label} <span className="text-gray-400 font-normal">({lab.level})</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {byTest
                          ? `Module Test passed (${s?.testScore}/${s?.passScore} needed)`
                          : s?.teacherMarked
                            ? "Marked finished by you"
                            : !hasModuleTest(id)
                              ? "No Module Test: only you can mark it finished"
                              : s?.testScore != null
                                ? `Module Test best: ${s.testScore} (needs ${s.passScore})`
                                : "Not finished"}
                      </div>
                    </div>
                    {byTest ? (
                      <span className="text-xs font-semibold text-success-700 bg-success-50 px-3 py-1 rounded-full">Finished</span>
                    ) : (
                      <button
                        disabled={busy === id}
                        onClick={() => toggle(id, !s?.teacherMarked)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                          s?.teacherMarked
                            ? "!bg-success-50 border-success-300 text-success-700"
                            : "!bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                        } disabled:opacity-50`}
                      >
                        {busy === id ? "Saving…" : s?.teacherMarked ? "✓ Finished (undo)" : "Mark finished"}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
