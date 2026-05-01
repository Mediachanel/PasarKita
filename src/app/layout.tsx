import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pasar Kita - Marketplace Indonesia",
  description:
    "Pasar Kita adalah marketplace online terpercaya untuk belanja dan berjualan produk lokal Indonesia dengan mudah, aman, dan terjangkau.",
  keywords: ["marketplace", "belanja online", "penjualan", "Indonesia", "UMKM"],
  authors: [{ name: "Pasar Kita Team" }],
  openGraph: {
    title: "Pasar Kita - Marketplace Indonesia",
    description:
      "Marketplace online terpercaya untuk belanja dan berjualan produk lokal Indonesia",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="bg-marketplace-canvas text-gray-800 font-sans">
        {children}
      </body>
    </html>
  );
}
