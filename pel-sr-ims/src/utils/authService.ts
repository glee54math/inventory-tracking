// authService.ts - Firebase Authentication Service

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export type UserRole = "admin" | "worker" | "parent" | "student";

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: UserRole;
    createdAt: Date;
}

/**
 * Create a new user with email and password
 */
export async function signUpWithEmail(
    email: string,
    password: string,
    displayName: string,
    role: UserRole = "parent"
): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName });

    // Create user profile in Firestore
    await createUserProfile(user.uid, email, displayName, role);

    return user;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
    email: string,
    password: string
): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );
    return userCredential.user;
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(role: UserRole = "parent"): Promise<User> {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    // Check if user profile exists, if not create it
    const userProfile = await getUserProfile(user.uid);
    if (!userProfile) {
        await createUserProfile(
            user.uid,
            user.email || "",
            user.displayName || "",
            role
        );
    }

    return user;
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
    await signOut(auth);
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
}

/**
 * Create user profile in Firestore
 */
async function createUserProfile(
    uid: string,
    email: string,
    displayName: string,
    role: UserRole
): Promise<void> {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
        uid,
        email,
        displayName,
        role,
        createdAt: new Date(),
    });
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        return null;
    }

    const data = userSnap.data();
    return {
        uid: data.uid,
        email: data.email,
        displayName: data.displayName,
        role: data.role,
        createdAt: data.createdAt?.toDate() || new Date(),
    };
}

/**
 * Get current user's role
 */
export async function getUserRole(uid: string): Promise<UserRole | null> {
    const profile = await getUserProfile(uid);
    return profile?.role || null;
}