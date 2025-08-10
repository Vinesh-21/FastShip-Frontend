import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import type { userType } from "@/types/userType";
import type { AxiosError } from "axios";
import { signup } from "@/services/apiHelpers";
import {
  UserType,
  type DeliveryPartnerCreate,
  type SellerCreate,
} from "@/lib/client";

type PartnerSignupData = {
  email: string;
  max_handling_capacity: number;
  name: string;
  password: string;
  serviceable_zip_codes: number[]; // now number[]
};

type SellerSignupData = {
  email: string;
  name: string;
  password: string;
  zip_code: number;
};

export function SignupForm({
  className,
  mode,
  ...props
}: { mode: UserType | undefined } & React.ComponentProps<"div">) {
  const navigate = useNavigate();

  const { isPending: pendingSignup, mutate: mutateSignup } = useMutation({
    mutationFn: (formData: SellerCreate | DeliveryPartnerCreate) =>
      signup(mode, formData),
    onSuccess: () => {
      toast.success(`Signup successful as a ${mode}`);
      navigate(`/${mode}/login`, { replace: true });
    },
    onError: (error) => {
      const message =
        (error as AxiosError<any>)?.response?.data?.detail ||
        "Something went wrong";
      toast.error(`Signup failed: ${message}`);
    },
  });

  async function handleSubmit(data: FormData) {
    if (!mode) return;

    const email = data.get("email")?.toString() || "";
    const name = data.get("name")?.toString() || "";
    const password = data.get("password")?.toString() || "";

    if (mode === UserType.Partner) {
      const max_handling_capacity = parseInt(
        data.get("max_handling_capacity")?.toString() || "0",
        10
      );
      const serviceable_zip_codes =
        data
          .get("serviceable_zip_codes")
          ?.toString()
          .split(",")
          .map((z) => Number(z.trim())) // convert to numbers
          .filter((n) => !isNaN(n)) || [];

      mutateSignup({
        email,
        name,
        password,
        max_handling_capacity,
        serviceable_zip_codes, // now correct type: number[]
      });
    }

    if (mode === UserType.Seller) {
      const zip_code = parseInt(data.get("zip_code")?.toString() || "0", 10);
      mutateSignup({ email, name, password, zip_code });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            action={async (formData) => handleSubmit(formData)}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-balance">
                  {`Sign up for a FastShip ${mode} account`}
                </p>
              </div>

              {/* Common Fields */}
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
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>

              {/* Partner Specific */}
              {mode === UserType.Partner && (
                <>
                  <div className="grid gap-3">
                    <Label htmlFor="max_handling_capacity">
                      Max Handling Capacity
                    </Label>
                    <Input
                      id="max_handling_capacity"
                      name="max_handling_capacity"
                      type="number"
                      min="1"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="serviceable_zip_codes">
                      Serviceable Zip Codes
                    </Label>
                    <Input
                      id="serviceable_zip_codes"
                      name="serviceable_zip_codes"
                      placeholder="Comma-separated e.g. 12345, 67890"
                      required
                    />
                  </div>
                </>
              )}

              {/* Seller Specific */}
              {mode === UserType.Seller && (
                <div className="grid gap-3">
                  <Label htmlFor="zip_code">Zip Code</Label>
                  <Input id="zip_code" name="zip_code" type="text" required />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={pendingSignup}>
                {pendingSignup ? "Signing up..." : "Sign up"}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  to={`/${mode}/login`}
                  className="underline underline-offset-4"
                >
                  Log in
                </Link>
              </div>
            </div>
          </form>

          {/* Side Image */}
          <div className="bg-muted relative hidden md:block">
            <img
              src={
                mode === UserType.Seller
                  ? "/fastshipSeller.png"
                  : "/fastship.png"
              }
              alt="FastShip Logo"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
