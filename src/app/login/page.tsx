"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const GoogleIcon = () => (
    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C9.37,19.27 7.13,17.21 7.13,14.39C7.13,11.57 9.37,9.5 12.19,9.5C13.59,9.5 14.6,10.27 15.09,10.71L17.03,8.79C15.64,7.4 14.12,6.5 12.19,6.5C8.07,6.5 4.5,9.65 4.5,14.39C4.5,19.13 8.07,22.28 12.19,22.28C16.53,22.28 20.24,19.34 20.24,14.5C20.24,13.44 20.08,12.33 19.82,11.53L21.35,11.1Z"
      />
    </svg>
  );

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
          <Button
            onClick={signInWithGoogle}
            className="w-full"
            variant="outline"
          >
            <GoogleIcon />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
