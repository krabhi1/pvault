import { Octokit } from "octokit";
import { env } from "./env";
import axios from "axios";
import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";

const octokit = new Octokit({
  auth: env.githubToken,
});

export async function upsert(name: string, content: string) {
  //TODO throw HTTPException
  const result = await octokit.request("PATCH /gists/" + env.githubGistId, {
    gist_id: env.githubGistId,
    files: {
      [name]: {
        content,
      },
    },
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  return result.data.files;
}

// export async function getFile(name: string) {
//   try {
//     const { data } = await axios.get(
//       `https://gist.githubusercontent.com/krabhi1/${env.githubGistId}/raw/${name}`
//     );
//     return data as string;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       const status = (error.status || 500) as StatusCode;
//       const message = status == 404 ? "Not found" : error.message;
//       throw new HTTPException(status, { message });
//     }
//     throw new HTTPException(500, { message: "Server error" });
//   }
// }

export async function remove(name: string) {
  try {
    const result = await octokit.request("PATCH /gists/" + env.githubGistId, {
      gist_id: env.githubGistId,
      files: {
        [name]: null,
      },
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    return result;
  } catch (error) {
    throw new HTTPException(404, { message: "Username not exist" });
  }
}
export type GistFile = {
  name: string;
  url: string;
};
export async function getFiles() {
  const result = await octokit.request("GET /gists/" + env.githubGistId, {
    gist_id: env.githubGistId,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const files = Object.keys(result.data.files).map((name, i) => {
    const file = result.data.files[name];
    return {
      name: file.filename,
      url: file.raw_url,
    } as GistFile;
  });
  return files;
}
