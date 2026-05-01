import "./globals.css";

import type { Metadata } from "next";
import RootProvider from "@/Providers/RootProvider/Providers";

export const metadata: Metadata = {
  title: "TekzoBD Offline Store",
  description: "TekzoBD Offline Store is a comprehensive inventory management system designed to streamline operations for offline retailers. With features like product management, stock tracking, and sales analytics, it empowers store owners to efficiently manage their inventory and boost sales. The user-friendly interface and robust functionality make it an essential tool for offline businesses looking to optimize their operations and enhance customer satisfaction.",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
