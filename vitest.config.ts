// vitest.config.ts (or vite.config.ts)
import { defineConfig, loadEnv } from 'vite';

export default defineConfig({
    test: {
        alias: {
            "@": "/src"
        },
        env: loadEnv('', process.cwd(), ''),
    },
});
