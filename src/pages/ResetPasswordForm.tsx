import { useState, type FormEvent } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import type { userType } from "@/types/userType";

export default function ResetPasswordForm({ mode }: { mode: userType }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const validate = (): string | null => {
    if (!token)
      return "No token provided. Please use the link sent to your email.";
    if (!password || !confirmPassword)
      return "Please fill both password fields.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setIsLoading(true);
    try {
      const BACKEND =
        import.meta.env.VITE_BACKEND_URL ?? "http://127.0.0.1:8000/";

      const url =
        mode === "seller"
          ? `${BACKEND}/seller/reset_password`
          : `${BACKEND}/partner/reset_password`;

      const formData = new FormData();
      formData.append("password", password);
      const res = await axios.post(url + `?token=${token}`, formData);

      toast.success(res.data?.detail ?? "Password reset successful.");
      setIsSuccess(true);
      setTimeout(() => navigate(`/${mode}/login`), 3000);
    } catch (error) {
      const msg =
        (error as AxiosError<any>)?.response?.data?.detail ??
        (error as AxiosError<any>)?.message ??
        "Something went wrong.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="h-dvh flex justify-center items-center">
        <div className="w-[90%] lg:w-[40%] bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4">Invalid reset link</h2>
          <p className="mb-4">
            No token found in the URL. Please open the link from your email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh flex justify-center items-center">
      <form
        className="w-[90%] lg:w-[40%] space-y-4 bg-white p-6 rounded shadow"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold">Reset Password</h2>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            required
            minLength={8}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password (min 8 chars)"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            required
            minLength={8}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
          />
        </div>

        <div>
          {isSuccess ? (
            <p className="text-green-600">
              Password reset successful. Redirecting to login...
            </p>
          ) : (
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <p className="animate-pulse">Saving...</p>
              ) : (
                <p>Reset Password</p>
              )}
            </Button>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Token:{" "}
          <code className="font-mono break-all bg-stone-400/40 text-black-300 px-1 rounded">
            {token}
          </code>
        </p>
      </form>
    </div>
  );
}
