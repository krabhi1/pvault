import { hc } from "hono/client";

import { UserRouterType } from "@/app/api/user";
import { DataRouterType } from "@/app/api/data";

export const userRpc = hc<UserRouterType>("http://localhost:3000/api/user");
export const dataRpc = hc<DataRouterType>("http://localhost:3000/api/data");
