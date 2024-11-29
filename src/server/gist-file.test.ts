import { HTTPException } from "hono/http-exception"
import { getFile, upsert } from "./gist-file"
import { describe, it, expect } from 'vitest'


describe('Gist tests', () => {
    it("file exist", async () => {
        await expect(getFile('pvault')).resolves.toBeDefined()
    })
    it("file not exist", async () => {
        await expect(getFile('pvault-random-value')).rejects.toThrow("Not found")
        try {
            expect(getFile('pvault-random-value'))
        } catch (error: any) {
            expect(error).toBeInstanceOf(HTTPException)
            expect(error.message).toBe("Not found")
            expect(error.statusCode).toBe(404)
        }
    })

})

