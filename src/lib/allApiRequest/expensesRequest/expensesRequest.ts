
import { request } from "../apiRequests";

export const loginUser = async (phone: string, password: string) => {
  return request("POST", "/user/login", { phone, password });
}

export const getExpenses = async () => {
  return request("GET", `/expenses`);
}



