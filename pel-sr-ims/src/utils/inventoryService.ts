import { doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, query, where, orderBy, } from "firebase/firestore";
import { db } from "./firebase";
import type { LogEntry, SubmittedAction } from "./types";
import type { InventoryData, Subsection, InsufficientSubsection, Worker, Student } from "./types";

// subject_Location = math_back, math_front, english_back, english_front
// Upload your local JSON to Firestore
export const saveInventory = async (data: object, subject_Location: string) => {
  const ref = doc(db, "inventory", subject_Location);
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
  // subject_Location: "math_front" | "math_back" | "english_front" | "english_back"
  // returns {(level: string) --> [ map: {count: # , range: string} ] }
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


export async function updateInventoryFromActions(submittedActions: SubmittedAction[]) {
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
        const objFoundBySection: Subsection | undefined = inventoryFrom[action.level]?.find((subsection: Subsection) => subsection.range === section);

        // Once found, the count is subtracted by the number of Copies based on the section "range".
        if (objFoundBySection) {
          objFoundBySection.count -= action.movementNumOfCopiesMap[section];
        }
      }
      if (inventoryTo) {
        // This finds the object in JSON data based on the section "range".
        const objFoundBySection: Subsection | undefined = inventoryTo[action.level]?.find((subsection: Subsection) => subsection.range === section);

        // Once found, the count is subtracted by the number of Copies based on the section "range".
        if (objFoundBySection) {
          objFoundBySection.count += action.movementNumOfCopiesMap[section];
        }
      }


      // Update database of both inventoryFrom and inventoryTo
      // movementType = BackToFront, BackToStudent, FrontToBack, FrontToStudent, ShipmentToBack, ShipmentToFront
      // inventory names are of the form: (subject)_(location); all lowercase
      const movementType = action.movementMap[action.selectedSubsections[index]];
      const fromFrontBackOrShipment = movementType.substring(0, movementType.indexOf("To"))
      const toFrontBackOrStudent = movementType.substring(movementType.indexOf("To") + 2)
      console.log(movementType, fromFrontBackOrShipment, toFrontBackOrStudent, index);
      if (inventoryFrom && fromFrontBackOrShipment !== 'Shipment') {
        saveInventory(inventoryFrom, `${action.subject?.toLowerCase()}_${fromFrontBackOrShipment.toLowerCase()}`);
      }
      if (inventoryTo && toFrontBackOrStudent !== 'Student') {
        saveInventory(inventoryTo, `${action.subject?.toLowerCase()}_${toFrontBackOrStudent.toLowerCase()}`);
      }
      index++;
    }
  }
}

export async function updateLogFromActions(workerName: string, submittedActions: SubmittedAction[]) {
  for (const action of submittedActions) {
    const logTime = new Date();

    for (const range of action.selectedSubsections) {
      const numOfCopies = action.movementNumOfCopiesMap[range];
      const movementAction = action.movementMap[range];
      const studentFirstName = action.toStudent.firstName;
      const studentLastName = action.toStudent.lastName;

      const logEntry: LogEntry = {
        timeStamp: logTime,
        userID: workerName,
        eventType: `Adding ${action} To Log by ${workerName}`,
        message: `${numOfCopies} ${numOfCopies === 1 ? "copy" : "copies"} of ${action.level} ${range} from ${movementAction} ${studentFirstName ? "for " + (studentFirstName + " " + studentLastName) : ""} | Done by: ${workerName}`
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
      const backMathCount = backMathAndFinal[level].find((subsection: Subsection) => subsection.range === range.range)?.count || 0;
      const frontMathCount = range.count;
      if (backMathCount + frontMathCount < 8) {
        insufficient.push({
          level,
          range: (range.range),
          missingCount: (8 - (backMathCount + frontMathCount))
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
      const backEnglishCount = backEnglishAndFinal[level].find((subsection: Subsection) => subsection.range === range.range)?.count || 0;
      const frontEnglishCount = range.count;
      if (backEnglishCount + frontEnglishCount < 8) {
        insufficient.push({
          level,
          range: (range.range),
          missingCount: (8 - (backEnglishCount + frontEnglishCount))
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
  const collectionRef = collection(db, "students", place, "students");  // place = san-ramon
  const q = query(
    collectionRef,
    orderBy("firstName", "asc"),
  )
  const querySnapshot = await getDocs(q);

  const students: Student[] = [];

  querySnapshot.forEach((doc) => {
    const studentData = doc.data();
    students.push(studentData as Student);
  });

  return students;
}

export async function addNewStudentToDatabase(place: string, student: Student) {
  const studentsCollectionRef = collection(db, "students", place, "students");
  await addDoc(studentsCollectionRef, student); // somehow it's not PROPERLY adding subjects startDate
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
    where('firstName', '==', student.firstName),
    where('lastName', '==', student.lastName)
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
// Worker Management Functions
export async function createNewWorker(firstName: string, lastName: string, location: string = "san-ramon"): Promise<boolean> {
  // Generate initials from first and last name
  const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  const tempPIN = '';

  // Create new worker object (pin will be empty string initially)
  const newWorker: Worker = {
    firstName,
    lastName,
    initials,
  };

  try {
    // Get the workers document for the specified location
    const workersDocRef = doc(db, "workers", location);
    const workersSnap = await getDoc(workersDocRef);

    if (!workersSnap.exists()) {
      // If document doesn't exist, create it with the new worker
      await setDoc(workersDocRef, {
        workers: [{ ...newWorker, pin: "" }]
      });
      console.log(`✅ Created workers document and added ${firstName} ${lastName} (${initials})`);
      return true;
    }

    // Document exists, get current workers array
    const data = workersSnap.data();
    const currentWorkers = data.workers as Worker[];

    // Check if worker with same initials already exists
    const existingWorker = currentWorkers.find((w: Worker) => w.initials === initials);
    if (existingWorker) {
      console.log(`❌ Worker with initials ${initials} already exists`);
      return false;
    }

    // Add new worker to the array
    const updatedWorkers = [...currentWorkers, { ...newWorker, pin: "" }];

    // Update the document
    await updateDoc(workersDocRef, {
      workers: updatedWorkers
    });

    console.log(`✅ Added ${firstName} ${lastName} (${initials}) to ${location} workers`);
    return true;
  } catch (error) {
    console.error("Error creating worker:", error);
    return false;
  }
}

// PIN Authentication Functions
export async function checkWorkerHasPin(workerInitials: string): Promise<boolean> {
  // Check if worker has a PIN set in the database
  const querySnapshot = await getDocs(collection(db, "workers"));

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    const workers = data.workers as Worker[];

    if (Array.isArray(workers)) {
      const worker = workers.find((w: Worker) => w.initials === workerInitials);
      if (worker) {
        return !!(worker as any).pin; // Check if pin field exists and is truthy
      }
    }
  }

  return false;
}

export async function createWorkerPin(workerInitials: string, pin: string): Promise<boolean> {
  // Create a PIN for a worker
  const querySnapshot = await getDocs(collection(db, "workers"));

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    const workers = data.workers as Worker[];

    if (Array.isArray(workers)) {
      const workerIndex = workers.findIndex((w: Worker) => w.initials === workerInitials);
      if (workerIndex !== -1) {
        // Update the worker object with the PIN
        workers[workerIndex] = {
          ...workers[workerIndex],
          pin: pin
        } as any;

        // Update the document
        await updateDoc(docSnap.ref, {
          workers: workers
        });

        console.log(`✅ PIN created for ${workerInitials}`);
        return true;
      }
    }
  }

  console.log(`❌ Worker ${workerInitials} not found`);
  return false;
}

export async function verifyWorkerPin(workerInitials: string, pin: string): Promise<boolean> {
  // Verify a worker's PIN
  const querySnapshot = await getDocs(collection(db, "workers"));

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    const workers = data.workers as Worker[];

    if (Array.isArray(workers)) {
      const worker = workers.find((w: Worker) => w.initials === workerInitials);
      if (worker) {
        return (worker as any).pin === pin;
      }
    }
  }

  return false;
}
// Log Reassignment Functions
export async function canEditLogEntry(logTimestamp: Date): Promise<boolean> {
  // Check if log entry is within 4 hours of creation
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
  return logTimestamp >= fourHoursAgo;
}

export async function reassignLogEntry(
  logId: string,
  newWorkerInitials: string,
  reassignedBy: string
): Promise<boolean> {
  // Reassign a log entry to a different worker
  // Creates an audit trail by adding a new log entry
  try {
    const logDocRef = doc(db, "logs", logId);
    const logSnap = await getDoc(logDocRef);

    if (!logSnap.exists()) {
      console.error("Log entry not found");
      return false;
    }

    const logData = logSnap.data();
    const originalWorker = logData.userID;
    
    // Check if entry is within 4 hours
    const logTimestamp = logData.timeStamp.toDate();
    const canEdit = await canEditLogEntry(logTimestamp);
    
    if (!canEdit) {
      console.error("Log entry is older than 4 hours and cannot be edited");
      return false;
    }

    // Update the log entry with new worker
    await updateDoc(logDocRef, {
      userID: newWorkerInitials,
      reassignedFrom: originalWorker,
      reassignedBy: reassignedBy,
      reassignedAt: new Date(),
    });

    // Create audit log entry
    const auditLogEntry: LogEntry = {
      timeStamp: new Date(),
      userID: reassignedBy,
      eventType: "Log Reassignment",
      message: `Reassigned action from ${originalWorker} to ${newWorkerInitials}: "${logData.message}"`,
    };

    await saveLog(auditLogEntry);

    console.log(`✅ Log entry reassigned from ${originalWorker} to ${newWorkerInitials}`);
    return true;
  } catch (error) {
    console.error("Error reassigning log entry:", error);
    return false;
  }
}

export async function getLogEntryById(logId: string): Promise<LogEntry | null> {
  // Helper function to get a specific log entry
  try {
    const logDocRef = doc(db, "logs", logId);
    const logSnap = await getDoc(logDocRef);

    if (!logSnap.exists()) {
      return null;
    }

    const data = logSnap.data();
    return {
      timeStamp: data.timeStamp.toDate(),
      userID: data.userID,
      eventType: data.eventType,
      message: data.message,
    };
  } catch (error) {
    console.error("Error fetching log entry:", error);
    return null;
  }
}