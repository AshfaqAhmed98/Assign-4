import {
  getMarketCategories,
  getMarketProducts,
  MarketDataUnavailableError,
} from "@/lib/market-data-server";

type RouteContext = {
  params: Promise<{ resource: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { resource } = await params;

  if (resource !== "categories" && resource !== "products") {
    return Response.json(
      { error: "Unknown market data resource" },
      {
      status: 404,
      },
    );
  }

  try {
    const data =
      resource === "categories"
        ? await getMarketCategories()
        : await getMarketProducts();

    return Response.json(data, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
    });
  } catch (error: unknown) {
    console.error(`Could not load Bazar Dor API resource "${resource}":`, error);
    const status =
      error instanceof MarketDataUnavailableError && error.status === 429
        ? 429
        : 502;
    return Response.json(
      { error: "Bazar Dor market data is temporarily unavailable" },
      { status },
    );
  }
}