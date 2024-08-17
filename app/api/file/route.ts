import { handleRoute, makeResponse, readGistFile, updateGistFile } from "../utils";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export function GET(request: Request) {
  return handleRoute(request, async ({ env, params }) => {
    const { username, password } = params;
    if (!username || !password) {
      return makeResponse({
        statusCode: 400,
        message: "Invalid username and password",
      });
    }
    if (username === "abhishek" && password === env.SECRET_KEY_ABHISHEK) {
      const result = await readGistFile(
        env.GITHUB_TOKEN,
        env.GIST_ID_ABHISHEK,
        "a.e",
      );
      return makeResponse(result);
    }
    if (username === "nitesh" && password === env.SECRET_KEY_NITESH) {
      const result = await readGistFile(
        env.GITHUB_TOKEN,
        env.GIST_ID_NITESH,
        "n.e",
      );
      return makeResponse(result);
    }

    return makeResponse({
      statusCode: 401,
      message: "User not found with this username or password",
    });
  });
}

export function PATCH(request: Request) {
  return handleRoute(request, async ({ body, env }) => {
    const { username, password,data } = body;
    if (!username || !password || !data) {
      return makeResponse({
        statusCode: 400,
        message: "Invalid username or password or data",
      });
    }

    if (username === "abhishek" && password === env.SECRET_KEY_ABHISHEK) {
      const result = await updateGistFile(
        env.GITHUB_TOKEN,
        env.GIST_ID_ABHISHEK,
        "a.e",
        data
      );
      return makeResponse(result);
    }
    if (username === "nitesh" && password === env.SECRET_KEY_NITESH) {
      const result = await updateGistFile(
        env.GITHUB_TOKEN,
        env.GIST_ID_NITESH,
        "n.e",
        data
      );
      return makeResponse(result);
    }
    return makeResponse({
      statusCode: 401,
      message: "User not found with this username or password",
    });
  });
}
