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
    const result = await octokit.request('PATCH /gists/' + env.githubGistId, {
        gist_id: env.githubGistId,
        files: {
            [name]: {
                content
            }
        },
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    return result.data.files
}

export async function getFile(name: string) {
    try {
        const { data } = await axios.get(`https://gist.githubusercontent.com/krabhi1/${env.githubGistId}/raw/${name}`)
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

export async function remove(name: string) {
    const result = await octokit.request('PATCH /gists/' + env.githubGistId, {
        gist_id: env.githubGistId,
        files: {
            [name]: null
        },
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    return result
}