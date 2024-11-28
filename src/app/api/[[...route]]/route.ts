import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { logger } from 'hono/logger'
import { env } from '@/server/env'
import { HTTPException } from 'hono/http-exception'

export const runtime = 'edge'


const app = new Hono().basePath('/api')
app.use(logger())
app.get('/', (c) => {
    // throw new HTTPException(401, { message: "some error", cause: "cause:any" })

    return c.json({
        message: 'Hello PVault!',
        env
    })
})

app.post('/user/signin', (c) => {
    return c.json({
        message: 'Hello PVault!',
    })
})

app.post('/user/signup', (c) => {
    return c.json({
        message: 'Hello PVault!',
    })
})
app.post('/user/change-password', (c) => {
    return c.json({
        message: 'Hello PVault!',
    })
})
// -------data---------
app.get('/data', (c) => {
    return c.json({
        message: 'Hello PVault!',
    })
})
app.post('/data', (c) => {
    return c.json({
        message: 'Hello PVault!',
    })
})

export const GET = handle(app)
export const POST = handle(app)