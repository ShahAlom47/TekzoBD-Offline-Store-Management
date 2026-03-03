import { Sale } from "@/Interfaces/saleInterfaces";
import { request } from "../apiRequests";

export const addProduct = async (data: Sale) => {
  return request("POST", "/sales/add", {...data});
}