import { HTTPException } from "hono/http-exception"
import { getFile, upsert } from "../../../server/gist-file"
import { describe, it, expect } from 'vitest'
import { app } from './route'

describe('User', () => {

    it("POST signup", async () => {
        const res = await app.request('/api/hello', {
        })
        console.log(res.status)
        expect(res.status).toBe(200)
    })
    it("POST signup ", async () => {
        const res = await app.request('/api/user/signup', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                username: "pvault",
                password: "12345"
            })
        })
        expect(res.status).toBe(400)
    })
    it("POST signup with new user", async () => {
        const res = await app.request('/api/user/signup', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                username: "pvault-1",
                password: "12345"
            })
        })
        expect(res.status).toBe(200)
    })

})

