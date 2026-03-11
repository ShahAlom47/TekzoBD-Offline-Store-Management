import { useQuery } from "@tanstack/react-query";
import { Customer } from "@/Interfaces/customerInterface";
import { getSingleCustomer } from "@/lib/allApiRequest/customerRequest/customerRequest";

const fetchCustomer = async (id: string): Promise<Customer> => {
  const res = await getSingleCustomer(id);

  if (!res.success) {
    throw new Error("Failed to fetch customer");
  }

  return res.data as Customer;
};

export const useCustomer = (id: string) => {
  return useQuery<Customer, Error>({
    queryKey: ["customer", id],
    queryFn: () => fetchCustomer(id),
    enabled: !!id, // id না থাকলে query run হবে না
    staleTime: 1000 * 60 * 30,
  });
};