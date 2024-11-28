import { env } from "./env";
import axios from 'axios'
//get a gist
export async function upsert(name: string, content: string) {
    const { githubGistId, githubToken } = env
    const url = `https://api.github.com/gists/${githubGistId}`;
    const body = {
        files: {
            name: {
                content
            }
        }
    };
    const { data } = await axios.patch(url, body, {
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
    const { data } = await axios.get(`https://gist.githubusercontent.com/krabhi1/${githubGistId}/raw/${name}`)
    return data
}
