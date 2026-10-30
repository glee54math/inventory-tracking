// ManageWorkers.tsx
// Admin page: mark workers inactive when they leave, or reactivate them.
// Inactive workers are hidden from the login screen and the worker-switch
// modal, but still show up in timesheet reporting. Also lets staff view/edit
// a worker's basic info (name).

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loadWorkersForLocation,
  setWorkerStatus,
  updateWorkerInfo,
} from "../../utils/inventoryService";
import type { Worker } from "../../utils/types";

const LOCATIONS = ["san-ramon", "dublin"];

interface EditForm {
  firstName: string;
  lastName: string;
}

function toEditForm(worker: Worker): EditForm {
  return {
    firstName: worker.firstName || "",
    lastName: worker.lastName || "",
  };
}

export default function ManageWorkers() {
  const navigate = useNavigate();
  const [location, setLocation] = useState<string>("san-ramon");
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingInitials, setUpdatingInitials] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expandedInitials, setExpandedInitials] = useState<Set<string>>(new Set());
  const [editingInitials, setEditingInitials] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadWorkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const loadWorkers = async () => {
    setIsLoading(true);
    try {
      const list = await loadWorkersForLocation(location, { includeInactive: true });
      setWorkers(list);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (worker: Worker) => {
    if (!worker.initials) return;
    const goingInactive = worker.status !== "inactive";

    setUpdatingInitials(worker.initials);
    try {
      await setWorkerStatus(location, worker.initials, goingInactive ? "inactive" : "active");
      await loadWorkers();
    } finally {
      setUpdatingInitials(null);
    }
  };

  const toggleExpanded = (initials: string) => {
    setExpandedInitials((prev) => {
      const next = new Set(prev);
      if (next.has(initials)) {
        next.delete(initials);
      } else {
        next.add(initials);
      }
      return next;
    });
  };

  const startEditing = (worker: Worker) => {
    if (!worker.initials) return;
    setEditingInitials(worker.initials);
    setEditForm(toEditForm(worker));
  };

  const cancelEditing = () => {
    setEditingInitials(null);
    setEditForm(null);
  };

  const handleSaveEdit = async (worker: Worker) => {
    if (!worker.initials || !editForm) return;

    setIsSaving(true);
    try {
      await updateWorkerInfo(location, worker.initials, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
      });
      await loadWorkers();
      setEditingInitials(null);
      setEditForm(null);
    } finally {
      setIsSaving(false);
    }
  };

  const searchLower = search.toLowerCase().trim();
  const matchesSearch = (w: Worker) =>
    `${w.firstName} ${w.lastName}`.toLowerCase().includes(searchLower);

  const activeWorkers = workers.filter((w) => w.status !== "inactive" && matchesSearch(w));
  const inactiveWorkers = workers.filter((w) => w.status === "inactive" && matchesSearch(w));

  const infoRow = (label: string, value: string | undefined | null) => (
    <div className="flex justify-between gap-4 py-1 border-b border-gray-100 text-sm">
      <span className="text-gray-500">{label}</span>
      {value ? (
        <span className="text-gray-800 text-right">{value}</span>
      ) : (
        <span className="text-gray-400 italic text-right">Not set</span>
      )}
    </div>
  );

  const renderDetails = (worker: Worker) => {
    const isEditing = editingInitials === worker.initials;

    if (isEditing && editForm) {
      return (
        <div className="px-4 pb-4 pt-1 bg-gray-50 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <label className="text-sm">
              First Name
              <input
                type="text"
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </label>
            <label className="text-sm">
              Last Name
              <input
                type="text"
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSaveEdit(worker)}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm rounded !bg-blue-200 hover:!bg-blue-300 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={cancelEditing}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm rounded !bg-gray-200 hover:!bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="px-4 pb-4 pt-1 bg-gray-50 border-t">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div>
            {infoRow("First Name", worker.firstName)}
            {infoRow("Last Name", worker.lastName)}
            {infoRow("Initials", worker.initials)}
          </div>
          <div>
            {infoRow("PIN Set", worker.pin ? "Yes" : "No")}
            {infoRow("Location", worker.location)}
            {worker.status === "inactive" &&
              infoRow(
                "Inactive Since",
                worker.inactiveSince
                  ? new Date(worker.inactiveSince).toLocaleDateString()
                  : undefined
              )}
          </div>
        </div>
        <button
          onClick={() => startEditing(worker)}
          className="mt-3 px-3 py-1.5 text-sm rounded !bg-yellow-200 hover:!bg-yellow-300"
        >
          Edit Info
        </button>
      </div>
    );
  };

  const renderRow = (worker: Worker) => {
    const isInactive = worker.status === "inactive";
    const isExpanded = worker.initials ? expandedInitials.has(worker.initials) : false;

    return (
      <div key={worker.initials} className="border rounded bg-white overflow-hidden">
        <div className="flex items-center justify-between p-3">
          <button
            onClick={() => worker.initials && toggleExpanded(worker.initials)}
            className="flex items-center gap-2 text-left flex-1"
          >
            <span className="text-gray-500 w-3">{isExpanded ? "▼" : "▶"}</span>
            <span className="font-medium">
              {worker.firstName} {worker.lastName}
            </span>
          </button>
          <button
            onClick={() => handleToggleStatus(worker)}
            disabled={updatingInitials === worker.initials}
            className={`px-3 py-1.5 text-sm rounded disabled:opacity-50 ${
              isInactive
                ? "!bg-green-200 hover:!bg-green-300"
                : "!bg-red-200 hover:!bg-red-300"
            }`}
          >
            {updatingInitials === worker.initials
              ? "Updating..."
              : isInactive
              ? "Reactivate"
              : "Mark Inactive"}
          </button>
        </div>
        {isExpanded && renderDetails(worker)}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-50 p-6 overflow-auto z-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Workers</h1>
        <button
          onClick={() => navigate("/")}
          className="px-3 py-1.5 text-sm border rounded border-gray-400 text-gray-700 hover:!bg-gray-200"
        >
          ← Back
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="px-3 py-2 border rounded flex-1 max-w-xs"
        />
      </div>

      {isLoading && <p className="text-gray-500">Loading workers...</p>}

      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-bold mb-3">Active ({activeWorkers.length})</h2>
            <div className="flex flex-col gap-2">
              {activeWorkers.map(renderRow)}
              {activeWorkers.length === 0 && (
                <p className="text-sm text-gray-400 italic">No active workers match.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-bold mb-3">Inactive ({inactiveWorkers.length})</h2>
            <div className="flex flex-col gap-2">
              {inactiveWorkers.map(renderRow)}
              {inactiveWorkers.length === 0 && (
                <p className="text-sm text-gray-400 italic">No inactive workers match.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
