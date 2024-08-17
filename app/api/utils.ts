import { makeResult, Result } from "../utils";
export type Env = {
  GITHUB_TOKEN: string;
  SECRET_KEY_ABHISHEK: string;
  SECRET_KEY_NITESH: string;
  GIST_ID_NITESH: string;
  GIST_ID_ABHISHEK: string;
};
export function getEnv() {
  const env: Env = {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN!,
    SECRET_KEY_ABHISHEK: process.env.SECRET_KEY_ABHISHEK!,
    SECRET_KEY_NITESH: process.env.SECRET_KEY_NITESH!,
    GIST_ID_NITESH: process.env.GIST_ID_NITESH!,
    GIST_ID_ABHISHEK: process.env.GIST_ID_ABHISHEK!,
  };

  //if any invalid return undefined
  if (
    !env.GITHUB_TOKEN ||
    !env.SECRET_KEY_ABHISHEK ||
    !env.SECRET_KEY_NITESH ||
    !env.GIST_ID_NITESH ||
    !env.GIST_ID_ABHISHEK
  ) {
    return undefined;
  }
  return env;
}

export function makeResponse(result: Result<any>) {
  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
    status: result.statusCode || 200,
  });
}

export async function parseBody<T>(req: Request) {
  try {
    const body = await req.json();
    return body as Promise<T>;
  } catch (e) {
    // console.error(e);
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
  const urlParams = new URL(request.url).searchParams;
  const params = Object.fromEntries(urlParams.entries());

  return callback({
    native: request,
    body: body,
    params: params,
    env: env,
    headers: request.headers,
  });
}

export async function jsonFetch<T = any>({
  url,
  method,
  headers,
  body,
}: {
  url: string;
  method: "POST" | "GET" | "PATCH";
  headers?: any;
  body?: any;
}) {
  const result: Result<T> = {};
  try {
    const jsonHeaders =
      typeof body === "object" ? { "Content-Type": "application/json" } : {};
    const response = await fetch(url, {
      method,
      headers: headers || jsonHeaders,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-cache",
    });

    try {
      const data = await response.json();
      result.data = data;
      result.statusCode = response.status;
    } catch (e) {
      console.log(e);
      result.error = e + "";
      result.message = "parse error";
      result.statusCode = 500;
    }
  } catch (e) {
    console.log(e);
    result.error = e + "";
    result.message = "fetch error";
    result.statusCode = 500;
  }
  return result;
}

export async function readGistFile(
  githubToken: string,
  gistId: string,
  fileName: string,
) {
  const output = makeResult<string>({});
  const result = await jsonFetch({
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${githubToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    url: "https://api.github.com/gists/" + gistId,
  });
  output.statusCode = result.statusCode;
  if (result.statusCode == 200 && result.data) {
    const raw_url = result.data.files[fileName].raw_url;
    const text = await downloadFile(raw_url);
    if (text) {
      output.data = text;
      output.statusCode = 200;
    } else {
      output.statusCode = 500;
      output.message = "Error while downloading gist file";
    }
  } else if (
    result.statusCode &&
    result.statusCode > 299 &&
    result.statusCode < 499
  ) {
    output.message = result.data.message;
  }
  return output;
}

export async function updateGistFile(
  githubToken: string,
  gistId: string,
  fileName: string,
  data: string,
) {
  const output = makeResult<string>({});
  const result = await jsonFetch({
    method: "PATCH",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${githubToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    url: "https://api.github.com/gists/" + gistId,
    body: {
      files: {
        [fileName]: {
          content: data,
        },
      },
    },
  });
  output.statusCode = result.statusCode;
  if (result.statusCode == 200 && result.data) {
    output.data = result.data;
  } else if (
    result.statusCode &&
    result.statusCode > 299 &&
    result.statusCode < 499
  ) {
    output.message = result.data.message;
  }

  return output;
}

function downloadFile(url: string) {
  return fetch(url)
    .then((response) => response.text())
    .catch((e) => undefined);
}
