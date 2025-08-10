import { SignupForm } from "@/components/Signup";
import { UserType } from "@/lib/client";

function PartnerSignup() {
  return (
    <div className="h-dvh flex justify-center items-center">
      <div className="w-[70%] lg:w-[40%]">
        <SignupForm mode={UserType.Partner} />
      </div>
    </div>
  );
}

export default PartnerSignup;
