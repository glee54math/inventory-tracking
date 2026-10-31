// DataEntryCard.tsx
// One card, three tabs, for a worker's Data Entry history and output:
// - Log: the full year/month-collapsible history table.
// - Last Session: today's output (or the most recent session with hours, if
//   nothing's logged today yet). A shift still clocked in counts elapsed time
//   up to now and is labeled "Live" — the figure becomes final the moment the
//   worker clocks out, with no separate pending state to reconcile.
// - Metrics: an all-time weighted running average across every session.

import { useState } from "react";
import { formatDateMMDDYY, formatMinutes, parseDateMMDDYY } from "../../utils/timesheetService";
import { EMPTY_DATA_ENTRY_COUNTS } from "../../utils/dataEntryService";
import type { DataEntryCounts, DataEntryRecord } from "../../utils/types";
import DataEntryTable from "./DataEntryTable";

type MinutesByDate = Map<string, { minutes: number; isLive: boolean }>;

interface DataEntryCardProps {
  entries: DataEntryRecord[];
  minutesByDate: MinutesByDate;
  editable?: boolean;
  onSaveEdit?: (original: DataEntryRecord, updates: DataEntryCounts) => Promise<void> | void;
}

type Tab = "log" | "lastSession" | "metrics";

const TABS: { key: Tab; label: string }[] = [
  { key: "log", label: "Log" },
  { key: "lastSession", label: "Last Session" },
  { key: "metrics", label: "Metrics" },
];

const METRICS: { key: keyof DataEntryCounts; label: string }[] = [
  { key: "cleanWorksheets", label: "Clean Worksheets" },
  { key: "correctionWorksheets", label: "Correction Worksheets" },
  { key: "foldersRecorded", label: "Folders Recorded" },
  { key: "foldersPulled", label: "Folders Pulled" },
  { key: "foldersRecordedAndPulled", label: "Recorded & Pulled" },
];

function perHour(count: number, hours: number): string {
  if (hours <= 0) return "—";
  return (count / hours).toFixed(1);
}

function totalCount(counts: DataEntryCounts): number {
  return METRICS.reduce((sum, m) => sum + counts[m.key], 0);
}

function MetricsTable({ counts, hours }: { counts: DataEntryCounts; hours: number }) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b">
          <th className="text-left p-1">Metric</th>
          <th className="text-left p-1">Count</th>
          <th className="text-left p-1">Per Hour</th>
        </tr>
      </thead>
      <tbody>
        {METRICS.map((metric) => (
          <tr key={metric.key} className="border-b">
            <td className="p-1">{metric.label}</td>
            <td className="p-1">{counts[metric.key]}</td>
            <td className="p-1">{perHour(counts[metric.key], hours)}</td>
          </tr>
        ))}
        <tr className="font-semibold !bg-gray-50">
          <td className="p-1">Total Items</td>
          <td className="p-1">{totalCount(counts)}</td>
          <td className="p-1">{perHour(totalCount(counts), hours)}</td>
        </tr>
      </tbody>
    </table>
  );
}

function LastSessionTab({ entries, minutesByDate }: { entries: DataEntryRecord[]; minutesByDate: MinutesByDate }) {
  const today = formatDateMMDDYY(new Date());

  const datesWithHours = Array.from(minutesByDate.entries()).filter(([, info]) => info.minutes > 0);
  const todayInfo = minutesByDate.get(today);
  const useToday = !!todayInfo && todayInfo.minutes > 0;

  let displayDate: string | null = null;
  let displayInfo: { minutes: number; isLive: boolean } | null = null;
  let displayLabel = "";

  if (useToday) {
    displayDate = today;
    displayInfo = todayInfo!;
    displayLabel = "Today";
  } else if (datesWithHours.length > 0) {
    const [lastDate, lastInfo] = datesWithHours.reduce((latest, current) =>
      parseDateMMDDYY(current[0]) > parseDateMMDDYY(latest[0]) ? current : latest
    );
    displayDate = lastDate;
    displayInfo = lastInfo;
    displayLabel = `Last Session (${lastDate})`;
  }

  if (!displayDate || !displayInfo) {
    return <p className="text-sm text-gray-500 text-center">No work sessions recorded yet.</p>;
  }

  const displayCounts = entries.find((e) => e.date === displayDate) ?? EMPTY_DATA_ENTRY_COUNTS;
  const displayHours = displayInfo.minutes / 60;

  return (
    <div>
      <h3 className="font-semibold mb-2 text-center">
        {displayLabel} — Hours Worked: {formatMinutes(displayInfo.minutes)}{" "}
        {useToday && (
          <span className={displayInfo.isLive ? "text-green-700" : "text-gray-500"}>
            ({displayInfo.isLive ? "Live — updates while clocked in" : "Final for today"})
          </span>
        )}
      </h3>
      <MetricsTable counts={displayCounts} hours={displayHours} />
    </div>
  );
}

function MetricsTab({ entries, minutesByDate }: { entries: DataEntryRecord[]; minutesByDate: MinutesByDate }) {
  // Weighted running average: sum counts and hours only across days that have
  // both, so a day logged with no clock-in doesn't inflate the rate.
  const runningTotals = { ...EMPTY_DATA_ENTRY_COUNTS };
  let runningMinutes = 0;
  for (const entry of entries) {
    const dayInfo = minutesByDate.get(entry.date);
    if (!dayInfo || dayInfo.minutes <= 0) continue;
    runningMinutes += dayInfo.minutes;
    for (const metric of METRICS) {
      runningTotals[metric.key] += entry[metric.key];
    }
  }

  if (runningMinutes === 0) {
    return <p className="text-sm text-gray-500 text-center">No sessions recorded yet to average.</p>;
  }

  return (
    <div>
      <h3 className="font-semibold mb-2 text-center">
        Running Average (All Sessions — {formatMinutes(runningMinutes)} total)
      </h3>
      <MetricsTable counts={runningTotals} hours={runningMinutes / 60} />
    </div>
  );
}

export default function DataEntryCard({ entries, minutesByDate, editable, onSaveEdit }: DataEntryCardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("lastSession");

  return (
    <div className="border rounded mb-4 overflow-hidden">
      <div className="flex border-b !bg-gray-50">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-3 py-2 text-sm font-semibold ${
              activeTab === tab.key ? "!bg-white border-b-2 border-blue-500" : "text-gray-500 hover:!bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-3">
        {activeTab === "log" && (
          <DataEntryTable entries={entries} editable={editable} onSaveEdit={onSaveEdit} minutesByDate={minutesByDate} />
        )}
        {activeTab === "lastSession" && <LastSessionTab entries={entries} minutesByDate={minutesByDate} />}
        {activeTab === "metrics" && <MetricsTab entries={entries} minutesByDate={minutesByDate} />}
      </div>
    </div>
  );
}
