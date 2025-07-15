"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const GoogleIcon = () => (
  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25C22.56 11.45 22.49 10.68 22.36 9.92H12V14.4H18.2C17.93 15.99 17.02 17.36 15.65 18.27V20.73H19.34C21.45 18.83 22.56 15.83 22.56 12.25Z" fill="#4285F4" />
    <path d="M12 23C14.97 23 17.45 22.04 19.34 20.73L15.65 18.27C14.65 18.93 13.43 19.33 12 19.33C9.31 19.33 7.02 17.64 6.13 15.35H2.34V17.9C4.23 21.03 7.84 23 12 23Z" fill="#34A853" />
    <path d="M6.13 15.35C5.89 14.65 5.75 13.88 5.75 13.1C5.75 12.32 5.89 11.55 6.13 10.85V8.29H2.34C1.5 9.87 1 11.43 1 13.1C1 14.77 1.5 16.33 2.34 17.9L6.13 15.35Z" fill="#FBBC05" />
    <path d="M12 6.67C13.56 6.67 14.92 7.21 15.99 8.22L19.43 4.78C17.45 2.9 14.97 1.9 12 1.9C7.84 1.9 4.23 3.97 2.34 7.1L6.13 9.65C7.02 7.36 9.31 5.67 12 5.67V6.67H12Z" fill="#EA4335" />
  </svg>
);

export default function LoginPage() {
  const { user, loading, signInWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
    if (searchParams.get('signup') === 'success') {
      setShowSuccess(true);
    }
  }, [user, loading, router, searchParams]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    const err = await signInWithEmail(values.email, values.password);
    if (err) {
      setError(err);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    const err = await signInWithGoogle();
    if (err) {
      setError(err);
    }
  };

  if (loading || user) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">PassVault</CardTitle>
          <CardDescription>
            Secure your digital life. Sign in to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               {showSuccess && (
                <Alert variant="default" className="bg-green-500/10 border-green-500/50 text-green-500">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="text-green-400">Signup Successful!</AlertTitle>
                  <AlertDescription>
                    You can now log in with your new account.
                  </AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="user@example.com" {...field} />
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
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            <GoogleIcon />
            Sign in with Google
          </Button>

        </CardContent>
        <CardFooter className="justify-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
