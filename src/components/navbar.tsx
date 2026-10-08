"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getCategories,
  getProducts,
  type Category,
  type Product,
} from "@/lib/api";

const numberFormat = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 1,
});

const unitNames: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  piece: "টি",
  dozen: "ডজন",
};

function formatPrice(product: Product) {
  const unit = unitNames[product.unit] ?? product.unit;
  return `৳${numberFormat.format(product.today)}/${unit}`;
}

function PriceItem({ product }: { product: Product }) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";
  const indicator = isUp ? "▲" : isDown ? "▼" : "●";
  const changeText =
    product.change.dir === "flat"
      ? "০%"
      : `${numberFormat.format(Math.abs(product.change.pct))}%`;

  return (
    <span className="inline-flex min-h-7.75 flex-none items-center gap-1.75 whitespace-nowrap border-r border-[#e9eeea] px-3 text-xs text-[#37443b]">
      <span aria-hidden="true" className="text-xs">
        {product.categoryIcon}
      </span>
      <span>{product.nameBn}</span>
      <span className="text-[#536158]">{formatPrice(product)}</span>
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-bold ${
          isUp
            ? "text-[#d13d39]"
            : isDown
              ? "text-[#15934b]"
              : "text-[#87918b]"
        }`}
      >
        <span aria-hidden="true">{indicator}</span> {changeText}
      </span>
    </span>
  );
}

export function Navbar({ banglaDate }: { banglaDate: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryError, setCategoryError] = useState(false);
  const [productError, setProductError] = useState(false);
  const pathname = usePathname();
  const currentCategory = pathname.startsWith("/category/")
    ? pathname.slice("/category/".length)
    : pathname === "/"
      ? "chal"
      : "";

  useEffect(() => {
    let active = true;

    void Promise.allSettled([getCategories(), getProducts()]).then(
      ([categoryResult, productResult]) => {
        if (!active) return;

        if (categoryResult.status === "fulfilled") {
          setCategories(categoryResult.value);
        } else {
          setCategoryError(true);
        }

        if (productResult.status === "fulfilled") {
          setProducts(productResult.value);
        } else {
          setProductError(true);
        }
      },
    );

    return () => {
      active = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 w-full border-b border-[#e8eeea] bg-white">
      <div className="mx-auto flex min-h-14.5 max-w-295 items-center justify-between px-3 py-2 sm:min-h-15.5 sm:px-4">
        <Link
          className="inline-flex items-center gap-1.75 text-inherit no-underline"
          href="/"
          aria-label="বাজার দর - হোম"
        >
          <span
            aria-hidden="true"
            className="grid size-8.5 place-items-center rounded-[10px] bg-[#078b4b] text-xl sm:size-9"
          >
            🛒
          </span>
          <span className="flex flex-col gap-px">
            <span className="text-sm leading-[1.2] font-bold sm:text-base">
              বাজার দর
            </span>
            <span className="max-w-[47vw] overflow-hidden text-[10px] leading-[1.3] text-ellipsis whitespace-nowrap text-[#77827c] sm:text-[11px]">
              {banglaDate || "আজকের তারিখ"}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            className="inline-flex min-h-9 items-center justify-center rounded-md px-3 text-xs font-semibold whitespace-nowrap text-[#34423a] no-underline transition-colors duration-150 hover:bg-[#f0f6f2] sm:px-4 sm:text-[13px]"
            href="/sign-in"
          >
            সাইন ইন
          </Link>
          <Link
            className="inline-flex min-h-9 items-center justify-center rounded-md bg-[#078b4b] px-3 text-xs font-semibold whitespace-nowrap text-white no-underline transition-colors duration-150 hover:bg-[#06743f] sm:px-4 sm:text-[13px]"
            href="/sign-up"
          >
            সাইন আপ
          </Link>
        </div>
      </div>

      <nav aria-label="পণ্যের বিভাগ" className="border-t border-[#f1f4f2]">
        <div className="scrollbar-none mx-auto flex min-h-11 w-full max-w-295 items-center justify-start gap-1 overflow-x-auto px-3 py-1 sm:px-4">
          {categories.map((category) => {
            const isActive = category.slug === currentCategory;
            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-h-9 flex-none items-center gap-2 rounded-md px-3 text-[13px] whitespace-nowrap no-underline transition-colors duration-150 ${
                  isActive
                    ? "bg-[#e7f5ec] font-bold text-[#06743f]"
                    : "font-medium text-[#435047] hover:bg-[#f0f6f2] hover:text-[#06743f]"
                }`}
                href={`/category/${category.slug}`}
                key={category.id}
              >
                <span aria-hidden="true">{category.icon}</span>
                {category.nameBn}
              </Link>
            );
          })}
          {categoryError && (
            <span
              className="shrink-0 self-center whitespace-nowrap text-xs text-[#a33b2e]"
              role="status"
            >
              বিভাগ লোড করা যায়নি
            </span>
          )}
          {!categoryError && categories.length === 0 && (
            <span className="shrink-0 self-center whitespace-nowrap text-xs text-[#77827c]">
              বিভাগ লোড হচ্ছে…
            </span>
          )}
        </div>
      </nav>

      <section
        aria-label="বাজারদরের আপডেট"
        className="min-h-8 overflow-hidden border-t border-[#edf1ee] bg-[#fbfcfb]"
      >
        {productError ? (
          <p
            className="m-0 px-3 py-1.75 text-center text-xs text-[#a33b2e]"
            role="status"
          >
            বাজারদরের তথ্য এই মুহূর্তে পাওয়া যাচ্ছে না
          </p>
        ) : products.length === 0 ? (
          <p
            className="m-0 px-3 py-1.75 text-center text-xs text-[#536158]"
            role="status"
          >
            বাজারদরের তথ্য লোড হচ্ছে…
          </p>
        ) : (
          <div className="overflow-hidden">
            <div className="flex w-max animate-ticker-scroll hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none">
              {[0, 1].map((copy) => (
                <div
                  aria-hidden={copy === 1}
                  className="flex w-max"
                  key={copy}
                >
                  {products.map((product) => (
                    <PriceItem key={product.id} product={product} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </header>
  );
}
