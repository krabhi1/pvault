import { HTTPException } from "hono/http-exception";
import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";
import axios from "axios";
import { GistFile } from "./github";
import { decrypt } from "./crypt";

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

export function makeResponse(
  ctx: Context,
  data: {
    data?: any;
    error?: {
      message: string;
      cause?: any;
    };
  },
  code: StatusCode = 200
) {
  return ctx.json(data, code);
}

export function onError(err: HTTPException | Error, c: Context) {
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

export async function verifyUser(file: GistFile, password: string) {
  const content = await downloadFile(file.url);
  try {
    decrypt(content, password);
  } catch (error) {
    //TODO check if really password is wrong by check the error
    throw new HTTPException(400, { message: "Incorrect password" });
  }
}
