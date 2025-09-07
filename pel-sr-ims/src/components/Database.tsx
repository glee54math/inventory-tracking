// Database.tsx
// Database Table for Students

// imports
import { useEffect, useState } from "react";
import { loadStudentsFromDB } from "../utils/inventoryService";
import type { Student } from "../utils/types";

// Props if Needed


// Component
export default function Database() {
    // states
    const [students, setStudents] = useState<Student[]>([]);
    const [studentProps, setStudentProps] = useState<string[]>([]);
    


    useEffect(() => {
        // load students
        const getStudents = async() => {
            setStudents(await loadStudentsFromDB("san-ramon"));
            // console.log(students);
            setStudentProps((Object.keys(students[0])).sort());
            // console.log((students["subjects_startDate_Map"]));
        };
        getStudents();
    }, [students]);

    return (
        <table className="w-[40%] opacity-100 bg-white p-2 border overflow-auto w-full max-w-full">
            <thead>
                <tr key="student-props">
                    {studentProps.map((property: string) => (
                        <th
                            key={property}
                            className="border border-gray-400 px-2 py-1 text-left relative h-20 w-16 text-sm"
                        >
                            {property.split(/_|\B(?=[A-Z])/).join(" ")}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {students.map((student: Student) => (
                    <tr>
                        {studentProps.map((property: string) => (
                            <td
                                onPointerOver={() => {
                                    console.log(student[property] + " is a string: " + (typeof(student[property]) === "string"))
                                    console.log(student[property] + " is an Object: " + typeof(student[property]))
                                }}
                            >
                                {student["firstName"] + "'s " + property} 
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

