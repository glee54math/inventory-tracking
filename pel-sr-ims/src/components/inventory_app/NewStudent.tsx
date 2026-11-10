// NewStudent.tsx
// This component is an input form that allows staff to add a new Student
/*
    Student Fields:
        firstName: string;
        lastName: string;
        father: string;
        mother: string;
        dateOfBirth: string;
        school: string;
        motherPhone: string;
        fatherPhone: string;
        motherEmail: string;
        fatherEmail: string;
        subjects_startDate_Map: Record<string, Date>;
        hwkAssigned: string[]; // This will probably be changed
*/
import type { Student } from "../../utils/types";
import { addNewStudentToDatabase } from "../../utils/inventoryService";
import { useState } from "react";

interface NewStudentFormProps {
    onClose: () => void;
}

// Formats raw digits as (888)456-7890 while typing; caps at 10 digits.
function formatPhoneNumber(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length < 4) return digits;
    if (digits.length < 7) return `(${digits.slice(0, 3)})${digits.slice(3)}`;
    return `(${digits.slice(0, 3)})${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function NewStudentForm({onClose}:NewStudentFormProps) {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [father, setFather] = useState("");
    const [mother, setMother] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [school, setSchool] = useState("");
    const [motherPhone, setMotherPhone] = useState("");
    const [fatherPhone, setFatherPhone] = useState("");
    const [motherEmail, setMotherEmail] = useState("");
    const [fatherEmail, setFatherEmail] = useState("");
    const [subjectsChecked, setSubjectsChecked] = useState<string[]>([]);
    const [subjects_startDate_Map, setSubjects_startDate_Map] = useState<Record<string, string>>({});   // subject: Date as string.

    const handleReset = () => {
        setFirstName("");
        setLastName("");
        setFather("");
        setMother("");
        setDateOfBirth("");
        setSchool("");
        setMotherPhone("");
        setFatherPhone("");
        setMotherEmail("");
        setFatherEmail("");
        setSubjectsChecked([]);
        setSubjects_startDate_Map({});
    }

    const toggleSubject = (subject: string) => {
        setSubjectsChecked((prev) => {
            if (prev.includes(subject)) {
                // remove subject + cleanup map entry
                setSubjects_startDate_Map((map) => {
                    const newMap = { ...map };
                    delete newMap[subject];
                    return newMap;
                });
                return prev.filter((s) => s !== subject);
            } else {
                return [...prev, subject];
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // ⛔ prevent page refresh

        // adds new student to database
        const newStudent: Student = {
            firstName, lastName, father, mother,
            dateOfBirth, school,
            motherPhone, fatherPhone,
            motherEmail, fatherEmail,
            subjects_startDate_Map
        };

        try {
            addNewStudentToDatabase("san-ramon", newStudent);
            handleReset();
            onClose();
            console.log(newStudent.firstName + newStudent.lastName + " was added successfully.");
        } catch (error) {
            console.log("Error occured in adding new student to database.");
        }  
    }

    return (
        <div className="relative bg-white rounded-lg shadow p-6 space-y-3 max-w-md">
            <button
                onClick={onClose}
                className=" absolute bg-white rounded-lg shadow p-6 space-y-3 max-w-sm 
                            top-2 right-2 !bg-red-200 !hover:bg-red-700
                          "
            >
                X
            </button>
            
            {/* Add New Student Header */}
            <h1 className="text-large font-semibold pr-10">
                Add New Student
            </h1>
            
            <div className="flex flex-col">
                {/* First Name */}
                <label htmlFor="firstName">First Name: </label>
                <input 
                    type="text" 
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border rounded"
                />

                {/* Last Name */}
                <label htmlFor="lastName">Last Name: </label>
                <input 
                    type="text" 
                    id="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border rounded" />

                {/* Mother's Name */}
                <label htmlFor="mothersName">Mother's Name: </label>
                <input 
                    type="text" 
                    id="mothersName" 
                    value={mother}
                    onChange={(e) => setMother(e.target.value)}
                    className="border rounded"
                />

                {/* Father's Name */}
                <label htmlFor="fathersName">Father's Name: </label>
                <input
                    type="text"
                    id="fathersName"
                    value={father}
                    onChange={(e) => setFather(e.target.value)}
                    className="border rounded"
                />

                {/* Date of Birth */}
                <label htmlFor="dateOfBirth">Date of Birth: </label>
                <input
                    type="date"
                    id="dateOfBirth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="border rounded"
                />

                {/* School */}
                <label htmlFor="school">School: </label>
                <input
                    type="text"
                    id="school"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="border rounded"
                />

                {/* Mother's Phone Number */}
                <label htmlFor="mothersPhone">Mother's Phone Number: </label>
                <input
                    type="tel"
                    id="mothersPhone"
                    value={formatPhoneNumber(motherPhone)}
                    onChange={(e) => setMotherPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="border rounded"
                />

                {/* Father's Phone Number */}
                <label htmlFor="fathersPhone">Father's Phone Number: </label>
                <input
                    type="tel"
                    id="fathersPhone"
                    value={formatPhoneNumber(fatherPhone)}
                    onChange={(e) => setFatherPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="border rounded"
                />

                {/* Mother's Email */}
                <label htmlFor="mothersEmail">Mother's Email: </label>
                <input
                    type="email"
                    id="mothersEmail"
                    value={motherEmail}
                    onChange={(e) => setMotherEmail(e.target.value)}
                    className="border rounded"
                />

                {/* Father's Email */}
                <label htmlFor="fathersEmail">Father's Email: </label>
                <input
                    type="email"
                    id="fathersEmail"
                    value={fatherEmail}
                    onChange={(e) => setFatherEmail(e.target.value)}
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
                                onChange={() => toggleSubject("Math")}
                                className="border rounded mr-1"
                            />
                            <label htmlFor="math-enrolled" className="mr-6">Math</label>
                            {subjectsChecked.includes("Math") &&
                                <div>
                                    <label htmlFor="math-date-enrolled">Date Enrolled: </label>
                                    <input 
                                        type="date" 
                                        id="math-date-enrolled" 
                                        onChange={(e) => setSubjects_startDate_Map((prev) => ({
                                            ...prev,
                                            "Math": (e.target.value),
                                        }))}
                                        className={
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
                                onChange={() => toggleSubject("English")}
                                className="border rounded mr-1"
                            />
                            <label htmlFor="english-enrolled" className="mr-3">English</label>
                            {subjectsChecked.includes("English") &&
                                <div>
                                    <label htmlFor="english-date-enrolled">Date Enrolled: </label>
                                    <input 
                                        type="date" 
                                        id="english-date-enrolled" 
                                        onChange={(e) => setSubjects_startDate_Map((prev) => ({
                                            ...prev,
                                            "English": (e.target.value),
                                        }))}
                                        className={
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