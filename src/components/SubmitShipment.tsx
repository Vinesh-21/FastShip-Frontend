import { postSubmitShipment } from "@/services/apiHelpers";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { ShipmentCreate } from "@/lib/client";
import { Trash, TruckIcon } from "lucide-react";
import type { AxiosError } from "axios";
import FormInputField from "./FormInput";

function SubmitShipment() {
  const { register, handleSubmit, reset, formState } = useForm();

  const { errors } = formState;

  const queryClient = useQueryClient();

  const { isPending, mutate: mutateCreateShipment } = useMutation({
    mutationFn: (data: ShipmentCreate) => postSubmitShipment(data),
    onSuccess: () => {
      toast.success("Shipment Created");
      queryClient.invalidateQueries({
        queryKey: ["shipments"],
      });

      reset();
    },
    onError: (error) => {
      toast.error(
        `Error: ${(error as AxiosError<any>)?.response?.data?.detail} `
      );
    },
  });

  const onSubmit = (data: any) => {
    mutateCreateShipment(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[80%] sm:w-[50%] md:w-[30%] space-y-4"
    >
      <FormInputField
        id="content"
        label="Content"
        placeholder="e.g. Phone, Docs, Books etc..."
        registration={register("content", {
          required: "Required!, Enter the name of the item",
          validate: (value) =>
            value.length <= 2
              ? "Item name should be more than 2 characters"
              : true,
        })}
        error={errors.content}
      />

      <FormInputField
        id="weight"
        label="Weight (kg)"
        type="number"
        placeholder="e.g. 2.5 (in KGs)"
        registration={register("weight", {
          required: "Required!, Enter the package weight",
          valueAsNumber: true,
          validate: (value) =>
            value > 25
              ? "Deliverable Weight should be less than or equal to 25 KGs"
              : true,
        })}
        error={errors.weight}
      />

      <FormInputField
        id="destination"
        label="Destination PIN/ZIP"
        type="number"
        placeholder="e.g. 600001"
        registration={register("destination", {
          required: "Required!, Enter the destination PIN/ZIP code",
        })}
        error={errors.destination}
      />

      <FormInputField
        id="email"
        label="Client Email"
        type="email"
        placeholder="e.g. client@gmail.com"
        registration={register("client_contact_email", {
          required: "Required!, Enter the client's email address",
        })}
        error={errors.client_contact_email}
      />

      <FormInputField
        id="phone"
        label="Client Phone Number"
        type="tel"
        placeholder="e.g. 7338583004"
        registration={register("client_contact_phone", {
          required: "Required! ,Enter the client's phone number",
        })}
        error={errors.client_contact_phone}
      />

      <div className="flex justify-between gap-2 w-full">
        <Button
          type="reset"
          onClick={reset}
          variant={"outline"}
          className="flex items-center gap-2 "
          disabled={isPending}
        >
          Clear <Trash />
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 "
        >
          Submit <TruckIcon color="white" />
        </Button>
      </div>
    </form>
  );
}

export default SubmitShipment;
