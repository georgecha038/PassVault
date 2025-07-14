"use client";

import { useState, useEffect, useCallback } from 'react';
import type { PasswordEntry } from '@/types';

const STORAGE_KEY = 'passvault-passwords';

export function usePasswords() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedPasswords = window.localStorage.getItem(STORAGE_KEY);
      if (storedPasswords) {
        setPasswords(JSON.parse(storedPasswords));
      }
    } catch (error) {
      console.error('Failed to load passwords from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(passwords));
      } catch (error) {
        console.error('Failed to save passwords to localStorage', error);
      }
    }
  }, [passwords, isLoaded]);

  const addPassword = useCallback((newPassword: Omit<PasswordEntry, 'id'>) => {
    const entry: PasswordEntry = {
      ...newPassword,
      id: new Date().toISOString() + Math.random(),
    };
    setPasswords(prev => [...prev, entry]);
  }, []);

  const updatePassword = useCallback((updatedPassword: PasswordEntry) => {
    setPasswords(prev =>
      prev.map(p => (p.id === updatedPassword.id ? updatedPassword : p))
    );
  }, []);

  const deletePassword = useCallback((id: string) => {
    setPasswords(prev => prev.filter(p => p.id !== id));
  }, []);

  return { passwords, isLoaded, addPassword, updatePassword, deletePassword };
}
