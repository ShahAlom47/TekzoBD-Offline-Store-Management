
import { request } from "../apiRequests";

export const loginUser = async (phone: string, password: string) => {
  return request("POST", "/user/login", { phone, password });
}

export const getUserInfo = async (userEmail: string) => {
  return request("GET", `/user/user-info/${userEmail}`);
}



