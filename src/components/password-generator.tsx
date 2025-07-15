"use client";

import { useState, useCallback, useEffect } from "react";
import { RefreshCw, ClipboardCopy, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type PasswordGeneratorProps = {
  onPasswordGenerated: (password: string) => void;
};

export function PasswordGenerator({ onPasswordGenerated }: PasswordGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [length, setLength] = useState(16);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const { toast } = useToast();

  const generatePassword = useCallback(() => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    const charPool = uppercaseChars + lowercaseChars + numberChars + symbolChars;

    if (charPool === "") {
      setGeneratedPassword("");
      return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      password += charPool[randomIndex];
    }
    setGeneratedPassword(password);
  }, [length]);
  
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);


  const copyToClipboard = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword);
    toast({
        title: "Copied!",
        description: "Password copied to clipboard.",
        className: "bg-primary text-primary-foreground",
    })
  }

  const handleUsePassword = () => {
    if (!generatedPassword) {
      generatePassword();
      if(generatedPassword) onPasswordGenerated(generatedPassword);
    } else {
        onPasswordGenerated(generatedPassword);
    }
    toast({
        title: "Password Set",
        description: "Generated password has been set in the form.",
        className: "bg-primary text-primary-foreground",
    })
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between space-x-4">
        <h4 className="text-sm font-semibold">
          Password Generator
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            <span className="sr-only">{isOpen ? "Hide" : "Show"} options</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-4 pt-2 border-t data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <div className="flex items-center justify-between pt-2">
              <Label htmlFor="length" className="text-base">Password Length: {length}</Label>
          </div>
          <Slider
              id="length"
              min={8}
              max={64}
              step={1}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
          />
          
          <Button type="button" variant="outline" className="w-full" onClick={generatePassword}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate New Password
          </Button>
           {generatedPassword && (
              <div className="space-y-2">
                  <div className="relative">
                      <Input value={generatedPassword} readOnly className="pr-10 font-mono text-sm sm:text-base" />
                      <Button type="button" size="icon" variant="ghost" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={copyToClipboard}>
                          <ClipboardCopy className="h-4 w-4" />
                      </Button>
                  </div>
                  <Button type="button" className="w-full" onClick={handleUsePassword}>Use this Password</Button>
              </div>
          )}
      </CollapsibleContent>
    </Collapsible>
  );
}
