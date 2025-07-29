import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve, parse, basename } from 'path'
import * as fs from 'fs'
import crypto from 'crypto'

const rootPaths = fs.readdirSync('src').reduce((out, item) => {
    const parsed = parse(item)
    return { ...out, [parsed.name]: resolve('src', item) }
}, {})

export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 3000,
        open: 'http://localhost:3000',
        hmr: {
            host: 'localhost',
            port: 80,
            protocol: 'ws',
        },
    },
    css: {
        modules: {
            scopeBehaviour: 'local',
            generateScopedName: (name: string, filename: string) =>
                `${basename(filename, '.module.css')}__${name}__${crypto
                    .createHash('sha256')
                    .update(filename)
                    .digest('hex')
                    .substring(0, 5)}`,
        },
    },
    resolve: {
        alias: rootPaths,
    },
})
