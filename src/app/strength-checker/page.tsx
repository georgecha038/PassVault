import { Header } from "@/components/header";
import { StrengthCheckerForm } from "@/components/strength-checker-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function StrengthCheckerPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl py-4 sm:py-8 px-4 md:px-6">
            <Card className="shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <ShieldCheck className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold">Password Strength Analyzer</CardTitle>
                    <CardDescription className="text-muted-foreground text-sm sm:text-base">
                        Powered by AI, this tool assesses your password's strength and provides suggestions for improvement.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <StrengthCheckerForm />
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
