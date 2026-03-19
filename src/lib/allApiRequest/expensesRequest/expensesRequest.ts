
import {  ExpenseFormType } from "@/Interfaces/expensesInterface";
import { request } from "../apiRequests";

export const loginUser = async (phone: string, password: string) => {
  return request("POST", "/user/login", { phone, password });
}

export const getExpenses = async () => {
  return request("GET", `/expenses`);
}
export const addExpenses = async (data:ExpenseFormType) => {
  return request("POST", `/expenses/add`,{...data});
}



