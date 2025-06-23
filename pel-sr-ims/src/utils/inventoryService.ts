import { doc, getDoc, setDoc, } from "firebase/firestore";
import { db } from "./firebase";
import type { SubmittedAction } from "./types";
import type { InventoryData, Subsection } from "./types";


// subject_Location = math_back, math_front, english_back, english_front
// Upload your local JSON to Firestore
export const saveInventory = async (data: object, subject_Location: string) => {
    const ref = doc(db,"inventory",subject_Location); 
    await setDoc(ref, data) 
    console.log("Saved!");
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

export async function updateInventoryFromActions( submittedActions: SubmittedAction[]) {
  // SubmittedAction has subject, level, subsection[], movementType(AtoB), numOfCopies
  // movementType = BackToFront, BackToStudent, FrontToBack, FrontToStudent, ShipmentToBack, ShipmentToFront
  // Determine the inventories involved
  console.log(submittedActions)
  let inventoryFrom: InventoryData | undefined;
  let inventoryTo: InventoryData | undefined;
  let index = 0;  // used for associating [] and map

  for (const action of submittedActions) {
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
    action.selectedSubsections.forEach((section: string) => {
      if (inventoryFrom) {
        // This finds the object in JSON data based on the section "range".
        const objFoundBySection: Subsection | undefined = inventoryFrom[action.level]?.find((subsection: Subsection) => subsection.range===section);
        
        // Once found, the count is subtracted by the number of Copies based on the section "range".
        if (objFoundBySection)
          objFoundBySection.count -= action.movementNumOfCopiesMap[section];
      }
      if (inventoryTo) {
        // This finds the object in JSON data based on the section "range".
        const objFoundBySection: Subsection | undefined = inventoryTo[action.level]?.find((subsection: Subsection) => subsection.range===section);

        // Once found, the count is subtracted by the number of Copies based on the section "range".
        if (objFoundBySection)
          objFoundBySection.count += action.movementNumOfCopiesMap[section];
      }
    })

    // Update database of both inventoryFrom and inventoryTo
    // movementType = BackToFront, BackToStudent, FrontToBack, FrontToStudent, ShipmentToBack, ShipmentToFront
    // inventory names are of the form: (subject)_(location); all lowercase
    const movementType = action.movementMap[action.selectedSubsections[index]];
    const fromFrontBackOrShipment = movementType.substring(0,movementType.indexOf("To"))
    const toFrontBackOrStudent = movementType.substring(movementType.indexOf("To")+2)
    if (inventoryFrom && fromFrontBackOrShipment !== 'Shipment')
      saveInventory(inventoryFrom,`${action.subject?.toLowerCase()}_${fromFrontBackOrShipment.toLowerCase()}`);
    if (inventoryTo && toFrontBackOrStudent !== 'Student')
      saveInventory(inventoryTo,`${action.subject?.toLowerCase()}_${toFrontBackOrStudent.toLowerCase()}`);

    index++;
  }

}