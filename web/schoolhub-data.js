import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs, query, where, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// These helpers are a starting point, not a full replacement for localStorage.
// Call them only after the user signs in and has a provisioned /users/{uid} profile.
export async function addSchoolNotice({ schoolId, title, body, createdBy }) {
  if (!schoolId || !title?.trim() || !body?.trim() || !createdBy) {
    throw new Error("schoolId, title, body and createdBy are required.");
  }
  return addDoc(collection(db, "schools", schoolId, "notifications"), {
    title: title.trim(),
    body: body.trim(),
    createdBy,
    createdAt: serverTimestamp(),
    audience: { type: "school" },
    status: "draft"
  });
}

export async function listSchoolNotices(schoolId) {
  if (!schoolId) throw new Error("schoolId is required.");
  const q = query(
    collection(db, "schools", schoolId, "notifications"),
    where("status", "==", "published"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
