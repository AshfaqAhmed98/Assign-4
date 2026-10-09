import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProductBySlug } from "@/lib/market-data-server";
import ProductDetail, {
  ProductDataUnavailable,
} from "@/components/product-detail";

export const instant = false;

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params;

  let product;
  try {
    product = await getProductBySlug(slug);
  } catch (error: unknown) {
    console.error(`Could not load product "${slug}" for its detail page:`, error);
    return <ProductDataUnavailable />;
  }

  if (!product) {
    notFound();
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/signin?redirect=protected");
  }

  return <ProductDetail product={product} />;
}
