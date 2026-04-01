"use client";

import { useState } from "react";

interface Memo {
  memoNumber: string;
  amount: number;
}

const Purchase = () => {
  const [memos, setMemos] = useState<Memo[]>([
    { memoNumber: "", amount: 0 },
  ]);

  const [transportCost, setTransportCost] = useState(0);
  const [otherCost, setOtherCost] = useState(0);

  // ➕ Add new memo
  const addMemo = () => {
    setMemos([...memos, { memoNumber: "", amount: 0 }]);
  };

  // ✏️ Update memo
  const handleMemoChange = (
    index: number,
    field: keyof Memo,
    value: string | number
  ) => {
    const updated = [...memos];
    updated[index][field] =
      field === "amount" ? Number(value) : value;
    setMemos(updated);
  };

  // 🧮 Calculate total
  const productTotal = memos.reduce(
    (sum, m) => sum + (m.amount || 0),
    0
  );

  const grandTotal = productTotal + transportCost + otherCost;

  // 🚀 Submit
  const handleSubmit = () => {
    const data = {
      date: new Date(),
      memos,
      productTotal,
      transportCost,
      otherCost,
      grandTotal,
    };

    console.log("Purchase Data:", data);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Purchase Entry
      </h2>

      {/* Memo List */}
      {memos.map((memo, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Memo Number"
            value={memo.memoNumber}
            onChange={(e) =>
              handleMemoChange(index, "memoNumber", e.target.value)
            }
            className="border p-2 w-1/2"
          />

          <input
            type="number"
            placeholder="Amount"
            value={memo.amount}
            onChange={(e) =>
              handleMemoChange(index, "amount", e.target.value)
            }
            className="border p-2 w-1/2"
          />
        </div>
      ))}

      <button
        onClick={addMemo}
        className="bg-blue-500 text-white px-3 py-1 mt-2"
      >
        + Add Memo
      </button>

      {/* Costs */}
      <div className="mt-4 space-y-2">
        <input
          type="number"
          placeholder="Transport Cost"
          value={transportCost}
          onChange={(e) => setTransportCost(Number(e.target.value))}
          className="border p-2 w-full"
        />

        <input
          type="number"
          placeholder="Other Cost"
          value={otherCost}
          onChange={(e) => setOtherCost(Number(e.target.value))}
          className="border p-2 w-full"
        />
      </div>

      {/* Totals */}
      <div className="mt-4">
        <p>Product Total: ৳ {productTotal}</p>
        <p>Grand Total: ৳ {grandTotal}</p>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 mt-4"
      >
        Save Purchase
      </button>
    </div>
  );
};

export default Purchase;