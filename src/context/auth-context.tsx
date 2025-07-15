"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut, 
  User,
  FirebaseError
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<string | null>;
  signUpWithEmail: (email: string, pass: string) => Promise<string | null>;
  signInWithGoogle: () => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getFriendlyErrorMessage = (error: FirebaseError): string => {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'This email address is already in use.';
    case 'auth/weak-password':
      return 'The password is too weak. Please use at least 6 characters.';
    case 'auth/popup-closed-by-user':
        return 'The sign-in popup was closed. Please try again.';
    case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
    case 'auth/unauthorized-domain':
        return 'This domain is not authorized for authentication. Please contact support.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (!user) {
        // Only redirect if not already on login or signup pages
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          router.push("/login");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const signInWithEmail = async (email: string, pass: string): Promise<string | null> => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      router.push("/");
      return null;
    } catch (error) {
      console.error("Error signing in", error);
      return getFriendlyErrorMessage(error as FirebaseError);
    }
  };
  
  const signUpWithEmail = async (email: string, pass: string): Promise<string | null> => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      router.push("/login?signup=success");
      return null;
    } catch (error) {
      console.error("Error signing up", error);
      return getFriendlyErrorMessage(error as FirebaseError);
    }
  }

  const signInWithGoogle = async (): Promise<string | null> => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
      return null;
    } catch (error) {
        console.error("Error signing in with Google", error);
        return getFriendlyErrorMessage(error as FirebaseError);
    }
  }

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
