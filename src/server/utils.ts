import { getFile } from "@/server/gist-file";
import { HTTPException } from "hono/http-exception";

export async function signupVerify(name: string): Promise<void> {
    try {
        await getFile(name); // Check if the file exists
        // If no exception, username already exists
        throw new HTTPException(400, { message: 'Username already exists' });
    } catch (error) {
        // Handle known 404 errors (file not found)
        if (error instanceof HTTPException && error.status === 404) {
            return; // Username is available
        }
        // Rethrow unexpected errors
        throw error;
    }
}