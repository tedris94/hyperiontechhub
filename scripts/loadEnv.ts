import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

/** Load `.env.local` then `.env` (same order as Next.js). */
export function loadProjectEnv(): string {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  dotenv.config({ path: path.join(root, '.env.local') })
  dotenv.config({ path: path.join(root, '.env') })
  return root
}
