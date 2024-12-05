import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import { env } from "@/server/env";
import user from "../user";
import data from "../data";
import { HTTPException } from "hono/http-exception";
import { makeResponse, handleError } from "@/server/utils";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");
app.use(logger());

app.route("/user", user);
app.route("/data", data);

app.onError(handleError);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
