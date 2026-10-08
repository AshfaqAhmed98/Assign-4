import Image from "next/image";
import { connection } from "next/server";
import { Suspense } from "react";
import { ProductSections } from "@/components/product-sections";

async function HeroBanner() {
  await connection();

  const banglaDate = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 rounded-3xl border border-[#dce8df] bg-[#fbfdfb] px-5 py-7 sm:px-8 sm:py-9 md:grid-cols-[minmax(0,1fr)_280px] md:gap-8 md:px-12 md:py-10"
    >
      <div className="flex flex-col items-start">
        <p className="mb-3 rounded-full bg-[#e4f3e9] px-3 py-1.5 text-sm font-medium text-[#078b4b]">
          {banglaDate}
        </p>
        <h1
          className="m-0 text-3xl leading-tight font-bold tracking-tight text-[#1f2b23] sm:text-4xl"
          id="hero-title"
        >
          আজকের বাজারের দাম এক নজরে
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#68736c] sm:text-base sm:leading-7">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
          বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
        </p>
        <a
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#078b4b] px-6 text-sm font-semibold text-white shadow-md shadow-[#078b4b]/20 transition-colors hover:bg-[#06743f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078b4b]"
          href="#সব-পণ্য"
        >
          সব পণ্য দেখুন
        </a>
      </div>

      <div className="flex justify-center md:justify-end">
        <Image
          alt="তাজা সবজির ঝুড়ি"
          className="h-auto w-48 object-contain sm:w-56 md:w-full"
          height={240}
          priority
          src="/bazar-hero.png"
          width={280}
        />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f2f7f3] px-4 py-6 sm:px-6 sm:py-8">
      <Suspense
        fallback={
          <div
            aria-label="ব্যানার লোড হচ্ছে"
            className="mx-auto h-80 max-w-7xl rounded-3xl border border-[#dce8df] bg-[#fbfdfb]"
          />
        }
      >
        <HeroBanner />
      </Suspense>
      <section
        aria-labelledby="all-products-title"
        className="mx-auto mt-10 max-w-7xl scroll-mt-40"
        id="সব-পণ্য"
      >
        <h2 className="sr-only" id="all-products-title">
          পণ্য ও বাজারদরের তালিকা
        </h2>
        <ProductSections />
      </section>
    </main>
  );
}
