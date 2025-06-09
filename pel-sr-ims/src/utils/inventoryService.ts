import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Upload your local JSON to Firestore
export const saveInventory = async (data: object) => {
    const ref = doc(db,"inventory","math_front"); 
    await setDoc(ref, data) 
    console.log("Saved!");
}

export async function loadInventory() {
  const docRef = doc(db, 'inventory', 'math_front');
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.log("❌ No such document!");
    return {}; // return empty object
  }

  return docSnap.data(); 
}