
import { Collection, Db } from "mongodb";
import clientPromise from "./db_connection";
import { Users } from "../../Interfaces/userInterfaces";


// Define the User type (you can extend it as needed)


export const getUserCollection = async (): Promise<Collection<Users>> => {
  const client = await clientPromise;
  const db: Db = client.db("tekzoBd-database"); // Replace with your database name
  return db.collection<Users>("users");
};

// export const getProductCollection = async (): Promise<Collection<ProductType>> => {
//   const client = await clientPromise;
//   const db: Db = client.db("tekzoBd-database"); // Replace with your database name
//   return db.collection<ProductType>("Products");
// };