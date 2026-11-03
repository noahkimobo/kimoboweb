import { spawnSync } from 'node:child_process'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const landing = path.join(root, 'daraja', 'landing')
const output = path.join(landing, 'dist')
const publicSite = path.join(root, 'public', 'daraja')

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell: false })
  if (result.error) throw result.error
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

if (process.platform === 'win32') {
  run(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', 'npm run build'], landing)
} else {
  run('npm', ['run', 'build'], landing)
}

const healthCheckSource = path.join(landing, 'Social Media Health Check.html')
const healthCheckHtml = await readFile(healthCheckSource, 'utf8')
const healthCheckOutput = path.join(output, 'social-media-health-check.html')
const whatsappNumber = process.env.PUBLIC_WHATSAPP_NUMBER ?? ''
const configuredWhatsApp = /^\d{10,15}$/.test(whatsappNumber) ? whatsappNumber : ''
const whatsappPlaceholder = 'var WHATSAPP="";'

if (!healthCheckHtml.includes(whatsappPlaceholder)) {
  throw new Error('Social media self-audit WhatsApp placeholder was not found.')
}

await writeFile(
  healthCheckOutput,
  healthCheckHtml.replace(
    whatsappPlaceholder,
    `var WHATSAPP=${JSON.stringify(configuredWhatsApp)};`,
  ),
)

await rm(publicSite, { recursive: true, force: true })
await mkdir(publicSite, { recursive: true })
await cp(output, publicSite, { recursive: true })

run(process.execPath, [path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next'), 'build'], root)
