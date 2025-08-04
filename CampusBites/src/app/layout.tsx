// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { CartProvider } from "@/components/ui/ContextReducer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CampusEats",
  description: "Order from campus canteens",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
