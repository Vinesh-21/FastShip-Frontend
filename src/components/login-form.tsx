import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext"; //
import toast from "react-hot-toast";
import type emailPasswordType from "@/types/account";
import { Link, useNavigate } from "react-router";
import type { userType } from "@/types/userType";
import type { AxiosError } from "axios";

export function LoginForm({
  className,
  user,
  ...props
}: { user: userType | undefined } & React.ComponentProps<"div">) {
  // useAuth from AuthContext
  const { login } = useAuth();

  // useNavigate Hook
  const navigate = useNavigate();

  const { isPending: pendingLogin, mutate: mutateLogin } = useMutation({
    mutationFn: async ({ email, password }: emailPasswordType) => {
      if (user === undefined) return;
      return await login(user, email, password);
    },
    onSuccess: () => {
      // Redirect, show success
      toast.success(`Login successful as a ${user}`);
      navigate("/dashboard", { replace: true });
    },
    onError: (error) => {
      // Show toast

      const message =
        (error as AxiosError<any>)?.response?.data?.detail ||
        "Something Went Wrong";
      toast.error(`Login failed: ${message}`);
    },
  });

  async function handleSubmit(data: FormData) {
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();
    if (!email || !password) return;
    mutateLogin({ email, password });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" action={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  {`Login to FastShip ${user} account`}
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to={`/${user}/forgot-password`}
                    className="text-blue-500 hover:underline text-xs"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={pendingLogin}>
                {pendingLogin ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center text-sm">
                Don&apos;t have an account?
                <Link
                  to={`/${user === "seller" ? "seller" : "partner"}/signup`}
                  className="underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={user === "seller" ? "/fastshipSeller.png" : "/fastship.png"}
              alt="FastShip Logo"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
