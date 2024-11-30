import { HTTPException } from "hono/http-exception";
import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";

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
