// fixMissingSubjects.ts - Utility to fix students with missing subject start dates

import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../../utils/firebase";
import type { Student } from "../../utils/types";

/**
 * Find students with missing subject start dates but have homework assigned
 */
export async function findStudentsWithMissingSubjects(location: string = "san-ramon") {
  const studentsRef = collection(db, "students", location, "students");
  const snapshot = await getDocs(studentsRef);

  const issues: Array<{
    student: Student;
    missingMath: boolean;
    missingEnglish: boolean;
    hasMathHwk: boolean;
    hasEnglishHwk: boolean;
  }> = [];

  snapshot.forEach((docSnap) => {
    const student = docSnap.data() as Student;
    const hwkAssigned = student.hwkAssigned || [];
    
    const hasMathHwk = hwkAssigned.some((hw) => hw.startsWith("M"));
    const hasEnglishHwk = hwkAssigned.some((hw) => hw.startsWith("E"));
    
    const subjectsMap = student.subjects_startDate_Map || {};
    const missingMath = !subjectsMap.Math && hasMathHwk;
    const missingEnglish = !subjectsMap.English && hasEnglishHwk;

    if (missingMath || missingEnglish) {
      issues.push({
        student,
        missingMath,
        missingEnglish,
        hasMathHwk,
        hasEnglishHwk,
      });
    }
  });

  return issues;
}

/**
 * Fix a student's missing subject start date
 * Estimates the start date based on earliest homework assignment or a default date
 */
export async function fixStudentSubjectStartDate(
  firstName: string,
  lastName: string,
  subject: "Math" | "English",
  startDate: string, // ISO date string (YYYY-MM-DD)
  location: string = "san-ramon"
): Promise<boolean> {
  try {
    // Find the student document
    const studentsRef = collection(db, "students", location, "students");
    const q = query(
      studentsRef,
      where("firstName", "==", firstName),
      where("lastName", "==", lastName)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.error(`Student ${firstName} ${lastName} not found`);
      return false;
    }

    if (snapshot.size > 1) {
      console.error(`Multiple students found with name ${firstName} ${lastName}`);
      return false;
    }

    const studentDoc = snapshot.docs[0];
    const currentData = studentDoc.data();
    const currentMap = currentData.subjects_startDate_Map || {};

    // Update the subjects_startDate_Map
    await updateDoc(studentDoc.ref, {
      subjects_startDate_Map: {
        ...currentMap,
        [subject]: startDate,
      },
    });

    console.log(`✅ Updated ${firstName} ${lastName} - ${subject} start date: ${startDate}`);
    return true;
  } catch (error) {
    console.error(`Error updating student ${firstName} ${lastName}:`, error);
    return false;
  }
}

/**
 * Batch fix all students with missing subject start dates
 * Uses a default date or earliest homework date
 */
export async function batchFixMissingSubjects(
  defaultStartDate: string = "2024-04-01", // Default to April 2024
  location: string = "san-ramon"
): Promise<void> {
  const issues = await findStudentsWithMissingSubjects(location);

  console.log(`Found ${issues.length} students with missing subject data`);

  for (const issue of issues) {
    const { student, missingMath, missingEnglish } = issue;

    if (missingMath) {
      await fixStudentSubjectStartDate(
        student.firstName,
        student.lastName,
        "Math",
        defaultStartDate,
        location
      );
    }

    if (missingEnglish) {
      await fixStudentSubjectStartDate(
        student.firstName,
        student.lastName,
        "English",
        defaultStartDate,
        location
      );
    }
  }

  console.log("✅ Batch fix complete!");
}