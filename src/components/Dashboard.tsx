import StatCards from "@/components/StatCards";
import { calculateOrderStats } from "@/lib/helper";
import ShipmentsList from "@/components/ShipmentList";
import { useQuery } from "@tanstack/react-query";
import { getAllShipments } from "@/services/apiHelpers";
import { useAuth } from "@/contexts/AuthContext";
import Spinner from "./Spinner";

function Dashboard() {
  const { user } = useAuth();

  const { isPending, data, isSuccess } = useQuery({
    queryKey: ["shipments"],
    queryFn: () => getAllShipments(user),
  });

  const shipments = data?.data || [];

  const { placed, out_for_delivery, in_transit, cancelled, delivered } =
    calculateOrderStats(shipments);
  return (
    <>
      {isPending ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md">
          <Spinner />
        </div>
      ) : null}
      <div className="w-full overflow-x-hidden">
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
          <div className="grid auto-rows-min gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            <StatCards title="Placed" statNumber={placed} color="blue" />
            <StatCards
              title="In Transit"
              statNumber={in_transit}
              color="purple"
            />
            <StatCards
              title="Out For Delivery"
              statNumber={out_for_delivery}
              color="amber"
            />
            <StatCards title="Delivered" statNumber={delivered} color="green" />
            <div>
              <StatCards title="Cancelled" statNumber={cancelled} color="red" />
            </div>
          </div>
          {/* 🚀 Show list of shipments below the stat cards */}
          {isSuccess && shipments.length > 0 ? (
            <ShipmentsList shipments={shipments} />
          ) : (
            <div className="min-h-[30vh] flex items-center justify-center text-gray-500">
              No Shipments Found
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
