import { Suspense } from "react";
import ProductDetail from "@/components/product-detail";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense
      fallback={
        <main className="flex-1 bg-[#f0f5f1] px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-6xl animate-pulse space-y-5">
            <div className="h-5 w-48 rounded bg-[#dfe9e1]" />
            <div className="h-28 rounded-2xl bg-white" />
            <div className="h-64 rounded-2xl bg-white" />
          </div>
        </main>
      }
    >
      {params.then(({ slug }) => (
        <ProductDetail slug={slug} />
      ))}
    </Suspense>
  );
}
