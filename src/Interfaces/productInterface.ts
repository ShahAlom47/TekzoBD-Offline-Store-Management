export interface Product {
  id: string;

  // Basic Info
  name: string;
  sku: string;
  barcode?: string;
  brand?: string;
  categoryId: string;

  // Pricing
  costPrice: number;              // Buying price
  sellingPrice: number;           // Regular price
  discountPrice?: number;
  vatPercentage?: number;
  minimumSellingPrice?: number;

  // Inventory
  openingStock: number;           // Initial stock
  currentStock: number;           // Live stock
  reorderLevel?: number;          // Low stock alert
  unit: "PCS" | "KG" | "LITER" | "BOX" | "Feet" ;

  // Auto Tracking (optional but useful)
  totalPurchased?: number;
  totalSold?: number;
  stockValue?: number;            // currentStock * costPrice

  // Supplier
  supplierId?: string;

  // Status
  status: "ACTIVE" | "INACTIVE";

  // Soft Delete
  isDeleted?: boolean;

  createdAt: Date;
  updatedAt: Date;
}