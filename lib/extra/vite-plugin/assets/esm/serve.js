import { Worker } from 'worker_threads'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const workerPath = resolve(__filename, '../worker.js')

/**
 * Renders a given path to HTML by spawning a worker
 * @param {string} path
 * @returns {Promise<any>}
 */
export const render = (path = '/') =>
    new Promise((resolveWorker, reject) => {
        const worker = new Worker(workerPath, {
            workerData: { url: path },
        })

        worker.once('message', resolveWorker)
        worker.once('error', reject)
        worker.once('exit', code => {
            if (code !== 0) reject(new Error(`Worker exited with code ${code}`))
        })
    })

/**
 * CLI support (preserves old interface)
 */
if (process.argv.includes('render')) {
    const url = process.argv[process.argv.indexOf('render') + 1] || '/'
    render(url).then(o => console.log(o.html))
}
