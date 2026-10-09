"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, type Product } from "@/lib/api";

const numberFormat = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 1,
});

const unitNames: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  liter: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

export function ProductCard({ product }: { product: Product }) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";
  const changeBadge = isUp
    ? `▲ ${numberFormat.format(Math.abs(product.change.pct))}%`
    : isDown
      ? `▼ ${numberFormat.format(Math.abs(product.change.pct))}%`
      : "— ০.০%";

  return (
    <Link
      aria-label={`${product.nameBn} এর বিস্তারিত দেখুন`}
      className="group block rounded-2xl no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078b4b]"
      href={`/product/${product.slug}`}
    >
      <article className="flex min-h-[138px] flex-col justify-between rounded-2xl border border-[#e0e9e2] bg-[#fbfdfb] p-4 shadow-[0_1px_3px_rgba(31,43,35,0.04)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[#cbded0] group-hover:shadow-md">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#f0f5f1] text-[26px]"
          >
            {product.image || product.categoryIcon || "🛒"}
          </span>
          <div className="min-w-0">
            <h3 className="line-clamp-2 min-h-6 text-[15px] leading-6 font-semibold text-[#28332e] sm:text-base">
              {product.nameBn}
            </h3>
            <p className="mt-0.5 text-[13px] leading-5 text-[#77827c] sm:text-sm">
              {unitNames[product.unit] ?? `প্রতি ${product.unit}`}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-xs leading-5 text-[#77827c]">আজকের দাম</p>
            <p className="mt-0.5 text-lg leading-7 font-bold text-[#28332e]">
              {numberFormat.format(product.today)} টাকা
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[13px] leading-6 font-semibold ${
              isUp
                ? "bg-[#e9f5ed] text-[#15934b]"
                : isDown
                  ? "bg-[#fceeed] text-[#d13d39]"
                  : "bg-[#f0f2f0] text-[#77827c]"
            }`}
          >
            {changeBadge}
          </span>
        </div>
      </article>
    </Link>
  );
}

function ProductCardGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductSectionsLoading() {
  return (
    <div aria-busy="true" aria-label="পণ্যের তথ্য লোড হচ্ছে" className="space-y-9 sm:space-y-10">
      {[0, 1, 2].map((section) => (
        <section key={section}>
          <div className="mb-4 h-8 w-48 animate-pulse rounded bg-[#dfe9e1] sm:mb-5" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                aria-hidden="true"
                className="min-h-[138px] animate-pulse rounded-2xl border border-[#e0e9e2] bg-[#fbfdfb] p-4"
                key={index}
              >
                <div className="flex items-center gap-3">
                  <span className="size-12 rounded-xl bg-[#e8efea]" />
                  <span className="space-y-2">
                    <span className="block h-4 w-28 rounded bg-[#e8efea]" />
                    <span className="block h-3 w-20 rounded bg-[#e8efea]" />
                  </span>
                </div>
                <div className="mt-5 h-4 w-24 rounded bg-[#e8efea]" />
              </div>
            ))}
          </div>
        </section>
      ))}
      <p className="sr-only" role="status">
        পণ্যের তথ্য লোড হচ্ছে…
      </p>
    </div>
  );
}

export function ProductSections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void getProducts()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch((error: unknown) => {
        console.error("Could not load products for the home page:", error);
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loadError) {
    return (
      <p className="rounded-xl border border-[#f0d7d4] bg-white p-5 text-sm leading-7 text-[#a33b2e]">
        পণ্যের তথ্য লোড করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।
      </p>
    );
  }

  if (isLoading) return <ProductSectionsLoading />;

  if (products.length === 0) {
    return (
      <p
        className="rounded-xl border border-[#e0e9e2] bg-white p-5 text-sm leading-7 text-[#68736c]"
        role="status"
      >
        এখন কোনো পণ্যের তথ্য পাওয়া যায়নি।
      </p>
    );
  }

  const risers = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);
  const fallers = products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  return (
    <div className="space-y-9 sm:space-y-10">
      <section aria-labelledby="risers-title">
        <h2
          className="mb-4 flex items-center gap-2 text-xl leading-relaxed font-bold text-[#28332e] sm:mb-5 sm:text-2xl"
          id="risers-title"
        >
          <span aria-hidden="true" className="text-[#d13d39]">
            ▲
          </span>
          আজ দাম বেড়েছে
        </h2>
        {risers.length > 0 ? (
          <ProductCardGrid products={risers} />
        ) : (
          <p className="text-sm leading-7 text-[#68736c]">আজ কোনো পণ্যের দাম বাড়েনি।</p>
        )}
      </section>

      <section aria-labelledby="fallers-title">
        <h2
          className="mb-4 flex items-center gap-2 text-xl leading-relaxed font-bold text-[#28332e] sm:mb-5 sm:text-2xl"
          id="fallers-title"
        >
          <span aria-hidden="true" className="text-[#15934b]">
            ▼
          </span>
          আজ দাম কমেছে
        </h2>
        {fallers.length > 0 ? (
          <ProductCardGrid products={fallers} />
        ) : (
          <p className="text-sm leading-7 text-[#68736c]">আজ কোনো পণ্যের দাম কমেনি।</p>
        )}
      </section>

      <section aria-labelledby="all-products-heading">
        <h2
          className="text-2xl leading-relaxed font-bold text-[#1f2b23] sm:text-3xl"
          id="all-products-heading"
        >
          সব পণ্য
        </h2>
        <p className="mb-5 mt-1 text-sm leading-7 text-[#68736c] sm:mb-6 sm:text-base">
          বাজারের সব পণ্যের আজকের দাম ও পরিবর্তন একসাথে দেখুন।
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
