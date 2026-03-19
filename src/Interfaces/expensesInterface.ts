
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


  export interface ExpenseFormType {
  title: string;            // Example: "Nasta", "Electricity"
  amount: number;           // টাকা
  category: ExpenseCategory; // category enum
  note?: string;            // optional
}

  // 🔹 Category constant (Single source of truth)
export const EXPENSE_CATEGORY = {
  DAILY_POCKET_MONEY: "daily_pocket_money",
  RENT: "rent",
  WIFI_BILL: "wifi_bill",
  ELECTRIC_BILL: "electric_bill",
  BILL: "bill",
  SALARY: "salary",
  TRANSPORT: "transport",
  OTHERS: "others",
} as const;

export const expenseCategoryOptions = [
  { label: "Daily Pocket Money", value: EXPENSE_CATEGORY.DAILY_POCKET_MONEY },
  { label: "Rent", value: EXPENSE_CATEGORY.RENT },
  { label: "WiFi Bill", value: EXPENSE_CATEGORY.WIFI_BILL },
  { label: "Electric Bill", value: EXPENSE_CATEGORY.ELECTRIC_BILL },
  { label: "Bill", value: EXPENSE_CATEGORY.BILL },
  { label: "Salary", value: EXPENSE_CATEGORY.SALARY },
  { label: "Transport", value: EXPENSE_CATEGORY.TRANSPORT },
  { label: "Others", value: EXPENSE_CATEGORY.OTHERS },
];