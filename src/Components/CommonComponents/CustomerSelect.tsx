"use client";

import { Customer } from "@/Interfaces/customerInterface";
import { Combobox } from "@headlessui/react";
import { useState } from "react";

interface Props {
  customers: Customer[];
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  onAddCustomerClick: () => void;
}

const CustomerSelect = ({
  customers,
  selectedCustomer,
  setSelectedCustomer,
  onAddCustomerClick,
}: Props) => {
  const [query, setQuery] = useState("");

  const filteredCustomers =
    query === ""
      ? customers
      : customers.filter((customer) =>
          customer.name
            .toLowerCase()
            .includes(query.toLowerCase())
        );

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Select Customer</h2>

     <div className=" flex flex-col md:flex-row gap-3">
         <Combobox value={selectedCustomer} onChange={setSelectedCustomer}>
        <div className="relative flex-grow">
          <Combobox.Input
            className="w-full border p-2 rounded-lg"
            displayValue={(customer: Customer) =>
              customer?.name || ""
            }
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search or select customer..."
          />

          <Combobox.Options className="absolute mt-1 w-full bg-white border rounded-lg shadow max-h-60 overflow-auto z-10">
            <Combobox.Option
              value={null}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              Walk-in Customer
            </Combobox.Option>

            {filteredCustomers.map((customer) => (
              <Combobox.Option
                key={customer._id}
                value={customer}
                className="p-2 cursor-pointer hover:bg-blue-100"
              >
                {customer.name}
              </Combobox.Option>
            ))}

            {filteredCustomers.length === 0 && (
              <div className="p-2 text-gray-400 text-sm">
                No customer found
              </div>
            )}
          </Combobox.Options>
        </div>
      </Combobox>

      <button
        onClick={onAddCustomerClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        + Add New Customer
      </button>
     </div>
    </div>
  );
};

export default CustomerSelect;