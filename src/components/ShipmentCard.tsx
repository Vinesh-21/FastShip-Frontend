import {
  ArrowUp,
  CheckCircle,
  Truck,
  PackageCheck,
  XCircle,
  Upload,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router";

type TimelineItem = {
  status: string;
  description: string;
  created_at: string;
};

type Shipment = {
  id: string;
  timeline: TimelineItem[];
  content: string;
  destination: number;
  weight: number;
};

type Props = {
  shipment: Shipment;
};

const statusIconMap: Record<string, React.ReactElement> = {
  placed: <ArrowUp className="text-blue-500" />,
  in_transit: <Truck className="text-purple-500" />,
  out_for_delivery: <PackageCheck className="text-amber-500" />,
  delivered: <CheckCircle className="text-green-600" />,
  cancelled: <XCircle className="text-red-500" />,
};

const statusLabelMap: Record<string, string> = {
  placed: "placed",
  in_transit: "in transit",
  out_for_delivery: "shipment out for delivery",
  delivered: "successfully delivered",
  cancelled: "cancelled",
};

export default function ShipmentCard({ shipment }: Props) {
  const { user } = useAuth();
  const { id, timeline, weight, content, destination } = shipment;

  const sortedTimeline = [...timeline].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const latestTwo = sortedTimeline.slice(0, 2);

  return (
    <div className="rounded-xl shadow-md border p-4 w-full max-w-full flex flex-col justify-between h-full">
      {/* Shipment ID */}
      <div>
        <p className="text-muted-foreground text-sm">Shipment Number</p>
        <p className="font-semibold text-lg">{id.slice(0, 10)}</p>
      </div>

      {/* Timeline - grows to fill space */}
      <div className="flex-1 mt-4 flex flex-col gap-3 border-l-2 pl-4 relative">
        {latestTwo.map((entry, idx) => {
          const status = entry.status;
          const label = entry.description || statusLabelMap[status];
          const time = new Date(entry.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div className="flex items-start gap-3" key={idx}>
              <div className="w-6 h-6 mt-1">
                {statusIconMap[status] || (
                  <PackageCheck className="text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{time}</p>
                <p className="text-sm">{label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full mt-4 cursor-pointer">View Details</Button>
        </DialogTrigger>

        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Shipment Details</DialogTitle>
            <DialogDescription asChild>
              <div>
                <div className="relative">
                  <div>
                    <span className="font-semibold">Shipment ID:</span>
                    <span className="font-mono">{id}</span>
                    <br />
                  </div>
                  {user === "partner" && (
                    <div className="absolute flex items-center flex-col top-0 right-0">
                      <Link
                        to={`/dashboard/update-shipment?shipmentID=${id}`}
                        className="flex items-center justify-center rounded-lg bg-[#18181a] size-10"
                      >
                        <Upload color="white" />
                      </Link>
                      <span className="font-bold text-[#18181a]">
                        Update Shipment
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <span className="font-semibold">Content:</span> {content}
                  <br />
                  <span className="font-semibold">Destination:</span>{" "}
                  {destination}
                  <br />
                  <span className="font-semibold">Weight:</span> {weight}
                  <br />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4 max-h-[400px] overflow-y-auto border-l pl-4">
            {sortedTimeline.map((entry, idx) => {
              const time = new Date(entry.created_at).toLocaleString();
              return (
                <div key={idx} className="flex items-start gap-3">
                  {statusIconMap[entry.status]}
                  <div>
                    <p className="font-medium">{time}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
