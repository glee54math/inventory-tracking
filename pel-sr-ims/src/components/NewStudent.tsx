// NewStudent.tsx
// This component is an input form that allows staff to add a new Student
/*
    Student Fields:
        firstName: string;
        lastName: string;
        father: string;
        mother: string;
        subjects_startDate_Map: Record<string, Date>;
        hwkAssigned: string[]; // This will probably be changed 
*/
import type { Student } from "../utils/types";
import { addNewStudentToDatabase } from "../utils/inventoryService";
import { useState } from "react";

interface NewStudentFormProps {
    onClose: () => void;
}

export function NewStudentForm({onClose}:NewStudentFormProps) {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [father, setFather] = useState("");
    const [mother, setMother] = useState("");
    const [subjectsChecked, setSubjectsChecked] = useState<string[]>([]);
    const [subjects_startDate_Map, setSubjects_startDate_Map] = useState<Record<string, Date>>({});

    const handleReset = () => {
        setFirstName("");
        setLastName("");
        setFather("");
        setMother("");
        setSubjectsChecked([]);
        setSubjects_startDate_Map({});
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // ⛔ prevent page refresh

        // adds new student to database
        const newStudent: Student = {
            firstName, lastName, father, mother ,subjects_startDate_Map
        };

        try {
            addNewStudentToDatabase("san-ramon", newStudent);
            handleReset();
            console.log(newStudent.firstName + newStudent.lastName + " was added successfully.");
        } catch (error) {
            console.log("Error occured in adding new student to database.");
        }  
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 space-y-3 max-w-md">
            {/* <button
                onClick={onclose}
                className="absolute top-2 right-2 text-gray-600 !hover:text-black "
            >
                X
            </button> */}
            <h1>Add New Student</h1>
            <div className="flex flex-col">
                <label htmlFor="firstName">First Name: </label>
                <input 
                    type="text" 
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border rounded"
                />

                <label htmlFor="lastName">Last Name: </label>
                <input 
                    type="text" 
                    id="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border rounded" />

                <label htmlFor="mothersName">Mother's Name: </label>
                <input 
                    type="text" 
                    id="mothersName" 
                    value={mother}
                    onChange={(e) => setMother(e.target.value)}
                    className="border rounded"
                />

                <label htmlFor="fathersName">Father's Name: </label>
                <input 
                    type="text" 
                    id="fathersName" 
                    value={father}
                    onChange={(e) => setFather(e.target.value)}
                    className="border rounded"
                />

                <div>
                    <h2>Subjects Enrolled</h2>
                    <div className="flex flex-col max-w-md">
                        <div className="flex flex-row">
                            <input 
                                type="checkbox" 
                                id="math-enrolled"
                                checked={subjectsChecked.includes("Math")}
                                onChange={() => setSubjectsChecked((prev) => (
                                    !prev.includes("Math") ? [...prev,"Math"] : prev.filter(item => item !== "Math")
                                ))}
                                className="border rounded mr-1"
                            />
                            <label htmlFor="math-enrolled" className="mr-6">Math</label>
                            {subjectsChecked.includes("Math") &&
                                <div>
                                    <label htmlFor="math-date-enrolled">Date Enrolled: </label>
                                    <input type="date" id="math-date-enrolled" className={
                                            `border rounded mx-1 w-1/2}`
                                        } />
                                </div>
                            }
                        </div>
                        <div className="flex flex-row">
                            <input 
                                type="checkbox" 
                                id="english-enrolled"
                                checked={subjectsChecked.includes("English")}
                                onChange={() => setSubjectsChecked((prev) => (
                                    !prev.includes("English") ? [...prev,"English"] : prev.filter(item => item != "English")
                                ))}
                                className="border rounded mr-1"
                            />
                            <label htmlFor="english-enrolled" className="mr-3">English</label>
                            {subjectsChecked.includes("English") &&
                                <div>
                                    <label htmlFor="english-date-enrolled">Date Enrolled: </label>
                                    <input type="date" id="english-date-enrolled" className={
                                            `border rounded mx-1 w-1/2}`
                                        } />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <button 
                type="button"
                onClick={handleReset}
                className="border rounded m-1 !bg-red-200"
            >
                Reset
            </button>
            <button
                type="submit"
                onClick={handleSubmit}
                className="border rounded m-1 !bg-blue-300 !hover:bg-blue-700"
            >
                Submit
            </button>
        </div>
    )
}