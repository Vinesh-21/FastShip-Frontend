import api from "@/lib/api";
import {
  UserType,
  type DeliveryPartnerCreate,
  type SellerCreate,
  type ShipmentCreate,
} from "@/lib/client";
import type { userType } from "@/types/userType";

export async function getProfile(user: userType | undefined) {
  if (user === undefined) return;
  const userProfile =
    user === "seller"
      ? api.seller.getSellerProfile
      : api.partner.getDeliveryPartnerProfile;

  return await userProfile();
}

export async function getShipmentByID(id: string) {
  if (id === undefined) return;

  return await api.shipment.getShipment({ id: id });
}

export async function getAllShipments(user_type: userType | undefined) {
  if (user_type === undefined) return;

  const profile = await getProfile(user_type);

  if (!profile) return;
  const user_id = profile.data.id;

  return await api.shipment.getAllShipments({
    user_type: user_type,
    user_id: user_id,
  });
}

export async function postSubmitShipment(data: ShipmentCreate) {
  data["client_contact_phone"] = "+91" + data["client_contact_phone"];
  return await api.shipment.createShipment(data);
}

export async function patchUpdateShipments(data: any) {
  data = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== "")
  );
  const { shipment_id: id, ...restOfdata } = data;
  return await api.shipment.updateShipment({ id }, restOfdata);
}

export const postForgotPassword = (userType: UserType, email: string) => {
  return api.instance.post(
    `${import.meta.env.VITE_BACKEND}/${userType}/forgot-password`,
    { email }
  );
};

export async function signup(
  mode: UserType | undefined,
  payload: SellerCreate | DeliveryPartnerCreate
) {
  try {
    if (mode === UserType.Seller) {
      const { data } = await api.seller.signupSeller(payload as SellerCreate);
      return data;
    } else if (mode === UserType.Partner) {
      const { data } = await api.partner.signupDeliveryPartner(
        payload as DeliveryPartnerCreate
      );
      return data;
    }
    throw new Error("Invalid user type");
  } catch (err: any) {
    const message = err.response?.data?.detail || "Signup failed";
    throw new Error(message);
  }
}
