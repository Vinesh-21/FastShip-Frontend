import { SignupForm } from "@/components/Signup";
import { UserType } from "@/lib/client";
import React from "react";

function SellerSignup() {
  return (
    <div className="h-dvh flex justify-center items-center">
      <div className="w-[70%] lg:w-[40%]">
        <SignupForm mode={UserType.Seller} />
      </div>
    </div>
  );
}

export default SellerSignup;
