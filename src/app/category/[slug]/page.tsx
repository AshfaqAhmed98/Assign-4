import { Suspense } from "react";
import {
  CategoryProducts,
  CategoryProductsLoading,
} from "@/components/category-products";

async function CategoryRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
