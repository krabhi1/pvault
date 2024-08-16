import { Env, getEnv, handleRoute, makeResponse, parseBody } from "../utils";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export async function POST(request: Request) {
  return handleRoute(request, async ({ body, env }) => {
    const { username, password } = body;
    if (!username || !password) {
      return makeResponse({
        statusCode: 400,
        message: "Invalid username and password",
      });
    }

    if (username === "abhishek" && password === env.SECRET_KEY_ABHISHEK) {
      return makeResponse({ data: true });
    }
    if (username === "nitesh" && password === env.SECRET_KEY_NITESH) {
      return makeResponse({ data: true });
    }
    return makeResponse({
      statusCode: 401,
      message: "User not found with this username or password",
    });
  });
}
