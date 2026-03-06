"use client";

import AddCustomer from "@/Components/CommonComponents/AddCustomer";
import SearchBox from "@/Components/CommonComponents/SearchBox";
import React, { useState } from "react";

const Customers = () => {

  const [search, setSearch] = useState("");

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      <h1 className="text-2xl font-bold">All Customer</h1>

      <div className="flex justify-between items-center">
        
        <SearchBox
          placeholder="Search customer..."
          value={search}
          onChange={setSearch}
        />

        <AddCustomer />

      </div>

    </div>
  );
};

export default Customers;