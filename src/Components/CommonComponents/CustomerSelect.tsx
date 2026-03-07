"use client";

import { Customer } from "@/Interfaces/customerInterface";
import { Combobox } from "@headlessui/react";
import { useState } from "react";
import CustomModal from "./CustomModal";
import AddCustomer from "./AddCustomer";
import { useCustomers } from "@/hook/useCustomers";

interface Props {
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
}

const CustomerSelect = ({ selectedCustomer, setSelectedCustomer }: Props) => {
  const { data: customers, isLoading, isError } = useCustomers();
  const [query, setQuery] = useState("");
  const [isOpen, setOpen] = useState(false);

  // filter customers by name / phone / address / type
  const filteredCustomers =
    !customers || query === ""
      ? customers || []
      : customers.filter((customer) =>
          [customer.name, customer.phone, customer.address, customer.customerType]
            .filter(Boolean)
            .some((field) =>
              field!.toLowerCase().includes(query.toLowerCase())
            )
        );

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Select Customer</h2>

      {isLoading && <p>Loading customers...</p>}
      {isError && <p className="text-red-500">Failed to load customers</p>}

      {customers && (
        <div className="flex flex-col md:flex-row gap-3">
          <Combobox value={selectedCustomer} onChange={setSelectedCustomer} >
            <div className="relative">
              <Combobox.Input
                className="w-full border p-2 rounded-lg"
                displayValue={(customer: Customer | null) => customer?.name || ""}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search or select customer..."
              />

              <Combobox.Options className="absolute mt-1 w-full bg-white border rounded-lg shadow max-h-60 overflow-auto z-10">
                {/* Walk-in Customer */}
                <Combobox.Option
                  value={null}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  Walk-in Customer
                </Combobox.Option>

                {/* Filtered Customers */}
                {filteredCustomers.map((customer) => (
                  <Combobox.Option
                    key={customer._id?.toString()}
                    value={customer}
                    className="p-2 cursor-pointer hover:bg-blue-100"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{customer.name}</span>
                      <span className="text-sm text-gray-500">
                        {customer.phone}{" "}
                        {customer.address ? `- ${customer.address}` : ""}
                      </span>
                      {customer.customerType && (
                        <span className="text-xs text-gray-400">
                          {customer.customerType}
                        </span>
                      )}
                    </div>
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

          {/* Add Customer Button */}
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg whitespace-nowrap"
          >
            + Add New Customer
          </button>
        </div>
      )}

      {/* Modal for adding new customer */}
      <CustomModal open={isOpen} onOpenChange={setOpen} title="Add New Customer">
        <AddCustomer
          onSuccess={(newCustomer: Customer) => {
            setSelectedCustomer(newCustomer); // select newly added customer
            setOpen(false);
          }}
        />
      </CustomModal>
    </div>
  );
};

export default CustomerSelect;