import { LoginForm } from "@/components/login-form";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/lib/client";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const PartnerLoginPage = () => {
  const { token, user, isInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if already authenticated and initialization is complete
    if (isInitialized && token && user === "partner") {
      navigate("/dashboard", { replace: true });
    }
  }, [token, user, isInitialized, navigate]);

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="h-dvh flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  // If already authenticated, don't render the form (prevents flash)
  if (token && user === "partner") {
    return (
      <div className="h-dvh flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-dvh flex justify-center items-center">
      <div className="w-[70%] lg:w-[40%]">
        <LoginForm user={UserType.Partner} />
      </div>
    </div>
  );
};

export default PartnerLoginPage;
