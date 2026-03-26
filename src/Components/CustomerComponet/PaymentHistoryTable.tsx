"use client";

import { CustomerPaymentHistory } from "@/Interfaces/customerInterface";



type Props = {
  payments: CustomerPaymentHistory[];
};

export default function PaymentHistoryTable({ payments }: Props) {
  if (!payments?.length) {
    return (
      <div className="text-center text-gray-400 py-6">
        No payment history found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Date</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Method</th>
            <th className="p-3">Type</th>
            <th className="p-3">Transaction</th>
            <th className="p-3">Note</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => {
            const date = new Date(payment.paymentDate).toLocaleDateString();

            const typeBadge =
              payment.type === "DUE_PAYMENT" ? (
                <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-600">
                  Due
                </span>
              ) : (
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-600">
                  Sale
                </span>
              );

            return (
              <tr
                key={payment._id.toString()}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">{date}</td>

                <td className="p-3 font-medium text-indigo-600">
                  ৳ {payment.amount}
                </td>

                <td className="p-3">{payment.method}</td>

                <td className="p-3">{typeBadge}</td>

                <td className="p-3">
                  {payment.transactionId || "-"}
                </td>

                <td className="p-3 text-gray-500">
                  {payment.note || "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}