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

    expect(res.status).toBe(409);
    expect(body.error!.message).toBe("Username already exist");
  });
  // signin
  it("should signin successfully", async () => {
    const res = await client.signin.$post({
      json: { username, password },
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toBe("Signin successfully");
  });
  it("should fail if  signin with wrong username", async () => {
    const res = await client.signin.$post({
      json: { username: username + username, password },
    });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error!.message).toBe("Username not exist");
  });
  it("should fail if  signin with wrong password", async () => {
    const res = await client.signin.$post({
      json: { username: username, password: password + password },
    });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error!.message).toBe("Incorrect password");
  });
  // delete
  it("should fail if delete with wrong password ", async () => {
    const encodedCredentials = Buffer.from(
      `${username}:${password}error`
    ).toString("base64");
    const res = await client.index.$delete(undefined, {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    });
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error!.message).toBe("Incorrect password");
  });
  it("should fail if username not exist ", async () => {
    const encodedCredentials = Buffer.from(
      `${username}error:${password}`
    ).toString("base64");
    const res = await client.index.$delete(undefined, {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    });
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error!.message).toBe("Username not exist");
  });
  it("should delete successfuly ", async () => {
    const encodedCredentials = Buffer.from(`${username}:${password}`).toString(
      "base64"
    );
    const res = await client.index.$delete(undefined, {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toBe("User deleted successfully");
  });
  it("should fail if delete again ", async () => {
    const encodedCredentials = Buffer.from(`${username}:${password}`).toString(
      "base64"
    );
    const res = await client.index.$delete(undefined, {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    });
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error!.message).toBe("Username not exist");
  });
});
