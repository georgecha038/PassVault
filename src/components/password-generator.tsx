"use client";

import { useState, useCallback, useEffect } from "react";
import { RefreshCw, ClipboardCopy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

type PasswordGeneratorProps = {
  onPasswordGenerated: (password: string) => void;
};

export function PasswordGenerator({ onPasswordGenerated }: PasswordGeneratorProps) {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const { toast } = useToast();

  const generatePassword = useCallback(() => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let charPool = "";
    if (includeUppercase) charPool += uppercaseChars;
    if (includeLowercase) charPool += lowercaseChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSymbols) charPool += symbolChars;

    if (charPool === "") {
        toast({
            title: "Error",
            description: "Please select at least one character type.",
            variant: "destructive"
        });
      setGeneratedPassword("");
      return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      password += charPool[randomIndex];
    }
    setGeneratedPassword(password);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, toast]);
  
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
    <Card className="bg-secondary/50">
        <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
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
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                    <Switch id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                    <Label htmlFor="uppercase">Uppercase</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
                    <Label htmlFor="lowercase">Lowercase</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                    <Label htmlFor="numbers">Numbers</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                    <Label htmlFor="symbols">Symbols</Label>
                </div>
            </div>
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
        </CardContent>
    </Card>
  );
}
