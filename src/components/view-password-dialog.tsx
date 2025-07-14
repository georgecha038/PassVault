"use client";

import { useState } from "react";
import type { PasswordEntry } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Eye, EyeOff, Trash2, Pencil } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";


type ViewPasswordDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  passwordEntry: PasswordEntry;
  onDelete: (id: string) => void;
  onEdit: () => void;
};

export function ViewPasswordDialog({
  isOpen,
  onClose,
  passwordEntry,
  onDelete,
  onEdit
}: ViewPasswordDialogProps) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${fieldName} has been copied.`,
      className: "bg-primary text-primary-foreground",
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };
  
  const handleDelete = () => {
    onDelete(passwordEntry.id)
    toast({
        title: "Password Deleted",
        description: `Credentials for ${passwordEntry.website} have been deleted.`,
        variant: "destructive",
    });
    onClose();
  }

  if (!passwordEntry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="truncate">{passwordEntry.website}</DialogTitle>
          <DialogDescription>
            Viewing credentials. Be careful where you display this information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input id="username" value={passwordEntry.username} readOnly className="truncate" />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => copyToClipboard(passwordEntry.username, "Username")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                value={passwordEntry.password}
                readOnly
              />
              <div className="absolute right-1 top-1/2 flex -translate-y-1/2">
                 <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={togglePasswordVisibility}
                  >
                    {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => copyToClipboard(passwordEntry.password, "Password")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between gap-2">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the password for <strong>{passwordEntry.website}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="flex flex-col-reverse sm:flex-row gap-2">
              <DialogClose asChild>
                <Button variant="secondary" className="w-full sm:w-auto">Close</Button>
              </DialogClose>
              <Button onClick={onEdit} className="w-full sm:w-auto">
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
