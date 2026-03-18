import { ObjectId } from "mongodb";

export interface Expense {
  _id?: ObjectId;           // MongoDB ID
  title: string;            // Example: "Nasta", "Electricity"
  amount: number;           // টাকা
  category: ExpenseCategory; // category enum
  note?: string;            // optional
  createdAt: Date;          // date
}

// 🔹 Allowed categories
export type ExpenseCategory = 
  |"daily_pocket_mony"
  |"rent"
  |"wifi_bill"
  |"electric_bill"
  | "rent" 
  | "bill" 
  | "salary" 
  | "transport" 
  | "others"
  ;