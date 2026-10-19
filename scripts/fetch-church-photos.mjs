/**
 * Downloads New Life Deliverance Tabernacle's own photos (from their current site's image host)
 * into public/images/church so the new site self-hosts them and never hotlinks.
 * Runs automatically before `npm run dev` and `npm run build`. Safe to re-run: skips files already present.
 * If the network is unavailable it warns and exits 0; the site shows branded placeholders until photos exist.
 */
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'images', 'church')
const manifest = JSON.parse(await readFile(join(root, 'src', 'data', 'photos.json'), 'utf8'))
const HOST = 'https://img77.uenicdn.com/image/upload'
const width = (name) => (/^(logo)/.test(name) ? 600 : /^(flyer)/.test(name) ? 1200 : 1600)

await mkdir(outDir, { recursive: true })

async function exists(p) { try { return (await stat(p)).size > 1000 } catch { return false } }

async function get(url, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    try {
      const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 30000)
      const res = await fetch(url, { signal: ctrl.signal }); clearTimeout(t)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return Buffer.from(await res.arrayBuffer())
    } catch (e) { if (i === tries) throw e; await new Promise((r) => setTimeout(r, 800 * i)) }
  }
}

let ok = 0, skipped = 0, failed = 0
const queue = [...manifest]
async function worker() {
  for (let p = queue.shift(); p; p = queue.shift()) {
    const file = join(outDir, `${p.name}.${p.ext}`)
    if (await exists(file)) { skipped++; continue }
    const q = p.ext === 'png' ? '' : ',q_auto:good'
    try { await writeFile(file, await get(`${HOST}/c_limit,w_${width(p.name)}${q}/${p.v}/business/${p.id}.${p.ext}`)); ok++ }
    catch (e) { failed++; console.warn(`  photo not downloaded: ${p.name} (${e.message})`) }
  }
}
await Promise.all(Array.from({ length: 6 }, worker))
console.log(`church photos: ${ok} downloaded, ${skipped} already present, ${failed} failed (of ${manifest.length})`)
