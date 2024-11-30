import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { logger } from 'hono/logger'
import { env } from '@/server/env'
import { HTTPException } from 'hono/http-exception'
import { decode, sign, verify } from 'hono/jwt'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { signupVerify } from '@/server/utils'
import { remove, upsert } from '@/server/github'
export const runtime = 'edge'

const app = new Hono().basePath('/api')
app.use(logger())
app.get('/hello', (c) => {
    // throw new HTTPException(401, { message: "some error", cause: "cause:any" })
    return c.json({
        message: 'Hello PVault!'
    })
})


app.post('/user/signin', (c) => {
    const { jwtSecret } = env

    return c.json({
        message: 'Hello PVault!',
    })
})
app.post('/user/signup', zValidator('json', z.object({
    username: z.string().min(3),
    password: z.string().min(5)
}), (parsed, c) => {
    if (!parsed.success) {
        return c.json({
            error: {
                message: "Invalid input",
                detail: parsed.error
            }
        }, 400)
    }
}), async (c) => {
    const { jwtSecret } = env
    const { username, password } = c.req.valid('json')
    //check username not exist
    await signupVerify(username)
    //create gist 
    const res = await upsert(username, JSON.stringify({
        collections: []
    }))

    //gen jwt token


    return c.json({
        message: 'Hello PVault!',
        res
    })
})
app.post('/user/change-password', (c) => {
    return c.json({
        message: 'Hello PVault!',
    })
})
app.delete('/user/:username', async (c) => {
    const { username } = c.req.param()
    const res = await remove(username)
    return c.json({
        message: 'Hello PVault!',
        res
    })
})
// -------data---------
app.get('/user/:name/collections', (c) => {
    return c.json({
        message: 'Hello PVault!',
    })
})
app.patch('/user/:name/collections', (c) => {
    return c.json({
        message: 'Hello PVault!',
    })
})

app.onError((err, c) => {
    console.log(err)
    if (err instanceof HTTPException) {
        return c.json({
            error: {
                message: err.message
            }
        }, err.status)
    }
    return c.json({ error: { message: err.message } }, 500)
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)
export { app }