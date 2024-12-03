import { findFalsyKeys } from "@/lib/common";

export const env = {
  githubToken: process.env.GITHUB_TOKEN!,
  jwtSecret: process.env.JWT_SECRET!,
  dataEncryptionKey: process.env.DATA_ENCRYPTION_KEY!,
  githubGistId: process.env.GITHUB_GIST_ID!,
};
//load all env if not exist  throw error
const missingKeys = findFalsyKeys(env);
if (missingKeys.length > 0) {
  throw new Error("Missing keys " + missingKeys);
}
