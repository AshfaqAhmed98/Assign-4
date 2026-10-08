import { MarketHeader } from "@/components/market-header";
import { Suspense } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bazar Dor",
  description: "Bazar Dor web application",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" className="h-full antialiased">
      <body className="min-h-full min-w-[320px] flex flex-col bg-white font-sans text-[#28332e]">
        <Suspense
          fallback={
            <header
              aria-busy="true"
              aria-label="বাজারদরের তথ্য লোড হচ্ছে"
              className="market-header market-header-loading"
            />
          }
        >
          <MarketHeader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
