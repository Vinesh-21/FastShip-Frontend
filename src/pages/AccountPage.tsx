import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile } from "@/services/apiHelpers";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

function AccountPage() {
  const { user, logout } = useAuth();

  const { data, isPending } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(user),
  });

  const { isPending: isPendingLogout, mutate: logoutUser } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Logged Out Successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return (
    <>
      {isPending ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md">
          <Spinner />
        </div>
      ) : null}
      <div className=" w-screen h-screen pt-4 px-3">
        <div className="w-[60%] sm:w-[30%] space-y-4 ">
          <div className="flex flex-col gap-2 w-full">
            <Label>Name</Label>
            <Input
              value={data?.data.name ?? ""}
              disabled
              className="border-stone-500 border-2 bg-stone-700/30"
            />
          </div>
          <div className="flex flex-col gap-2 w-full ">
            <Label>Email</Label>
            <Input
              value={data?.data.email ?? ""}
              disabled
              className="border-stone-500 border-2 bg-stone-700/30"
            />
          </div>
          <div className="w-full">
            <Button
              disabled={isPendingLogout}
              onClick={() => logoutUser(user!)}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountPage;
