import UpdateShipment from "@/components/UpdateShipment";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

function UpdateShipmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === "seller") {
      toast.error("Update Shipment - Access Only to Delivery Partner", {
        position: "top-left",
      });
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="w-screen h-screen pt-4 px-3">
      <UpdateShipment />
    </div>
  );
}

export default UpdateShipmentPage;
