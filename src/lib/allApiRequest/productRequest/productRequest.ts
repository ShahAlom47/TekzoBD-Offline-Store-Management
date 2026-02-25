
import { ProductFormData } from "@/Interfaces/productInterface";
import { request } from "../apiRequests";

export const getProducts = async () => {
  return request("GET", "/products");
}
export const addProduct = async (data: ProductFormData) => {
  return request("POST", "/products/add", {data});
}




