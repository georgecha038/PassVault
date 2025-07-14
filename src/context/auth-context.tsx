"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getFriendlyErrorMessage = (error: FirebaseError): string => {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'This email address is already in use.';
    case 'auth/weak-password':
      return 'The password is too weak. Please use at least 6 characters.';
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

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signUpWithEmail, logout }}>
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
