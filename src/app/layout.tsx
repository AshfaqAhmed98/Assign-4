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
        className={`${notoSansBengali.className} min-h-full min-w-[320px] flex flex-col bg-white text-[#28332e]`}
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
        </ToastProvider>
      </body>
    </html>
  );
}
