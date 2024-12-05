import { testClient } from "hono/testing";
import app from "./user";
import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import { handleError } from "@/server/utils";
app.onError(handleError);

describe("User flow", async () => {
  let client: ReturnType<typeof testClient<typeof app>>;
  const username = "demo";
  const password = "12345";

  beforeAll(async () => {
    client = testClient(app);
    //delete the user if exist
    const encodedCredentials = Buffer.from(`${username}:${password}`).toString(
      "base64"
    );
    await client.index.$delete(undefined, {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    });
  });
});
