"use client";

import { useState, useMemo } from "react";
import { PlusCircle, KeyRound, Search } from "lucide-react";
import { usePasswords } from "@/hooks/use-passwords";
import type { PasswordEntry } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AddPasswordDialog } from "@/components/add-password-dialog";
import { ViewPasswordDialog } from "@/components/view-password-dialog";
import PasswordListItem from "./password-list-item";
import { Input } from "./ui/input";

export function PasswordList() {
  const { passwords, isLoaded, addPassword, updatePassword, deletePassword } =
    usePasswords();
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(
    null
  );
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPasswords = useMemo(() => {
    if (!searchQuery) {
      return passwords;
    }
    return passwords.filter(
      (p) =>
        p.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [passwords, searchQuery]);

  const handleViewPassword = (password: PasswordEntry) => {
    setSelectedPassword(password);
    setViewDialogOpen(true);
  };

  const handleEditPassword = (password: PasswordEntry) => {
    setSelectedPassword(password);
    setAddDialogOpen(true);
  };

  const handleDeletePassword = (id: string) => {
    deletePassword(id);
    if (selectedPassword?.id === id) {
      setViewDialogOpen(false);
      setSelectedPassword(null);
    }
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedPassword(null);
  };

  const closeAddDialog = () => {
    setAddDialogOpen(false);
    setSelectedPassword(null);
  };

  const hasPasswords = passwords.length > 0;
  const hasSearchResults = filteredPasswords.length > 0;

  return (
    <div className="container mx-auto max-w-4xl py-4 sm:py-8 px-4 md:px-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl sm:text-2xl font-bold">
              Your Passwords
            </CardTitle>
            <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
              {hasPasswords && (
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search passwords..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
              <Button
                onClick={() => setAddDialogOpen(true)}
                size="sm"
                className="shrink-0"
              >
                <PlusCircle className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add New</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!isLoaded ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
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
            ) : hasPasswords ? (
              hasSearchResults ? (
                filteredPasswords.map((p) => (
                  <PasswordListItem
                    key={p.id}
                    password={p}
                    onView={() => handleViewPassword(p)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 sm:p-12 text-center">
                   <div className="rounded-full border border-dashed bg-secondary p-4">
                      <Search className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold">No Results Found</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Your search for "{searchQuery}" did not match any passwords.
                    </p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 sm:p-12 text-center">
                <div className="rounded-full border border-dashed bg-secondary p-4">
                  <KeyRound className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">
                  No Passwords Saved
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
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
