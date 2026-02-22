
import { Collection, Db } from "mongodb";
import clientPromise from "./db_connection";
import { User } from "@/Interfaces/userInterfaces";


// Define the User type (you can extend it as needed)


export const getUserCollection = async (): Promise<Collection<User>> => {
  const client = await clientPromise;
  const db: Db = client.db("TekzoBD-Offline-Store-DB"); // Replace with your database name
  return db.collection<User>("users");
};

// export const getProductCollection = async (): Promise<Collection<ProductType>> => {
//   const client = await clientPromise;
//   const db: Db = client.db("tekzoBd-database"); // Replace with your database name
//   return db.collection<ProductType>("Products");
// };