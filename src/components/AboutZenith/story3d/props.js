import {
  AdditiveBlending,
  BufferGeometry,
  CapsuleGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  EdgesGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LatheGeometry,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Path,
  Quaternion,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Shape,
  SphereGeometry,
  SplineCurve,
  SpriteMaterial,
  Sprite,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
} from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { PAL } from './kit'

/*
  One scene per stop on the road, each built from physically based materials
  (brushed metal, matte plastic, glass, painted surfaces, lit screens) on a
  concrete pad with a thin light strip:

    0 Student Community Day   tiered seating around a network globe
    1 Discussion Panels       a panel table, chairs and a backdrop screen
    2 Speaker Sessions        a stage with podium, LED screen and spotlights
    3 Goodies & Swags         gift boxes, tote bag, bottle, notebook, tees
    4 Hackathon               a laptop running code, coffee and cans
    5 Ideation                an ideas board and a glowing bulb
    6 Prototyping             two monitors of code and a running app, phone, tablet
    7 Deployment              a cloud above stacks of servers
    8 Evaluation / Jury       the judges' desk, chairs, score sheets and a results screen
    9 Prize Pool              a winners' podium with a gold trophy

  Every builder returns { group, update(dt, time, active) }. `active` eases
  from 0 to 1 while the camera is at that stop and drives its own animation.
*/

// ---- shape helpers (geometries are shared through the kit) ----
const rbox = (k, w, h, d, r) =>
  k.geo(
    `rb${w},${h},${d},${r}`,
    () => new RoundedBoxGeometry(w, h, d, 2, r ?? Math.min(0.04, Math.min(w, h, d) / 2.6)),
  )
const cyl = (k, rt, rb, h, s = 32) =>
  k.geo(`cyl${rt},${rb},${h},${s}`, () => new CylinderGeometry(rt, rb, h, s))
const sph = (k, r, w = 24, h = 16) => k.geo(`sph${r},${w},${h}`, () => new SphereGeometry(r, w, h))
const tor = (k, r, t, rs = 10, ts = 40, arc = Math.PI * 2) =>
  k.geo(`tor${r},${t},${rs},${ts},${arc}`, () => new TorusGeometry(r, t, rs, ts, arc))
const cone = (k, r, h, s = 24, open = false) =>
  k.geo(`cone${r},${h},${s},${open}`, () => new ConeGeometry(r, h, s, 1, open))
const plane = (k, w, h) => k.geo(`pl${w},${h}`, () => new PlaneGeometry(w, h))

const circle = (k, r) => k.geo(`circle${r}`, () => new CircleGeometry(r, 48))
const clamp01 = (v) => Math.max(0, Math.min(1, v))

// ---- canvas-drawn screens and signs ----
function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill
  ctx.beginPath()
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r)
  else ctx.rect(x, y, w, h)
  ctx.fill()
}

/** The panel stage backdrop: a title, large soft circles and a row of speaker portraits */
function panelBackdropTexture(k) {
  return k.tex('panelBackdrop', 512, 270, (ctx, w, h) => {
    const bg = ctx.createLinearGradient(0, 0, w, h)
    bg.addColorStop(0, '#0e0630')
    bg.addColorStop(1, '#2b1578')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)
    ctx.lineWidth = 2
    ;[
      [w * 0.86, h * 0.2, 150, 'rgba(251,87,166,0.28)'],
      [w * 0.86, h * 0.2, 105, 'rgba(251,87,166,0.2)'],
      [w * 0.86, h * 0.2, 60, 'rgba(251,87,166,0.14)'],
      [w * 0.1, h * 0.95, 130, 'rgba(32,227,153,0.2)'],
      [w * 0.1, h * 0.95, 85, 'rgba(32,227,153,0.14)'],
    ].forEach(([x, y, r, color]) => {
      ctx.strokeStyle = color
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.stroke()
    })
    ctx.fillStyle = '#ffffff'
    ctx.font = '400 36px "Plus Jakarta Sans", Arial, sans-serif'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText('Panel Discussion', 36, 78)
    roundRect(ctx, 36, 96, 110, 3, 1.5, '#20e399')
    roundRect(ctx, 36, 118, 220, 7, 3.5, 'rgba(255,255,255,0.28)')
    roundRect(ctx, 36, 136, 160, 7, 3.5, 'rgba(255,255,255,0.2)')
  })
}

/** The event mark printed on the front of the lectern */
function lecternMarkTexture(k) {
  return k.tex('lecternMark', 256, 128, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#f4f2f6'
    ctx.font = '500 46px "Plus Jakarta Sans", Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText("ZENITH '26", w / 2, h / 2 - 8)
    roundRect(ctx, w / 2 - 34, h / 2 + 24, 68, 3, 1.5, '#20e399')
  })
}

/** A round, soft light on a transparent square (stage light pools, screen spill). `stops` are [position, css colour]. */
function softTexture(k, key, stops) {
  return k.tex(`soft${key}`, 128, 128, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
    stops.forEach(([at, color]) => g.addColorStop(at, color))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  })
}

/** A faint diagonal reflection across the glass of a screen */
function glareTexture(k) {
  return k.tex('glare', 256, 144, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, 'rgba(255,255,255,0.0)')
    g.addColorStop(0.35, 'rgba(255,255,255,0.05)')
    g.addColorStop(0.5, 'rgba(255,255,255,0.0)')
    g.addColorStop(1, 'rgba(255,255,255,0.0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  })
}

/** A keynote title slide: small label, a light-weight headline, a rule and a subtitle */
function keynoteTexture(k) {
  return k.tex('keynote', 1024, 556, (ctx, w, h) => {
    const bg = ctx.createLinearGradient(0, 0, w, h)
    bg.addColorStop(0, '#08031f')
    bg.addColorStop(1, '#1a0e55')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)
    const glow = ctx.createRadialGradient(w * 0.82, h * 0.78, 0, w * 0.82, h * 0.78, h * 0.9)
    glow.addColorStop(0, 'rgba(138,99,245,0.45)')
    glow.addColorStop(1, 'rgba(138,99,245,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'
    ctx.lineWidth = 2
    for (let i = 1; i <= 4; i += 1) {
      ctx.beginPath()
      ctx.arc(w * 0.82, h * 0.78, i * 120, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.textBaseline = 'alphabetic'
    ctx.textAlign = 'left'
    const family = '"Plus Jakarta Sans", Arial, sans-serif'
    if ('letterSpacing' in ctx) ctx.letterSpacing = '4px'
    ctx.fillStyle = '#20e399'
    ctx.font = `600 20px ${family}`
    ctx.fillText('AWS STUDENT COMMUNITY DAY', 72, 120)
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
    ctx.fillStyle = '#f4f2f6'
    ctx.font = `300 66px ${family}`
    ctx.fillText('The future of cloud,', 72, 238)
    ctx.fillText('built by students.', 72, 316)
    roundRect(ctx, 72, 356, 72, 3, 1.5, '#20e399')
    ctx.fillStyle = 'rgba(244,242,246,0.6)'
    ctx.font = `400 24px ${family}`
    ctx.fillText("Keynote  ·  ZENITH '26", 72, 410)
    ctx.fillStyle = 'rgba(244,242,246,0.35)'
    ctx.font = `500 18px ${family}`
    ctx.textAlign = 'right'
    ctx.fillText('01', w - 64, h - 48)
  })
}

/** A code editor window: title bar, file tree, tabs, syntax-coloured code, minimap and status bar */
function ideTexture(k) {
  const texture = k.tex('ide', 1024, 640, (ctx, w, h) => {
    const mono = '"JetBrains Mono", Consolas, "Courier New", monospace'
    ctx.fillStyle = '#100c24'
    ctx.fillRect(0, 0, w, h)

    // title bar
    ctx.fillStyle = '#0b0819'
    ctx.fillRect(0, 0, w, 30)
    ;['#fb57a6', '#ffc83d', '#20e399'].forEach((c, i) => {
      ctx.fillStyle = c
      ctx.beginPath()
      ctx.arc(20 + i * 20, 15, 5, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.fillStyle = 'rgba(244,242,246,0.55)'
    ctx.font = `13px ${mono}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('deploy.ts — zenith-26', w / 2, 16)

    // activity bar and explorer
    ctx.fillStyle = '#0b0819'
    ctx.fillRect(0, 30, 52, h - 56)
    ;[0, 1, 2, 3].forEach((i) => roundRect(ctx, 16, 52 + i * 46, 20, 20, 5, i === 0 ? '#f4f2f6' : 'rgba(244,242,246,0.3)'))
    ctx.fillStyle = '#130e2b'
    ctx.fillRect(52, 30, 214, h - 56)
    ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(244,242,246,0.5)'
    ctx.font = `600 12px ${mono}`
    ctx.fillText('EXPLORER', 70, 56)
    const tree = [
      [0, 'zenith-26', '#8a63f5'],
      [1, 'src', '#8a63f5'],
      [2, 'deploy.ts', '#20e399'],
      [2, 'stack.ts', '#e9e6f2'],
      [2, 'idea.ts', '#e9e6f2'],
      [1, 'package.json', '#ffc83d'],
      [1, 'README.md', '#e9e6f2'],
    ]
    tree.forEach(([depth, name, color], i) => {
      const y = 84 + i * 28
      if (name === 'deploy.ts') {
        ctx.fillStyle = 'rgba(138,99,245,0.22)'
        ctx.fillRect(52, y - 14, 214, 28)
      }
      roundRect(ctx, 72 + depth * 16, y - 5, 10, 10, 2, color)
      ctx.fillStyle = 'rgba(244,242,246,0.85)'
      ctx.font = `14px ${mono}`
      ctx.fillText(name, 92 + depth * 16, y + 1)
    })

    // tabs
    ctx.fillStyle = '#0d0a1e'
    ctx.fillRect(266, 30, w - 266, 38)
    ctx.fillStyle = '#100c24'
    ctx.fillRect(266, 30, 150, 38)
    ctx.fillStyle = '#20e399'
    ctx.fillRect(266, 30, 150, 2)
    ctx.fillStyle = 'rgba(244,242,246,0.9)'
    ctx.font = `14px ${mono}`
    ctx.fillText('deploy.ts', 290, 50)
    ctx.fillStyle = 'rgba(244,242,246,0.4)'
    ctx.fillText('stack.ts', 442, 50)

    // code
    const lines = [
      'import { Stack, Function } from "@aws/cdk"',
      '',
      'const app = new Stack("zenith-26")',
      '',
      'app.add(new Function("ideate", {',
      '  runtime: "nodejs20",',
      '  memory: 512,',
      '  handler: async (team) => {',
      '    const idea = await team.brainstorm()',
      '    return build(idea)',
      '  },',
      '}))',
      '',
      'await app.deploy({ region: "ap-south-1" })',
      '// ship it',
    ]
    const palette = { kw: '#fb57a6', str: '#20e399', num: '#ffc83d', cm: '#6b6490', fn: '#8ab4ff', pl: '#e9e6f2' }
    const token = /("[^"]*")|(\/\/.*)|(\b\d+\b)|(\b(?:import|from|const|new|await|async|return)\b)|([A-Za-z_]\w*(?=\())|(.)/g
    const codeX = 330
    const top = 100
    const lineHeight = 29
    ctx.font = `17px ${mono}`
    let cursor = { x: codeX, y: top }
    lines.forEach((text, i) => {
      const y = top + i * lineHeight
      ctx.fillStyle = 'rgba(244,242,246,0.28)'
      ctx.textAlign = 'right'
      ctx.fillText(String(i + 1), 296, y)
      ctx.textAlign = 'left'
      let x = codeX
      let match
      token.lastIndex = 0
      while ((match = token.exec(text)) !== null) {
        const kind = match[1] ? 'str' : match[2] ? 'cm' : match[3] ? 'num' : match[4] ? 'kw' : match[5] ? 'fn' : 'pl'
        ctx.fillStyle = palette[kind]
        ctx.fillText(match[0], x, y)
        x += ctx.measureText(match[0]).width
      }
      cursor = { x, y }
    })
    // where the blinking caret sits: just after the last line
    const canvas = ctx.canvas
    canvas.__cursor = { x: cursor.x + 6, y: cursor.y }

    // minimap
    ctx.fillStyle = '#0d0a1e'
    ctx.fillRect(w - 96, 68, 96, h - 94)
    let seed = 11
    const rand = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    for (let i = 0; i < 26; i += 1) {
      roundRect(ctx, w - 84 + (i % 4) * 4, 82 + i * 9, 10 + rand() * 50, 4, 2, ['#fb57a6', '#20e399', '#8a63f5', '#e9e6f2'][Math.floor(rand() * 4)] + '88')
    }

    // status bar
    ctx.fillStyle = '#4a2fb0'
    ctx.fillRect(0, h - 26, w, 26)
    ctx.fillStyle = '#f4f2f6'
    ctx.font = `12px ${mono}`
    ctx.fillText('  main   0 errors   0 warnings', 14, h - 12)
    ctx.textAlign = 'right'
    ctx.fillText('Ln 15, Col 11    TypeScript    UTF-8  ', w - 14, h - 12)
  })
  const caret = texture.image.__cursor
  texture.userData.cursor = { u: caret.x / 1024, v: (caret.y - 2) / 640 }
  return texture
}

/** A lock screen for the phone */
function phoneTexture(k) {
  return k.tex('phone', 128, 256, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, '#1c0b5a')
    g.addColorStop(1, '#fb57a6')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#ffffff'
    ctx.font = '300 54px "Plus Jakarta Sans", Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('9:41', w / 2, 72)
    roundRect(ctx, w / 2 - 28, h - 24, 56, 4, 2, 'rgba(255,255,255,0.8)')
  })
}

/** A used whiteboard: marker mind map with sticky notes that cast soft shadows */
function boardTexture(k) {
  return k.tex('board', 1024, 614, (ctx, w, h) => {
    const bg = ctx.createLinearGradient(0, 0, 0, h)
    bg.addColorStop(0, '#f6f4fa')
    bg.addColorStop(1, '#ebe8f2')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)
    // faint ghost marks where things were rubbed out
    ctx.fillStyle = 'rgba(120,110,150,0.05)'
    ;[
      [140, 120, 160, 40],
      [700, 470, 220, 50],
      [380, 520, 180, 36],
    ].forEach(([x, y, a, b]) => {
      ctx.beginPath()
      ctx.ellipse(x, y, a, b, -0.3, 0, Math.PI * 2)
      ctx.fill()
    })

    const script = '"Segoe Script", "Bradley Hand", "Comic Sans MS", cursive'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // mind map in blue marker: a central bubble with branches
    ctx.strokeStyle = '#1d5fd1'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.ellipse(w / 2, h / 2, 120, 62, -0.04, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = '#1d5fd1'
    ctx.font = `700 54px ${script}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('IDEA', w / 2, h / 2 + 4)
    const branch = (x1, y1, cx, cy, x2, y2) => {
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.quadraticCurveTo(cx, cy, x2, y2)
      ctx.stroke()
    }
    branch(w / 2 - 110, h / 2 - 28, 360, 160, 290, 150)
    branch(w / 2 + 110, h / 2 - 28, 660, 150, 740, 150)
    branch(w / 2 - 100, h / 2 + 38, 360, 440, 280, 450)
    branch(w / 2 + 100, h / 2 + 38, 680, 440, 760, 450)
    // red arrow and underline
    ctx.strokeStyle = '#d33a3a'
    ctx.lineWidth = 4
    branch(450, 540, 520, 570, 600, 540)
    ctx.beginPath()
    ctx.moveTo(582, 528)
    ctx.lineTo(602, 541)
    ctx.lineTo(580, 552)
    ctx.stroke()
    // green tick and a small bulb doodle
    ctx.strokeStyle = '#1b9e5a'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(900, 96)
    ctx.lineTo(920, 118)
    ctx.lineTo(958, 70)
    ctx.stroke()
    ctx.strokeStyle = '#222230'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(112, 86, 22, Math.PI * 0.8, Math.PI * 2.2)
    ctx.stroke()
    ctx.strokeRect(100, 108, 24, 12)

    // sticky notes: drop shadow, slight rotation, a curled corner and pencil scribbles
    const notes = [
      [210, 150, '#ffd45c', -0.08],
      [800, 150, '#ff8fc1', 0.07],
      [190, 450, '#6df0bd', 0.05],
      [830, 450, '#b59bff', -0.06],
    ]
    notes.forEach(([x, y, color, turn]) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(turn)
      ctx.shadowColor = 'rgba(30,20,70,0.35)'
      ctx.shadowBlur = 16
      ctx.shadowOffsetX = 4
      ctx.shadowOffsetY = 7
      ctx.fillStyle = color
      ctx.fillRect(-82, -82, 164, 164)
      ctx.shadowColor = 'transparent'
      const sheen = ctx.createLinearGradient(-82, -82, 82, 82)
      sheen.addColorStop(0, 'rgba(255,255,255,0.35)')
      sheen.addColorStop(0.6, 'rgba(255,255,255,0)')
      sheen.addColorStop(1, 'rgba(0,0,0,0.08)')
      ctx.fillStyle = sheen
      ctx.fillRect(-82, -82, 164, 164)
      ctx.fillStyle = 'rgba(40,30,70,0.5)'
      ;[-46, -18, 10, 38].forEach((ly, i) => {
        ctx.fillRect(-58, ly, 116 - i * 22, 5)
      })
      ctx.restore()
    })
  })
}

/** A large number on a plain card or plate */
function numberTexture(k, text, background, color) {
  return k.tex(`num${text}${background}${color}`, 128, 128, (ctx, w, h) => {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = color
    ctx.font = '800 92px "Plus Jakarta Sans", Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, w / 2, h / 2 + 6)
  })
}

// ---- parts used by several scenes ----

/** A raised concrete platform: a wide footing, a chamfered slab and a darker top deck */
function plinth(k, g, radius = 2.1) {
  // One turned body with rounded top and bottom edges and a slight taper,
  // in a polished finish that catches the sky reflections
  const body = k.geo(`plinth${radius}`, () => {
    const bottom = radius * 1.1
    const top = radius * 1.04
    const fillet = 0.09
    const profile = [new Vector2(0, 0), new Vector2(bottom - 0.05, 0)]
    for (let i = 1; i <= 6; i += 1) {
      const a = (i / 6) * (Math.PI / 2)
      profile.push(new Vector2(bottom - 0.05 + Math.sin(a) * 0.05, 0.05 - Math.cos(a) * 0.05))
    }
    profile.push(new Vector2(top, 0.34 - fillet))
    for (let i = 1; i <= 8; i += 1) {
      const a = (i / 8) * (Math.PI / 2)
      profile.push(new Vector2(top - fillet + Math.cos(a) * fillet, 0.34 - fillet + Math.sin(a) * fillet))
    }
    profile.push(new Vector2(0, 0.34))
    return new LatheGeometry(profile, 96)
  })
  k.put(g, body, k.std(0x383353, { rough: 0.26, metal: 0.35, envIntensity: 1.7, double: true }), 0, 0, 0)
}

/** An office chair seen from the front: seat, back, post and base */
function chair(k, parent, x, z, scale = 1) {
  const c = new Group()
  c.position.set(x, 0.32, z)
  c.scale.setScalar(scale)
  const fabric = k.std(PAL.fabric, { rough: 0.95 })
  k.put(c, rbox(k, 0.58, 0.1, 0.56, 0.04), fabric, 0, 0.62, 0)
  k.put(c, rbox(k, 0.56, 0.62, 0.08, 0.04), fabric, 0, 1.0, -0.27)
  k.put(c, cyl(k, 0.035, 0.035, 0.42, 12), k.metal(PAL.steel, 0.3), 0, 0.38, 0)
  k.put(c, cyl(k, 0.3, 0.3, 0.04, 24), k.std(PAL.charcoal, { rough: 0.5, metal: 0.4 }), 0, 0.12, 0)
  parent.add(c)
  return c
}

/** A tall cone of light, drawn additively */
function lightCone(k, parent, x, y, z, radius, height, flip = false) {
  // Its own material, so each cone can fade on its own
  const material = k.track(
    new MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.04,
      blending: AdditiveBlending,
      depthWrite: false,
      side: DoubleSide,
      fog: false,
    }),
  )
  const mesh = k.put(parent, cone(k, radius, height, 28, true), material, x, y, z)
  if (flip) mesh.rotation.x = Math.PI
  return { mesh, material }
}

// ---------------------------------------------------------------------------
// 0. AWS Student Community Day: tiered seating around a network globe
// ---------------------------------------------------------------------------
function community(k) {
  const group = new Group()
  plinth(k, group, 2.4)

  const arc = (inner, outer, height) =>
    k.geo(`tier${inner},${outer},${height}`, () => {
      const shape = new Shape()
      const a0 = Math.PI / 2 - 1.75
      const a1 = Math.PI / 2 + 1.75
      shape.absarc(0, 0, outer, a0, a1, false)
      shape.absarc(0, 0, inner, a1, a0, true)
      shape.closePath()
      const g = new ExtrudeGeometry(shape, { depth: height, bevelEnabled: false, curveSegments: 40 })
      g.rotateX(-Math.PI / 2)
      return g
    })
  // Concrete steps, then individual seats on them, all facing the globe
  const stepMaterial = k.std(0x3b3656, { rough: 0.88 })
  const tiers = [
    [1.3, 1.73, 0.2],
    [1.75, 2.05, 0.38],
    [2.07, 2.36, 0.56],
  ]
  tiers.forEach(([inner, outer, height]) => k.put(group, arc(inner, outer, height), stepMaterial, 0, 0.34, 0))

  const seatFabric = k.std(0x4a3aa6, { rough: 0.85 })
  const frame = k.metal(0x3a3650, 0.4)
  const rows = tiers.map(([inner, outer, height]) => {
    const r = (inner + outer) / 2 + 0.02
    return { r, count: Math.floor((3.3 * r) / 0.34), top: 0.34 + height }
  })
  const seatTotal = rows.reduce((sum, row) => sum + row.count, 0)
  const cushions = new InstancedMesh(rbox(k, 0.28, 0.06, 0.26, 0.025), seatFabric, seatTotal)
  const backrests = new InstancedMesh(rbox(k, 0.28, 0.24, 0.05, 0.02), seatFabric, seatTotal)
  const legs = new InstancedMesh(cyl(k, 0.035, 0.045, 0.16, 8), frame, seatTotal)
  const seatMatrix = new Matrix4()
  const seatTurn = new Quaternion()
  const seatAt = new Vector3()
  const one = new Vector3(1, 1, 1)
  const upAxis = new Vector3(0, 1, 0)
  let seatIndex = 0
  rows.forEach(({ r, count, top }) => {
    for (let i = 0; i < count; i += 1) {
      const angle = Math.PI / 2 - 1.65 + (i / (count - 1)) * 3.3
      const x = Math.cos(angle) * r
      const z = -Math.sin(angle) * r
      seatTurn.setFromAxisAngle(upAxis, Math.atan2(-x, -z))
      seatMatrix.compose(seatAt.set(x, top + 0.09, z), seatTurn, one)
      legs.setMatrixAt(seatIndex, seatMatrix)
      seatMatrix.compose(seatAt.set(x, top + 0.19, z), seatTurn, one)
      cushions.setMatrixAt(seatIndex, seatMatrix)
      seatMatrix.compose(
        seatAt.set(x + Math.cos(angle) * 0.13, top + 0.34, z - Math.sin(angle) * 0.13),
        seatTurn,
        one,
      )
      backrests.setMatrixAt(seatIndex, seatMatrix)
      seatIndex += 1
    }
  })
  group.add(cushions, backrests, legs)

  // Hologram projector: a turned metal base with a lens that throws a faint beam up into the globe
  const projector = k.geo('projector', () => {
    // A smooth curve through the control points gives rounded, flowing edges
    const curve = new SplineCurve(
      [
        [0.9, 0],
        [0.97, 0.04],
        [0.96, 0.1],
        [0.86, 0.16],
        [0.7, 0.21],
        [0.58, 0.31],
        [0.5, 0.43],
        [0.49, 0.52],
        [0.55, 0.58],
        [0.6, 0.62],
        [0.55, 0.65],
        [0.46, 0.65],
      ].map(([x, y]) => new Vector2(x, y)),
    )
    const profile = [new Vector2(0, 0), ...curve.getPoints(80), new Vector2(0, 0.65)]
    return new LatheGeometry(profile, 96)
  })
  k.put(group, projector, k.std(0x2a2640, { rough: 0.16, metal: 0.9, envIntensity: 1.9, double: true }), 0, 0.34, 0)
  k.put(group, tor(k, 0.5, 0.02, 8, 56), k.metal(PAL.steel, 0.25), 0, 0.78, 0, Math.PI / 2)
  // Lens: dark glass with a soft mint glow, and a soft column of light above it
  k.put(group, cyl(k, 0.42, 0.42, 0.02, 48), k.std(0x0f2f2b, { rough: 0.15, glow: 0.7, glowColor: 0x20e399 }), 0, 1.0, 0)
  const lensGlow = k.glowSprite(0x6ff3cf, 1.9, 0.5)
  lensGlow.position.set(0, 1.08, 0)
  group.add(lensGlow)
  const projection = k.glowSprite(0x7ff0d8, 1.6, 0.3)
  projection.scale.set(1.1, 2.0, 1)
  projection.position.set(0, 1.55, 0)
  group.add(projection)

  // The globe: a mesh of nodes and links around a glowing core
  const globe = new Group()
  globe.position.y = 2.4
  group.add(globe)
  const ico = k.geo('globe', () => new IcosahedronGeometry(1, 2))
  const links = k.track(new LineSegments(
    k.track(new EdgesGeometry(ico)),
    k.track(new LineBasicMaterial({
      color: 0x8ff7de,
      transparent: true,
      opacity: 0.4,
      blending: AdditiveBlending,
      depthWrite: false,
    })),
  ))
  globe.add(links)
  const seen = new Map()
  const vertices = ico.attributes.position
  for (let i = 0; i < vertices.count; i += 1) {
    const key = [vertices.getX(i), vertices.getY(i), vertices.getZ(i)].map((v) => v.toFixed(3)).join()
    if (!seen.has(key)) seen.set(key, [vertices.getX(i), vertices.getY(i), vertices.getZ(i)])
  }
  const nodes = new InstancedMesh(
    sph(k, 0.024, 10, 8),
    k.flat(0xcffff2, { transparent: true, opacity: 0.9, blending: AdditiveBlending, depthWrite: false }),
    seen.size,
  )
  const matrix = new Matrix4()
  let index = 0
  seen.forEach(([x, y, z]) => {
    matrix.makeTranslation(x, y, z)
    nodes.setMatrixAt(index, matrix)
    index += 1
  })
  globe.add(nodes)
  // A faint shell gives the globe volume, and a soft glow sits behind it
  k.put(
    globe,
    sph(k, 0.99, 40, 28),
    k.flat(0x8f6bff, { transparent: true, opacity: 0.07, blending: AdditiveBlending, depthWrite: false }),
  )
  const halo = k.glowSprite(0x8f6bff, 3.2, 0.25)
  globe.add(halo)

  return {
    group,
    update(dt, time, active) {
      globe.rotation.y += dt * (0.2 + active * 0.35)
      globe.rotation.x = Math.sin(time * 0.4) * 0.12
      halo.material.opacity = 0.16 + active * 0.14 + Math.sin(time * 2) * 0.02
      projection.material.opacity = 0.2 + active * 0.15
      lensGlow.material.opacity = 0.4 + active * 0.25
    },
  }
}

// ---------------------------------------------------------------------------
// 1. AWS Discussion Panels
// ---------------------------------------------------------------------------
function panels(k) {
  const group = new Group()
  plinth(k, group, 2.4)

  k.put(group, rbox(k, 4.3, 2.4, 0.14, 0.04), k.std(PAL.charcoal, { rough: 0.5, metal: 0.3 }), 0, 1.65, -1.4)
  k.put(group, plane(k, 4.0, 2.1), k.screen(panelBackdropTexture(k)), 0, 1.65, -1.32)

  // A rug under the seating, then four lounge armchairs in a shallow arc with
  // a small round side table between each pair, as on a conference panel stage
  k.put(group, rbox(k, 4.0, 0.02, 1.9, 0.01), k.std(0x2a2350, { rough: 1 }), 0, 0.35, 0.0)
  const leather = k.glossy(0x3d2f84, { rough: 0.32, clearcoat: 1, clearcoatRough: 0.1 })
  const cushion = k.glossy(0x5a47bd, { rough: 0.38, clearcoat: 0.7, clearcoatRough: 0.15 })
  const brass = k.std(0xffd98a, { rough: 0.14, metal: 1, envIntensity: 2.2 })
  const armchair = (x, z, turn) => {
    const c = new Group()
    c.position.set(x, 0.36, z)
    c.rotation.y = turn
    k.put(c, rbox(k, 0.66, 0.16, 0.6, 0.06), leather, 0, 0.5, 0)
    k.put(c, rbox(k, 0.56, 0.09, 0.52, 0.04), cushion, 0, 0.62, 0.02)
    const back = k.put(c, rbox(k, 0.66, 0.64, 0.14, 0.07), leather, 0, 0.9, -0.27)
    back.rotation.x = -0.14
    k.put(c, rbox(k, 0.54, 0.46, 0.06, 0.04), cushion, 0, 0.9, -0.2).rotation.x = -0.14
    ;[-0.37, 0.37].forEach((ax) => k.put(c, rbox(k, 0.1, 0.24, 0.56, 0.045), leather, ax, 0.68, -0.02))
    // Legs run up into a frame under the seat, so the chair stands on the rug
    k.put(c, rbox(k, 0.6, 0.05, 0.54, 0.02), brass, 0, 0.4, 0)
    ;[-0.26, 0.26].forEach((lx) =>
      [-0.22, 0.22].forEach((lz) => k.put(c, cyl(k, 0.026, 0.016, 0.42, 10), brass, lx, 0.21, lz)),
    )
    group.add(c)
  }
  ;[-1.725, -0.575, 0.575, 1.725].forEach((x) => armchair(x, -0.25, -x * 0.07))

  const glassMaterial = k.std(0xdfeaff, { rough: 0.05, opacity: 0.45, envIntensity: 1.6 })
  ;[-1.15, 0, 1.15].forEach((x) => {
    k.put(group, cyl(k, 0.17, 0.17, 0.03, 36), k.glossy(0xf1eef7, { rough: 0.2, clearcoat: 1, clearcoatRough: 0.05 }), x, 0.95, 0.3)
    k.put(group, cyl(k, 0.018, 0.018, 0.56, 10), brass, x, 0.65, 0.3)
    k.put(group, cyl(k, 0.14, 0.14, 0.025, 28), brass, x, 0.375, 0.3)
    k.put(group, cyl(k, 0.045, 0.038, 0.13, 20), glassMaterial, x, 1.03, 0.3)
  })

  const beams = [-1.95, 1.95].map((x) => {
    k.put(group, cyl(k, 0.1, 0.13, 0.12, 20), k.metal(PAL.steel, 0.3), x, 0.38, -1.15)
    // a soft wash of light up the backdrop, not a cone
    const wash = k.glowSprite(0xcfc4ff, 2.6, 0.12)
    wash.position.set(x, 1.1, -1.1)
    group.add(wash)
    return wash
  })

  return {
    group,
    update(dt, time, active) {
      beams.forEach((wash) => {
        wash.material.opacity = 0.1 + active * 0.1
      })
    },
  }
}

// ---------------------------------------------------------------------------
// 2. AWS Speaker Sessions
// ---------------------------------------------------------------------------
function speaker(k) {
  const group = new Group()
  plinth(k, group, 2.5)
  const black = k.std(0x15131d, { rough: 0.45, metal: 0.6 })
  const chrome = k.metal(0xe6e9f2, 0.12)

  // Stage deck
  k.put(group, rbox(k, 4.1, 0.36, 2.3, 0.08), k.glossy(0x211c38, { rough: 0.4, clearcoat: 0.6, clearcoatRough: 0.2 }), 0, 0.52, -0.1)
  k.put(group, rbox(k, 4.1, 0.03, 0.03, 0.01), k.flat(PAL.mint), 0, 0.62, 1.05)

  // LED screen: a slim bezel, the picture, a faint glass glare and two feet
  k.put(group, rbox(k, 3.7, 2.1, 0.1, 0.03), k.std(0x0c0a14, { rough: 0.3, metal: 0.5 }), 0, 2.15, -1.05)
  k.put(group, plane(k, 3.56, 1.93), k.screen(keynoteTexture(k)), 0, 2.15, -0.997)
  k.put(
    group,
    plane(k, 3.56, 1.93),
    k.screen(glareTexture(k), { transparent: true, depthWrite: false, blending: AdditiveBlending }),
    0,
    2.15,
    -0.995,
  )
  ;[-1.45, 1.45].forEach((x) => k.put(group, rbox(k, 0.14, 0.4, 0.1, 0.03), black, x, 0.9, -1.05))
  // Light from the screen falls on the deck in front of it
  const spill = k.put(
    group,
    plane(k, 3.8, 1.5),
    k.screen(softTexture(k, 'spill', [[0, 'rgba(120,150,255,0.55)'], [1, 'rgba(120,150,255,0)']]), {
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      opacity: 0.35,
    }),
    0,
    0.703,
    -0.35,
    -Math.PI / 2,
  )

  // Lectern: a narrow, flared, bevelled lacquered body with a sloped reading top
  const lectern = new Group()
  lectern.position.set(0, 0.665, 0.1)
  group.add(lectern)
  const body = k.geo('lectern', () => {
    const width = 0.58
    const side = new Shape()
    side.moveTo(-0.24, 0.06)
    side.lineTo(0.2, 0.06)
    side.lineTo(0.3, 1.0)
    side.lineTo(0.32, 1.02)
    side.lineTo(-0.3, 1.12)
    side.lineTo(-0.28, 1.08)
    side.closePath()
    const g = new ExtrudeGeometry(side, {
      depth: width,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.025,
      bevelSegments: 4,
      curveSegments: 8,
    })
    g.translate(0, 0, -width / 2)
    g.rotateY(-Math.PI / 2)
    g.computeVertexNormals()
    return g
  })
  k.put(lectern, body, k.glossy(0x1d1833, { rough: 0.3, clearcoat: 1, clearcoatRough: 0.06, envIntensity: 1.8 }))
  k.put(lectern, cyl(k, 0.012, 0.012, 0.62, 16), chrome, 0, 1.035, 0.325, 0, 0, Math.PI / 2)
  k.put(lectern, plane(k, 0.4, 0.2), k.screen(lecternMarkTexture(k), { transparent: true, depthWrite: false }), 0, 0.58, 0.292).rotation.x = 0.106

  // Gooseneck microphone, centred on the reading top
  const stem = k.geo('gooseneck', () => {
    const path = new CatmullRomCurve3([
      new Vector3(0, 0, 0),
      new Vector3(0, 0.2, 0),
      new Vector3(0, 0.34, 0.03),
      new Vector3(0, 0.4, 0.1),
      new Vector3(0, 0.38, 0.17),
    ])
    return new TubeGeometry(path, 28, 0.007, 8, false)
  })
  const mic = new Group()
  mic.position.set(0, 1.095, -0.02)
  k.put(mic, cyl(k, 0.04, 0.045, 0.025, 24), chrome, 0, 0.012, 0)
  k.put(mic, stem, k.metal(0x20202c, 0.3), 0, 0.02, 0)
  k.put(mic, sph(k, 0.022, 14, 10), k.std(0x15131d, { rough: 0.5 }), 0, 0.4, 0.2).scale.set(0.8, 1.5, 0.8)
  lectern.add(mic)

  // Lighting rig: a box truss on two stands, with real-looking spot fixtures
  const steel = k.metal(0x9ea3b3, 0.35)
  ;[-1.95, 1.95].forEach((x) => {
    k.put(group, cyl(k, 0.04, 0.04, 3.1, 14), steel, x, 2.25, 0.1)
  })
  const trussY = 3.78
  k.put(group, cyl(k, 0.022, 0.022, 4.0, 12), steel, 0, trussY + 0.08, 0.1, 0, 0, Math.PI / 2)
  k.put(group, cyl(k, 0.022, 0.022, 4.0, 12), steel, 0, trussY - 0.08, 0.1, 0, 0, Math.PI / 2)
  const bracesCount = 16
  const braces = new InstancedMesh(cyl(k, 0.01, 0.01, 0.3, 6), steel, bracesCount)
  const braceMatrix = new Matrix4()
  const braceTurn = new Quaternion()
  const braceAt = new Vector3()
  const braceOne = new Vector3(1, 1, 1)
  const zAxis = new Vector3(0, 0, 1)
  for (let i = 0; i < bracesCount; i += 1) {
    braceTurn.setFromAxisAngle(zAxis, i % 2 ? 0.55 : -0.55)
    braceAt.set(-1.8 + i * 0.24, trussY, 0.1)
    braceMatrix.compose(braceAt, braceTurn, braceOne)
    braces.setMatrixAt(i, braceMatrix)
  }
  group.add(braces)

  const pools = []
  const fixtures = [-1.3, 0, 1.3].map((x) => {
    const light = new Group()
    light.position.set(x, trussY - 0.34, 0.1)
    group.add(light)
    // hook and yoke
    k.put(light, cyl(k, 0.012, 0.012, 0.18, 8), black, 0, 0.27, 0)
    k.put(light, rbox(k, 0.34, 0.02, 0.04, 0.008), black, 0, 0.18, 0)
    ;[-0.16, 0.16].forEach((ax) => k.put(light, rbox(k, 0.02, 0.2, 0.04, 0.008), black, ax, 0.08, 0))
    // the lamp itself, tilted to point down and towards the audience
    const lamp = new Group()
    lamp.rotation.x = 0.7
    light.add(lamp)
    k.put(lamp, cyl(k, 0.115, 0.14, 0.36, 28), black, 0, 0, 0, Math.PI / 2)
    k.put(lamp, cyl(k, 0.14, 0.14, 0.05, 28), black, 0, 0, -0.2, Math.PI / 2)
    ;[-0.06, 0.02, 0.1].forEach((z) => k.put(lamp, tor(k, 0.118, 0.008, 6, 28), black, 0, 0, z))
    k.put(lamp, cyl(k, 0.15, 0.15, 0.03, 28), chrome, 0, 0, 0.2, Math.PI / 2)
    const lens = k.put(lamp, cyl(k, 0.125, 0.125, 0.01, 28), k.flat(0xfff2dc, { toneMapped: false }), 0, 0, 0.215, Math.PI / 2)
    const glow = k.glowSprite(0xfff0d6, 0.75, 0.6)
    glow.position.set(0, 0, 0.26)
    lamp.add(glow)
    // the soft pool of light it throws on the deck
    const pool = k.put(
      group,
      plane(k, 1.9, 1.9),
      k.screen(softTexture(k, 'pool', [[0, 'rgba(255,240,220,0.9)'], [0.55, 'rgba(255,240,220,0.25)'], [1, 'rgba(255,240,220,0)']]), {
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        opacity: 0.2,
      }),
      x * 0.8,
      0.705,
      0.55,
      -Math.PI / 2,
    )
    pools.push(pool)
    return { glow, lens }
  })

  return {
    group,
    update(dt, time, active) {
      fixtures.forEach(({ glow }) => {
        glow.material.opacity = 0.45 + active * 0.35
      })
      pools.forEach((pool) => {
        pool.material.opacity = 0.14 + active * 0.14
      })
      spill.material.opacity = 0.25 + active * 0.2
    },
  }
}

// ---------------------------------------------------------------------------
// 3. AWS Goodies & Swags
// ---------------------------------------------------------------------------
function goodies(k) {
  const group = new Group()
  plinth(k, group, 2.3)
  const top = 0.34 // top of the pad

  const cotton = k.fabric(0xd9cfba)
  const steelMetal = k.metal(0xcfd3dd, 0.25)
  const blackPlastic = k.std(0x15131d, { rough: 0.5 })

  // ---- premium gift box: matte black with a satin ribbon and bow ----
  const box = new Group()
  box.position.set(0.05, top, -0.95)
  box.rotation.y = -0.12
  group.add(box)
  const lacquer = k.glossy(0x1a1730, { rough: 0.45, clearcoat: 0.5, clearcoatRough: 0.25 })
  const satin = k.fabric(0xe0457f, 0.35)
  k.put(box, rbox(k, 1.25, 0.5, 1.25, 0.03), lacquer, 0, 0.25, 0)
  k.put(box, rbox(k, 1.31, 0.17, 1.31, 0.03), lacquer, 0, 0.585, 0)
  k.put(box, rbox(k, 0.15, 0.5, 1.27, 0.01), satin, 0, 0.25, 0)
  k.put(box, rbox(k, 0.15, 0.17, 1.33, 0.01), satin, 0, 0.585, 0)
  k.put(box, rbox(k, 1.33, 0.17, 0.15, 0.01), satin, 0, 0.59, 0)
  ;[-1, 1].forEach((side) =>
    k.put(box, tor(k, 0.17, 0.034, 12, 28), satin, side * 0.17, 0.78, 0, 0, side * 0.35, side * 0.5),
  )
  k.put(box, sph(k, 0.065, 16, 12), satin, 0, 0.72, 0)

  // ---- canvas tote bag, plain, with stitched straps ----
  const tote = new Group()
  tote.position.set(-1.45, top, -0.15)
  tote.rotation.y = 0.4
  group.add(tote)
  k.put(tote, rbox(k, 0.95, 1.05, 0.26, 0.07), cotton, 0, 0.525, 0)
  k.put(tote, rbox(k, 0.97, 0.06, 0.28, 0.02), k.fabric(0xc9bea6), 0, 1.0, 0)
  const strap = k.geo('toteStrap', () => {
    const path = new CatmullRomCurve3([
      new Vector3(-0.27, 1.0, 0),
      new Vector3(-0.25, 1.35, 0),
      new Vector3(-0.12, 1.62, 0),
      new Vector3(0.12, 1.62, 0),
      new Vector3(0.25, 1.35, 0),
      new Vector3(0.27, 1.0, 0),
    ])
    return new TubeGeometry(path, 36, 0.024, 8, false)
  })
  ;[-0.09, 0.09].forEach((z) => k.put(tote, strap, k.fabric(0xc9bea6), 0, 0, z))

  // ---- folded T-shirts ----
  const tees = [0xf1eef7, 0x4a2fb0, 0x23202f]
  tees.forEach((color, i) => {
    const tee = new Group()
    tee.position.set(-0.55 + i * 0.01, top + 0.06 + i * 0.105, 0.85)
    tee.rotation.y = 0.12 - i * 0.07
    group.add(tee)
    const cloth = k.fabric(color)
    k.put(tee, rbox(k, 0.92, 0.1, 0.72, 0.045), cloth, 0, 0, 0)
    ;[-1, 1].forEach((side) =>
      k.put(tee, rbox(k, 0.3, 0.085, 0.34, 0.04), cloth, side * 0.5, 0.012, -0.02, 0, side * 0.12, 0),
    )
    k.put(tee, tor(k, 0.1, 0.014, 8, 20, Math.PI), cloth, 0, 0.055, -0.3, Math.PI / 2, 0, 0)
  })

  // ---- insulated bottle ----
  const bottle = new Group()
  bottle.position.set(1.45, top, -0.3)
  group.add(bottle)
  const bottleBody = k.geo('bottle', () => {
    const profile = [
      [0, 0],
      [0.16, 0],
      [0.18, 0.025],
      [0.18, 0.82],
      [0.165, 0.92],
      [0.12, 0.99],
      [0.088, 1.03],
      [0.088, 1.08],
      [0, 1.08],
    ].map(([x, y]) => new Vector2(x, y))
    return new LatheGeometry(profile, 56)
  })
  k.put(bottle, bottleBody, k.std(0x5a3bd0, { rough: 0.3, metal: 0.85, envIntensity: 1.6, double: true }))
  k.put(bottle, cyl(k, 0.186, 0.186, 0.025, 40), steelMetal, 0, 0.012, 0)
  k.put(bottle, cyl(k, 0.1, 0.1, 0.16, 32), blackPlastic, 0, 1.16, 0)
  k.put(bottle, tor(k, 0.075, 0.014, 8, 24, Math.PI), blackPlastic, 0, 1.25, 0)

  // ---- baseball cap ----
  const cap = new Group()
  cap.position.set(1.3, top + 0.02, 0.95)
  cap.rotation.set(0.12, -0.5, 0)
  group.add(cap)
  const capCloth = k.fabric(0x4a2fb0)
  const dome = k.put(cap, k.geo('capDome', () => new SphereGeometry(0.3, 32, 18, 0, Math.PI * 2, 0, Math.PI / 2)), capCloth, 0, 0.0, 0)
  dome.scale.set(1, 0.8, 1.05)
  k.put(cap, sph(k, 0.022, 10, 8), capCloth, 0, 0.245, 0)
  k.put(cap, cyl(k, 0.305, 0.305, 0.03, 36), k.fabric(0x3a2490), 0, 0.0, 0)
  const brim = k.geo('capBrim', () => {
    const shape = new Shape()
    shape.absarc(0, 0, 0.44, -Math.PI / 2 - 0.9, -Math.PI / 2 + 0.9, false)
    shape.lineTo(0, 0)
    const g = new ExtrudeGeometry(shape, { depth: 0.018, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 2, curveSegments: 20 })
    g.rotateX(-Math.PI / 2)
    return g
  })
  k.put(cap, brim, k.fabric(0x3a2490), 0, 0.0, 0.18).rotation.x = 0.05

  // ---- hardcover notebook with elastic band, and a pen ----
  const notebook = new Group()
  notebook.position.set(0.45, top, 0.45)
  notebook.rotation.y = 0.2
  group.add(notebook)
  const cover = k.std(0x1d1a2e, { rough: 0.6 })
  k.put(notebook, rbox(k, 0.82, 0.018, 1.06, 0.01), cover, 0, 0.009, 0)
  k.put(notebook, rbox(k, 0.76, 0.05, 1.0, 0.008), k.std(0xf1ecdf, { rough: 0.9 }), 0, 0.043, 0)
  k.put(notebook, rbox(k, 0.82, 0.018, 1.06, 0.01), cover, 0, 0.077, 0)
  k.put(notebook, rbox(k, 0.036, 0.1, 1.07, 0.008), k.fabric(0xc7506f), 0.28, 0.043, 0)
  const pen = new Group()
  pen.position.set(-0.05, 0.1, 0.05)
  pen.rotation.set(0, 0.7, 0)
  notebook.add(pen)
  k.put(pen, cyl(k, 0.013, 0.013, 0.62, 16), k.metal(0x2b2842, 0.25), 0, 0, 0, Math.PI / 2, 0, 0)
  k.put(pen, cone(k, 0.013, 0.07, 16), steelMetal, 0, 0, 0.345, Math.PI / 2, 0, 0)
  k.put(pen, rbox(k, 0.008, 0.012, 0.18, 0.003), steelMetal, 0, 0.018, -0.18)

  // ---- ceramic mug ----
  const mug = new Group()
  mug.position.set(0.4, top, 1.45)
  group.add(mug)
  const ceramic = k.glossy(0xf4f1fa, { rough: 0.2, clearcoat: 1, clearcoatRough: 0.05 })
  k.put(mug, cyl(k, 0.22, 0.19, 0.4, 40), ceramic, 0, 0.2, 0)
  k.put(mug, cyl(k, 0.195, 0.195, 0.01, 40), k.std(0x3a2316, { rough: 0.25 }), 0, 0.385, 0)
  k.put(mug, tor(k, 0.12, 0.032, 10, 24, Math.PI), ceramic, 0.22, 0.21, 0, 0, 0, -Math.PI / 2)

  // ---- event badge on a lanyard, lying flat ----
  const badge = new Group()
  badge.position.set(-1.3, top + 0.01, 1.05)
  badge.rotation.y = 0.5
  group.add(badge)
  const card = new Group()
  card.rotation.x = -Math.PI / 2
  badge.add(card)
  k.put(card, rbox(k, 0.44, 0.64, 0.012, 0.02), k.glossy(0xf4f2f6, { rough: 0.3, clearcoat: 0.6 }), 0, 0, 0)
  k.put(card, rbox(k, 0.44, 0.14, 0.014, 0.012), k.std(0x4a2fb0, { rough: 0.4 }), 0, -0.25, 0)
  k.put(card, rbox(k, 0.12, 0.022, 0.014, 0.008), k.std(0x15131d, { rough: 0.5 }), 0, 0.27, 0)
  const lanyard = k.geo('lanyard', () => {
    const path = new CatmullRomCurve3([
      new Vector3(0, 0.005, -0.3),
      new Vector3(0.15, 0.005, -0.55),
      new Vector3(0.5, 0.005, -0.7),
      new Vector3(0.75, 0.005, -0.4),
      new Vector3(0.55, 0.005, -0.05),
      new Vector3(0.12, 0.005, -0.2),
    ])
    return new TubeGeometry(path, 40, 0.022, 8, false)
  })
  const ribbon = k.put(badge, lanyard, k.fabric(0x20c98a), 0, 0, 0)
  ribbon.scale.y = 0.35

  return {
    group,
    update(dt, time, active) {
      box.rotation.y = -0.12 + Math.sin(time * 0.5) * 0.04 * (0.3 + active)
    },
  }
}

// ---------------------------------------------------------------------------
// 4. 2-Day National Level Hackathon: a laptop running code
// ---------------------------------------------------------------------------
function hackathon(k) {
  const group = new Group()
  plinth(k, group, 2.4)
  const surface = 0.34 // everything rests directly on the pad

  // ---- laptop: a slim aluminium slab, a keyboard well, a trackpad and a lid ----
  const laptop = new Group()
  laptop.position.set(0, surface, -0.1)
  group.add(laptop)
  const aluminium = k.std(0xd5d8e2, { rough: 0.3, metal: 1, envIntensity: 1.7 })
  k.put(laptop, rbox(k, 3.0, 0.07, 2.0, 0.035), aluminium, 0, 0.035, 0)
  k.put(laptop, rbox(k, 2.62, 0.012, 0.88, 0.01), k.std(0x0e0c18, { rough: 0.6 }), 0, 0.072, -0.3)
  k.put(
    laptop,
    plane(k, 2.5, 0.8),
    k.screen(softTexture(k, 'keys', [[0, 'rgba(255,255,255,0.9)'], [1, 'rgba(255,255,255,0)']]), {
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      opacity: 0.1,
    }),
    0,
    0.08,
    -0.3,
    -Math.PI / 2,
  )
  // Keys: five rows of fourteen, with the bottom row's middle swapped for a space bar
  const keys = new InstancedMesh(rbox(k, 0.16, 0.03, 0.15, 0.02), k.std(0x15131d, { rough: 0.5 }), 70)
  const keyMatrix = new Matrix4()
  for (let r = 0; r < 5; r += 1) {
    for (let c = 0; c < 14; c += 1) {
      const x = -1.2 + c * 0.185
      const hidden = r === 4 && Math.abs(x) < 0.5
      keyMatrix.compose(
        new Vector3(x, 0.093, -0.62 + r * 0.185),
        new Quaternion(),
        hidden ? new Vector3(0, 0, 0) : new Vector3(1, 1, 1),
      )
      keys.setMatrixAt(r * 14 + c, keyMatrix)
    }
  }
  laptop.add(keys)
  k.put(laptop, rbox(k, 1.0, 0.03, 0.15, 0.02), k.std(0x15131d, { rough: 0.5 }), 0, 0.093, 0.12)
  k.put(laptop, rbox(k, 0.95, 0.008, 0.6, 0.02), k.std(0xc3c7d2, { rough: 0.15, metal: 0.6, envIntensity: 1.8 }), 0, 0.072, 0.62)
  ;[-1.42, 1.42].forEach((x) => k.put(laptop, rbox(k, 0.1, 0.006, 0.8, 0.01), k.std(0x2a2733, { rough: 0.6 }), x, 0.072, -0.2))

  const lid = new Group()
  lid.position.set(0, 0.07, -1.0)
  lid.rotation.x = -0.36
  laptop.add(lid)
  k.put(lid, rbox(k, 3.0, 1.95, 0.045, 0.025), aluminium, 0, 0.975, 0)
  k.put(lid, rbox(k, 2.9, 1.86, 0.01, 0.01), k.std(0x050408, { rough: 0.25 }), 0, 0.975, 0.027)
  const ide = ideTexture(k)
  k.put(lid, plane(k, 2.78, 1.74), k.screen(ide), 0, 0.975, 0.034)
  k.put(
    lid,
    plane(k, 2.78, 1.74),
    k.screen(glareTexture(k), { transparent: true, depthWrite: false, blending: AdditiveBlending }),
    0,
    0.975,
    0.036,
  )
  k.put(lid, sph(k, 0.012, 10, 8), k.std(0x1a1a22, { rough: 0.3 }), 0, 1.9, 0.034)
  k.put(lid, cyl(k, 0.032, 0.032, 2.2, 20), k.metal(0x2a2733, 0.35), 0, 0.0, 0, 0, 0, Math.PI / 2)
  const cursor = k.put(
    lid,
    plane(k, 0.02, 0.07),
    k.flat(PAL.mint, { toneMapped: false }),
    (ide.userData.cursor.u - 0.5) * 2.78 + 0.01,
    0.975 + (0.5 - ide.userData.cursor.v) * 1.74,
    0.038,
  )
  // Light from the screen on the desk in front of the laptop
  k.put(
    group,
    plane(k, 3.2, 1.3),
    k.screen(softTexture(k, 'deskglow', [[0, 'rgba(150,180,255,0.6)'], [1, 'rgba(150,180,255,0)']]), {
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      opacity: 0.18,
    }),
    0,
    surface + 0.004,
    0.85,
    -Math.PI / 2,
  )

  // ---- wireless mouse ----
  const mouse = k.put(
    group,
    sph(k, 0.17, 28, 18),
    k.glossy(0xcfd3dd, { rough: 0.25, clearcoat: 0.8, clearcoatRough: 0.1 }),
    1.5,
    surface + 0.04,
    0.62,
  )
  mouse.scale.set(0.72, 0.4, 1.12)
  mouse.rotation.y = -0.2

  // ---- phone lying face-up ----
  const phone = new Group()
  phone.position.set(-1.5, surface + 0.02, 0.55)
  phone.rotation.y = 0.35
  group.add(phone)
  k.put(phone, rbox(k, 0.42, 0.04, 0.86, 0.05), k.glossy(0x0d0b14, { rough: 0.3, clearcoat: 1, clearcoatRough: 0.05 }), 0, 0, 0)
  k.put(phone, plane(k, 0.38, 0.8), k.screen(phoneTexture(k)), 0, 0.0215, 0, -Math.PI / 2)

  // ---- coffee mug with steam ----
  const mug = new Group()
  mug.position.set(1.5, surface, -0.6)
  group.add(mug)
  const ceramic = k.glossy(0xf4f1fa, { rough: 0.2, clearcoat: 1, clearcoatRough: 0.05 })
  k.put(mug, cyl(k, 0.22, 0.19, 0.4, 40), ceramic, 0, 0.2, 0)
  k.put(mug, cyl(k, 0.195, 0.195, 0.01, 40), k.std(0x3a2316, { rough: 0.2 }), 0, 0.385, 0)
  k.put(mug, tor(k, 0.12, 0.032, 10, 24, Math.PI), ceramic, 0.22, 0.21, 0, 0, 0, -Math.PI / 2)
  const steamMaterial = k.track(
    new SpriteMaterial({ map: k.puffTexture(), color: 0xffffff, transparent: true, opacity: 0.2, depthWrite: false }),
  )
  const steam = [0, 1, 2].map((i) => {
    const puff = new Sprite(steamMaterial)
    puff.scale.setScalar(0.35)
    mug.add(puff)
    return { puff, offset: i / 3 }
  })

  // ---- headphones resting flat ----
  const headphones = new Group()
  headphones.position.set(-1.45, surface, -0.62)
  headphones.rotation.y = 0.5
  group.add(headphones)
  const shell = k.std(0x1b1829, { rough: 0.35, metal: 0.5 })
  ;[-0.23, 0.23].forEach((x) => {
    k.put(headphones, cyl(k, 0.15, 0.15, 0.1, 36), shell, x, 0.05, 0)
    k.put(headphones, tor(k, 0.12, 0.035, 10, 28), k.fabric(0x2a2638), x, 0.1, 0, Math.PI / 2, 0, 0)
  })
  k.put(headphones, tor(k, 0.23, 0.022, 10, 32, Math.PI), shell, 0, 0.04, 0, Math.PI / 2, 0, 0)

  return {
    group,
    update(dt, time, active) {
      cursor.visible = Math.sin(time * 6) > 0
      steamMaterial.opacity = 0.14 + active * 0.12
      steam.forEach(({ puff, offset }) => {
        const t = (time * 0.25 + offset) % 1
        puff.position.set(Math.sin(time + offset * 6) * 0.04, 0.5 + t * 0.55, 0)
        puff.scale.setScalar(0.18 + t * 0.35)
      })
    },
  }
}

// ---------------------------------------------------------------------------
// 5. Ideation: an ideas board and a glowing bulb
// ---------------------------------------------------------------------------
function ideation(k) {
  const group = new Group()
  plinth(k, group, 2.4)
  const floor = 0.34
  const aluminium = k.std(0xd5d8e2, { rough: 0.35, metal: 1, envIntensity: 1.5 })

  // ---- rolling whiteboard: aluminium frame, glossy surface, marker tray, legs with casters ----
  const boardY = 1.95
  const boardZ = -1.5
  k.put(group, rbox(k, 3.95, 2.45, 0.1, 0.04), aluminium, 0, boardY, boardZ)
  k.put(group, plane(k, 3.75, 2.25), k.screen(boardTexture(k)), 0, boardY, boardZ + 0.054)
  k.put(
    group,
    plane(k, 3.75, 2.25),
    k.screen(glareTexture(k), { transparent: true, depthWrite: false, blending: AdditiveBlending }),
    0,
    boardY,
    boardZ + 0.056,
  )
  // marker tray with four markers and an eraser
  k.put(group, rbox(k, 2.4, 0.05, 0.15, 0.02), aluminium, 0, boardY - 1.25, boardZ + 0.1)
  ;[
    [-0.85, 0x1d5fd1],
    [-0.6, 0xd33a3a],
    [-0.35, 0x1b9e5a],
    [-0.1, 0x222230],
  ].forEach(([x, color]) => {
    k.put(group, cyl(k, 0.016, 0.016, 0.17, 14), k.std(color, { rough: 0.4 }), x, boardY - 1.2, boardZ + 0.1, 0, 0, Math.PI / 2)
    k.put(group, cyl(k, 0.017, 0.017, 0.05, 14), k.std(0xf1eef7, { rough: 0.4 }), x + 0.06, boardY - 1.2, boardZ + 0.1, 0, 0, Math.PI / 2)
  })
  k.put(group, rbox(k, 0.24, 0.05, 0.09, 0.015), k.fabric(0x2a2638), 0.7, boardY - 1.2, boardZ + 0.1)
  // legs
  ;[-1.5, 1.5].forEach((x) => {
    k.put(group, cyl(k, 0.035, 0.035, 0.4, 14), aluminium, x, floor + 0.2 + 0.18, boardZ)
    k.put(group, rbox(k, 0.1, 0.05, 0.9, 0.02), aluminium, x, floor + 0.09, boardZ + 0.2)
    ;[-0.2, 0.6].forEach((dz) => {
      k.put(group, sph(k, 0.04, 12, 8), k.std(0x15131d, { rough: 0.5 }), x, floor + 0.04, boardZ + dz)
    })
  })

  // ---- vintage filament bulb on a brass socket ----
  const bulb = new Group()
  bulb.position.set(0, floor, 0.45)
  group.add(bulb)
  const brass = k.std(0xffcf70, { rough: 0.28, metal: 1, envIntensity: 1.9 })
  k.put(bulb, cyl(k, 0.55, 0.62, 0.16, 48), k.std(0x1b1829, { rough: 0.35, metal: 0.6, envIntensity: 1.6 }), 0, 0.08, 0)
  k.put(bulb, cyl(k, 0.32, 0.4, 0.14, 40), brass, 0, 0.23, 0)
  k.put(bulb, cyl(k, 0.28, 0.28, 0.42, 36), brass, 0, 0.5, 0)
  ;[0.38, 0.5, 0.62].forEach((y) => k.put(bulb, tor(k, 0.285, 0.026, 8, 40), brass, y === 0.5 ? 0 : 0, y, 0, Math.PI / 2, 0, 0))
  k.put(bulb, cyl(k, 0.3, 0.3, 0.04, 36), k.std(0x1b1829, { rough: 0.4, metal: 0.5 }), 0, 0.73, 0)

  const glassShape = k.geo('bulbGlass', () => {
    const curve = new SplineCurve(
      [
        [0.27, 0],
        [0.3, 0.12],
        [0.4, 0.3],
        [0.62, 0.6],
        [0.75, 1.0],
        [0.72, 1.35],
        [0.54, 1.68],
        [0.26, 1.88],
        [0.0, 1.93],
      ].map(([x, y]) => new Vector2(x, y)),
    )
    return new LatheGeometry(curve.getPoints(60), 64)
  })
  const glass = k.put(
    bulb,
    glassShape,
    k.std(0xffffff, { rough: 0.02, opacity: 0.16, envIntensity: 2.4, double: true }),
    0,
    0.75,
    0,
  )
  glass.renderOrder = 2
  // glass stem and the zig-zag filament between two support wires
  k.put(bulb, cyl(k, 0.02, 0.02, 0.9, 10), k.std(0xeef2ff, { rough: 0.1, opacity: 0.5 }), 0, 1.25, 0)
  ;[-0.13, 0.13].forEach((x) => k.put(bulb, cyl(k, 0.006, 0.006, 0.55, 8), k.metal(0xcfd3dd, 0.3), x, 1.4, 0))
  const filament = k.geo('filament', () => {
    const points = []
    for (let i = 0; i <= 28; i += 1) {
      const t = i / 28
      points.push(new Vector3(-0.13 + t * 0.26, 1.58 + (i % 2 ? 0.0 : -0.1) + Math.sin(t * 9) * 0.015, 0))
    }
    return new TubeGeometry(new CatmullRomCurve3(points), 120, 0.007, 6, false)
  })
  k.put(bulb, filament, k.flat(0xffc070, { toneMapped: false }), 0, 0.0, 0)
  const halo = k.glowSprite(0xffb347, 3.6, 0.5)
  halo.position.set(0, 1.55, 0)
  bulb.add(halo)
  const core = k.glowSprite(0xfff0c8, 1.1, 0.8)
  core.position.set(0, 1.5, 0)
  bulb.add(core)

  // ---- a pad of sticky notes and a pencil beside the bulb ----
  const pad = new Group()
  pad.position.set(1.3, floor, 0.9)
  pad.rotation.y = 0.35
  group.add(pad)
  k.put(pad, rbox(k, 0.32, 0.14, 0.32, 0.012), k.std(0xffd45c, { rough: 0.9 }), 0, 0.07, 0)
  k.put(pad, rbox(k, 0.32, 0.012, 0.32, 0.004), k.std(0xe8b83c, { rough: 0.9 }), 0, 0.146, 0)
  const pencil = new Group()
  pencil.position.set(0.3, 0.025, 0.05)
  pencil.rotation.y = -0.6
  pad.add(pencil)
  k.put(pencil, cyl(k, 0.012, 0.012, 0.42, 6), k.std(0xf2b431, { rough: 0.5 }), 0, 0, 0, Math.PI / 2, 0, 0)
  k.put(pencil, cone(k, 0.012, 0.05, 6), k.std(0xe7c9a0, { rough: 0.8 }), 0, 0, 0.235, Math.PI / 2, 0, 0)

  return {
    group,
    update(dt, time, active) {
      const flicker = 1 + Math.sin(time * 3) * 0.025 + Math.sin(time * 11) * 0.01
      halo.material.opacity = 0.28 + active * 0.4
      halo.scale.setScalar(3.2 * (1 + active * 0.3) * flicker)
      core.material.opacity = 0.5 + active * 0.4
    },
  }
}

// ---------------------------------------------------------------------------
// 6. Prototyping: designing and building the app
// ---------------------------------------------------------------------------
/** A code editor beside a terminal: a React component being written, with the dev server running */
function devEditorTexture(k) {
  return k.tex('devEditor', 1024, 576, (ctx, w, h) => {
    const mono = '"JetBrains Mono", Consolas, "Courier New", monospace'
    ctx.fillStyle = '#100c24'
    ctx.fillRect(0, 0, w, h)
    // title bar
    ctx.fillStyle = '#0b0819'
    ctx.fillRect(0, 0, w, 30)
    ;['#fb57a6', '#ffc83d', '#20e399'].forEach((c, i) => {
      ctx.fillStyle = c
      ctx.beginPath()
      ctx.arc(20 + i * 20, 15, 5, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.fillStyle = 'rgba(244,242,246,0.55)'
    ctx.font = `13px ${mono}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Events.jsx — zenith-app', w / 2, 16)
    // activity bar and explorer
    ctx.fillStyle = '#0b0819'
    ctx.fillRect(0, 30, 52, h - 56)
    ;[0, 1, 2, 3].forEach((i) => roundRect(ctx, 16, 52 + i * 46, 20, 20, 5, i === 0 ? '#f4f2f6' : 'rgba(244,242,246,0.3)'))
    ctx.fillStyle = '#130e2b'
    ctx.fillRect(52, 30, 200, h - 56)
    ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(244,242,246,0.5)'
    ctx.font = `600 12px ${mono}`
    ctx.fillText('EXPLORER', 68, 56)
    ;[
      [0, 'zenith-app', '#8a63f5'],
      [1, 'src', '#8a63f5'],
      [2, 'Events.jsx', '#20e399'],
      [2, 'List.jsx', '#e9e6f2'],
      [2, 'api.js', '#ffc83d'],
      [2, 'main.jsx', '#e9e6f2'],
      [1, 'package.json', '#ffc83d'],
    ].forEach(([depth, name, color], i) => {
      const y = 84 + i * 27
      if (name === 'Events.jsx') {
        ctx.fillStyle = 'rgba(138,99,245,0.22)'
        ctx.fillRect(52, y - 13, 200, 27)
      }
      roundRect(ctx, 68 + depth * 14, y - 5, 10, 10, 2, color)
      ctx.fillStyle = 'rgba(244,242,246,0.85)'
      ctx.font = `14px ${mono}`
      ctx.fillText(name, 88 + depth * 14, y + 1)
    })
    // tabs
    ctx.fillStyle = '#0d0a1e'
    ctx.fillRect(252, 30, w - 252, 36)
    ctx.fillStyle = '#100c24'
    ctx.fillRect(252, 30, 150, 36)
    ctx.fillStyle = '#20e399'
    ctx.fillRect(252, 30, 150, 2)
    ctx.fillStyle = 'rgba(244,242,246,0.9)'
    ctx.font = `14px ${mono}`
    ctx.fillText('Events.jsx', 274, 49)
    ctx.fillStyle = 'rgba(244,242,246,0.4)'
    ctx.fillText('api.js', 424, 49)
    // code
    const lines = [
      'import { useEffect, useState } from "react"',
      'import { fetchEvents } from "./api"',
      '',
      'export default function Events() {',
      '  const [items, setItems] = useState([])',
      '',
      '  useEffect(() => {',
      '    fetchEvents().then(setItems)',
      '  }, [])',
      '',
      '  return <List items={items} />',
      '}',
    ]
    const palette = { kw: '#fb57a6', str: '#20e399', num: '#ffc83d', cm: '#6b6490', fn: '#8ab4ff', tag: '#8a63f5', pl: '#e9e6f2' }
    const token = /("[^"]*")|(\/\/.*)|(\b\d+\b)|(\b(?:import|from|export|default|function|const|return)\b)|(<\/?[A-Z]\w*)|([A-Za-z_]\w*(?=\())|(.)/g
    ctx.font = `16px ${mono}`
    lines.forEach((text, i) => {
      const y = 92 + i * 24
      ctx.fillStyle = 'rgba(244,242,246,0.28)'
      ctx.textAlign = 'right'
      ctx.fillText(String(i + 1), 296, y)
      ctx.textAlign = 'left'
      let x = 318
      let match
      token.lastIndex = 0
      while ((match = token.exec(text)) !== null) {
        const kind = match[1] ? 'str' : match[2] ? 'cm' : match[3] ? 'num' : match[4] ? 'kw' : match[5] ? 'tag' : match[6] ? 'fn' : 'pl'
        ctx.fillStyle = palette[kind]
        ctx.fillText(match[0], x, y)
        x += ctx.measureText(match[0]).width
      }
    })
    // minimap
    ctx.fillStyle = '#0d0a1e'
    ctx.fillRect(w - 80, 66, 80, 322)
    let seed = 9
    const rand = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    for (let i = 0; i < 22; i += 1) {
      roundRect(ctx, w - 70 + (i % 3) * 4, 78 + i * 12, 8 + rand() * 44, 4, 2, ['#fb57a6', '#20e399', '#8a63f5', '#e9e6f2'][Math.floor(rand() * 4)] + '88')
    }
    // terminal
    ctx.fillStyle = '#0b0819'
    ctx.fillRect(252, 392, w - 252, h - 418)
    ctx.fillStyle = 'rgba(244,242,246,0.55)'
    ctx.font = `600 12px ${mono}`
    ctx.fillText('TERMINAL', 274, 410)
    ctx.fillStyle = '#20e399'
    ctx.fillRect(266, 420, 70, 2)
    ctx.font = `15px ${mono}`
    ;[
      ['$ npm run dev', '#f4f2f6'],
      ['  VITE v5.4  ready in 312 ms', '#20e399'],
      ['  ➜  Local:   http://localhost:5173/', '#8a63f5'],
      ['  ✓ hmr update /src/Events.jsx', 'rgba(244,242,246,0.55)'],
    ].forEach(([line, color], i) => {
      ctx.fillStyle = color
      ctx.fillText(line, 274, 444 + i * 24)
    })
    // status bar
    ctx.fillStyle = '#4a2fb0'
    ctx.fillRect(0, h - 26, w, 26)
    ctx.fillStyle = '#f4f2f6'
    ctx.font = `12px ${mono}`
    ctx.fillText('  main   0 errors   0 warnings', 14, h - 12)
    ctx.textAlign = 'right'
    ctx.fillText('Ln 11, Col 33    JavaScript React    UTF-8  ', w - 14, h - 12)
  })
}

/** A browser showing the app running locally, with developer tools docked on the right */
function devBrowserTexture(k) {
  return k.tex('devBrowser', 1024, 576, (ctx, w, h) => {
    const sans = '"Plus Jakarta Sans", Arial, sans-serif'
    const mono = '"JetBrains Mono", Consolas, monospace'
    const pageW = 690
    ctx.fillStyle = '#22222a'
    ctx.fillRect(0, 0, w, h)
    // browser chrome
    ctx.fillStyle = '#2b2b34'
    ctx.fillRect(0, 0, w, 72)
    ;['#fb57a6', '#ffc83d', '#20e399'].forEach((c, i) => {
      ctx.fillStyle = c
      ctx.beginPath()
      ctx.arc(20 + i * 20, 16, 5, 0, Math.PI * 2)
      ctx.fill()
    })
    roundRect(ctx, 100, 6, 200, 28, 8, '#3a3a45')
    ctx.fillStyle = '#ffffff'
    ctx.font = `500 13px ${sans}`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    ctx.fillText('Zenith — Events', 120, 21)
    roundRect(ctx, 16, 40, w - 32, 26, 13, '#17171c')
    ctx.fillStyle = '#20e399'
    ctx.fillText('●', 30, 53)
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.font = `13px ${mono}`
    ctx.fillText('localhost:5173', 54, 54)
    // the page
    ctx.fillStyle = '#f6f3ff'
    ctx.fillRect(0, 72, pageW, h - 72)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 72, pageW, 46)
    roundRect(ctx, 24, 84, 22, 22, 6, '#6b2dea')
    ctx.fillStyle = '#1b1530'
    ctx.font = `700 15px ${sans}`
    ctx.fillText('Zenith', 56, 96)
    ;['Events', 'Speakers', 'Schedule'].forEach((t, i) => {
      ctx.fillStyle = i === 0 ? '#6b2dea' : '#6b6490'
      ctx.font = `500 13px ${sans}`
      ctx.fillText(t, 420 + i * 82, 96)
    })
    const hero = ctx.createLinearGradient(0, 118, pageW, 300)
    hero.addColorStop(0, '#6b2dea')
    hero.addColorStop(1, '#fb57a6')
    ctx.fillStyle = hero
    ctx.fillRect(0, 118, pageW, 190)
    ctx.fillStyle = '#ffffff'
    ctx.font = `700 40px ${sans}`
    ctx.fillText("Build what's next.", 40, 190)
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.font = `400 16px ${sans}`
    ctx.fillText('A national hackathon, three days, one stage.', 40, 228)
    roundRect(ctx, 40, 252, 130, 38, 19, '#20e399')
    ctx.fillStyle = '#05261b'
    ctx.font = `700 14px ${sans}`
    ctx.textAlign = 'center'
    ctx.fillText('Register now', 105, 272)
    ctx.textAlign = 'left'
    ;['#8a63f5', '#fb57a6', '#20e399'].forEach((c, i) => {
      const x = 28 + i * 220
      roundRect(ctx, x, 330, 204, 200, 14, '#ffffff')
      const thumb = ctx.createLinearGradient(x, 330, x + 204, 430)
      thumb.addColorStop(0, c)
      thumb.addColorStop(1, '#ffffff')
      roundRect(ctx, x + 10, 340, 184, 96, 10, thumb)
      roundRect(ctx, x + 14, 452, 120, 10, 5, '#2b2540')
      roundRect(ctx, x + 14, 472, 150, 8, 4, '#d9d3ec')
      roundRect(ctx, x + 14, 490, 100, 8, 4, '#e8e4f4')
    })
    // developer tools
    ctx.fillStyle = '#1b1b22'
    ctx.fillRect(pageW, 72, w - pageW, h - 72)
    ctx.fillStyle = '#26262e'
    ctx.fillRect(pageW, 72, w - pageW, 30)
    ctx.font = `500 12px ${sans}`
    ;['Elements', 'Console', 'Network'].forEach((t, i) => {
      ctx.fillStyle = i === 2 ? '#ffffff' : 'rgba(255,255,255,0.55)'
      ctx.fillText(t, pageW + 16 + i * 80, 88)
      if (i === 2) {
        ctx.fillStyle = '#2d8cff'
        ctx.fillRect(pageW + 16 + i * 80, 100, 56, 2)
      }
    })
    ctx.font = `12px ${mono}`
    ;[
      ['GET', '/api/events', '200', '42 ms', '#20e399'],
      ['GET', '/api/speakers', '200', '38 ms', '#20e399'],
      ['GET', '/assets/hero.webp', '200', '11 ms', '#20e399'],
      ['POST', '/api/register', '201', '96 ms', '#20e399'],
      ['GET', '/api/venue', '304', '9 ms', '#ffc83d'],
    ].forEach(([method, path, status, time, color], i) => {
      const y = 126 + i * 28
      if (i === 0) {
        ctx.fillStyle = 'rgba(45,140,255,0.22)'
        ctx.fillRect(pageW, y - 12, w - pageW, 26)
      }
      ctx.fillStyle = '#8a63f5'
      ctx.fillText(method, pageW + 14, y)
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.fillText(path, pageW + 56, y)
      ctx.fillStyle = color
      ctx.fillText(status, pageW + 210, y)
      ctx.fillStyle = 'rgba(255,255,255,0.45)'
      ctx.fillText(time, pageW + 252, y)
    })
    // a little waterfall chart
    ;[0, 1, 2, 3, 4].forEach((i) => roundRect(ctx, pageW + 16 + i * 18, 300 + i * 10, 150 - i * 18, 8, 4, ['#20e399', '#2d8cff', '#8a63f5', '#fb57a6', '#ffc83d'][i]))
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = `11px ${mono}`
    ctx.fillText('5 requests   18.4 kB transferred   Finish: 312 ms', pageW + 14, 392)
  })
}

/** The app's home screen as it would look on the phone */
function appScreenTexture(k) {
  return k.tex('appScreen', 256, 512, (ctx, w, h) => {
    const sans = '"Plus Jakarta Sans", Arial, sans-serif'
    ctx.fillStyle = '#f6f3ff'
    ctx.fillRect(0, 0, w, h)
    const head = ctx.createLinearGradient(0, 0, w, 150)
    head.addColorStop(0, '#6b2dea')
    head.addColorStop(1, '#fb57a6')
    ctx.fillStyle = head
    ctx.fillRect(0, 0, w, 150)
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.font = `600 13px ${sans}`
    ctx.textBaseline = 'middle'
    ctx.fillText('9:41', 22, 24)
    ctx.fillStyle = '#ffffff'
    ctx.font = `700 26px ${sans}`
    ctx.fillText('ZENITH', 22, 84)
    roundRect(ctx, 22, 108, 120, 8, 4, 'rgba(255,255,255,0.6)')
    const hero = ctx.createLinearGradient(20, 150, 236, 270)
    hero.addColorStop(0, '#20e399')
    hero.addColorStop(1, '#2fb7ff')
    roundRect(ctx, 20, 164, 216, 120, 16, hero)
    roundRect(ctx, 36, 226, 110, 12, 6, 'rgba(255,255,255,0.95)')
    roundRect(ctx, 36, 248, 78, 9, 4.5, 'rgba(255,255,255,0.65)')
    ;[304, 358].forEach((y) => {
      roundRect(ctx, 20, y, 216, 44, 12, '#ffffff')
      ctx.fillStyle = '#e4dcff'
      ctx.beginPath()
      ctx.arc(46, y + 22, 13, 0, Math.PI * 2)
      ctx.fill()
      roundRect(ctx, 70, y + 12, 96, 9, 4.5, '#c9c2e0')
      roundRect(ctx, 70, y + 27, 64, 7, 3.5, '#e1dcf0')
    })
    roundRect(ctx, 20, 420, 216, 44, 22, '#20e399')
    ctx.fillStyle = '#05261b'
    ctx.font = `700 16px ${sans}`
    ctx.textAlign = 'center'
    ctx.fillText('Get started', w / 2, 443)
    ctx.fillStyle = '#d7d0ec'
    ctx.fillRect(0, h - 26, w, 26)
  })
}

/** A low-fidelity wireframe sketched on the tablet, with pink stylus notes */
function wireframeTexture(k) {
  return k.tex('wireframe', 640, 470, (ctx, w, h) => {
    ctx.fillStyle = '#fbfaff'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(80,70,140,0.1)'
    ctx.lineWidth = 1
    for (let x = 0; x < w; x += 32) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    for (let y = 0; y < h; y += 32) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }
    ctx.strokeStyle = '#4a4a58'
    ctx.lineWidth = 3
    ctx.lineJoin = 'round'
    ctx.strokeRect(60, 50, 160, 330)
    ctx.strokeRect(76, 70, 128, 22)
    ctx.strokeRect(76, 108, 128, 90)
    ctx.beginPath()
    ctx.moveTo(76, 108)
    ctx.lineTo(204, 198)
    ctx.moveTo(204, 108)
    ctx.lineTo(76, 198)
    ctx.stroke()
    ;[216, 238, 260].forEach((y, i) => {
      ctx.beginPath()
      ctx.moveTo(76, y)
      ctx.lineTo(204 - i * 30, y)
      ctx.stroke()
    })
    ctx.strokeRect(76, 300, 128, 34)
    ctx.strokeRect(300, 50, 160, 330)
    ctx.strokeRect(316, 70, 128, 120)
    ;[210, 236, 262, 288].forEach((y) => {
      ctx.strokeRect(316, y, 128, 18)
    })
    ctx.strokeRect(316, 330, 128, 34)
    ctx.strokeStyle = '#fb57a6'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(210, 316)
    ctx.bezierCurveTo(250, 316, 262, 340, 296, 322)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(284, 312)
    ctx.lineTo(298, 322)
    ctx.lineTo(282, 332)
    ctx.stroke()
    ctx.fillStyle = '#fb57a6'
    ctx.font = '600 22px "Segoe Script", "Bradley Hand", cursive'
    ctx.fillText('tap → details', 490, 120)
    ctx.fillText('add search?', 490, 250)
  })
}

function prototyping(k) {
  const group = new Group()
  plinth(k, group, 2.4)
  const top = 0.34
  const aluminium = k.std(0xd5d8e2, { rough: 0.3, metal: 1, envIntensity: 1.7 })
  const bezel = k.glossy(0x0b0a12, { rough: 0.3, clearcoat: 1, clearcoatRough: 0.06 })

  // ---- two monitors angled in: code and terminal on the left, the running app and dev tools on the right ----
  const glare = k.screen(glareTexture(k), { transparent: true, depthWrite: false, blending: AdditiveBlending })
  const monitor = (x, turn, texture) => {
    const m = new Group()
    m.position.set(x, top, -1.0)
    m.rotation.y = turn
    group.add(m)
    k.put(m, cyl(k, 0.34, 0.36, 0.03, 48), aluminium, 0, 0.015, 0.06).scale.z = 0.75
    k.put(m, rbox(k, 0.12, 0.62, 0.05, 0.02), aluminium, 0, 0.33, -0.03)
    k.put(m, rbox(k, 2.0, 1.2, 0.06, 0.03), bezel, 0, 1.2, 0)
    k.put(m, plane(k, 1.92, 1.08), k.screen(texture), 0, 1.2, 0.032)
    k.put(m, plane(k, 1.92, 1.08), glare, 0, 1.2, 0.034)
    k.put(m, sph(k, 0.008, 8, 6), k.std(0x1a1a22, { rough: 0.3 }), 0, 1.78, 0.032)
  }
  monitor(-1.05, 0.28, devEditorTexture(k))
  monitor(1.05, -0.28, devBrowserTexture(k))
  k.put(
    group,
    plane(k, 4.2, 1.5),
    k.screen(softTexture(k, 'devglow', [[0, 'rgba(140,160,255,0.55)'], [1, 'rgba(140,160,255,0)']]), {
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      opacity: 0.2,
    }),
    0,
    top + 0.004,
    -0.15,
    -Math.PI / 2,
  )

  // ---- mechanical keyboard ----
  const keyboard = new Group()
  keyboard.position.set(-0.1, top, 0.7)
  keyboard.rotation.x = 0.05
  group.add(keyboard)
  k.put(keyboard, rbox(k, 1.58, 0.05, 0.56, 0.025), aluminium, 0, 0.025, 0)
  const caps = new InstancedMesh(rbox(k, 0.088, 0.035, 0.088, 0.016), k.std(0xffffff, { rough: 0.55 }), 75)
  const capMatrix = new Matrix4()
  const capColor = new Color()
  for (let r = 0; r < 5; r += 1) {
    for (let c = 0; c < 15; c += 1) {
      capMatrix.makeTranslation(-0.7 + c * 0.1, 0.067, -0.2 + r * 0.1)
      caps.setMatrixAt(r * 15 + c, capMatrix)
      capColor.set((r === 0 && c === 0) || (r === 2 && c === 14) ? 0x20e399 : r === 4 ? 0x3a3650 : 0x23202f)
      caps.setColorAt(r * 15 + c, capColor)
    }
  }
  keyboard.add(caps)
  k.put(
    keyboard,
    plane(k, 1.5, 0.5),
    k.screen(softTexture(k, 'keysglow', [[0, 'rgba(160,140,255,0.8)'], [1, 'rgba(160,140,255,0)']]), {
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      opacity: 0.14,
    }),
    0,
    0.052,
    0,
    -Math.PI / 2,
  )

  // ---- mouse ----
  const mouse = k.put(
    group,
    sph(k, 0.17, 28, 18),
    k.glossy(0xcfd3dd, { rough: 0.25, clearcoat: 0.8, clearcoatRough: 0.1 }),
    1.1,
    top + 0.04,
    0.72,
  )
  mouse.scale.set(0.72, 0.4, 1.12)
  mouse.rotation.y = -0.2

  // ---- phone on a stand, running the app ----
  const phone = new Group()
  phone.position.set(1.7, top, 0.3)
  phone.rotation.y = -0.5
  group.add(phone)
  k.put(phone, rbox(k, 0.5, 0.04, 0.4, 0.02), aluminium, 0, 0.02, 0)
  const phoneBody = new Group()
  phoneBody.position.set(0, 0.52, -0.05)
  phoneBody.rotation.x = -0.16
  phone.add(phoneBody)
  k.put(phoneBody, rbox(k, 0.5, 0.98, 0.045, 0.07), bezel, 0, 0, 0)
  k.put(phoneBody, plane(k, 0.44, 0.9), k.screen(appScreenTexture(k)), 0, 0, 0.024)
  k.put(phoneBody, rbox(k, 0.12, 0.022, 0.006, 0.01), k.flat(0x050408), 0, 0.44, 0.026)

  // ---- tablet with the wireframe the screens were built from ----
  const tablet = new Group()
  tablet.position.set(-1.55, top, 0.35)
  tablet.rotation.y = 0.45
  group.add(tablet)
  k.put(tablet, rbox(k, 1.2, 0.04, 0.88, 0.05), k.glossy(0xcfd3dd, { rough: 0.25, clearcoat: 0.5 }), 0, 0.02, 0)
  k.put(tablet, rbox(k, 1.14, 0.006, 0.82, 0.04), bezel, 0, 0.042, 0)
  k.put(tablet, plane(k, 1.07, 0.785), k.screen(wireframeTexture(k)), 0, 0.0455, 0, -Math.PI / 2)

  return {
    group,
    update() {
      // nothing moves: the work is on the screens
    },
  }
}

// ---------------------------------------------------------------------------
// 7. Deployment: shipping to production
// ---------------------------------------------------------------------------
/** The front of one rack server: drive bays, vents and status lights */
function serverUnitTexture(k) {
  return k.tex('serverUnit', 512, 112, (ctx, w, h) => {
    ctx.fillStyle = '#12101c'
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 4; i += 1) {
      roundRect(ctx, 22 + i * 62, 22, 52, 68, 5, '#1d1a2c')
      roundRect(ctx, 30 + i * 62, 34, 36, 6, 2, '#2c2840')
      roundRect(ctx, 30 + i * 62, 48, 36, 6, 2, '#2c2840')
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'
    ctx.lineWidth = 2
    for (let v = 0; v < 22; v += 1) {
      ctx.beginPath()
      ctx.moveTo(290 + v * 6, 28)
      ctx.lineTo(290 + v * 6, 84)
      ctx.stroke()
    }
    roundRect(ctx, 446, 30, 44, 8, 3, '#2c2840')
  })
}

function deployment(k) {
  const group = new Group()
  plinth(k, group, 2.4)
  const top = 0.34

  // ---- the cloud: smooth, glossy white, with an upload arrow, floating above the servers ----
  const cloudY = 2.4
  const cloud = new Group()
  cloud.position.set(0, cloudY, 0)
  cloud.scale.setScalar(0.92)
  group.add(cloud)
  const cloudBody = new Group()
  cloudBody.scale.z = 0.62
  cloud.add(cloudBody)
  const white = k.glossy(0xf3efff, { rough: 0.22, clearcoat: 1, clearcoatRough: 0.06, envIntensity: 1.7 })
  ;[
    [-0.66, -0.12, 0.42],
    [0.0, 0.22, 0.62],
    [0.68, -0.06, 0.46],
  ].forEach(([x, y, r]) => k.put(cloudBody, sph(k, r, 48, 32), white, x, y, 0))
  k.put(cloudBody, k.geo('cloudBase', () => new CapsuleGeometry(0.3, 1.3, 12, 32)), white, 0, -0.24, 0, 0, 0, Math.PI / 2)
  // The curved "smile" arrow in orange: a smooth, tapering ribbon with an arrowhead,
  // laid onto the cloud's front surface
  const smile = k.geo('smileArrow', () => {
    const spheres = [
      [-0.66, -0.12, 0.42],
      [0.0, 0.22, 0.62],
      [0.68, -0.06, 0.46],
    ]
    // Height of the cloud's front at (x, y), with the creases between its lobes smoothed out
    const front = (x, y) => {
      const beta = 30
      let sum = 0
      spheres.forEach(([cx, cy, r]) => {
        const h = 0.62 * Math.sqrt(Math.max(r * r - (x - cx) ** 2 - (y - cy) ** 2, 0))
        sum += Math.exp(beta * h)
      })
      const base = 0.62 * Math.sqrt(Math.max(0.09 - (y + 0.24) ** 2, 0)) * (Math.abs(x) <= 0.7 ? 1 : 0)
      sum += Math.exp(beta * base)
      return Math.log(sum) / beta
    }
    const p0 = new Vector2(-0.5, 0.06)
    const c = new Vector2(0.0, -0.36)
    const p2 = new Vector2(0.4, 0.04)
    const bezier = (t) =>
      new Vector2(
        (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * c.x + t * t * p2.x,
        (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * c.y + t * t * p2.y,
      )
    const tangentAt = (t) =>
      new Vector2(
        2 * (1 - t) * (c.x - p0.x) + 2 * t * (p2.x - c.x),
        2 * (1 - t) * (c.y - p0.y) + 2 * t * (p2.y - c.y),
      ).normalize()

    const positions = []
    const indices = []
    const lift = 0.02
    const addPoint = (x, y) => {
      positions.push(x, y, front(x, y) + lift)
      return positions.length / 3 - 1
    }
    const strip = (rows, cols, pointAt) => {
      const start = positions.length / 3
      for (let r = 0; r <= rows; r += 1) {
        for (let q = 0; q <= cols; q += 1) {
          const [x, y] = pointAt(r / rows, (q / cols) * 2 - 1)
          addPoint(x, y)
        }
      }
      for (let r = 0; r < rows; r += 1) {
        for (let q = 0; q < cols; q += 1) {
          const a = start + r * (cols + 1) + q
          const b = a + 1
          const d = a + cols + 1
          const e = d + 1
          indices.push(a, d, b, b, d, e)
        }
      }
    }
    // the body: thin on the left, widening to the right
    strip(70, 8, (t, v) => {
      const point = bezier(t)
      const tangent = tangentAt(t)
      const width = 0.006 + 0.072 * t
      return [point.x - tangent.y * width * v, point.y + tangent.x * width * v]
    })
    // the head: a triangle that carries on in the direction of the curve
    const end = bezier(1)
    const direction = tangentAt(1)
    strip(10, 8, (s, v) => {
      const halfWidth = 0.15 * (1 - s)
      const centre = new Vector2(end.x + direction.x * 0.22 * s, end.y + direction.y * 0.22 * s)
      return [centre.x - direction.y * halfWidth * v, centre.y + direction.x * halfWidth * v]
    })

    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute(positions, 3))
    g.setIndex(indices)
    g.computeVertexNormals()
    return g
  })
  const smileMaterial = k.std(0xff9900, { rough: 0.3, glow: 0.2, envIntensity: 1.4, double: true })
  smileMaterial.polygonOffset = true
  smileMaterial.polygonOffsetFactor = -2
  smileMaterial.polygonOffsetUnits = -2
  k.put(cloud, smile, smileMaterial)

  // ---- servers on the base: three stacks of rack units ----
  const dark = k.glossy(0x15131d, { rough: 0.35, clearcoat: 0.8, clearcoatRough: 0.1 })
  const aluminium = k.std(0xd5d8e2, { rough: 0.3, metal: 1, envIntensity: 1.7 })
  const lights = []
  const stack = (x, z, turn, units) => {
    const s = new Group()
    s.position.set(x, top, z)
    s.rotation.y = turn
    group.add(s)
    for (let i = 0; i < units; i += 1) {
      const y = 0.1 + i * 0.235
      k.put(s, rbox(k, 0.98, 0.2, 0.64, 0.03), dark, 0, y, 0)
      k.put(s, plane(k, 0.92, 0.2), k.screen(serverUnitTexture(k)), 0, y, 0.322)
      const led = k.glowSprite(0x20e399, 0.12, 0.8)
      led.position.set(0.4, y + 0.04, 0.33)
      s.add(led)
      lights.push({ sprite: led, phase: i * 1.3 + x * 2 })
    }
    k.put(s, rbox(k, 1.02, 0.03, 0.68, 0.012), aluminium, 0, 0.1 + units * 0.235 - 0.09, 0)
  }
  stack(0, 0.1, 0, 6)
  stack(-1.35, -0.05, 0.3, 4)
  stack(1.35, -0.05, -0.3, 4)

  return {
    group,
    update(dt, time, active) {
      cloud.position.y = cloudY + Math.sin(time * 1.1) * 0.05
      cloud.rotation.y = Math.sin(time * 0.5) * 0.15
      lights.forEach(({ sprite, phase }) => {
        sprite.material.opacity = Math.sin(time * 5 + phase * 3) > -0.2 ? 0.55 + active * 0.35 : 0.1
      })
    },
  }
}

// ---------------------------------------------------------------------------
// 8. Evaluation / Jury
// ---------------------------------------------------------------------------
/** The jury's screen: just the word JURY, on the same soft gradient and faint arcs as the other screens */
function evaluationTexture(k) {
  return k.tex('evaluation', 1024, 576, (ctx, w, h) => {
    const sans = '"Plus Jakarta Sans", Arial, sans-serif'
    const bg = ctx.createLinearGradient(0, 0, w, h)
    bg.addColorStop(0, '#08031f')
    bg.addColorStop(1, '#1a0e55')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)
    const glow = ctx.createRadialGradient(w * 0.82, h * 0.78, 0, w * 0.82, h * 0.78, h * 0.9)
    glow.addColorStop(0, 'rgba(138,99,245,0.45)')
    glow.addColorStop(1, 'rgba(138,99,245,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'
    ctx.lineWidth = 2
    for (let i = 1; i <= 4; i += 1) {
      ctx.beginPath()
      ctx.arc(w * 0.82, h * 0.78, i * 120, 0, Math.PI * 2)
      ctx.stroke()
    }

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    if ('letterSpacing' in ctx) ctx.letterSpacing = '24px'
    ctx.fillStyle = '#f4f2f6'
    ctx.font = `300 130px ${sans}`
    ctx.fillText('JURY', w / 2 + 12, h / 2 - 10)
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
    roundRect(ctx, w / 2 - 36, h / 2 + 62, 72, 3, 1.5, '#20e399')
  })
}

/** A judge's score sheet on a clipboard */
function scoreSheetTexture(k) {
  return k.tex('scoreSheet', 256, 340, (ctx, w, h) => {
    ctx.fillStyle = '#fbfaff'
    ctx.fillRect(0, 0, w, h)
    roundRect(ctx, 20, 22, 110, 12, 4, '#2b2540')
    roundRect(ctx, 20, 44, 70, 7, 3.5, '#c9c2e0')
    ctx.strokeStyle = '#c9c2e0'
    ctx.lineWidth = 2
    for (let i = 0; i < 5; i += 1) {
      const y = 92 + i * 44
      ctx.strokeRect(22, y - 9, 16, 16)
      roundRect(ctx, 52, y - 6, 110, 8, 4, '#d9d3ec')
      ctx.strokeStyle = '#33324a'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(192, y + 2)
      ctx.quadraticCurveTo(206, y - 14, 220, y + 2)
      ctx.stroke()
      ctx.strokeStyle = '#c9c2e0'
      ctx.lineWidth = 2
    }
    ctx.strokeStyle = '#1d5fd1'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(24, 92)
    ctx.lineTo(30, 98)
    ctx.lineTo(40, 84)
    ctx.moveTo(24, 136)
    ctx.lineTo(30, 142)
    ctx.lineTo(40, 128)
    ctx.stroke()
  })
}

/** A black leather conference chair on a five-star base */
function conferenceChair(k, parent, x, z, turn) {
  const c = new Group()
  c.position.set(x, 0.34, z)
  c.rotation.y = turn
  parent.add(c)
  const leather = k.glossy(0x17151f, { rough: 0.38, clearcoat: 0.8, clearcoatRough: 0.12 })
  const panel = k.glossy(0x24212f, { rough: 0.42, clearcoat: 0.6, clearcoatRough: 0.15 })
  const steel = k.metal(0xcfd3dd, 0.25)
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2
    const leg = k.put(c, rbox(k, 0.36, 0.03, 0.05, 0.012), steel, Math.sin(a) * 0.18, 0.07, Math.cos(a) * 0.18)
    leg.rotation.y = a + Math.PI / 2
    k.put(c, sph(k, 0.03, 10, 8), k.std(0x15131d, { rough: 0.5 }), Math.sin(a) * 0.35, 0.035, Math.cos(a) * 0.35)
  }
  k.put(c, cyl(k, 0.035, 0.045, 0.34, 14), steel, 0, 0.27, 0)
  k.put(c, rbox(k, 0.62, 0.1, 0.6, 0.05), leather, 0, 0.5, 0)
  const back = k.put(c, rbox(k, 0.6, 0.78, 0.1, 0.06), leather, 0, 0.98, -0.27)
  back.rotation.x = -0.1
  k.put(c, rbox(k, 0.42, 0.56, 0.03, 0.02), panel, 0, 0.96, -0.215).rotation.x = -0.1
  k.put(c, rbox(k, 0.4, 0.2, 0.09, 0.05), leather, 0, 1.5, -0.29).rotation.x = -0.1
  ;[-0.36, 0.36].forEach((ax) => {
    k.put(c, rbox(k, 0.04, 0.2, 0.04, 0.012), steel, ax, 0.66, -0.05)
    k.put(c, rbox(k, 0.08, 0.04, 0.34, 0.02), leather, ax, 0.78, -0.02)
  })
  return c
}

function jury(k) {
  const group = new Group()
  plinth(k, group, 2.4)
  const top = 0.34
  const aluminium = k.std(0xd5d8e2, { rough: 0.3, metal: 1, envIntensity: 1.7 })
  const bezel = k.glossy(0x0b0a12, { rough: 0.3, clearcoat: 1, clearcoatRough: 0.06 })
  const veneer = k.glossy(0x2a2236, { rough: 0.4, clearcoat: 0.7, clearcoatRough: 0.15 })

  // ---- results screen on a floor-standing display ----
  const wall = new Group()
  wall.position.set(0, top, -1.3)
  group.add(wall)
  ;[-1.35, 1.35].forEach((x) => {
    k.put(wall, rbox(k, 0.1, 0.9, 0.1, 0.03), aluminium, x, 0.45, -0.02)
    k.put(wall, rbox(k, 0.14, 0.04, 0.7, 0.02), aluminium, x, 0.02, 0.15)
  })
  k.put(wall, rbox(k, 3.3, 1.9, 0.08, 0.04), bezel, 0, 1.85, 0)
  k.put(wall, plane(k, 3.18, 1.79), k.screen(evaluationTexture(k)), 0, 1.85, 0.042)
  k.put(
    wall,
    plane(k, 3.18, 1.79),
    k.screen(glareTexture(k), { transparent: true, depthWrite: false, blending: AdditiveBlending }),
    0,
    1.85,
    0.044,
  )

  // ---- the judges' desk ----
  const deskTop = top + 0.78
  k.put(group, rbox(k, 3.1, 0.07, 0.92, 0.03), k.glossy(0xf1eef7, { rough: 0.3, clearcoat: 0.6, clearcoatRough: 0.15 }), 0, deskTop, 0.3)
  k.put(group, rbox(k, 2.96, 0.66, 0.05, 0.02), veneer, 0, top + 0.43, 0.7)
  ;[-1.5, 1.5].forEach((x) => k.put(group, rbox(k, 0.06, 0.74, 0.86, 0.02), veneer, x, top + 0.4, 0.3))

  // ---- three places: chair, name plate, score sheet, water ----
  ;[-0.95, 0, 0.95].forEach((x, i) => {
    conferenceChair(k, group, x, -0.35, (i - 1) * -0.08)
    const surface = deskTop + 0.035
    // name plate
    const plate = k.put(group, rbox(k, 0.42, 0.12, 0.02, 0.008), k.glossy(0xf4f2f6, { rough: 0.3, clearcoat: 0.6 }), x, surface + 0.06, 0.63)
    plate.rotation.x = -0.22
    k.put(group, rbox(k, 0.2, 0.008, 0.022, 0.003), k.flat(PAL.mint), x, surface + 0.045, 0.637).rotation.x = -0.22
    // small score display standing on the desk
    const scoreboard = new Group()
    scoreboard.position.set(x, surface, -0.1)
    scoreboard.rotation.x = -0.12
    group.add(scoreboard)
    k.put(scoreboard, rbox(k, 0.32, 0.32, 0.05, 0.02), k.glossy(0x0b0a12, { rough: 0.3, clearcoat: 1, clearcoatRough: 0.06 }), 0, 0.17, 0)
    k.put(
      scoreboard,
      plane(k, 0.26, 0.26),
      k.screen(numberTexture(k, ['9', '8', '9'][i], '#0e0b20', '#20e399')),
      0,
      0.17,
      0.0265,
    )
    k.put(scoreboard, rbox(k, 0.26, 0.03, 0.14, 0.012), aluminium, 0, 0.015, -0.03)
    // score sheet on a clipboard
    const clip = new Group()
    clip.position.set(x - 0.05, surface + 0.012, 0.28)
    clip.rotation.y = (i - 1) * 0.12
    group.add(clip)
    k.put(clip, rbox(k, 0.34, 0.02, 0.46, 0.008), k.std(0x1d1a2e, { rough: 0.5 }), 0, 0, 0)
    k.put(clip, plane(k, 0.29, 0.39), k.screen(scoreSheetTexture(k)), 0, 0.0115, 0.01, -Math.PI / 2)
    k.put(clip, rbox(k, 0.1, 0.03, 0.04, 0.01), aluminium, 0, 0.018, -0.2)
    // pen
    const pen = new Group()
    pen.position.set(x + 0.2, surface + 0.012, 0.3)
    pen.rotation.y = 0.5 - i * 0.2
    group.add(pen)
    k.put(pen, cyl(k, 0.01, 0.01, 0.3, 12), k.std(0x20202c, { rough: 0.3, metal: 0.7 }), 0, 0, 0, Math.PI / 2, 0, 0)
    // water bottle and glass
    k.put(group, cyl(k, 0.05, 0.05, 0.3, 24), k.std(0xdfeaff, { rough: 0.04, opacity: 0.4, envIntensity: 1.8 }), x + 0.36, surface + 0.15, 0.1)
    k.put(group, cyl(k, 0.045, 0.045, 0.06, 20), k.std(0x2a2638, { rough: 0.4 }), x + 0.36, surface + 0.33, 0.1)
    k.put(group, cyl(k, 0.042, 0.036, 0.1, 24), k.std(0xdfeaff, { rough: 0.04, opacity: 0.4, envIntensity: 1.8 }), x - 0.3, surface + 0.05, 0.12)
  })

  return {
    group,
    update() {
      // a still scene: the judges' places, ready for the final round
    },
  }
}

// ---------------------------------------------------------------------------
// 9. Prize Pool: a winners' podium with a gold trophy
// ---------------------------------------------------------------------------
/** The printed vinyl banner hung across the gantry: ZENITH ’26 on the left, WINNERS on the right */
function gantryBannerTexture(k) {
  return k.tex('gantryBanner', 2048, 376, (ctx, w, h) => {
    const sans = '"Plus Jakarta Sans", Arial, sans-serif'
    const bg = ctx.createLinearGradient(0, 0, w, h)
    bg.addColorStop(0, '#0a0526')
    bg.addColorStop(1, '#22126b')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)
    const glow = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.35)
    glow.addColorStop(0, 'rgba(138,99,245,0.35)')
    glow.addColorStop(1, 'rgba(138,99,245,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 3
    for (let i = 1; i <= 5; i += 1) {
      ctx.beginPath()
      ctx.arc(w * 0.5, h * 0.5, i * 90, 0, Math.PI * 2)
      ctx.stroke()
    }
    // thin gold rules along the top and bottom edges
    ctx.fillStyle = '#e0a93c'
    ctx.fillRect(0, 0, w, 8)
    ctx.fillRect(0, h - 8, w, 8)

    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    if ('letterSpacing' in ctx) ctx.letterSpacing = '18px'
    ctx.fillStyle = '#f4f2f6'
    ctx.font = `700 150px ${sans}`
    ctx.fillText('ZENITH ’26', w * 0.25 + 9, h / 2 + 8)
    ctx.fillStyle = '#ffd98a'
    ctx.font = `700 150px ${sans}`
    ctx.fillText('WINNERS', w * 0.76 + 9, h / 2 + 8)
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
  })
}

/** A large gold place number for the front of a podium block */
function numeralTexture(k, text) {
  return k.tex(`numeral${text}`, 256, 256, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    const g = ctx.createLinearGradient(0, 40, 0, h - 40)
    g.addColorStop(0, '#ffe9a8')
    g.addColorStop(0.5, '#e0a93c')
    g.addColorStop(1, '#a8741c')
    ctx.fillStyle = g
    ctx.font = '700 200px "Plus Jakarta Sans", Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, w / 2, h / 2 + 10)
  })
}

/** A chequered strip across the road, the finish line */
function finishLineTexture(k) {
  return k.tex('finishLine', 256, 40, (ctx, w, h) => {
    const cell = 20
    for (let x = 0; x < w / cell; x += 1) {
      for (let y = 0; y < h / cell; y += 1) {
        ctx.fillStyle = (x + y) % 2 ? '#f4f2f6' : '#15131d'
        ctx.fillRect(x * cell, y * cell, cell, cell)
      }
    }
  })
}

function prize(k) {
  const group = new Group()
  plinth(k, group, 2.5)

  // ---- the winners' podium: a low dark base slab, then three lacquered white blocks with gold trim ----
  const floor = 0.34
  k.put(group, rbox(k, 4.1, 0.12, 1.4, 0.05), k.glossy(0x1d1a2e, { rough: 0.35, clearcoat: 0.8, clearcoatRough: 0.1 }), 0, floor + 0.06, 0)
  k.put(group, rbox(k, 3.9, 0.02, 0.02, 0.006), k.flat(0xffe3a0, { toneMapped: false }), 0, floor + 0.04, 0.71)
  const lacquer = k.glossy(0xf1eef7, { rough: 0.3, clearcoat: 1, clearcoatRough: 0.06, envIntensity: 1.5 })
  const trimGold = k.std(0xffd27a, { rough: 0.2, metal: 1, envIntensity: 2 })
  const block = (x, height, place) => {
    const y0 = floor + 0.12
    k.put(group, rbox(k, 1.15, height, 1.05, 0.05), lacquer, x, y0 + height / 2, 0)
    k.put(group, rbox(k, 1.19, 0.05, 1.09, 0.02), trimGold, x, y0 + height + 0.025, 0)
    k.put(group, rbox(k, 1.19, 0.04, 1.09, 0.02), trimGold, x, y0 + 0.02, 0)
    k.put(
      group,
      plane(k, 0.62, 0.62),
      k.screen(numeralTexture(k, place), { transparent: true, depthWrite: false }),
      x,
      y0 + height * 0.5,
      0.529,
    )
    return y0 + height + 0.05
  }
  const secondTop = block(-1.28, 0.9, '2')
  const firstTop = block(0, 1.3, '1')
  const thirdTop = block(1.28, 0.65, '3')

  // ---- the winners' gantry: a steel box-truss finish gantry across the road, well back towards the camera ----
  const gantry = new Group()
  gantry.position.set(0, 0.25, 15)
  group.add(gantry)
  const chordSteel = k.metal(0xc4c8d4, 0.28)
  const braceSteel = k.metal(0xaeb2c0, 0.35)
  const darkSteel = k.std(0x23202f, { rough: 0.4, metal: 0.7 })
  const span = 2.6 // x of each tower
  const towerHeight = 4.45
  const truss = 0.52 // the width of every truss

  // one InstancedMesh of thin diagonal braces; each entry is [position, axis, angle, length]
  const braceMesh = (entries) => {
    const mesh = new InstancedMesh(cyl(k, 0.011, 0.011, 1, 6), braceSteel, entries.length)
    const matrix = new Matrix4()
    entries.forEach(([at, rotation, length], i) => {
      matrix.compose(at, rotation, new Vector3(1, length, 1))
      mesh.setMatrixAt(i, matrix)
    })
    return mesh
  }
  const turn = (axis, angle) => new Quaternion().setFromAxisAngle(axis, angle)
  const X = new Vector3(1, 0, 0)
  const Y = new Vector3(0, 1, 0)
  const Z = new Vector3(0, 0, 1)
  const entries = []

  // towers: four corner tubes, with zig-zag bracing on all four faces
  const segments = 8
  const pitch = towerHeight / segments
  const slant = Math.atan(truss / pitch)
  const diagonal = Math.hypot(truss, pitch)
  ;[-span, span].forEach((cx) => {
    ;[-1, 1].forEach((sx) =>
      [-1, 1].forEach((sz) =>
        k.put(gantry, cyl(k, 0.03, 0.03, towerHeight, 10), chordSteel, cx + (sx * truss) / 2, towerHeight / 2, (sz * truss) / 2),
      ),
    )
    for (let j = 0; j < segments; j += 1) {
      const y = (j + 0.5) * pitch
      const sign = j % 2 ? 1 : -1
      ;[-1, 1].forEach((side) => {
        // front and back faces (in the XY plane)
        entries.push([new Vector3(cx, y, (side * truss) / 2), turn(Z, sign * slant), diagonal])
        // left and right faces (in the YZ plane)
        entries.push([new Vector3(cx + (side * truss) / 2, y, 0), turn(X, sign * slant), diagonal])
      })
    }
    // heavy base: steel plate, two ballast blocks and an outrigger strut at the back
    k.put(gantry, rbox(k, 1.0, 0.06, 1.0, 0.02), darkSteel, cx, 0.03, 0)
    ;[0.1, 0.32].forEach((y) => k.put(gantry, rbox(k, 0.56, 0.2, 0.56, 0.03), k.std(0x15131d, { rough: 0.7 }), cx, y + 0.06, -0.62))
    k.put(gantry, cyl(k, 0.022, 0.022, 2.7, 8), chordSteel, cx, 1.25, -0.9, 0.476, 0, 0)
    k.put(gantry, rbox(k, 0.66, 0.1, 0.66, 0.03), darkSteel, cx, towerHeight + 0.05, 0)
  })

  // the top truss: four tubes between the towers, braced on the front, back and underside
  const topY = towerHeight - truss / 2
  const topLength = span * 2
  ;[-1, 1].forEach((sy) =>
    [-1, 1].forEach((sz) =>
      k.put(gantry, cyl(k, 0.03, 0.03, topLength, 10), chordSteel, 0, topY + (sy * truss) / 2, (sz * truss) / 2, 0, 0, Math.PI / 2),
    ),
  )
  const bays = 10
  const bay = (topLength - truss) / bays
  const topSlant = Math.atan(bay / truss)
  const topDiagonal = Math.hypot(bay, truss)
  for (let j = 0; j < bays; j += 1) {
    const x = -topLength / 2 + truss / 2 + (j + 0.5) * bay
    const sign = j % 2 ? 1 : -1
    ;[-1, 1].forEach((side) => {
      entries.push([new Vector3(x, topY, (side * truss) / 2), turn(Z, sign * topSlant), topDiagonal])
    })
    // underside: laid flat, running from the front tube to the back tube
    entries.push([
      new Vector3(x, topY - truss / 2, 0),
      turn(Y, sign * topSlant).multiply(turn(X, Math.PI / 2)),
      topDiagonal,
    ])
  }
  gantry.add(braceMesh(entries))

  // the printed vinyl banner hung from the front of the top truss
  const bannerMaterial = k.track(
    new MeshStandardMaterial({ map: gantryBannerTexture(k), roughness: 0.85, metalness: 0, envMapIntensity: 0.6 }),
  )
  const banner = k.put(gantry, plane(k, topLength - truss - 0.1, 0.9), bannerMaterial, 0, topY - truss / 2 - 0.36, truss / 2 + 0.02)
  banner.castShadow = true
  // a thin light strip under the truss, and three flood lights on top aimed at the banner
  k.put(gantry, rbox(k, topLength - truss - 0.1, 0.02, 0.02, 0.006), k.flat(PAL.mint), 0, topY - truss / 2 - 0.01, truss / 2 + 0.03)
  const floodGlows = [-1.5, 0, 1.5].map((x) => {
    const lamp = new Group()
    lamp.position.set(x, towerHeight + 0.14, truss / 2 + 0.1)
    lamp.rotation.x = 0.85
    gantry.add(lamp)
    k.put(lamp, cyl(k, 0.1, 0.12, 0.26, 24), darkSteel, 0, 0, 0, Math.PI / 2, 0, 0)
    k.put(lamp, cyl(k, 0.115, 0.115, 0.02, 24), k.flat(0xfff2dc, { toneMapped: false }), 0, 0, 0.14, Math.PI / 2, 0, 0)
    const glow = k.glowSprite(0xfff0d6, 0.7, 0.55)
    glow.position.set(0, 0, 0.2)
    lamp.add(glow)
    return glow
  })
  // finish line painted across the road
  k.put(
    gantry,
    plane(k, 2.6, 0.42),
    k.screen(finishLineTexture(k), { polygonOffset: true, polygonOffsetFactor: -8, polygonOffsetUnits: -8 }),
    0,
    0.02,
    0,
    -Math.PI / 2,
  )

  const trophy = new Group()
  trophy.position.y = firstTop
  trophy.scale.setScalar(1.1)
  group.add(trophy)
  const gold = k.std(0xffcf70, { rough: 0.14, metal: 1, double: true, envIntensity: 2.2 })
  const cup = k.geo('trophy', () => {
    const profile = [
      [0, 0],
      [0.52, 0],
      [0.52, 0.1],
      [0.36, 0.18],
      [0.14, 0.3],
      [0.12, 0.45],
      [0.14, 0.62],
      [0.3, 0.75],
      [0.5, 1.05],
      [0.62, 1.4],
      [0.66, 1.75],
      [0.62, 1.88],
      [0.55, 1.84],
      [0.58, 1.72],
      [0.54, 1.4],
      [0.4, 1.1],
      [0.18, 0.95],
      [0, 0.92],
    ].map(([x, y]) => new Vector2(x, y))
    return new LatheGeometry(profile, 48)
  })
  k.put(trophy, cup, gold)
  k.put(trophy, tor(k, 0.3, 0.05, 10, 28), gold, 0.7, 1.4, 0)
  k.put(trophy, tor(k, 0.3, 0.05, 10, 28), gold, -0.7, 1.4, 0)
  // smaller silver and bronze cups on the second and third places
  const miniTrophy = (x, top, material) => {
    const small = new Group()
    small.position.set(x, top, 0)
    small.scale.setScalar(0.38)
    group.add(small)
    k.put(small, cup, material)
    k.put(small, tor(k, 0.3, 0.05, 10, 28), material, 0.7, 1.4, 0)
    k.put(small, tor(k, 0.3, 0.05, 10, 28), material, -0.7, 1.4, 0)
  }
  miniTrophy(-1.28, secondTop, k.std(0xe3e7f0, { rough: 0.16, metal: 1, double: true, envIntensity: 2 }))
  miniTrophy(1.28, thirdTop, k.std(0xd9965f, { rough: 0.2, metal: 1, double: true, envIntensity: 2 }))

  // A soft golden glow behind the trophy
  const beam = k.glowSprite(0xffd98a, 4.5, 0.2)
  beam.position.set(0, 2.6, -0.2)
  group.add(beam)

  // Gold specks drifting up through the light
  const count = 46
  const positions = new Float32Array(count * 3)
  const seeds = Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 3.2,
    z: (Math.random() - 0.5) * 3.2,
    y: 0.6 + Math.random() * 4,
    speed: 0.12 + Math.random() * 0.25,
    sway: Math.random() * 6,
  }))
  const specksGeometry = k.track(new BufferGeometry())
  specksGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  const specksMaterial = k.track(
    new PointsMaterial({
      color: new Color(0xffd98a),
      size: 0.07,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    }),
  )
  const specks = new Points(specksGeometry, specksMaterial)
  specks.frustumCulled = false
  group.add(specks)

  return {
    group,
    update(dt, time, active) {
      trophy.rotation.y += dt * (0.35 + active * 0.7)
      beam.material.opacity = 0.14 + active * 0.2
      specks.visible = active > 0.03
      specksMaterial.opacity = active
      if (!specks.visible) return
      const attr = specksGeometry.attributes.position
      seeds.forEach((s, i) => {
        s.y += dt * s.speed
        if (s.y > 4.8) s.y = 0.6
        attr.setXYZ(i, s.x + Math.sin(time * 0.8 + s.sway) * 0.2, s.y, s.z + Math.cos(time * 0.7 + s.sway) * 0.2)
      })
      attr.needsUpdate = true
    },
  }
}

const BUILDERS = [
  community,
  panels,
  speaker,
  goodies,
  hackathon,
  ideation,
  prototyping,
  deployment,
  jury,
  prize,
]

/** The scene for stop `index` (cycles if there are more stops than builders). */
export function buildProp(kit, index) {
  const prop = BUILDERS[index % BUILDERS.length](kit)
  // Solid surfaces cast and receive shadows (where the renderer has them on)
  prop.group.traverse((object) => {
    if (object.isMesh && object.material.isMeshStandardMaterial && !object.material.transparent) {
      object.castShadow = true
      object.receiveShadow = true
    }
  })
  return prop
}
