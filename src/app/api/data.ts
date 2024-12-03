import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  handleBasicAuth,
  makeResponse,
  zHttpExceptionHook,
} from "@/server/utils";
import { decrypt, encrypt } from "@/server/crypt";
import { env } from "@/server/env";
import { getFileContent, upsert } from "@/server/github";
type Env = {
  Variables: {
    authUser?: {
      username: string;
      password: string;
    };
  };
};
const app = new Hono<Env>()
  .put(
    "",
    handleBasicAuth,
    zValidator(
      "json",
      z.object({
        encryptedData: z.string().min(5),
      }),
      zHttpExceptionHook
    ),
    async (c) => {
      const { encryptedData } = c.req.valid("json");
      const { username } = c.var.authUser!!;
      //second layer encryption
      const encryptedData2 = encrypt(encryptedData, env.dataEncryptionKey);
      //update the gist file
      await upsert(username, encryptedData2);

      return makeResponse(c, { data: "Data updated successfully" }, 200);
    }
  )
  .get("", handleBasicAuth, async (c) => {
    const { username } = c.var.authUser!!;
    let data = await getFileContent(username);
    data = decrypt(data, env.dataEncryptionKey);
    return makeResponse(c, { data }, 200);
  });

export default app;
