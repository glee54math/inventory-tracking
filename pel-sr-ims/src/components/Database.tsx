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
            const ind = students.findIndex((student) => student.firstName === "Dylan");
            setStudentProps((Object.keys(students[ind])).sort());
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
                    <tr key={student.firstName + student.lastName}>
                        {studentProps.map((property: string) => (
                            // if it's an array, then I want to print the contents.
                            (Array.isArray(student[property]) && (
                                <td 
                                    key={student.firstName + property} 
                                    className="border border-gray-400 px-2 py-1 text-xs"
                                >
                                    {student[property].join(", ")}
                                </td>
                            )) ||
                            ((typeof student[property] === "string") && (
                                <td 
                                    key={student.firstName + property} 
                                    className="border border-gray-400 px-2 py-1 text-xs"
                                >
                                    {student[property]}
                                </td>
                            )) ||
                            ((typeof student[property] === "object") && (
                                // map, needs to be broken down. 
                                <td 
                                    key={student.firstName + property} 
                                    className="border border-gray-400 px-2 py-1 text-xs"
                                >
                                    {Object.entries(student[property]).map( ([subject, date]) => (
                                        <div key={subject+"-join-date"}>
                                            {subject + ": " + date}
                                        </div>
                                    ))}
                                </td>
                            )) ||
                            ((typeof student[property] === "undefined") && (
                                <td 
                                    key={student.firstName + property} 
                                    className="border border-gray-400 px-2 py-1 text-xs"
                                >
                                    This means that it's empty.
                                </td>
                            ))
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

