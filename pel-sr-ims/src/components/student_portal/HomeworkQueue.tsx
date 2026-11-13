import { useState } from "react";
import type { HomeworkAssignment } from "../../utils/types";
import { toDate, parseAssignment } from "../../utils/progressService";

interface HomeworkQueueProps {
  hwkAssigned: (string | HomeworkAssignment)[];
}

type Subject = "Math" | "English";

interface Item {
  assignment: string;
  subject: Subject;
  date: Date | null; // null = legacy entry from before assignments carried dates
}

interface Week {
  start: Date;
  // assignment → number of copies, in the order first assigned
  counts: Map<string, number>;
}

interface Month {
  key: string;
  label: string;
  weeks: Week[];
}

interface SubjectColumn {
  subject: Subject;
  months: Month[];
  legacy: Map<string, number>;
  total: number;
}

function normalize(items: (string | HomeworkAssignment)[]): Item[] {
  const out: Item[] = [];
  items.forEach((item) => {
    const assignment = typeof item === "string" ? item : item.assignment;
    const parsed = parseAssignment(assignment);
    if (!parsed) return;
    out.push({
      assignment,
      subject: parsed.subject,
      date: typeof item === "string" ? null : toDate(item.dateAssigned),
    });
  });
  return out;
}

// Weeks start on Sunday
function weekStart(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function addCount(counts: Map<string, number>, assignment: string) {
  counts.set(assignment, (counts.get(assignment) ?? 0) + 1);
}

function buildColumn(subject: Subject, items: Item[]): SubjectColumn {
  const subjectItems = items.filter((i) => i.subject === subject);
  const legacy = new Map<string, number>();
  const monthMap = new Map<string, Month>();

  subjectItems
    .filter((i) => i.date)
    .sort((a, b) => b.date!.getTime() - a.date!.getTime())
    .forEach((item) => {
      const date = item.date!;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      let month = monthMap.get(key);
      if (!month) {
        month = {
          key,
          label: date.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
          weeks: [],
        };
        monthMap.set(key, month);
      }
      const start = weekStart(date);
      let week = month.weeks.find((w) => w.start.getTime() === start.getTime());
      if (!week) {
        week = { start, counts: new Map() };
        month.weeks.push(week);
      }
      addCount(week.counts, item.assignment);
    });

  subjectItems.filter((i) => !i.date).forEach((i) => addCount(legacy, i.assignment));

  return {
    subject,
    months: Array.from(monthMap.values()),
    legacy,
    total: subjectItems.length,
  };
}

function AssignmentList({ counts }: { counts: Map<string, number> }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {Array.from(counts.entries()).map(([assignment, n]) => (
        <li
          key={assignment}
          className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800"
        >
          {assignment}
          {n > 1 && <span className="ml-1 text-xs font-medium text-gray-500">×{n}</span>}
        </li>
      ))}
    </ul>
  );
}

function SubjectColumnView({ column }: { column: SubjectColumn }) {
  const accent = column.subject === "Math" ? "text-primary-700" : "text-success-700";

  return (
    <div>
      <h4 className={`text-sm font-bold uppercase tracking-wide mb-3 ${accent}`}>
        {column.subject}{" "}
        <span className="font-normal normal-case text-gray-500">({column.total})</span>
      </h4>

      <div className="space-y-3">
        {column.months.map((month, i) => (
          <details key={month.key} open={i === 0} className="group">
            <summary className="cursor-pointer select-none text-sm font-semibold text-gray-700">
              {month.label}
            </summary>
            <div className="mt-2 space-y-3 pl-3 border-l-2 border-gray-100">
              {month.weeks.map((week) => (
                <div key={week.start.getTime()}>
                  <p className="text-xs text-gray-500 mb-1.5">
                    Week of{" "}
                    {week.start.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </p>
                  <AssignmentList counts={week.counts} />
                </div>
              ))}
            </div>
          </details>
        ))}

        {column.legacy.size > 0 && (
          <details>
            <summary className="cursor-pointer select-none text-sm font-semibold text-gray-500">
              Older homework (no date)
            </summary>
            <div className="mt-2 pl-3 border-l-2 border-gray-100">
              <AssignmentList counts={column.legacy} />
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

export default function HomeworkQueue({ hwkAssigned }: HomeworkQueueProps) {
  const items = normalize(hwkAssigned ?? []);
  const columns = (["Math", "English"] as Subject[])
    .map((subject) => buildColumn(subject, items))
    .filter((c) => c.total > 0);
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="w-full flex items-center justify-between !bg-transparent border-none p-0 cursor-pointer text-left"
      >
        <h3 className="text-base font-bold text-gray-800">
          Homework{" "}
          {items.length > 0 && (
            <span className="text-sm font-normal text-gray-400">
              ({items.length} item{items.length !== 1 ? "s" : ""})
            </span>
          )}
        </h3>
        <span className="text-gray-400 text-sm select-none">
          {collapsed ? "▶" : "▼"}
        </span>
      </button>

      {!collapsed && (
        <div className="mt-4">
          {columns.length === 0 ? (
            <p className="text-gray-400 text-sm">No homework assigned.</p>
          ) : (
            <div className={`grid gap-6 ${columns.length > 1 ? "md:grid-cols-2" : ""}`}>
              {columns.map((column) => (
                <SubjectColumnView key={column.subject} column={column} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
