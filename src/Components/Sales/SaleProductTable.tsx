import { SaleProduct } from "@/Interfaces/saleInterfaces";
import { CustomTable } from "../CommonComponents/CustomTable";

interface PropsType {
  products: SaleProduct[];
}
const SaleProductTable = ({ products }: PropsType) => {
console.log(products)


  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Quantity", accessor: "quantity" },
    { header: "Selling Price", accessor: "sellingPrice" },
    { header: "Cost ", accessor: "cost" },
    { header: "Total", accessor: "total" },
    { header: "Profit", accessor: "profit" },
  ];

  const data = products.map((item: SaleProduct) => {
    return {
      name: item.productName,
      quantity: item?.quantity,
      sellingPrice: item?.sellingPrice,
      cost: item?.totalCost,
      total: item.totalPrice,
      profit: item?.profit,
    };
  });

  return <CustomTable columns={columns} data={data} />;
};

export default SaleProductTable;
