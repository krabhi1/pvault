import { HTTPException } from "hono/http-exception";
import { env } from "./env";
import axios from 'axios'
import { StatusCode } from "hono/utils/http-status";
//get a gist
export async function upsert(name: string, content: string) {
    const { githubGistId, githubToken } = env
    const url = `https://api.github.com/gists/${githubGistId}`;
    const body = {
        files: {
            [name]: {
                content: content
            }
        }
    };
    const { data } = await axios.patch(url, JSON.stringify(body), {
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${githubToken}`,
            "X-GitHub-Api-Version": "2022-11-28"
        }
    })
    return data;
}
export async function remove(name: string) {
    const { githubGistId, githubToken } = env
    const url = `https://api.github.com/gists/${githubGistId}`;
    const body = {
        files: {
            name: null
        }
    };
    await axios.patch(url, body, {
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${githubToken}`,
            "X-GitHub-Api-Version": "2022-11-28"
        }
    })
}

export async function getFile(name: string) {
    const { githubGistId } = env
    try {
        const { data } = await axios.get(`https://gist.githubusercontent.com/krabhi1/${githubGistId}/raw/${name}`)
        return data as string
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = (error.status || 500) as StatusCode
            const message = status == 404 ? "Not found" : error.message
            throw new HTTPException(status, { message })
        }
        throw new HTTPException(500, { message: "Server error" })

    }
}
