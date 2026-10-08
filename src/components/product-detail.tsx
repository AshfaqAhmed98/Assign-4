"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts, type Product, type ProductMarket } from "@/lib/api";

const numberFormat = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 2,
});

const unitNames: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  liter: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

const unitSuffixes: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

function getPriceSummary(product: Product, markets: ProductMarket[]) {
  if (markets.length === 0) {
    return { min: product.today, max: product.today, average: product.today };
  }

  const min = Math.min(...markets.map((market) => market.min));
  const max = Math.max(...markets.map((market) => market.max));
  const average =
    markets.reduce((sum, market) => sum + (market.min + market.max) / 2, 0) /
    markets.length;

  return { min, max, average };
}

function MarketRow({ market }: { market: ProductMarket }) {
  const average = (market.min + market.max) / 2;

  return (
    <tr className="border-b border-[#e4ebe5] last:border-0 even:bg-[#f4f7f4]">
      <td className="px-4 py-3.5 font-medium text-[#28332e]">
        {market.market}
      </td>
      <td className="px-4 py-3.5 text-[#59665d]">{market.division}</td>
      <td className="px-4 py-3.5 text-right tabular-nums text-[#15934b]">
        {numberFormat.format(market.min)} টাকা
      </td>
      <td className="px-4 py-3.5 text-right tabular-nums text-[#d13d39]">
        {numberFormat.format(market.max)} টাকা
      </td>
      <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-[#28332e]">
        {numberFormat.format(average)} টাকা
      </td>
    </tr>
  );
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-[#f0f5f1] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl animate-pulse space-y-5">
        <div className="h-5 w-48 rounded bg-[#dfe9e1]" />
        <div className="h-28 rounded-2xl bg-white" />
        <div className="h-64 rounded-2xl bg-white" />
      </div>
    </main>
  );
}

export default function ProductDetail({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    void getProducts()
      .then((products) => {
        if (active) {
          setProduct(products.find((item) => item.slug === slug) ?? null);
        }
      })
      .catch((error: unknown) => {
        console.error(`Could not load product details for "${slug}":`, error);
        if (active) setLoadError(true);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (!product && !loadError) return <LoadingState />;

  if (loadError || !product) {
    return (
      <main className="min-h-screen bg-[#f0f5f1] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-[#e0e9e2] bg-[#fbfdfb] p-6 sm:p-8">
          <h1 className="text-xl font-bold text-[#28332e]">
            {loadError ? "পণ্যের তথ্য পাওয়া যায়নি" : "পণ্যটি খুঁজে পাওয়া যায়নি"}
          </h1>
          <p className="mt-2 text-sm leading-7 text-[#68736c]">
            {loadError
              ? "পণ্যের তথ্য লোড করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।"
              : "এই ঠিকানায় কোনো পণ্যের তথ্য নেই।"}
          </p>
          <Link
            className="mt-5 inline-flex rounded-lg bg-[#078b4b] px-4 py-2.5 text-sm font-semibold text-white no-underline hover:bg-[#06743f]"
            href="/#সব-পণ্য"
          >
            সব পণ্য দেখুন
          </Link>
        </div>
      </main>
    );
  }

  const markets = product.markets ?? [];
  const summary = getPriceSummary(product, markets);
  const categoryName = product.categoryNameBn ?? "বাজারপণ্য";
  const unitName = unitNames[product.unit] ?? `প্রতি ${product.unit}`;
  const priceDifference =
    typeof product.yesterday === "number"
      ? Math.abs(product.today - product.yesterday)
      : null;
  const actualDirection =
    typeof product.yesterday !== "number"
      ? product.change.dir
      : product.today > product.yesterday
        ? "up"
        : product.today < product.yesterday
          ? "down"
          : "flat";
  const changeLabel =
    actualDirection === "up"
      ? "গতকালের তুলনায় আজ দাম বেড়েছে"
      : actualDirection === "down"
        ? "গতকালের তুলনায় আজ দাম কমেছে"
        : "গতকালের তুলনায় আজ দামে পরিবর্তন নেই";
  const changeText =
    actualDirection === "flat"
      ? "— ০.০%"
      : `${actualDirection === "up" ? "▲" : "▼"} ${numberFormat.format(Math.abs(product.change.pct))}%`;

  return (
    <main className="min-h-screen bg-[#f0f5f1] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="ব্রেডক্রাম্ব" className="mb-4 text-sm text-[#68736c]">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link className="hover:text-[#078b4b]" href="/">
                হোম
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link
                className="hover:text-[#078b4b]"
                href={product.category ? `/category/${product.category}` : "/"}
              >
                {categoryName}
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="font-medium text-[#28332e]">
              {product.nameBn}
            </li>
          </ol>
        </nav>

        <section
          aria-labelledby="product-title"
          className="flex flex-col gap-4 rounded-2xl border border-[#e0e9e2] bg-[#fbfdfb] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5"
        >
          <div className="flex min-w-0 items-center gap-4">
            <span
              aria-hidden="true"
              className="grid size-14 shrink-0 place-items-center rounded-xl bg-[#f0f5f1] text-3xl sm:size-16"
            >
              {product.image || product.categoryIcon || "🛒"}
            </span>
            <div className="min-w-0">
              <h1
                className="text-xl leading-relaxed font-bold text-[#28332e] sm:text-2xl"
                id="product-title"
              >
                {product.nameBn}
              </h1>
              <p className="mt-0.5 text-xs leading-5 text-[#68736c]">
                {categoryName} · {unitName}
              </p>
              <p
                className={`mt-1 text-xs leading-5 ${
                  actualDirection === "up"
                    ? "text-[#c53b36]"
                    : actualDirection === "down"
                      ? "text-[#148348]"
                      : "text-[#77827c]"
                }`}
              >
                {changeLabel}
                {priceDifference !== null && priceDifference > 0
                  ? ` - ${numberFormat.format(priceDifference)} টাকা`
                  : ""}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 rounded-xl bg-[#f0f5f1] px-4 py-3 sm:min-w-36 sm:flex-col sm:gap-1 sm:text-center">
            <span className="text-xs text-[#68736c]">আজকের দাম</span>
            <span className="text-2xl font-bold text-[#28332e]">
              {numberFormat.format(product.today)}
            </span>
            <span className="text-xs text-[#59665d]">
              টাকা / {unitSuffixes[product.unit] ?? product.unit}
            </span>
            <span
              className={`text-xs font-bold ${
                actualDirection === "up"
                  ? "text-[#d13d39]"
                  : actualDirection === "down"
                    ? "text-[#15934b]"
                    : "text-[#77827c]"
              }`}
            >
              {changeText}
            </span>
          </div>
        </section>

        <section
          aria-labelledby="price-summary-heading"
          className="mt-5 rounded-2xl border border-[#e0e9e2] bg-[#fbfdfb] p-5 shadow-sm sm:p-7"
        >
          <h2
            className="text-lg font-bold text-[#28332e] sm:text-xl"
            id="price-summary-heading"
          >
            দামের সারসংক্ষেপ
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <SummaryCard
              label="সর্বনিম্ন দাম"
              value={summary.min}
              detail="বাজারের সর্বনিম্ন দর"
              color="text-[#15934b]"
            />
            <SummaryCard
              label="সর্বোচ্চ দাম"
              value={summary.max}
              detail="বাজারের সর্বোচ্চ দর"
              color="text-[#d13d39]"
            />
            <SummaryCard
              label="গড় দাম"
              value={summary.average}
              detail="সব বাজারের গড় দর"
              color="text-[#078b4b]"
            />
          </div>
        </section>

        <section
          aria-labelledby="market-prices-heading"
          className="mt-5 rounded-2xl border border-[#e0e9e2] bg-[#fbfdfb] p-5 shadow-sm sm:p-7"
        >
          <div className="mb-4">
            <h2
              className="text-lg font-bold text-[#28332e] sm:text-xl"
              id="market-prices-heading"
            >
              বাজারভিত্তিক আজকের দাম
            </h2>
            <p className="mt-1 text-sm leading-6 text-[#68736c]">
              বিভিন্ন বাজারে {product.nameBn} এর সর্বনিম্ন, সর্বোচ্চ ও গড় দর।
            </p>
          </div>
          {markets.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-[#e0e9e2]">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead className="bg-[#f0f5f1] text-left text-xs font-semibold text-[#59665d]">
                  <tr>
                    <th className="px-4 py-3">বাজার</th>
                    <th className="px-4 py-3">বিভাগ</th>
                    <th className="px-4 py-3 text-right">সর্বনিম্ন</th>
                    <th className="px-4 py-3 text-right">সর্বোচ্চ</th>
                    <th className="px-4 py-3 text-right">গড়</th>
                  </tr>
                </thead>
                <tbody>
                  {markets.map((market) => (
                    <MarketRow key={`${market.market}-${market.division}`} market={market} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl bg-[#f4f7f4] p-4 text-sm leading-7 text-[#68736c]">
              এই পণ্যের বাজারভিত্তিক দামের তথ্য এখন পাওয়া যাচ্ছে না।
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  color,
}: {
  label: string;
  value: number;
  detail: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-[#e2eae3] bg-[#fbfdfb] p-4">
      <p className="text-sm font-medium text-[#59665d]">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>
        {numberFormat.format(value)} টাকা
      </p>
      <p className="mt-1 text-xs text-[#77827c]">{detail}</p>
    </div>
  );
}
