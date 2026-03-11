"use client";

import { useCustomer } from "@/hook/useCustomer";
import { useParams } from "next/navigation";

const CustomerDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useCustomer(id?.toString() || "");

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const customer = data?.customer;
  const sales = data?.sales || [];
  const summary = data?.summary;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Customer Info Card */}
      <div className="bg-white shadow rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">{customer?.name}</h2>
          <p className="text-gray-500">{customer?.phone}</p>
          <p className="text-gray-500">{customer?.email}</p>
          <p className="text-gray-500">{customer?.address}</p>

          <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
            {customer?.customerType}
          </span>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Current Due</p>
          <p className="text-2xl font-bold text-red-500">
            ৳ {summary?.currentDue || 0}
          </p>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Purchase</p>
          <p className="text-lg font-semibold">
            ৳ {summary?.totalPurchase || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="text-lg font-semibold text-green-600">
            ৳ {summary?.totalPaid || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Due</p>
          <p className="text-lg font-semibold text-red-500">
            ৳ {summary?.totalDue || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Opening Balance</p>
          <p className="text-lg font-semibold">
            ৳ {summary?.openingBalance || 0}
          </p>
        </div>

      </div>

      {/* Sales History */}
      <div className="bg-white shadow rounded-2xl p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">Sales History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            
            <thead>
              <tr className="border-b text-gray-600">
                <th className="text-left py-2">Sale No</th>
                <th className="text-left py-2">Date</th>
                <th className="text-right py-2">Total</th>
                <th className="text-right py-2">Paid</th>
                <th className="text-right py-2">Due</th>
              </tr>
            </thead>

            <tbody>
              {sales.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    No sales found
                  </td>
                </tr>
              )}

              {sales.map((sale: any) => (
                <tr key={sale._id} className="border-b hover:bg-gray-50">
                  
                  <td className="py-3">{sale.saleNumber}</td>

                  <td>
                    {new Date(sale.createdAt).toLocaleDateString()}
                  </td>

                  <td className="text-right">
                    ৳ {sale.totalAmount}
                  </td>

                  <td className="text-right text-green-600">
                    ৳ {sale.paidAmount}
                  </td>

                  <td className="text-right text-red-500">
                    ৳ {sale.dueAmount}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;