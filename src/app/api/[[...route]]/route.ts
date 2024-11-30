import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import { env } from "@/server/env";
import user from "./user";
import collection from "./collection";
import { HTTPException } from "hono/http-exception";
import { makeResponse, onError } from "@/server/utils";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");
app.use(logger());

app.route("/user", user);
app.route("/collection", collection);

app.onError(onError);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export { app };
