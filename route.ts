export const dynamic = "force-dynamic"; // static by default, unless reading the request

export function GET(request: Request) {
  const num = (request.body as any)?.num;
  return new Response(
    JSON.stringify({
      env: process.env,
    }),
    { headers: { "content-type": "application/json" } },
  );
}

