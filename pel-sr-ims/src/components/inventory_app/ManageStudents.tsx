// ManageStudents.tsx
// Admin page: mark students inactive when they leave the center, or
// reactivate them. Inactive students are hidden from the Action panel,
// ID card assignment, and student/parent portal login/registration.
// Also lets staff view/edit a student's basic info (name, parents,
// starting grade, subject enrollment dates).

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loadStudentsFromDB,
  setStudentStatus,
  updateStudentInfo,
} from "../../utils/inventoryService";
import type { Student } from "../../utils/types";

const LOCATIONS = ["san-ramon", "dublin"];

interface EditForm {
  firstName: string;
  lastName: string;
  father: string;
  mother: string;
  startingGrade: string;
  mathDate: string;
  englishDate: string;
}

function toEditForm(student: Student): EditForm {
  return {
    firstName: student.firstName || "",
    lastName: student.lastName || "",
    father: student.father || "",
    mother: student.mother || "",
    startingGrade: student.startingGrade || "",
    mathDate: student.subjects_startDate_Map?.Math || "",
    englishDate: student.subjects_startDate_Map?.English || "",
  };
}

export default function ManageStudents() {
  const navigate = useNavigate();
  const [location, setLocation] = useState<string>("san-ramon");
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const list = await loadStudentsFromDB(location, { includeInactive: true });
      setStudents(list);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (student: Student) => {
    if (!student.id) return;
    const goingInactive = student.status !== "inactive";

    setUpdatingId(student.id);
    try {
      await setStudentStatus(location, student.id, goingInactive ? "inactive" : "active");
      await loadStudents();
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpanded = (studentId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }
      return next;
    });
  };

  const startEditing = (student: Student) => {
    if (!student.id) return;
    setEditingId(student.id);
    setEditForm(toEditForm(student));
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = async (student: Student) => {
    if (!student.id || !editForm) return;

    const subjects_startDate_Map: Record<string, string> = {
      ...student.subjects_startDate_Map,
    };
    if (editForm.mathDate) subjects_startDate_Map.Math = editForm.mathDate;
    else delete subjects_startDate_Map.Math;
    if (editForm.englishDate) subjects_startDate_Map.English = editForm.englishDate;
    else delete subjects_startDate_Map.English;

    setIsSaving(true);
    try {
      await updateStudentInfo(location, student.id, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        father: editForm.father,
        mother: editForm.mother,
        startingGrade: editForm.startingGrade || undefined,
        subjects_startDate_Map,
      });
      await loadStudents();
      setEditingId(null);
      setEditForm(null);
    } finally {
      setIsSaving(false);
    }
  };

  const searchLower = search.toLowerCase().trim();
  const matchesSearch = (s: Student) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchLower);

  const activeStudents = students.filter((s) => s.status !== "inactive" && matchesSearch(s));
  const inactiveStudents = students.filter((s) => s.status === "inactive" && matchesSearch(s));

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

  const renderDetails = (student: Student) => {
    const isEditing = editingId === student.id;

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
            <label className="text-sm">
              Father's Name
              <input
                type="text"
                value={editForm.father}
                onChange={(e) => setEditForm({ ...editForm, father: e.target.value })}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </label>
            <label className="text-sm">
              Mother's Name
              <input
                type="text"
                value={editForm.mother}
                onChange={(e) => setEditForm({ ...editForm, mother: e.target.value })}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </label>
            <label className="text-sm">
              Starting Grade
              <input
                type="text"
                value={editForm.startingGrade}
                onChange={(e) => setEditForm({ ...editForm, startingGrade: e.target.value })}
                placeholder="K, 1, 2, ..."
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </label>
            <div />
            <label className="text-sm">
              Math Start Date
              <input
                type="date"
                value={editForm.mathDate}
                onChange={(e) => setEditForm({ ...editForm, mathDate: e.target.value })}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </label>
            <label className="text-sm">
              English Start Date
              <input
                type="date"
                value={editForm.englishDate}
                onChange={(e) => setEditForm({ ...editForm, englishDate: e.target.value })}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSaveEdit(student)}
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
            {infoRow("First Name", student.firstName)}
            {infoRow("Last Name", student.lastName)}
            {infoRow("Father's Name", student.father)}
            {infoRow("Mother's Name", student.mother)}
            {infoRow("Starting Grade", student.startingGrade)}
          </div>
          <div>
            {infoRow("Math Start Date", student.subjects_startDate_Map?.Math)}
            {infoRow("English Start Date", student.subjects_startDate_Map?.English)}
            {infoRow("Student Code", student.studentCode)}
            {infoRow("PEL Balance", student.pelBalance?.toString())}
            {infoRow("Location", student.location)}
            {student.status === "inactive" &&
              infoRow(
                "Inactive Since",
                student.inactiveSince
                  ? new Date(student.inactiveSince).toLocaleDateString()
                  : undefined
              )}
          </div>
        </div>
        <button
          onClick={() => startEditing(student)}
          className="mt-3 px-3 py-1.5 text-sm rounded !bg-yellow-200 hover:!bg-yellow-300"
        >
          Edit Info
        </button>
      </div>
    );
  };

  const renderRow = (student: Student) => {
    const isInactive = student.status === "inactive";
    const isExpanded = student.id ? expandedIds.has(student.id) : false;

    return (
      <div key={student.id} className="border rounded bg-white overflow-hidden">
        <div className="flex items-center justify-between p-3">
          <button
            onClick={() => student.id && toggleExpanded(student.id)}
            className="flex items-center gap-2 text-left flex-1"
          >
            <span className="text-gray-500 w-3">{isExpanded ? "▼" : "▶"}</span>
            <span className="font-medium">
              {student.firstName} {student.lastName}
            </span>
          </button>
          <button
            onClick={() => handleToggleStatus(student)}
            disabled={updatingId === student.id}
            className={`px-3 py-1.5 text-sm rounded disabled:opacity-50 ${
              isInactive
                ? "!bg-green-200 hover:!bg-green-300"
                : "!bg-red-200 hover:!bg-red-300"
            }`}
          >
            {updatingId === student.id ? "Updating..." : isInactive ? "Reactivate" : "Mark Inactive"}
          </button>
        </div>
        {isExpanded && renderDetails(student)}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-50 p-6 overflow-auto z-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Students</h1>
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

      {isLoading && <p className="text-gray-500">Loading students...</p>}

      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-bold mb-3">Active ({activeStudents.length})</h2>
            <div className="flex flex-col gap-2">
              {activeStudents.map(renderRow)}
              {activeStudents.length === 0 && (
                <p className="text-sm text-gray-400 italic">No active students match.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-bold mb-3">Inactive ({inactiveStudents.length})</h2>
            <div className="flex flex-col gap-2">
              {inactiveStudents.map(renderRow)}
              {inactiveStudents.length === 0 && (
                <p className="text-sm text-gray-400 italic">No inactive students match.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
