import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bazar Dor",
  description: "Bazar Dor web application",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
