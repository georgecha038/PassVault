"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PasswordEntry } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordGenerator } from "./password-generator";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  website: z.string().url({ message: "Please enter a valid URL." }),
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type AddPasswordDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  passwordEntry: PasswordEntry | null;
};

export function AddPasswordDialog({
  isOpen,
  onClose,
  onSave,
  passwordEntry,
}: AddPasswordDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      website: "",
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (passwordEntry && isOpen) {
      form.reset({
        website: passwordEntry.website,
        username: passwordEntry.username,
        password: passwordEntry.password,
      });
    } else if (!passwordEntry && isOpen) {
      form.reset({
        website: "",
        username: "",
        password: "",
      });
    }
  }, [passwordEntry, form, isOpen]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (passwordEntry) {
        onSave({ ...passwordEntry, ...values });
    } else {
        onSave(values);
    }
    toast({
      title: passwordEntry ? "Password Updated" : "Password Saved",
      description: `Credentials for ${values.website} have been securely saved.`,
      className: "bg-primary text-primary-foreground",
    });
    onClose();
  };
  
  const handleGeneratedPassword = (password: string) => {
    form.setValue("password", password, { shouldValidate: true });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{passwordEntry ? "Edit Password" : "Add New Password"}</DialogTitle>
          <DialogDescription>
            Enter the details for the new password entry.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <PasswordGenerator onPasswordGenerated={handleGeneratedPassword} />

            <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
              <Button type="submit" className="w-full sm:w-auto">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
