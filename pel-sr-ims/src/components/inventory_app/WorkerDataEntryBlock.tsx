// WorkerDataEntryBlock.tsx
// One worker's expanded Data Entry content in the admin (All Workers) view:
// the tabbed Log / Last Session / Metrics card. Pulled into its own component
// because it needs useWorkerMinutesByDate, which (per the Rules of Hooks)
// can't be called directly inside the .map() loop in AllWorkersDataEntries.tsx.

import { upsertDataEntry } from "../../utils/dataEntryService";
import type { DataEntryRecord } from "../../utils/types";
import DataEntryCard from "./DataEntryCard";
import { useWorkerMinutesByDate } from "./useWorkerMinutesByDate";

interface WorkerDataEntryBlockProps {
  record: { firstName: string; lastName: string; entries: DataEntryRecord[] };
}

export default function WorkerDataEntryBlock({ record }: WorkerDataEntryBlockProps) {
  const minutesByDate = useWorkerMinutesByDate(record.firstName, record.lastName);

  return (
    <div className="p-2">
      <DataEntryCard
        entries={record.entries}
        minutesByDate={minutesByDate}
        editable
        onSaveEdit={(original, updates) => upsertDataEntry(record.firstName, record.lastName, original.date, updates)}
      />
    </div>
  );
}
