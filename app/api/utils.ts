import { Result } from "../utils";
export type Env = {
  GITHUB_TOKEN_ABHISHEK: string;
  GITHUB_TOKEN_NITESH: string;
  SECRET_KEY_ABHISHEK: string;
  SECRET_KEY_NITESH: string;
};
export function getEnv() {
  const env = {
    GITHUB_TOKEN_ABHISHEK: process.env.GITHUB_TOKEN_ABHISHEK,
    GITHUB_TOKEN_NITESH: process.env.GITHUB_TOKEN_NITESH,
    SECRET_KEY_ABHISHEK: process.env.SECRET_KEY_ABHISHEK,
    SECRET_KEY_NITESH: process.env.SECRET_KEY_NITESH,
  } as Env;

  //if any invalid return undefined
  if (
    !env.GITHUB_TOKEN_ABHISHEK ||
    !env.GITHUB_TOKEN_NITESH ||
    !env.SECRET_KEY_ABHISHEK ||
    !env.SECRET_KEY_NITESH
  ) {
    return undefined;
  }
  return env;
}

export function makeResponse(result: Result<any>) {
  return new Response(JSON.stringify(result), {
    headers: {
      "content-type": "application/json",
    },
    status: result.statusCode || 200,
  });
}

export function parseBody<T>(req: Request) {
  try {
    return req.json() as Promise<T>;
  } catch (e) {
    console.error(e);
    return {} as Promise<T>;
  }
}

export type CustomRequest = {
  native: Request;
  body: any;
  params: any;
  env: Env;
  headers: any;
};

export async function handleRoute(
  request: Request,
  callback: (req: CustomRequest) => Promise<Response>,
) {
  const body = await parseBody(request);
  const env = getEnv();
  if (!env) {
    return makeResponse({ statusCode: 400, message: "Invalid Environment" });
  }
  const params = new URL(request.url).searchParams;

  return callback({
    native: request,
    body: body,
    params: params,
    env: env,
    headers: request.headers,
  });
}
