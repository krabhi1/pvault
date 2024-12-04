import { hc } from "hono/client";

import { UserType } from "@/app/api/user";
import { usePromise } from "@/hooks/use-promise";

export const userRpc = hc<UserType>("http://localhost:3000/api/user");
