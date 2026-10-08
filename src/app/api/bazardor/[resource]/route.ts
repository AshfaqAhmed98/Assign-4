const UPSTREAM_API_BASE_URLS = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];
const ALLOWED_RESOURCES = new Set(["categories", "products"]);

type RouteContext = {
  params: Promise<{ resource: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { resource } = await params;

  if (!ALLOWED_RESOURCES.has(resource)) {
    return Response.json({ error: "Unknown market data resource" }, {
      status: 404,
    });
  }

  let lastStatus: number | undefined;

  for (const [index, baseUrl] of UPSTREAM_API_BASE_URLS.entries()) {
    let upstream: Response;
    try {
      upstream = await fetch(`${baseUrl}/${resource}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
    } catch (error) {
      console.error(
        `Could not reach Bazar Dor API ${index + 1} (${resource}):`,
        error,
      );
      continue;
    }

    if (!upstream.ok) {
      lastStatus = upstream.status;
      console.warn(
        `Bazar Dor API ${index + 1} (${resource}) returned ${upstream.status}; trying the alternate API.`,
      );
      continue;
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") ?? "application/json",
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    });
  }

  if (lastStatus === 429) {
    return Response.json(
      { error: "Both market data APIs are temporarily rate limited" },
      { status: 429 },
    );
  }

  return Response.json(
    { error: "Both market data APIs are unavailable" },
    { status: 502 },
  );
}