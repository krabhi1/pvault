import { isUserExist, makeResponse, onError } from "@/server/utils";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { encrypt } from "@/server/crypt";
import { upsert } from "@/server/github";

function zHttpExceptionHook(parsed: any, c: any) {
  if (!parsed.success) {
    throw new HTTPException(400, {
      message: "Invalid input",
      cause: parsed.error,
    });
  }
}
const app = new Hono()
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
      console.log({ username, password });
      //thow if username exist
      const isExist = await isUserExist(username);
      if (isExist) {
        throw new HTTPException(400, { message: "Username already exist" });
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
  .post("/signin", (c) => {
    return c.json({ message: "User created successfully" }, 201);
  })
  .delete(
    ":username",
    zValidator(
      "param",
      z.object({
        username: z.string().min(3),
      })
    ),
    (c) => {
      const { username } = c.req.valid("param");

      return makeResponse(c, { data: "User deleted successfully" }, 200);
    }
  );

export default app;
