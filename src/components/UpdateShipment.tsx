import { useEffect } from "react";
import { Button } from "./ui/button";
import { Trash, Upload } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import FormInputField from "./FormInput";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSearchParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getShipmentByID, patchUpdateShipments } from "@/services/apiHelpers";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

function UpdateShipment() {
  let [searchParams] = useSearchParams();
  let shipmentID = searchParams.get("shipmentID");

  //   Fetch Data
  const { data: shipmentData } = useQuery({
    queryKey: ["getShipmentID", shipmentID],
    queryFn: () => getShipmentByID(shipmentID!),
    enabled: !!shipmentID,
  });

  const queryClient = useQueryClient();

  //   Patch Data
  const { mutate: updateShipment, isPending: isUpdating } = useMutation({
    mutationKey: ["updateShipment"],
    mutationFn: patchUpdateShipments,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getShipmentID", shipmentID],
      });
      toast.success("Shipment updated successfully!");
    },
    onError: (error: any) => {
      toast.error(
        `Error: ${(error as AxiosError<any>)?.response?.data?.detail} `
      );
    },
  });

  const { register, handleSubmit, reset, formState, control } = useForm({
    defaultValues: {
      shipment_id: "",
      description: "",
      //   estimated_delivery: "",
      location: "",
      status: "",
      verification_otp: "",
    },
  });
  let lenOfShipmentEvent = shipmentData?.data?.timeline.length;
  const lastTimelineEntry =
    shipmentData?.data.timeline[lenOfShipmentEvent! - 1];

  useEffect(() => {
    if (shipmentData?.data) {
      const rawDelivery = shipmentData.data.estimated_delivery;

      //   const formattedDelivery = rawDelivery
      //     ? new Date(rawDelivery).toISOString().slice(0, 16)
      //     : "";
      reset({
        shipment_id: shipmentData.data.id || "",
        description: lastTimelineEntry?.description || "",
        // estimated_delivery: formattedDelivery,
        location: String(shipmentData.data.destination) || "",
        status: lastTimelineEntry?.status,
        verification_otp: "",
      });
    }
  }, [shipmentData, reset]);

  const { errors } = formState;

  const onSubmit = (data: any) => {
    if (data?.verification_otp) {
      if (data?.status !== "delivered") {
        toast.error("Status should be *Delivered* While Submitting the OTP");
        return;
      }
    }

    updateShipment(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[80%] sm:w-[50%] md:w-[30%] space-y-4"
    >
      <FormInputField
        id="shipment_id"
        label="Shipment ID"
        placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
        registration={register("shipment_id", {
          required: "Required!, Enter the Shipment ID",
        })}
        error={errors.shipment_id}
      />

      <FormInputField
        id="description"
        label="Description"
        type="text"
        placeholder="e.g. Scanned at 60028"
        registration={register("description")}
        error={errors.description}
      />

      {/* <FormInputField
        id="estimated_delivery"
        label="Estimated Delivery"
        type="datetime-local"
        registration={register("estimated_delivery", {
          required: "Required! , Entry is Estimated Delivery.",
        })}
        error={errors.estimated_delivery}
      /> */}

      <FormInputField
        id="location"
        label="location"
        type="number"
        placeholder="e.g. 60028 (PIN/ZIP code)"
        registration={register("location", {})}
        error={errors.location}
      />

      <div className={"flex flex-col gap-2 w-full "}>
        <Label>Status</Label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              key={field.value}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Shipment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placed">Placed</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="out_for_delivery">
                  Out For Delivery
                </SelectItem>
                {lastTimelineEntry?.status === "out_for_delivery" && (
                  <SelectItem value="delivered">Delivered</SelectItem>
                )}
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {lastTimelineEntry?.status === "out_for_delivery" ? (
        <FormInputField
          id="verification_otp"
          label="Verification OTP"
          type="text"
          placeholder="e.g. 332833"
          registration={register("verification_otp", {
            required: "Required!, Enter the 6-digit OTP",
            validate: (val) =>
              val.length === 6 || "OTP should be exactly 6 digits",
          })}
          error={errors.verification_otp}
        />
      ) : null}

      <div className="flex justify-between items-center gap-2 w-full">
        <Button
          disabled={isUpdating}
          type="reset"
          onClick={() => reset}
          variant={"outline"}
          className="flex items-center gap-2 "
        >
          Clear <Trash />
        </Button>
        {lastTimelineEntry?.status === "delivered" ? (
          <p className="text-red-500">**This Shipment is already delivered**</p>
        ) : (
          <Button
            type="submit"
            className="flex items-center gap-2 "
            disabled={isUpdating}
          >
            Update <Upload color="white" />
          </Button>
        )}
      </div>
    </form>
  );
}

export default UpdateShipment;
