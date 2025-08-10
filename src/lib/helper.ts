import type { ShipmentRead } from "@/lib/client";

interface OrderStats {
  placed: number;
  out_for_delivery: number;
  in_transit: number;
  delivered: number;
  cancelled: number;
}

export function calculateOrderStats(
  shipments: ShipmentRead[] | undefined
): OrderStats {
  const stats: OrderStats = {
    placed: 0,
    out_for_delivery: 0,
    in_transit: 0,
    delivered: 0,
    cancelled: 0,
  };

  if (shipments === undefined) return stats;

  for (const shipment of shipments) {
    const timeline = shipment.timeline;

    if (timeline.length === 0) continue;

    // Find the latest event by date
    const latestStatus = timeline.reduce((latest, current) =>
      new Date(current.created_at) > new Date(latest.created_at)
        ? current
        : latest
    );

    switch (latestStatus.status) {
      case "placed":
        stats.placed++;
        break;
      case "out_for_delivery":
        stats.out_for_delivery++;
        break;
      case "in_transit":
        stats.in_transit++;
        break;
      case "delivered":
        stats.delivered++;
        break;
      case "cancelled":
        stats.cancelled++;
        break;
    }
  }

  return stats;
}
