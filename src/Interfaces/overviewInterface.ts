



export interface Overview {
  overall: {
    totalPurchase: number;
    totalExpense: number;
    totalSales: number;
    profit: number;
  };

  filtered: {
    purchase: number;
    expense: number;
    sales: number;
    profit: number;
  };

  counts: {
    totalPurchases: number;
    totalExpenses: number;
    totalSales: number;
  };

  today: {
    purchase: number;
    expense: number;
    sales: number;
  };

  thisWeek: {
    purchase: number;
    expense: number;
    sales: number;
  };

  thisMonth: {
    purchase: number;
    expense: number;
    sales: number;
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
  };
}



type FilterType = "today" | "week" | "month" | "custom" | "all";

export interface OverviewFilter {
  type: FilterType;
  month?: string; // "2026-04"
  startDate?: string;
  endDate?: string;
}    