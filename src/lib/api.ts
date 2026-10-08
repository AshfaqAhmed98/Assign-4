export const API_BASE_URL = "https://api.api-store.workers.dev/api/bazardor";

export type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  categoryIcon: string;
  today: number;
  unit: string;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

async function fetchList<T>(
  endpoint: string,
  isValid: (value: unknown) => value is T,
): Promise<T[]> {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Bazar Dor API ${endpoint} returned ${response.status}`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every(isValid)) {
    throw new Error(`Bazar Dor API ${endpoint} returned invalid data`);
  }

  return data;
}

function isCategory(value: unknown): value is Category {
  if (typeof value !== "object" || value === null) return false;
  const category = value as Record<string, unknown>;
  return (
    typeof category.id === "string" &&
    typeof category.slug === "string" &&
    typeof category.nameBn === "string" &&
    typeof category.icon === "string"
  );
}

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;
  const product = value as Record<string, unknown>;
  if (
    typeof product.id !== "number" ||
    typeof product.slug !== "string" ||
    typeof product.nameBn !== "string" ||
    typeof product.categoryIcon !== "string" ||
    typeof product.today !== "number" ||
    typeof product.unit !== "string" ||
    typeof product.change !== "object" ||
    product.change === null
  ) {
    return false;
  }

  const change = product.change as Record<string, unknown>;
  return (
    (change.dir === "up" || change.dir === "down" || change.dir === "flat") &&
    typeof change.pct === "number"
  );
}

export function getCategories() {
  return fetchList("categories", isCategory);
}

export function getProducts() {
  return fetchList("products", isProduct);
}
