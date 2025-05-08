import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve, parse } from 'path'
import * as fs from 'fs'

const rootPaths = fs.readdirSync('src').reduce((out, item) => {
    const parsed = parse(item)
    return { ...out, [parsed.name]: resolve('src', item) }
}, {})

export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        port: 3000,
        open: 'http://localhost:3000',
    },
    resolve: {
        alias: rootPaths,
    },
})
