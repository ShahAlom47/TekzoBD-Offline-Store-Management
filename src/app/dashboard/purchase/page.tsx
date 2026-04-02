"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Purchase {
  _id: string;
  date: string;
  memos: { memoNumber: string; amount: number }[];
  productTotal: number;
  transportCost: number;
  otherCost: number;
  grandTotal: number;
}

const fetchPurchases = async (): Promise<Purchase[]> => {
  const res = await fetch("/api/purchase");
  const data = await res.json();
  return data;
};

const PurchasePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["purchases"],
    queryFn: fetchPurchases,
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
  <div>  <h2 className="text-xl font-semibold mb-4">
        Purchase History
      </h2>
      <Link href="/dashboard/purchase/add">Add Purchase</Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Memo Count</th>
            <th className="p-2 border">Product Total</th>
            <th className="p-2 border">Transport</th>
            <th className="p-2 border">Grand Total</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((item) => (
            <tr key={item._id}>
              <td className="p-2 border">
                {new Date(item.date).toLocaleDateString()}
              </td>

              <td className="p-2 border">
                {item.memos.length}
              </td>

              <td className="p-2 border">
                ৳ {item.productTotal}
              </td>

              <td className="p-2 border">
                ৳ {item.transportCost || 0}
              </td>

              <td className="p-2 border font-semibold">
                ৳ {item.grandTotal}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchasePage;