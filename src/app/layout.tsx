import { MarketHeader } from "@/components/market-header";
import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthToastListener } from "@/components/auth-toast-listener";
import { ToastProvider } from "@/components/toast-provider";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bazar Dor",
  description: "Bazar Dor web application",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      data-scroll-behavior="smooth"
      lang="bn"
      className={`${notoSansBengali.variable} h-full scroll-smooth antialiased`}
    >
      <body
        className={`${notoSansBengali.className} flex min-h-screen flex-col bg-white text-[#28332e]`}
      >
        <ToastProvider>
          <Suspense fallback={null}>
            <AuthToastListener />
          </Suspense>
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
          <footer className="border-t border-[#e1e9e3] bg-[#fbfdfb] px-4 py-4 sm:px-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-1.5 text-center text-xs leading-5 text-[#68736c] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-left">
              <p>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
              <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
