import { HTTPException } from "hono/http-exception";
import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";
import axios from "axios";
import { getFileContent, getFiles } from "./github";
import { decrypt } from "./crypt";
import { basicAuth } from "hono/basic-auth";
import { env } from "./env";

// export async function isUserExist(name: string) {
//   try {
//     const file = await getFile(name); // Check if the file exists
//     console.log({ name, file });
//     return true;
//   } catch (error) {
//     console.log(error);
//     // Handle known 404 errors (file not found)
//     if (error instanceof HTTPException && error.status === 404) {
//       return false;
//     }
//     // Rethrow unexpected errors
//     throw error;
//   }
// }

export function makeResponse<T = any>(
  ctx: Context,
  data: {
    data?: T;
    error?: {
      message: string;
      cause?: any;
    };
  },
  code: StatusCode = 200
) {
  return ctx.json(data, code);
}

export function handleError(err: HTTPException | Error, c: Context) {
  console.log("Error ", err.message);
  if (err instanceof HTTPException) {
    return makeResponse(
      c,
      {
        error: {
          message: err.message,
          cause: err.cause,
        },
      },
      err.status
    );
  }
  return makeResponse(
    c,
    {
      error: {
        message: err.message,
        cause: err,
      },
    },
    500
  );
}

export async function downloadFile(url: string) {
  const result = await axios.get(url, { responseType: "text" });
  return result.data as string;
}

export async function verifyUser(username: string, password: string) {
  let data: string;
  try {
    data = await getFileContent(username);
    //decrypt it with server key
    data = decrypt(data, env.dataEncryptionKey);
  } catch (error) {
    if (error instanceof HTTPException) {
      if (error.status == 404)
        throw new HTTPException(400, { message: "Username not exist" });
    }
    throw error;
  }
  try {
    console.log(data, password);
    decrypt(data, password);
  } catch (error) {
    //TODO check if really password is wrong by check the error
    console.log(error);
    throw new HTTPException(401, {
      message: "Incorrect password",
    });
  }
}

export const handleBasicAuth = basicAuth({
  async verifyUser(username, password, c) {
    c.set("authUser", { username, password });
    await verifyUser(username, password);
    return true;
  },
});

export function zHttpExceptionHook(parsed: any, c: any) {
  if (!parsed.success) {
    throw new HTTPException(400, {
      message: "Invalid input",
      cause: parsed.error,
    });
  }
}
