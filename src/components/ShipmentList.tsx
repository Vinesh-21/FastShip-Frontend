import ShipmentCard from "./ShipmentCard";

type ShipmentsListProps = {
  shipments: any[];
};

export default function ShipmentsList({ shipments }: ShipmentsListProps) {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
      {shipments?.map((shipment) => (
        <ShipmentCard key={shipment.id} shipment={shipment} />
      ))}
    </div>
  );
}
