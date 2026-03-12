import { Sale } from '@/Interfaces/saleInterfaces';
import React from 'react';
import { CustomTable } from '../CommonComponents/CustomTable';
interface PropsType{
    saleData:Sale[]
}
const CustomerSaleHistoryTable = ({saleData}:PropsType) => {

  
  const columns = [
    { header: "Sale No", accessor: "saleNumber" },
    { header: "Date", accessor: "createdAt" },
    { header: "Total", accessor: "totalAmount" },
    { header: "Paid", accessor: "paidAmount" },
    { header: "Due", accessor: "dueAmount" },
  ];

  const data = saleData.map((item) => {

    return {
        saleNumber: item.saleNumber,
        createdAt: new Date(item.createdAt).toLocaleDateString(),
        totalAmount: `৳ ${item.totalAmount}`,
        paidAmount: `৳ ${item.paidAmount}`,
        dueAmount: `৳ ${item.dueAmount}`,

     

      action: (
        <div className="flex gap-3">
         

        
        </div>
      ),
    };
  });

    return (
        <div>
            <CustomTable  columns={columns} data={data}></CustomTable>
        </div>
    );
};

export default CustomerSaleHistoryTable;