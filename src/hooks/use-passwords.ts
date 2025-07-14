"use client";

import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { PasswordEntry } from '@/types';

const COLLECTION_NAME = 'passwords';

export function usePasswords() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const passwordsCollection = collection(db, COLLECTION_NAME);
    
    // Set up a real-time listener
    const unsubscribe = onSnapshot(passwordsCollection, (snapshot: QuerySnapshot<DocumentData>) => {
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

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const addPassword = useCallback(async (newPassword: Omit<PasswordEntry, 'id'>) => {
    try {
      const passwordsCollection = collection(db, COLLECTION_NAME);
      await addDoc(passwordsCollection, newPassword);
    } catch (error) {
      console.error('Failed to save password to Firestore', error);
    }
  }, []);

  const updatePassword = useCallback(async (updatedPassword: PasswordEntry) => {
    try {
      const { id, ...dataToUpdate } = updatedPassword;
      const passwordDoc = doc(db, COLLECTION_NAME, id);
      await updateDoc(passwordDoc, dataToUpdate);
    } catch (error) {
      console.error('Failed to update password in Firestore', error);
    }
  }, []);

  const deletePassword = useCallback(async (id: string) => {
    try {
      const passwordDoc = doc(db, COLLECTION_NAME, id);
      await deleteDoc(passwordDoc);
    } catch (error) {
      console.error('Failed to delete password from Firestore', error);
    }
  }, []);

  return { passwords, isLoaded, addPassword, updatePassword, deletePassword };
}
