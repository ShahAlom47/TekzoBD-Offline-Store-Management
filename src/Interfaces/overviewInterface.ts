import { PaymentMethod } from "./paymentInterface";




export interface Overview {
  overall: {
    totalPurchase: number;
    totalExpense: number;
    totalSales: number;
    totalPayment: number; // 💰 added
    profit: number;
  };

  filtered: {
    purchase: number;
    expense: number;
    sales: number;
    payment: number; // 💰 added
    profit: number;
  };

  counts: {
    totalPurchases: number;
    totalExpenses: number;
    totalSales: number;
    totalPayments: number; // 💰 added
  };

  today: {
    purchase: number;
    expense: number;
    sales: number;
    payment: number; // 💰 added
  };

  thisWeek: {
    purchase: number;
    expense: number;
    sales: number;
    payment: number; // 💰 added
  };

  thisMonth: {
    purchase: number;
    expense: number;
    sales: number;
    payment: number; // 💰 added
  };

  stock: {
    totalProducts: number;
    inStock: number;
    outOfStock: number;
    lowStock: number;
    totalStockValue: number;
  };

  insights?: {
    topSellingProduct?: string;
    topExpenseCategory?: string;
    topPaymentMethod?: PaymentMethod; // optional insight
  };
}



export type FilterType = "today" | "week" | "month" | "custom" | "all";

export interface OverviewFilter {
  type: FilterType;
  month?: string; // "2026-04"
  startDate?: string;
  endDate?: string;
}    