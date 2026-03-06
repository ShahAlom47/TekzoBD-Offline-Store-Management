'use client'

import { Customer } from "@/Interfaces/customerInterface";
import { CustomTable } from "../CommonComponents/CustomTable";

interface TableProps {
    customer:Customer[];
    refetch?:()=>void;
}

const CustomerTable = ({ customer, refetch }:TableProps) => {

 const columns = [
    { header: "Name", accessor: "name" },
    { header: "Phone", accessor: "phone" },
    { header: "Address", accessor: "address" },
    { header: "Current Due", accessor: "currentStock" },
    { header: "Status", accessor: "status" },
    { header: "Action", accessor: "action" },
  ];

  const data = customer.map((customer) => ({
    name: (<h1 className="font-medium">{customer.name}</h1>),
    phone: customer.phone,
    address: customer.address,
    currentStock: customer.currentDue,
  }));

    return (
        <div>
            <CustomTable columns={columns} data={data} />
        </div>
    );
};

export default CustomerTable;