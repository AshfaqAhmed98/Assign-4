import "server-only";

import {
  isCategory,
  isProduct,
  type Category,
  type Product,
} from "@/lib/api";

const UPSTREAM_API_BASE_URLS = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

export class MarketDataUnavailableError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "MarketDataUnavailableError";
  }
}

async function fetchMarketData<T>(
  resource: "categories" | "products",
  isValid: (value: unknown) => value is T,
): Promise<T[]> {
  let lastStatus: number | undefined;
  let lastError: unknown;

  for (const [index, baseUrl] of UPSTREAM_API_BASE_URLS.entries()) {
    let response: Response;
    try {
      response = await fetch(`${baseUrl}/${resource}`, {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
      });
    } catch (error) {
      lastError = error;
      console.error(
        `Could not reach Bazar Dor API ${index + 1} (${resource}):`,
        error,
      );
      continue;
    }

    if (!response.ok) {
      lastStatus = response.status;
      console.warn(
        `Bazar Dor API ${index + 1} (${resource}) returned ${response.status}; trying the alternate API.`,
      );
      continue;
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch (error) {
      lastError = error;
      console.error(
        `Bazar Dor API ${index + 1} (${resource}) returned invalid JSON:`,
        error,
      );
      continue;
    }

    if (Array.isArray(data) && data.every(isValid)) {
      return data;
    }

    lastError = new Error(`Bazar Dor API ${resource} returned invalid data`);
    console.error(
      `Bazar Dor API ${index + 1} (${resource}) returned invalid data.`,
    );
  }

  throw new MarketDataUnavailableError(
    `Bazar Dor API (${resource}) is unavailable`,
    lastStatus ?? (lastError instanceof Error ? undefined : 502),
  );
}

export function getMarketCategories(): Promise<Category[]> {
  return fetchMarketData("categories", isCategory);
}

export function getMarketProducts(): Promise<Product[]> {
  return fetchMarketData("products", isProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getMarketProducts();
  return products.find((product) => product.slug === slug) ?? null;
}
