import SubmitShipment from "@/components/SubmitShipment";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

function SubmitShipmentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === "partner") {
      toast.error("Submit Shipment - Access Only to Seller", {
        position: "top-left",
      });
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="w-screen h-screen pt-4 px-3">
      <SubmitShipment />
    </div>
  );
}

export default SubmitShipmentsPage;
