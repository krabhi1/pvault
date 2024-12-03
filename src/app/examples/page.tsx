"use client";
import { hc } from "hono/client";

import { UserType } from "@/app/api/user";
import { Button } from "@/components/ui/button";

const client = hc<UserType>("http://localhost:3000/api/user");
async function call() {
  let res = await client.signup.$post({
    json: { password: "123456", username: "abhi" },
  });
  console.log(await res.json());
  res = await client.signin.$post({
    json: { password: "123456", username: "abhi" },
  });
  console.log(await res.json());
}
export default function Page() {
  return (
    <div className="p-10">
      <Button onClick={call}>click</Button>
    </div>
  );
}
