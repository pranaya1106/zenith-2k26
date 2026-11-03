import { spawn } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'

const [w, h, out] = [Number(process.argv[2]), Number(process.argv[3]), process.argv[4]]
mkdirSync(out, { recursive: true })
const chrome = spawn(
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  [
    '--headless=new',
    '--remote-debugging-port=9336',
    `--window-size=${w},${h}`,
    '--user-data-dir=' + process.env.TEMP + '\\chrome-az-' + Date.now(),
    'about:blank',
  ],
  { stdio: 'ignore' },
)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let targets
for (let i = 0; i < 40; i++) {
  try {
    targets = await (await fetch('http://127.0.0.1:9336/json')).json()
    if (targets.length) break
  } catch {}
  await sleep(250)
}
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const pending = new Map()
const errors = []
ws.onmessage = (m) => {
  const d = JSON.parse(m.data)
  if (d.id && pending.has(d.id)) pending.get(d.id)(d.result)
  else if (d.method === 'Runtime.exceptionThrown') errors.push(JSON.stringify(d.params).slice(0, 400))
}
const send = (method, params = {}) =>
  new Promise((r) => {
    const i = ++id
    pending.set(i, r)
    ws.send(JSON.stringify({ id: i, method, params }))
  })
await send('Runtime.enable')
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 600 })
await send('Page.navigate', { url: 'http://localhost:5199/#x' })
await sleep(3000)
// fractions of the runway's scroll range (section top at viewport top = 0)
const info = await send('Runtime.evaluate', {
  expression:
    'JSON.stringify({top:document.querySelector(".zenith__runway").getBoundingClientRect().top+scrollY,h:document.querySelector(".zenith__runway").offsetHeight,vh:innerHeight})',
})
if (!info.result.value) { console.log(JSON.stringify(info).slice(0,400), errors.join('\n')); chrome.kill(); process.exit(1) }
const { top, h: rh, vh } = JSON.parse(info.result.value)
const startY = top - vh * 0.75
const endY = top + rh - vh
for (const f of [0.15, 0.4, 0.7, 1.0]) {
  const y = Math.round(startY + (endY - startY) * f)
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` })
  await sleep(1800)
  const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70 })
  writeFileSync(`${out}\\az_${String(f).replace('.', '_')}.jpg`, Buffer.from(r.data, 'base64'))
}
const dbg = await send('Runtime.evaluate', {
  expression:
    "(()=>{const s=document.querySelector('.zenith__shape');const i=s.querySelector('img');const c=getComputedStyle(s);return JSON.stringify({r:s.getBoundingClientRect(),tf:s.style.transform,ctf:c.transform,vis:c.visibility,op:c.opacity,nw:i.naturalWidth,ir:i.getBoundingClientRect()})})()",
})
console.log(dbg.result.value)
console.log('errors', errors.length, errors.join('\n'))
chrome.kill()
process.exit(0)

