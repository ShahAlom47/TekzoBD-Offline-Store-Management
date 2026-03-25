// Interfaces/customerInterface.ts

import { ObjectId } from "mongodb";
import { Sale } from "./saleInterfaces";

export interface Customer {
  _id: ObjectId|string;

  // Basic Info
  name: string;
  phone: string;           // Required রাখাই ভালো POS এর জন্য
  email?: string;
  address?: string;

  // Business Info
  customerType?: "REGULAR" | "WHOLESALE" | "VIP";

  // Financial Info (Derived – DB তে store না করলেও চলবে)
  openingBalance?: number; // যদি পুরানো বাকি নিয়ে শুরু করো
  creditLimit?: number;    // সর্বোচ্চ কত বাকি রাখতে পারবে
  currentDue?:number;

  // Status
  isActive: boolean;
  isDeleted?:boolean;

  // Metadata
  createdAt: string;
  updatedAt: string;
}


 export type CustomerWithOutId = Omit<Customer, "_id">;



export  interface AddCustomerFormInputs {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  customerType?: "REGULAR" | "WHOLESALE" | "VIP";
  openingBalance?: number;
  creditLimit?: number;
  isActive: boolean;
}

export interface GetAllCustomerParams {
  currentPage: number;
  limit: number;
  searchTrim?: string;
}


export interface CustomerSummary {
  totalSales: number;
  totalPurchase: number;
  totalPaid: number;
  totalDue: number;
  openingBalance: number;
  currentDue: number;
}

export interface CustomerDetailsData {
  customer: Customer;
  sales: Sale[];
  summary: CustomerSummary;
}

export interface CustomerDetailsResponse {
  success: boolean;
  data: CustomerDetailsData;
  message?: string;
}