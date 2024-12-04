"use client";
import { hc } from "hono/client";

import { UserRouterType } from "@/app/api/user";
import { Button } from "@/components/ui/button";
import { DataRouterType } from "../api/data";

const client = hc<UserRouterType>("http://localhost:3000/api/user");
const dataApi = hc<DataRouterType>("http://localhost:3000/api/data", {});
async function call() {
  let res = await client.signup.$post({
    json: { password: "123456", username: "abhi" },
  });
  console.log(await res.json());
  res = await client.signin.$post({
    json: { password: "123456", username: "abhi" },
  });
  console.log(await res.json());
  res = await dataApi.index.$get(
    {},
    {
      headers: {
        Authorization: "",
      },
    }
  );
}
export default function Page() {
  return (
    <div className="p-10">
      <Button onClick={call}>click</Button>
    </div>
  );
}
