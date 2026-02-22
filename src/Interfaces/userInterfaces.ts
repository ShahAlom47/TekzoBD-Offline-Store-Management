import { ObjectId } from "mongodb";

export type UserRole = "OWNER" | "MANAGER" | "SALESMAN";

 export interface User {
  _id?: string| ObjectId;                // uuid
  fullName: string;
  email: string;
  passwordHash: string;

  role: UserRole;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}