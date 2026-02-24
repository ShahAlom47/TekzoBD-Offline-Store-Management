"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StoreNavbar() {
  const pathname = usePathname();

  const menus = [
    { name: "Overview", href: "/dashboard" },
    { name: "Products", href: "/dashboard/products" },
    { name: "Add Product", href: "/dashboard/products/add" },
    { name: "Sales", href: "/dashboard/sales" },
    { name: "Categories", href: "/dashboard/categories" },
    { name: "Customers", href: "/dashboard/customers" },
    { name: "Suppliers", href: "/dashboard/suppliers" },
    { name: "Expenses", href: "/dashboard/expenses" },
    { name: "Reports", href: "/dashboard/reports" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <nav className="px-3 py-4 flex flex-col gap-1">
      {menus.map((menu) => {
        const isActive = pathname === menu.href;

        return (
          <Link
            key={menu.href}
            href={menu.href}
            className={`
              relative px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            {menu.name}

            {/* Active Indicator */}
            {isActive && (
              <span className="absolute left-0 top-0 h-full w-1 bg-indigo-600 rounded-r-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}