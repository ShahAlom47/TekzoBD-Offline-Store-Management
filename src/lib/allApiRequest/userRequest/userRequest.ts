import { UserRole } from './../../../Interfaces/userInterfaces';

import { RegisterFormInputs } from "@/app/register/page";
import { request } from "../apiRequests";

export const createUser = async (data:RegisterFormInputs) => {
  return request("POST", "/user/register", {...data});
}
export const loginUser = async (phone: string, password: string) => {
  return request("POST", "/user/login", { phone, password });
}
export const updateUser = async (userId: string, data: { role?: UserRole, isActive?: boolean }) => {
  return request("PUT", `/user/update/${userId}`, {...data});
}

export const getUserInfo = async (userEmail: string) => {
  return request("GET", `/user/user-info/${userEmail}`);
}



