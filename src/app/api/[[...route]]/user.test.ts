import { testClient } from "hono/testing";
import app from "./user";
import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import { onError } from "@/server/utils";
app.onError(onError);

describe("User flow", async () => {
  let client: ReturnType<typeof testClient<typeof app>>;
  const username = "demo";
  const password = "12345";

  beforeAll(async () => {
    client = testClient(app);
    //delete the user if exist
    await client[":username"].$delete({ param: { username } });
  });

  it("should successfully sign up a new user", async () => {
    const res = await client.signup.$post({
      json: { username, password },
    });
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.data).toBe("User created successfully");
  });

  it("should fail if signup with same username", async () => {
    const res = await client.signup.$post({
      json: { username, password },
    });
    const body = await res.json();
    console.log(body);

    expect(res.status).toBe(409);
    expect(body.error!.message).toBe("Username already exist");
  });
});
