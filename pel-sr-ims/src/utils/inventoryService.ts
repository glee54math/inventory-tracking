import { doc, getDoc, getDocs, setDoc, collection, addDoc, deleteField, updateDoc, query, where } from "firebase/firestore";
import { db } from "./firebase";
import type { LogEntry, SubmittedAction } from "./types";
import type { InventoryData, Subsection, InsufficientSubsection, Worker, Student} from "./types";

// subject_Location = math_back, math_front, english_back, english_front
// Upload your local JSON to Firestore
export const saveInventory = async (data: object, subject_Location: string) => {
    const ref = doc(db,"inventory",subject_Location); 
    await setDoc(ref, data) 
    console.log("Saved!");
}

export async function loadAllInventories() {
  const collectionRef = collection(db, 'inventory');
  const querySnapshot = await getDocs(collectionRef);

  const allData: Record<string, any> = {};

  querySnapshot.forEach((doc) => {
    allData[doc.id] = doc.data(); // doc.id is like "math_back", "english_front", etc.
  });

  return allData;
}

export async function loadInventory(subject_Location: string) {
  const docRef = doc(db, 'inventory', subject_Location);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.log("❌ No such document!");
    return {}; // return empty object
  }

  return docSnap.data(); 
}

export async function loadLog() {
  const collectionRef = collection(db, "logs");
  const documentSnapshot = await getDocs(collectionRef);

  const documents: Record<string, LogEntry> = {}

  documentSnapshot.forEach((doc) => {
    documents[doc.id] = doc.data() as LogEntry;
  })

  return documents; 
};

export const saveLog = async (logEntry: LogEntry) => {
  const logsRef = collection(db, "logs");
  await addDoc(logsRef, logEntry);
  console.log("Log entry saved");
};


export async function updateInventoryFromActions( submittedActions: SubmittedAction[]) {
  // SubmittedAction has subject, level, subsection[], movementType(AtoB), numOfCopies
  // movementType = BackToFront, BackToStudent, FrontToBack, FrontToStudent, ShipmentToBack, ShipmentToFront
  // Determine the inventories involved
  console.log(submittedActions)
  let inventoryFrom: InventoryData | undefined;
  let inventoryTo: InventoryData | undefined;

  for (const action of submittedActions) {
    let index = 0;  // used for associating [] and map
    for (const section of action.selectedSubsections) {
      switch (action.movementMap[action.selectedSubsections[index]]) {
        case "BackToFront":
          inventoryFrom = await loadInventory(`${action.subject?.toLowerCase()}_back`);
          inventoryTo = await loadInventory(`${action.subject?.toLowerCase()}_front`);
          break;
        case "BackToStudent":
          inventoryFrom = await loadInventory(`${action.subject?.toLowerCase()}_back`);
          break;
        case "FrontToBack":
          inventoryFrom = await loadInventory(`${action.subject?.toLowerCase()}_front`);
          inventoryTo = await loadInventory(`${action.subject?.toLowerCase()}_back`);
          break;
        case "FrontToStudent":
          inventoryFrom = await loadInventory(`${action.subject?.toLowerCase()}_front`);
          break;
        case "ShipmentToBack":
          inventoryTo = await loadInventory(`${action.subject?.toLowerCase()}_back`);
          break;
        case "ShipmentToFront":
          inventoryTo = await loadInventory(`${action.subject?.toLowerCase()}_front`);
          break;
      }
     
      // inventoryFrom[level][subsection] -= numOfCopies
      // inventoryTo[level][subsection] += numOfCopies
    
      if (inventoryFrom) {
        // This finds the object in JSON data based on the section "range".
        const objFoundBySection: Subsection | undefined = inventoryFrom[action.level]?.find((subsection: Subsection) => subsection.range===section);
        
        // Once found, the count is subtracted by the number of Copies based on the section "range".
        if (objFoundBySection) {
          objFoundBySection.count -= action.movementNumOfCopiesMap[section];
        }
      }
      if (inventoryTo) {
        // This finds the object in JSON data based on the section "range".
        const objFoundBySection: Subsection | undefined = inventoryTo[action.level]?.find((subsection: Subsection) => subsection.range===section);

        // Once found, the count is subtracted by the number of Copies based on the section "range".
        if (objFoundBySection) {
          objFoundBySection.count += action.movementNumOfCopiesMap[section];
        }
      }
    

      // Update database of both inventoryFrom and inventoryTo
      // movementType = BackToFront, BackToStudent, FrontToBack, FrontToStudent, ShipmentToBack, ShipmentToFront
      // inventory names are of the form: (subject)_(location); all lowercase
      const movementType = action.movementMap[action.selectedSubsections[index]];
      const fromFrontBackOrShipment = movementType.substring(0,movementType.indexOf("To"))
      const toFrontBackOrStudent = movementType.substring(movementType.indexOf("To")+2)
      console.log(movementType, fromFrontBackOrShipment, toFrontBackOrStudent, index);
      if (inventoryFrom && fromFrontBackOrShipment !== 'Shipment') {
        saveInventory(inventoryFrom,`${action.subject?.toLowerCase()}_${fromFrontBackOrShipment.toLowerCase()}`);
      }
      if (inventoryTo && toFrontBackOrStudent !== 'Student') {
        saveInventory(inventoryTo,`${action.subject?.toLowerCase()}_${toFrontBackOrStudent.toLowerCase()}`);
      }
      index++;
    }
  }
}

export async function updateLogFromActions(submittedActions: SubmittedAction[]) {
  for (const action of submittedActions) {
    const logTime = new Date();

    for (const range of action.selectedSubsections) {
      const numOfCopies = action.movementNumOfCopiesMap[range];
      const movementAction = action.movementMap[range];

      const logEntry: LogEntry = {
        timeStamp: logTime,
        userID: "Mr. Lee",
        eventType: `Adding ${action} To Log`,
        message: `${numOfCopies} copies of ${action.level} ${range} from ${movementAction}`
      };

      await saveLog(logEntry); // call new version
    }
  }
}

export async function loadWorkersFromDB() {
  const collectionRef = collection(db, "workers");
  const documentSnapshot = await getDocs(collectionRef);

  const workers: Worker[] = [];

  documentSnapshot.forEach((doc) => {
    const data = doc.data();
    const siteWorkers = data.workers as Worker[];
    if (Array.isArray(siteWorkers)) {
      workers.push(...siteWorkers);
    }
  });
  // console.log(workers["san-ramon"])
  return workers; 
}

export async function determinePacketsNeededToBeOrdered() {
  //  Pull data on front and back inventory
  const backMathAndFinal: InventoryData | undefined = await loadInventory("math_back");
  const frontMath: InventoryData | undefined = await loadInventory("math_front");
  const backEnglishAndFinal: InventoryData | undefined = await loadInventory("english_back");
  const frontEnglish: InventoryData | undefined = await loadInventory("english_front");

  // loop through the data
  const insufficient: InsufficientSubsection[] = [];
  const mathLevels = Object.keys(frontMath);
  for (const level of mathLevels) {
    for (const range of frontMath[level]) {
      const backMathCount = backMathAndFinal[level].find((subsection: Subsection) => subsection.range===range.range)?.count || 0;
      const frontMathCount = range.count;
      if (backMathCount + frontMathCount < 8) {
        insufficient.push({
          level,
          range: (range.range),
          missingCount:(8-(backMathCount+frontMathCount))
        });
      }
      else {
        insufficient.push({
          level,
          range: (range.range),
          missingCount: 0,
        });
      }
    }
  }
  
  const englishLevels = Object.keys(frontEnglish);
  for (const level of englishLevels) {
    for (const range of frontEnglish[level]) {
      const backEnglishCount = backEnglishAndFinal[level].find((subsection: Subsection) => subsection.range===range.range)?.count || 0;
      const frontEnglishCount = range.count;
      if (backEnglishCount + frontEnglishCount < 8) {
        insufficient.push({
          level,
          range: (range.range),
          missingCount:(8-(backEnglishCount+frontEnglishCount))
        });
      }
      else {
        insufficient.push({
          level,
          range: (range.range),
          missingCount: 0,
        });
      }
    }
  }

  return insufficient;
}

export async function loadStudentsFromDB(place: string) {
  const collectionRef = collection(db,"students", place,"students");  // place = san-ramon
  const documentSnapshot = await getDocs(collectionRef);

  const students: Student[] = [];

  documentSnapshot.forEach((doc) => {
    const studentData = doc.data();
    students.push(studentData as Student);
  });

  return students;
}

export async function addNewStudentToDatabase(place: string, student: Student) {
  const studentsCollectionRef = collection(db,"students", place,"students");
  await addDoc(studentsCollectionRef, student);
  console.log(student.firstName + student.lastName + " was added.");
}

// one-time use: 9/2/25
export async function migrateStudentsArrayToSubcollection() {
  const studentsDocRef = doc(db, "students", "san-ramon");
  const studentSnap = await getDoc(studentsDocRef);

  if (!studentSnap.exists()) {
    console.error("❌ san-ramon doc does not exist");
    return;
  }

  const data = studentSnap.data();
  const studentsArray: Student[] = data.students || []; // existing array

  if (!studentsArray.length) {
    console.log("✅ No students array found, nothing to migrate");
    return;
  }

  console.log(`🔄 Migrating ${studentsArray.length} students...`);

  const studentsSubCol = collection(db, "students", "san-ramon", "students");

  for (const student of studentsArray) {
    await addDoc(studentsSubCol, student);
    console.log(`✅ Migrated: ${student.firstName} ${student.lastName}`);
  }

  // OPTIONAL: remove the old array after migration
  // await updateDoc(studentsDocRef, { students: deleteField() });
  // console.log("🧹 Old students array removed from san-ramon doc");
}

export async function assignHWToStudent(student: Student, hwPackets: string[]) {
  // find student from within database
  const q = query(
    collection(db, "students", "san-ramon", "students"),
    where('firstName','==',student.firstName),
    where('lastName','==',student.lastName)
  );

  // if nothing is found or if more than one is found.
  const qSnapShot = await getDocs(q);
  if (qSnapShot.size !== 1) {
    console.log("The size of your search is NOT 1")
    return;
  }
   
  for (const docSnap of qSnapShot.docs) {
    // Get current homework assigned (if missing, default to empty array)
    const currentHW = (docSnap.data().hwkAssigned ?? []) as string[];

    // Merge new hw packets with existing ones (avoid duplicates if needed)
    const updatedHW = [...currentHW, ...hwPackets];

    // ✅ Only update hwkAssigned field
    await updateDoc(docSnap.ref, {
      hwkAssigned: updatedHW,
    });

    console.log(`✅ Updated hwkAssigned for ${student.firstName} ${student.lastName}`);
  }
}