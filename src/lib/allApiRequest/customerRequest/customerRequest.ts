import { AddCustomerFormInputs } from "@/Interfaces/customerInterface";
import { request } from "../apiRequests";
import { GetAllCategoryParams } from "@/Interfaces/categoryInterfaces";

export const addCustomer = async (data:AddCustomerFormInputs) => {
  return request("POST", "/customers/add", { ...data }, );
}

export const getCustomer = async ({ currentPage, limit, searchTrim }: GetAllCategoryParams) => {
  const url = `/customers/getCustomers?currentPage=${currentPage}&pageSize=${limit}` +
              (searchTrim ? `&searchTrim=${encodeURIComponent(searchTrim)}` : "");

  return request("GET", url);
};