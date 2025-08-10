import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { postForgotPassword } from "@/services/apiHelpers";
import { UserType } from "@/lib/client";

export default function PartnerForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  async function resetPassword(email: string) {
    setIsLoading(() => true);
    try {
      const res = await postForgotPassword(UserType.Seller, email);
      toast.success(res.data.detail), { duration: 1000 * 60 };
      setIsSent(() => true);
    } catch (error) {
      toast.error((error as AxiosError<any>)?.response?.data?.detail);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = (event: FormEvent) => {
    if (!email) return;
    event.preventDefault();
    resetPassword(email);
  };

  return (
    <div className="h-dvh flex justify-center items-center">
      <form
        method="get"
        onSubmit={handleSubmit}
        className="w-[70%] lg:w-[40%] space-y-4 bg-white p-6 rounded shadow"
      >
        <h2 className="text-xl font-bold">Seller Forgot Password</h2>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
          />
        </div>

        {isSent ? (
          <p className="text-red-500 font-light">
            ** <b className="font-extrabold">Reset link </b>is sent to your mail
            {email} **
          </p>
        ) : (
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <p className="animate-pulse">Loading...</p>
            ) : (
              <p>Send Reset Link </p>
            )}
          </Button>
        )}
      </form>
    </div>
  );
}
