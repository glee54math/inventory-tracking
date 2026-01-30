// parentService.ts - Service for managing parent accounts and data

import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Parent, ChildSearchResult } from "./types";
import type { Student } from "./types";

/**
 * Create a parent profile in Firestore
 */
export async function createParentProfile(
    uid: string,
    email: string,
    firstName: string,
    lastName: string,
    parentType: "father" | "mother" | "guardian",
    children: string[] = []
): Promise<void> {
    const parentRef = doc(db, "parents", uid);

    const parentData: Parent = {
        uid,
        email,
        firstName,
        lastName,
        parentType,
        children,
        accountClaimed: true,
        createdAt: new Date(),
        lastLogin: new Date(),
    };

    await setDoc(parentRef, parentData);
    console.log(`✅ Created parent profile for ${firstName} ${lastName}`);
}

/**
 * Get parent profile by UID
 */
export async function getParentProfile(uid: string): Promise<Parent | null> {
    const parentRef = doc(db, "parents", uid);
    const parentSnap = await getDoc(parentRef);

    if (!parentSnap.exists()) {
        return null;
    }

    const data = parentSnap.data();
    return {
        uid: data.uid,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        parentType: data.parentType,
        children: data.children || [],
        accountClaimed: data.accountClaimed,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLogin: data.lastLogin?.toDate(),
    };
}

/**
 * Add a child to parent's account
 */
export async function addChildToParent(
    parentUid: string,
    studentId: string
): Promise<void> {
    const parentRef = doc(db, "parents", parentUid);
    const parentSnap = await getDoc(parentRef);

    if (!parentSnap.exists()) {
        throw new Error("Parent profile not found");
    }

    const currentChildren = parentSnap.data().children || [];

    // Avoid duplicates
    if (!currentChildren.includes(studentId)) {
        await updateDoc(parentRef, {
            children: [...currentChildren, studentId],
        });
        console.log(`✅ Added child ${studentId} to parent ${parentUid}`);
    }
}

/**
 * Update last login time
 */
export async function updateLastLogin(parentUid: string): Promise<void> {
    const parentRef = doc(db, "parents", parentUid);
    await updateDoc(parentRef, {
        lastLogin: new Date(),
    });
}

/**
 * Search for students by name (for parent registration)
 */
export async function searchStudentsByName(
    searchQuery: string,
    location: string = "san-ramon"
): Promise<ChildSearchResult[]> {
    const studentsRef = collection(db, "students", location, "students");
    const snapshot = await getDocs(studentsRef);

    const results: ChildSearchResult[] = [];
    const searchLower = searchQuery.toLowerCase().trim();

    snapshot.forEach((doc) => {
        const student = doc.data() as Student;
        const studentId = doc.id;

        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        const firstName = student.firstName.toLowerCase();
        const lastName = student.lastName.toLowerCase();

        // Calculate match score
        let matchScore = 0;
        if (fullName === searchLower) matchScore = 100;
        else if (fullName.includes(searchLower)) matchScore = 80;
        else if (firstName.includes(searchLower) || lastName.includes(searchLower)) matchScore = 60;
        else if (firstName.startsWith(searchLower) || lastName.startsWith(searchLower)) matchScore = 40;

        if (matchScore > 0) {
            // Get join date from subjects_startDate_Map
            let joinDate: string | undefined;
            if (student.subjects_startDate_Map) {
                const dates = Object.values(student.subjects_startDate_Map);
                if (dates.length > 0) {
                    joinDate = dates[0]; // Use first subject's start date
                }
            }

            results.push({
                studentId,
                firstName: student.firstName,
                lastName: student.lastName,
                father: student.father,
                mother: student.mother,
                joinDate,
                matchScore,
            });
        }
    });

    // Sort by match score (highest first)
    return results.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Verify parent-child relationship
 */
export function verifyParentChildMatch(
    student: ChildSearchResult,
    parentFirstName: string,
    parentLastName: string,
    parentType: "father" | "mother" | "guardian"
): boolean {
    const parentFullName = `${parentFirstName} ${parentLastName}`.toLowerCase();

    if (parentType === "father" && student.father) {
        return student.father.toLowerCase().includes(parentFullName.split(' ')[0]) ||
            parentFullName.includes(student.father.toLowerCase());
    }

    if (parentType === "mother" && student.mother) {
        return student.mother.toLowerCase().includes(parentFullName.split(' ')[0]) ||
            parentFullName.includes(student.mother.toLowerCase());
    }

    // Guardians don't need strict matching
    return true;
}

/**
 * Get all children's data for a parent
 */
export async function getChildrenData(
    childIds: string[],
    location: string = "san-ramon"
): Promise<Student[]> {
    const children: Student[] = [];

    for (const childId of childIds) {
        const studentRef = doc(db, "students", location, "students", childId);
        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {
            children.push(studentSnap.data() as Student);
        }
    }

    return children;
}