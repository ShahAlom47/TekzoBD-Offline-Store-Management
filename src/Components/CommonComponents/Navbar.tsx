"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StoreNavbar() {

  const pathname = usePathname();

  const menus = [

    {
      name: "Overview",
      href: "/dashboard",
    },
    {
      name: "Products",
      href: "/dashboard/products",
    },

    {
      name: "Add Product",
      href: "/dashboard/products/add",
    },

    {
      name: "Sales",
      href: "/dashboard/sales",
    },
    {
      name: "Categories",
      href: "/dashboard/categories",
    },

    {
      name: "Customers",
      href: "/dashboard/customers",
    },

    {
      name: "Suppliers",
      href: "/dashboard/suppliers",
    },


    {
      name: "Expenses",
      href: "/dashboard/expenses",
    },

    {
      name: "Reports",
      href: "/dashboard/reports",
    },

    {
      name: "Settings",
      href: "/dashboard/settings",
    },

  ];


  return (

    <nav className=" text-black px-3 py-3 flex flex-col gap-2">

      {menus.map((menu) => (

        <Link
          key={menu.href}
          href={menu.href}
          className={`  hover:bg-blue-200 rounded-sm transition rounded-r-full px-2 ${
            pathname === menu.href
              ? "font-bold text-blue-600 border bg-blue-100  border-blue-600 rounded-sm rounded-r-full "
              : ""
          }`}
        >

          {menu.name}

        </Link>

      ))}

    </nav>

  );

}