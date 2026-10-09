import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  CategoryProducts,
  CategoryProductsLoading,
} from "@/components/category-products";
import {
  getMarketCategories,
  MarketDataUnavailableError,
} from "@/lib/market-data-server";

async function CategoryRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const categories = await getMarketCategories();
    if (!categories.some((category) => category.slug === slug)) {
      notFound();
    }
  } catch (error: unknown) {
    if (!(error instanceof MarketDataUnavailableError)) {
      throw error;
    }
    console.error(`Could not validate category "${slug}":`, error);
  }

  return <CategoryProducts slug={slug} />;
}

export default function CategoryPage({
  params,
}: PageProps<"/category/[slug]">) {
  return (
    <Suspense fallback={<CategoryProductsLoading />}>
      <CategoryRoute params={params} />
    </Suspense>
  );
}
