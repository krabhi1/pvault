import {
  parseBody,
  getEnv,
  makeResponse,
  Env,
  handleRoute,
  jsonFetch,
  readGistFile,
} from "../utils";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export function GET(request: Request) {
  return handleRoute(request, async ({ params, env }) => {
    const result = await readGistFile(
      env.GITHUB_TOKEN,
      env.GIST_ID_ABHISHEK,
      "abhishek",
    );
    return makeResponse(result);
  });
}
