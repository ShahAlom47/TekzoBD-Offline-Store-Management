import { Purchase } from "@/Interfaces/purchaseInterface";
import { request } from "../apiRequests";

export const addPurchase = async (data: Purchase) => {
  return request("POST", "/purchase/add", {...data});
}