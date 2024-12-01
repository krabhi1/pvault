import { downloadFile, makeResponse, handleBasicAuth } from "@/server/utils";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { decrypt, encrypt } from "@/server/crypt";
import { upsert, getFiles, remove } from "@/server/github";

function zHttpExceptionHook(parsed: any, c: any) {
  if (!parsed.success) {
    throw new HTTPException(400, {
      message: "Invalid input",
      cause: parsed.error,
    });
  }
}
type Env = {
  Variables: {
    authUser?: {
      username: string;
      password: string;
    };
  };
};
const app = new Hono<Env>()
  .post(
    "/signup",
    zValidator(
      "json",
      z.object({
        username: z.string().min(3),
        password: z.string().min(5),
      }),
      zHttpExceptionHook
    ),
    async (c) => {
      const { username, password } = c.req.valid("json");
      const files = await getFiles();
      // limit to 250 user only due to Github api response limit
      if (files.length > 250) {
        throw new HTTPException(400, {
          message: "User signup close due to max limit",
        });
      }

      //thow if username exist
      const isExist = files.find((file) => file.name == username);
      if (isExist) {
        throw new HTTPException(409, { message: "Username already exist" });
      }
      //create default data and encrypt with password
      const data = JSON.stringify({
        collections: [],
      });
      const encryptedData = encrypt(data, password);
      //create file for user
      await upsert(username, encryptedData);

      return makeResponse(c, { data: "User created successfully" }, 201);
    }
  )
  .post(
    "/signin",
    zValidator(
      "json",
      z.object({
        username: z.string().min(3),
        password: z.string().min(5),
      }),
      zHttpExceptionHook
    ),
    async (c) => {
      const { username, password } = c.req.valid("json");
      const files = await getFiles();
      const file = files.find((file) => file.name == username);
      if (!file) {
        throw new HTTPException(400, { message: "Username not exist" });
      }
      //check password match
      const content = await downloadFile(file.url);
      try {
        decrypt(content, password);
      } catch (error) {
        throw new HTTPException(400, { message: "Incorrect password" });
      }
      return makeResponse(c, { data: "Signin successfully" });
    }
  )
  .delete("", handleBasicAuth, async (c) => {
    const { username } = c.var.authUser!!;

    await remove(username);

    return makeResponse(c, { data: "User deleted successfully" }, 200);
  });

export default app;
