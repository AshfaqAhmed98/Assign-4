"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-sections";
import { NotFoundState } from "@/components/not-found-state";
import { getCategories, getProducts, type Category, type Product } from "@/lib/api";

type SortOrder = "default" | "price-asc" | "price-desc";

function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="min-h-[138px] animate-pulse rounded-2xl border border-[#e0e9e2] bg-[#fbfdfb] p-4"
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
  );
}

function HomeLink() {
  return (
    <Link
      className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#078b4b] px-5 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#06743f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078b4b]"
      href="/"
    >
      হোম পেজে ফিরে যান
    </Link>
  );
}

export function CategoryProducts({ slug }: { slug: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    void Promise.all([getCategories(), getProducts()])
      .then(([categoryData, productData]) => {
        if (!active) return;
        setCategories(categoryData);
        setProducts(productData);
      })
      .catch((error: unknown) => {
        console.error("Could not load products for the category page:", error);
        if (active) setHasLoadError(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) return <CategoryProductsLoading />;

  if (hasLoadError) {
    return (
      <main className="flex-1 bg-[#f0f5f1] px-4 py-6 sm:px-6 sm:py-8">
        <section className="mx-auto max-w-6xl rounded-2xl border border-[#f0d7d4] bg-[#fbfdfb] p-6 sm:p-8">
          <h1 className="text-xl font-bold text-[#a33b2e]">
            বিভাগের পণ্য লোড করা যায়নি
          </h1>
          <p className="mt-2 text-sm leading-7 text-[#68736c]">
            কিছুক্ষণ পর আবার চেষ্টা করুন।
          </p>
          <HomeLink />
        </section>
      </main>
    );
  }

  const category = categories.find((item) => item.slug === slug);
  const categoryProducts = products.filter(
    (product) => product.category === slug,
  );

  if (!category) {
    return <NotFoundState title="বিভাগটি খুঁজে পাওয়া যায়নি" />;
  }

  if (categoryProducts.length === 0) {
    return (
      <main className="flex-1 bg-[#f0f5f1] px-4 py-6 sm:px-6 sm:py-8">
        <section
          aria-labelledby="category-empty-title"
          className="mx-auto flex max-w-6xl flex-col items-center rounded-2xl border border-[#dce8df] bg-[#fbfdfb] px-5 py-12 text-center sm:py-16"
        >
          <span aria-hidden="true" className="text-5xl">
            {category.icon}
          </span>
          <p className="mt-4 text-sm font-semibold tracking-wide text-[#078b4b]">
            ৪০৪
          </p>
          <h1
            className="mt-2 text-2xl font-bold text-[#1f2b23] sm:text-3xl"
            id="category-empty-title"
          >
            {`${category.nameBn} বিভাগে কোনো পণ্য নেই`}
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-7 text-[#68736c]">
            এই বিভাগে এখনো কোনো পণ্যের তথ্য পাওয়া যায়নি।
          </p>
          <HomeLink />
        </section>
      </main>
    );
  }

  const sortedProducts =
    sortOrder === "price-asc"
      ? [...categoryProducts].sort((a, b) => a.today - b.today)
      : sortOrder === "price-desc"
        ? [...categoryProducts].sort((a, b) => b.today - a.today)
        : categoryProducts;

  return (
    <main className="flex-1 bg-[#f0f5f1] px-4 py-6 sm:px-6 sm:py-8">
      <section className="mx-auto max-w-6xl">
        <header className="flex min-h-20 items-center gap-4 rounded-2xl border border-[#dce8df] bg-[#fbfdfb] px-5 py-4 sm:px-7">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#f0f5f1] text-3xl"
          >
            {category.icon}
          </span>
          <div>
            <h1 className="text-2xl leading-relaxed font-bold text-[#1f2b23]">
              {category.nameBn}
            </h1>
            <p className="text-sm text-[#77827c]">
              {sortedProducts.length.toLocaleString("bn-BD")}টি পণ্যের আজকের
              বাজারদর
            </p>
          </div>
        </header>

        <div className="mt-4 flex min-h-14 items-center justify-end gap-2 rounded-2xl border border-[#dce8df] bg-[#fbfdfb] px-4 py-2">
          <label className="text-sm text-[#68736c]" htmlFor="category-sort">
            সাজান:
          </label>
          <div className="relative">
            <select
              className="min-h-9 appearance-none rounded-lg border border-[#dce8df] bg-white py-1 pl-3 pr-9 text-sm text-[#28332e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078b4b]"
              id="category-sort"
              onChange={(event) => {
                const value = event.currentTarget.value;
                if (
                  value === "default" ||
                  value === "price-asc" ||
                  value === "price-desc"
                ) {
                  setSortOrder(value);
                }
              }}
              value={sortOrder}
            >
              <option value="default">ডিফল্ট</option>
              <option value="price-asc">দাম: কম থেকে বেশি</option>
              <option value="price-desc">দাম: বেশি থেকে কম</option>
            </select>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#68736c]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        <p className="my-3 text-sm text-[#77827c]">
          মোট {sortedProducts.length.toLocaleString("bn-BD")}টি পণ্য দেখানো হচ্ছে
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

export function CategoryProductsLoading() {
  return (
    <main className="flex-1 bg-[#f0f5f1] px-4 py-6 sm:px-6 sm:py-8">
      <section
        aria-busy="true"
        aria-label="বিভাগের পণ্য লোড হচ্ছে"
        className="mx-auto max-w-6xl"
      >
        <div className="h-20 animate-pulse rounded-2xl border border-[#dce8df] bg-[#fbfdfb]" />
        <div className="mt-4 h-14 animate-pulse rounded-2xl border border-[#dce8df] bg-[#fbfdfb]" />
        <p className="sr-only" role="status">
          পণ্য লোড হচ্ছে…
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
