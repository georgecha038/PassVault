"use client";

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import type { PasswordEntry } from '@/types';

const COLLECTION_NAME = 'passwords';

export function usePasswords() {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setPasswords([]);
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);
    const passwordsCollection = collection(db, COLLECTION_NAME);
    const q = query(passwordsCollection, where("userId", "==", user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const passwordsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as PasswordEntry));
      setPasswords(passwordsData);
      setIsLoaded(true);
    }, (error) => {
      console.error('Failed to load passwords from Firestore', error);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [user]);

  const addPassword = useCallback(async (newPassword: Omit<PasswordEntry, 'id' | 'userId'>) => {
    if (!user) {
      console.error("No user logged in to add password");
      return;
    }
    try {
      const passwordsCollection = collection(db, COLLECTION_NAME);
      await addDoc(passwordsCollection, { ...newPassword, userId: user.uid });
    } catch (error) {
      console.error('Failed to save password to Firestore', error);
    }
  }, [user]);

  const updatePassword = useCallback(async (updatedPassword: PasswordEntry) => {
    if (!user) {
      console.error("No user logged in to update password");
      return;
    }
    try {
      const { id, ...dataToUpdate } = updatedPassword;
      if (dataToUpdate.userId !== user.uid) {
        console.error("User does not have permission to update this password");
        return;
      }
      const passwordDoc = doc(db, COLLECTION_NAME, id);
      await updateDoc(passwordDoc, dataToUpdate);
    } catch (error) {
      console.error('Failed to update password in Firestore', error);
    }
  }, [user]);

  const deletePassword = useCallback(async (id: string) => {
     if (!user) {
      console.error("No user logged in to delete password");
      return;
    }
    try {
      // We should ideally check for ownership before deleting, 
      // but Firestore rules will handle this securely.
      const passwordDoc = doc(db, COLLECTION_NAME, id);
      await deleteDoc(passwordDoc);
    } catch (error) {
      console.error('Failed to delete password from Firestore', error);
    }
  }, [user]);

  return { passwords, isLoaded, addPassword, updatePassword, deletePassword };
}
