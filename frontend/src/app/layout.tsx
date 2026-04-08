import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Siraj — Technology for the Future",
    template: "%s | Siraj",
  },
  description:
    "Siraj makes world-class smartphones, laptops, tablets, and wearables. Discover technology that moves you forward.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-[#1d1d1f]">
        {children}
      </body>
    </html>
  );
}
