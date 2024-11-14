import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('pvault api!')
})

export default app
