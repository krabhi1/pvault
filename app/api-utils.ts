import { Result } from "./utils";

export async function verifyLogin(username: string, password: string) {
  const result: Result<boolean> = { data: true };
  return result;
}

export async function getFile(username: string, password: string) {
  const result: Result<string> = { data: "some text" };
  return result;
}
export async function updateFile(
  username: string,
  password: string,
  text: string,
) {
  const result: Result<boolean> = { data: true };
  return result;
}


