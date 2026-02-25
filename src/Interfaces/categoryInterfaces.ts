import { ObjectId } from "mongodb";

export interface Category {
  _id?: ObjectId;

  name: string;
  slug: string;
  icon?: string;

  parentCategoryId?: ObjectId | null;

  status: "active" | "inactive";

  createdAt: Date;
  updatedAt: Date;
}

export type GetAllCategoryParams = {
  currentPage?: number;  
  limit?: number;
  searchTrim?: string;
};