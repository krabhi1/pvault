import { Result } from "./utils";

export async function verifyLogin(username: string, password: string) {
  return jsonFetch({
    method: "POST",
    url: "api/login",
    body: { username, password },
  });
}

export async function getFile(username: string, password: string) {
  return jsonFetch({
    method: "GET",
    url: `api/file?username=${username}&password=${password}`,
  });
}
export async function updateFile(
  username: string,
  password: string,
  text: string,
) {
  return jsonFetch({
    method: "PATCH",
    url: "api/file",
    body: { username, password, data: text },
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
      // result.data = data;
      // result.statusCode = response.status;
      return data as Result<T>;
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
