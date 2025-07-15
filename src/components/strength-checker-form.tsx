"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { analyzePasswordStrength } from "@/ai/flows/password-strength-analyzer";
import type { PasswordStrengthOutput } from "@/ai/flows/password-strength-analyzer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

type FormInputs = {
  password: string;
};

export function StrengthCheckerForm() {
  const form = useForm<FormInputs>({
    defaultValues: { password: "" },
  });
  const [analysis, setAnalysis] = useState<PasswordStrengthOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzePasswordStrength({ password: data.password });
      setAnalysis(result);
    } catch (e) {
      setError("Failed to analyze password. Please try again.");
      console.error(e);
    }
    setIsLoading(false);
  };
  
  const getStrengthBadgeClass = (strength: string) => {
    switch (strength.toLowerCase()) {
      case 'strong':
        return 'bg-green-500 text-white hover:bg-green-500/90';
      case 'moderate':
        return 'bg-yellow-500 text-white hover:bg-yellow-500/90';
      case 'weak':
        return 'bg-red-500 text-white hover:bg-red-500/90';
      default:
        return 'default';
    }
  }

  const getStrengthBorderClass = (strength: string) => {
     switch (strength.toLowerCase()) {
      case 'strong':
        return 'border-green-500/50';
      case 'moderate':
        return 'border-yellow-500/50';
      case 'weak':
        return 'border-red-500/50';
      default:
        return '';
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <FormField
              control={form.control}
              name="password"
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter a password to analyze"
                      {...field}
                      className="text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="min-w-[120px] w-full sm:w-auto">
              {isLoading ? <Loader2 className="animate-spin" /> : "Analyze"}
            </Button>
          </div>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysis && (
        <div className="space-y-4">
            <Alert className={cn("border-2", getStrengthBorderClass(analysis.strength))}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <AlertTitle className="text-lg sm:text-xl">Analysis Result</AlertTitle>
                    <Badge className={cn("self-start sm:self-center", getStrengthBadgeClass(analysis.strength))}>{analysis.strength}</Badge>
                </div>
                <AlertDescription className="mt-4">
                    <p className="font-semibold mb-2">Suggestions for improvement:</p>
                    <ul className="space-y-2">
                        {analysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 mt-1 shrink-0 text-green-400" />
                                <span>{suggestion}</span>
                            </li>
                        ))}
                    </ul>
                </AlertDescription>
            </Alert>
        </div>
      )}
    </div>
  );
}
