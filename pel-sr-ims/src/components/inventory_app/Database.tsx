// Database.tsx
// Database Table for Students with Column Filters

// imports
import { useEffect, useState } from "react";
import { loadStudentsFromDB } from "../../utils/inventoryService";
import type { Student } from "../../utils/types";

// Component
export default function Database() {
    // states
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [studentProps, setStudentProps] = useState<string[]>([]);
    const [filters, setFilters] = useState<Record<string, string>>({});

    // Helper function to organize homework assignments
    const organizeHomework = (hwkArray: string[]) => {
        if (!hwkArray || hwkArray.length === 0) return null;

        // Group by subject type and level
        const organized: Record<string, Record<string, string[]>> = {
            Math: {},
            English: {}
        };

        hwkArray.forEach((hwk) => {
            // Parse homework string (e.g., "MG6 81-90" or "EG3 1-10")
            const match = hwk.match(/^([A-Z]+)(\d+)\s+(.+)$/);
            if (match) {
                const [, prefix, level, range] = match;
                const subject = prefix.startsWith('M') ? 'Math' : 'English';
                const levelKey = `${prefix}${level}`;

                if (!organized[subject][levelKey]) {
                    organized[subject][levelKey] = [];
                }
                organized[subject][levelKey].push(range);
            }
        });

        return organized;
    };

    // Helper function to render organized homework
    const renderHomework = (hwkArray: string[]) => {
        const organized = organizeHomework(hwkArray);
        if (!organized) return "No homework assigned";

        return (
            <div className="space-y-2">
                {Object.entries(organized).map(([subject, levels]) => {
                    // Skip if no levels for this subject
                    if (Object.keys(levels).length === 0) return null;

                    return (
                        <div key={subject} className="mb-2">
                            <div className="font-semibold text-blue-700">{subject}:</div>
                            {Object.entries(levels)
                                .sort(([a], [b]) => a.localeCompare(b)) // Sort levels alphabetically
                                .map(([level, ranges]) => (
                                    <div key={level} className="ml-2 mb-1">
                                        <span className="font-medium text-gray-700">{level}:</span>
                                        <span className="ml-1 text-gray-600">
                                            {ranges.join(", ")}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    );
                })}
            </div>
        );
    };

    useEffect(() => {
        // load students
        const getStudents = async() => {
            const loadedStudents = await loadStudentsFromDB("san-ramon");
            setStudents(loadedStudents);
            
            if (loadedStudents.length > 0) {
                // Get properties from first student
                const props = Object.keys(loadedStudents[0]).sort();
                setStudentProps(props);
                
                // Initialize filters for each property
                const initialFilters: Record<string, string> = {};
                props.forEach(prop => {
                    initialFilters[prop] = "";
                });
                setFilters(initialFilters);
            }
        };
        getStudents();
    }, []);

    // Filter students whenever filters or students change
    useEffect(() => {
        if (students.length === 0) return;

        const filtered = students.filter((student) => {
            // Check each filter
            return studentProps.every((property) => {
                const filterValue = filters[property]?.toLowerCase().trim();
                
                // If no filter for this property, include the student
                if (!filterValue) return true;

                const studentValue = student[property];

                // Handle undefined values
                if (studentValue === undefined || studentValue === null) {
                    return false;
                }

                // Handle string values
                if (typeof studentValue === "string") {
                    return studentValue.toLowerCase().includes(filterValue);
                }

                // Handle array values (like hwkAssigned)
                if (Array.isArray(studentValue)) {
                    return studentValue.some((item) =>
                        String(item).toLowerCase().includes(filterValue)
                    );
                }

                // Handle object values (like subjects_startDate_Map)
                if (typeof studentValue === "object") {
                    // Search in both keys (subjects) and values (dates)
                    return Object.entries(studentValue).some(([key, value]) =>
                        key.toLowerCase().includes(filterValue) ||
                        String(value).toLowerCase().includes(filterValue)
                    );
                }

                // Default: convert to string and search
                return String(studentValue).toLowerCase().includes(filterValue);
            });
        });

        setFilteredStudents(filtered);
    }, [filters, students, studentProps]);

    // Handle filter input changes
    const handleFilterChange = (property: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [property]: value,
        }));
    };

    // Clear all filters
    const clearAllFilters = () => {
        const clearedFilters: Record<string, string> = {};
        studentProps.forEach(prop => {
            clearedFilters[prop] = "";
        });
        setFilters(clearedFilters);
    };

    // Check if any filters are active
    const hasActiveFilters = Object.values(filters).some(f => f.trim() !== "");

    return (
        <div className="w-full">
            {/* Clear Filters Button */}
            {hasActiveFilters && (
                <div className="mb-2 flex justify-end">
                    <button
                        onClick={clearAllFilters}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}

            {/* Results Count */}
            <div className="mb-2 text-sm text-gray-600">
                Showing {filteredStudents.length} of {students.length} students
            </div>

            {/* Table */}
            <div className="overflow-auto w-full max-w-full border">
                <table className="w-full bg-white">
                    <thead>
                        {/* Column Headers */}
                        <tr>
                            {studentProps.map((property: string) => (
                                <th
                                    key={property}
                                    className={`border border-gray-400 px-2 py-1 text-left bg-gray-100 ${
                                        property === "hwkAssigned" ? "min-w-[300px]" : ""
                                    }`}
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-sm">
                                            {property.split(/_|\B(?=[A-Z])/).join(" ")}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                        {/* Filter Inputs Row */}
                        <tr>
                            {studentProps.map((property: string) => (
                                <th
                                    key={`filter-${property}`}
                                    className={`border border-gray-400 px-2 py-1 bg-gray-50 ${
                                        property === "hwkAssigned" ? "min-w-[300px]" : ""
                                    }`}
                                >
                                    <input
                                        type="text"
                                        value={filters[property] || ""}
                                        onChange={(e) => handleFilterChange(property, e.target.value)}
                                        placeholder="Filter..."
                                        className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={studentProps.length}
                                    className="border border-gray-400 px-2 py-4 text-center text-gray-500"
                                >
                                    No students match the current filters
                                </td>
                            </tr>
                        ) : (
                            filteredStudents.map((student: Student) => (
                                <tr key={student.firstName + student.lastName}>
                                    {studentProps.map((property: string) => {
                                        const value = student[property];

                                        // Handle arrays
                                        if (Array.isArray(value)) {
                                            return (
                                                <td
                                                    key={student.firstName + property}
                                                    className={`border border-gray-400 px-2 py-1 text-xs ${
                                                        property === "hwkAssigned" ? "min-w-[300px]" : ""
                                                    }`}
                                                >
                                                    {property === "hwkAssigned" 
                                                        ? renderHomework(value)
                                                        : value.join(", ")
                                                    }
                                                </td>
                                            );
                                        }

                                        // Handle strings
                                        if (typeof value === "string") {
                                            return (
                                                <td
                                                    key={student.firstName + property}
                                                    className="border border-gray-400 px-2 py-1 text-xs"
                                                >
                                                    {value}
                                                </td>
                                            );
                                        }

                                        // Handle objects (like subjects_startDate_Map)
                                        if (typeof value === "object" && value !== null) {
                                            return (
                                                <td
                                                    key={student.firstName + property}
                                                    className="border border-gray-400 px-2 py-1 text-xs"
                                                >
                                                    {Object.entries(value).map(([subject, date]) => (
                                                        <div key={subject + "-join-date"}>
                                                            {subject + ": " + date}
                                                        </div>
                                                    ))}
                                                </td>
                                            );
                                        }

                                        // Handle undefined/null
                                        if (value === undefined || value === null) {
                                            return (
                                                <td
                                                    key={student.firstName + property}
                                                    className="border border-gray-400 px-2 py-1 text-xs text-gray-400"
                                                >
                                                    Empty
                                                </td>
                                            );
                                        }

                                        // Fallback for other types
                                        return (
                                            <td
                                                key={student.firstName + property}
                                                className="border border-gray-400 px-2 py-1 text-xs"
                                            >
                                                {String(value)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}