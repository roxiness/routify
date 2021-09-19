import { spawn } from 'child_process'
test('spawn test', async () => {
    spawn('ls', ['-l'], { stdio: 'inherit' })
})
