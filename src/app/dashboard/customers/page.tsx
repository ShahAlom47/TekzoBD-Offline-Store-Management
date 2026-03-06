"use client";

import AddCustomer from "@/Components/CommonComponents/AddCustomer";
import CustomModal from "@/Components/CommonComponents/CustomModal";
import SearchBox from "@/Components/CommonComponents/SearchBox";
import React, { useState } from "react";

const Customers = () => {

  const [search, setSearch] = useState("");
  
    const [isOpen,setOpen]= useState<boolean>(false)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      <h1 className="text-2xl font-bold">All Customer</h1>

      <div className="flex gap-2 justify-between  items-center  border-b-2 border-gray-900  p-2">
        
        <SearchBox
          placeholder="Search customer..."
          value={search}
          onChange={setSearch}
        />

            <button
          onClick={ ()=>setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg  "
        >
          + Add 
        </button>

      </div>


 <CustomModal
        open={isOpen}
        onOpenChange={setOpen}
        title="Add New Customer"
      >
        <AddCustomer></AddCustomer>
      </CustomModal>
    </div>
  );
};

export default Customers;