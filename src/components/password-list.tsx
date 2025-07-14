"use client";

import { useState } from "react";
import { PlusCircle, KeyRound } from "lucide-react";
import { usePasswords } from "@/hooks/use-passwords";
import type { PasswordEntry } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AddPasswordDialog } from "@/components/add-password-dialog";
import { ViewPasswordDialog } from "@/components/view-password-dialog";
import PasswordListItem from "./password-list-item";

export function PasswordList() {
  const { passwords, isLoaded, addPassword, updatePassword, deletePassword } =
    usePasswords();
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(
    null
  );
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);

  const handleViewPassword = (password: PasswordEntry) => {
    setSelectedPassword(password);
    setViewDialogOpen(true);
  };

  const handleEditPassword = (password: PasswordEntry) => {
    setSelectedPassword(password);
    setAddDialogOpen(true);
  }

  const handleDeletePassword = (id: string) => {
    deletePassword(id);
    if (selectedPassword?.id === id) {
      setViewDialogOpen(false);
      setSelectedPassword(null);
    }
  }

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedPassword(null);
  };
  
  const closeAddDialog = () => {
    setAddDialogOpen(false);
    setSelectedPassword(null);
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 md:px-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Your Passwords</CardTitle>
          <Button onClick={() => setAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!isLoaded ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))
            ) : passwords.length > 0 ? (
              passwords.map((p) => (
                <PasswordListItem
                  key={p.id}
                  password={p}
                  onView={() => handleViewPassword(p)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
                <div className="rounded-full border border-dashed bg-secondary p-4">
                  <KeyRound className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No Passwords Saved</h3>
                <p className="text-muted-foreground">
                  Click "Add New" to save your first password.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <AddPasswordDialog
        isOpen={isAddDialogOpen}
        onClose={closeAddDialog}
        onSave={selectedPassword ? updatePassword : addPassword}
        passwordEntry={selectedPassword}
      />

      {selectedPassword && (
        <ViewPasswordDialog
          isOpen={isViewDialogOpen}
          onClose={closeViewDialog}
          passwordEntry={selectedPassword}
          onDelete={handleDeletePassword}
          onEdit={() => {
            closeViewDialog();
            handleEditPassword(selectedPassword);
          }}
        />
      )}
    </div>
  );
}
