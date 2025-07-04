

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  // Add other properties as needed
}

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp({ uid, name, email }: SignUpParams) {
  try {
    // Check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();

    if (userRecord.exists)
      return { success: false, message: "User already exists. Please sign in." };

    // Save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      // profileURL,
      // resumeURL,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return { success: false, message: "This email is already in use" };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn({ email, idToken }: SignInParams) {
  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord)
      return { success: false, message: "User does not exist. Create an account." };

    await setSessionCookie(idToken);
  } catch (error: any) {
    console.log("");
    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // Get user info from db
    const userRecord = await db.collection("users").doc(decodedClaims.uid).get();

    if (!userRecord.exists) return null;

    return { ...userRecord.data(), id: userRecord.id } as User;
  } catch (error) {
    console.log(error);
    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
