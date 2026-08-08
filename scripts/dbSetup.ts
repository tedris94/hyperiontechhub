import { spawn } from 'child_process'
import { loadProjectEnv } from './loadEnv.js'

function run(script: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', script], {
      stdio: 'inherit',
      shell: true,
      env: process.env,
    })
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`npm run ${script} exited with ${code}`))
    })
  })
}

async function main() {
  loadProjectEnv()
  console.log('[db:setup] reset → migrate → seed (Supabase Postgres)')
  await run('db:reset')
  try {
    await run('migrate')
  } catch {
    console.warn('[db:setup] migrate failed — trying migrate:chunked…')
    await run('migrate:chunked')
    await run('migrate')
  }
  await run('seed')
  console.log('[db:setup] Done.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
