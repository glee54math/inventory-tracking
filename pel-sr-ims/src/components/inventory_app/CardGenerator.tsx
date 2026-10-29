// CardGenerator.tsx
// Admin page: bulk-assigns studentCode to students missing one, and renders a
// printable grid of PEL Dollars ID cards (QR-encoded studentCode + name). Print
// onto cardstock, then laminate — see the hardware plan for the physical setup.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { loadStudentsFromDB } from "../../utils/inventoryService";
import { assignStudentCode } from "../../utils/pelDollarsService";
import type { Student } from "../../utils/types";

const LOCATIONS = ["san-ramon", "dublin"];

export default function CardGenerator() {
  const navigate = useNavigate();
  const [location, setLocation] = useState<string>("san-ramon");
  const [students, setStudents] = useState<Student[]>([]);
  const [qrDataUrls, setQrDataUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const list = await loadStudentsFromDB(location);
      setStudents(list);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const withCodes = students.filter((s) => s.studentCode);
    withCodes.forEach(async (s) => {
      if (!s.studentCode || qrDataUrls[s.studentCode]) return;
      const url = await QRCode.toDataURL(s.studentCode, { margin: 1, width: 180 });
      setQrDataUrls((prev) => ({ ...prev, [s.studentCode!]: url }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students]);

  const handleAssignMissing = async () => {
    const missing = students.filter((s) => !s.studentCode);
    if (missing.length === 0) return;

    setIsAssigning(true);
    try {
      for (const student of missing) {
        await assignStudentCode(location, student.id!);
      }
      await loadStudents();
    } finally {
      setIsAssigning(false);
    }
  };

  const handleReissue = async (student: Student) => {
    if (!student.id) return;
    const confirmed = window.confirm(
      `Reissue a new card code for ${student.firstName} ${student.lastName}? Their old card will stop working immediately.`
    );
    if (!confirmed) return;

    await assignStudentCode(location, student.id);
    await loadStudents();
  };

  const missingCount = students.filter((s) => !s.studentCode).length;

  return (
    <div className="fixed inset-0 bg-gray-50 p-6 overflow-auto z-50">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <h1 className="text-3xl font-bold">PEL Dollars ID Cards</h1>
        <button
          onClick={() => navigate("/")}
          className="px-3 py-1.5 text-sm border rounded border-gray-400 text-gray-700 hover:!bg-gray-200"
        >
          ← Back
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4 print:hidden">
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

        <button
          onClick={handleAssignMissing}
          disabled={isLoading || isAssigning || missingCount === 0}
          className="px-4 py-2 !bg-green-200 hover:!bg-green-300 rounded disabled:opacity-50"
        >
          {isAssigning ? "Assigning..." : `Assign codes to ${missingCount} missing`}
        </button>

        <button
          onClick={() => window.print()}
          disabled={students.length === 0}
          className="px-4 py-2 !bg-blue-200 hover:!bg-blue-300 rounded disabled:opacity-50"
        >
          Print Cards
        </button>
      </div>

      {isLoading && <p className="text-gray-500">Loading students...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-2">
        {students.map((student) => (
          <div key={student.id} className="border rounded p-3 bg-white flex flex-col items-center text-center">
            <p className="font-bold text-sm mb-1">
              {student.firstName} {student.lastName}
            </p>
            {student.studentCode ? (
              <>
                {qrDataUrls[student.studentCode] ? (
                  <img src={qrDataUrls[student.studentCode]} alt="QR code" className="w-32 h-32" />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center text-xs text-gray-400">
                    Generating...
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">{student.studentCode}</p>
                <button
                  onClick={() => handleReissue(student)}
                  className="mt-2 text-xs px-2 py-1 !bg-gray-200 hover:!bg-gray-300 rounded print:hidden"
                >
                  Reissue
                </button>
              </>
            ) : (
              <p className="text-xs text-gray-400 italic py-10">No code assigned yet</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
