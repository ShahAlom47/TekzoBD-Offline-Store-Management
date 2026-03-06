import { AddCustomerFormInputs } from "@/Interfaces/customerInterface";
import { request } from "../apiRequests";

export const addCustomer = async (data:AddCustomerFormInputs) => {
  return request("POST", "/customers/add", { ...data }, );
}

// export const getAllCategories = async ({ currentPage, limit, searchTrim }: GetAllCategoryParams) => {
//   const url = `/categories/getAllCategory?currentPage=${currentPage}&pageSize=${limit}` +
//               (searchTrim ? `&searchTrim=${encodeURIComponent(searchTrim)}` : "");

//   return request("GET", url);
// };