import { parseBody, getEnv, makeResponse, Env } from "../utils";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export function GET(request: Request) {
  const num = (request.body as any)?.num;
  const params = new URL(request.url).searchParams;
  console.log("headers", request.headers, request.url, params);
  return new Response(
    JSON.stringify({
      env: process.env,
    }),
    { headers: { "content-type": "application/json" } },
  );
}

export async function POST(request: Request) {
  const body = await parseBody(request);
  const env = getEnv();
  if (!env) {
    return makeResponse({ statusCode: 400, message: "Invalid Environment" });
  }
  const params = new URL(request.url).searchParams;

  return logic(request, params, body, env);
}

async function logic(
  req: Request,
  params: any,
  body: any,
  env: Env,
): Promise<Response> {
  return makeResponse({ statusCode: 200, message: "Hello World" });
}
