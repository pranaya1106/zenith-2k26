import {
  AdditiveBlending,
  BackSide,
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Quaternion,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector3,
} from 'three'

/*
  The land the story travels through: a valley at dusk.

    sky        a gradient dome (follows the camera) and a large soft sun that
               the road leads towards
    terrain    one finely subdivided, smooth-shaded, vertex-coloured mesh. The
               road runs along a flat valley floor; the ground rises into
               ridges to either side
    road       an asphalt ribbon with edge lines
    lamps      posts along the left of the road, with a soft warm glow
    pines      three-tier conifers on the slopes, in muted colours
    clouds     a few large soft cloud sprites, and dust in the air

  Everything is built once; per frame only the clouds drift.
*/

export const FOG_COLOR = 0x5a3fae

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

export function buildWorld(kit, curve, { small }) {
  const group = new Group()
  const end = curve.getPointAt(1)
  const zStart = 40
  const zEnd = end.z - 90
  const samples = curve.getPoints(small ? 220 : 340)

  // The road carries straight on past both ends of the curve (behind the first
  // stop, where the camera starts, and beyond the last), so it never stops short
  const length = curve.getLength()
  const BEFORE = 38
  const AFTER = 70
  const startPoint = curve.getPointAt(0)
  const endPoint = curve.getPointAt(1)
  const startHeading = curve.getTangentAt(0)
  const endHeading = curve.getTangentAt(1)
  startHeading.y = 0
  startHeading.normalize()
  endHeading.y = 0
  endHeading.normalize()
  /** Point on the road at `distance` along it (negative = before the start, beyond `length` = after the end). */
  const roadAt = (distance, point, tangent) => {
    if (distance < 0) {
      point.copy(startPoint).addScaledVector(startHeading, distance)
      tangent.copy(startHeading)
    } else if (distance > length) {
      point.copy(endPoint).addScaledVector(endHeading, distance - length)
      tangent.copy(endHeading)
    } else {
      curve.getPointAt(distance / length, point)
      curve.getTangentAt(distance / length, tangent)
    }
  }
  for (let d = -BEFORE; d < 0; d += 4) {
    samples.push(startPoint.clone().addScaledVector(startHeading, d))
  }
  for (let d = 4; d <= AFTER; d += 4) {
    samples.push(endPoint.clone().addScaledVector(endHeading, d))
  }

  // ---- terrain height ----
  const noise = (x, z) =>
    Math.sin(x * 0.09 + 1.3) * Math.cos(z * 0.11) +
    Math.sin(x * 0.21 + z * 0.17) * 0.5 +
    Math.sin(x * 0.45 - z * 0.38 + 2) * 0.2

  /** Ground height at (x, z), the distance to the road, and the road's own height there. */
  const sample = (x, z) => {
    let best = Infinity
    let pathY = 0
    for (let i = 0; i < samples.length; i += 1) {
      const p = samples[i]
      const dx = x - p.x
      const dz = z - p.z
      const d2 = dx * dx + dz * dz
      if (d2 < best) {
        best = d2
        pathY = p.y
      }
    }
    const d = Math.sqrt(best)
    const open = smoothstep(7, 20, d)
    const n = noise(x, z)
    const ridge = clamp((n + 1.7) / 3.4, 0, 1)
    const fine = Math.sin(x * 1.3 + z * 0.9) * Math.cos(z * 1.1 - x * 0.7) * 0.12 * open
    // Along the road the ground is perfectly flat and well below the road surface, so it can
    // never rise through it; the hills and the gentle undulation only start beside the road
    const corridor = 1 - smoothstep(3.4, 7, d)
    const h =
      pathY -
      0.26 +
      (1 - corridor) * (0.14 + open * (ridge * ridge * 13 - 0.4) + (1 - open) * n * 0.14 + fine)
    return { h, d, pathY }
  }

  // ---- terrain mesh ----
  {
    const width = 220
    const length = zStart - zEnd
    const geometry = new PlaneGeometry(width, length, small ? 90 : 150, small ? 70 : 120)
    geometry.rotateX(-Math.PI / 2)
    geometry.translate(0, 0, (zStart + zEnd) / 2)
    const position = geometry.attributes.position
    const colors = new Float32Array(position.count * 3)
    const low = new Color(0x160c46)
    const mid = new Color(0x36228a)
    const high = new Color(0x8a74d8)
    const c = new Color()
    for (let i = 0; i < position.count; i += 1) {
      const { h, pathY } = sample(position.getX(i), position.getZ(i))
      position.setY(i, h)
      const t = clamp((h - pathY) / 13, 0, 1)
      if (t < 0.5) c.copy(low).lerp(mid, t * 2)
      else c.copy(mid).lerp(high, (t - 0.5) * 2)
      const jitter = 1 + Math.sin(i * 12.9898) * 0.03
      colors.set([c.r * jitter, c.g * jitter, c.b * jitter], i * 3)
    }
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
    geometry.computeVertexNormals()
    kit.track(geometry)
    const material = kit.track(new MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0, envMapIntensity: 0.12 }))
    const terrain = new Mesh(geometry, material)
    terrain.receiveShadow = true
    group.add(terrain)
  }

  // ---- road: asphalt ribbon with edge lines ----
  // The centre line is sampled once, at evenly spaced distances, and the direction at each point is
  // taken from its two neighbours, so the road and its edge lines bend smoothly together.
  const roadSteps = small ? 300 : 520
  const centreline = Array.from({ length: roadSteps + 1 }, (_, i) => {
    const point = new Vector3()
    const unused = new Vector3()
    roadAt(-BEFORE + (i / roadSteps) * (length + BEFORE + AFTER), point, unused)
    return point
  })
  const centreTangent = centreline.map((point, i) => {
    const before = centreline[Math.max(i - 1, 0)]
    const after = centreline[Math.min(i + 1, roadSteps)]
    return new Vector3(after.x - before.x, 0, after.z - before.z).normalize()
  })
  const ribbon = (offset, half, lift, steps) => {
    const vertices = new Float32Array((steps + 1) * 2 * 3)
    const indices = []
    const point = new Vector3()
    const tangent = new Vector3()
    for (let i = 0; i <= steps; i += 1) {
      point.copy(centreline[i])
      tangent.copy(centreTangent[i])
      const rx = -tangent.z
      const rz = tangent.x
      vertices.set(
        [point.x + rx * (offset - half), point.y + lift, point.z + rz * (offset - half)],
        i * 6,
      )
      vertices.set(
        [point.x + rx * (offset + half), point.y + lift, point.z + rz * (offset + half)],
        i * 6 + 3,
      )
      if (i < steps) {
        const a = i * 2
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
      }
    }
    const geometry = kit.track(new BufferGeometry())
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()
    return geometry
  }
  {
    const steps = roadSteps
    const roadMaterial = kit.std(0x17132a, { rough: 0.85, double: true, envIntensity: 0.15 })
    // Win every depth tie against the ground, so the road is always drawn on top of it
    roadMaterial.polygonOffset = true
    roadMaterial.polygonOffsetFactor = -3
    roadMaterial.polygonOffsetUnits = -3
    const road = new Mesh(ribbon(0, 1.3, -0.03, steps), roadMaterial)
    road.receiveShadow = true
    road.renderOrder = 1
    group.add(road)
    const line = kit.flat(0xffffff, { transparent: true, opacity: 0.5, side: DoubleSide })
    line.polygonOffset = true
    line.polygonOffsetFactor = -5
    line.polygonOffsetUnits = -5
    const leftLine = new Mesh(ribbon(-1.12, 0.03, -0.02, steps), line)
    const rightLine = new Mesh(ribbon(1.12, 0.03, -0.02, steps), line)
    leftLine.renderOrder = 2
    rightLine.renderOrder = 2
    group.add(leftLine, rightLine)
  }

  // ---- lamps along the left of the road ----
  {
    const count = small ? 14 : 22
    const poles = new InstancedMesh(
      kit.track(new CylinderGeometry(0.03, 0.04, 1.5, 8)),
      kit.metal(0x3a3650, 0.4),
      count,
    )
    const heads = new InstancedMesh(
      kit.track(new SphereGeometry(0.09, 12, 8)),
      kit.flat(0xffe0b0, { toneMapped: false }),
      count,
    )
    const glowPositions = new Float32Array(count * 3)
    const matrix = new Matrix4()
    const quaternion = new Quaternion()
    const scale = new Vector3(1, 1, 1)
    const p = new Vector3()
    const t = new Vector3()
    for (let i = 0; i < count; i += 1) {
      const u = (i + 0.5) / count
      curve.getPointAt(u, p)
      curve.getTangentAt(u, t)
      t.y = 0
      t.normalize()
      const x = p.x + t.z * 2.5
      const z = p.z - t.x * 2.5
      matrix.compose(new Vector3(x, p.y + 0.68, z), quaternion, scale)
      poles.setMatrixAt(i, matrix)
      matrix.compose(new Vector3(x, p.y + 1.42, z), quaternion, scale)
      heads.setMatrixAt(i, matrix)
      glowPositions.set([x, p.y + 1.42, z], i * 3)
    }
    group.add(poles, heads)

    const glowGeometry = kit.track(new BufferGeometry())
    glowGeometry.setAttribute('position', new Float32BufferAttribute(glowPositions, 3))
    const glowMaterial = kit.track(
      new PointsMaterial({
        map: kit.glowTexture(),
        color: 0xffc98a,
        size: 2.1,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    )
    group.add(new Points(glowGeometry, glowMaterial))
  }

  // ---- conifers on the slopes ----
  {
    const wanted = small ? 40 : 90
    const material = kit.track(new MeshStandardMaterial({ roughness: 1, metalness: 0, envMapIntensity: 0.15 }))
    const tiers = [
      { geometry: new ConeGeometry(1.0, 2.2, 9), lift: 1.1 },
      { geometry: new ConeGeometry(0.78, 1.8, 9), lift: 2.2 },
      { geometry: new ConeGeometry(0.54, 1.4, 9), lift: 3.1 },
    ].map(({ geometry, lift }) => ({
      lift,
      mesh: new InstancedMesh(kit.track(geometry), material, wanted),
    }))
    const palette = [0x1d4a55, 0x23405f, 0x2e3a78, 0x2a5d4f].map((hex) => new Color(hex))
    const matrix = new Matrix4()
    const quaternion = new Quaternion()
    let placed = 0
    for (let attempt = 0; attempt < wanted * 12 && placed < wanted; attempt += 1) {
      const x = (Math.random() - 0.5) * 150
      const z = zStart - 10 - Math.random() * (zStart - zEnd - 20)
      const { h, d } = sample(x, z)
      // Keep clear of the road and of the camera that rides behind it
      if (d < 18 || d > 42) continue
      const s = 0.8 + Math.random() * (small ? 0.7 : 1.2)
      const color = palette[Math.floor(Math.random() * palette.length)]
      tiers.forEach(({ lift, mesh }) => {
        matrix.compose(new Vector3(x, h + lift * s, z), quaternion, new Vector3(s, s, s))
        mesh.setMatrixAt(placed, matrix)
        mesh.setColorAt(placed, color)
      })
      placed += 1
    }
    tiers.forEach(({ mesh }) => {
      mesh.count = placed
      group.add(mesh)
    })
  }

  // ---- clouds: large soft sprites high in the sky ----
  const cloudMaterial = kit.track(
    new SpriteMaterial({
      map: kit.puffTexture(),
      color: 0xc4b3ee,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      fog: false,
    }),
  )
  const clouds = Array.from({ length: small ? 5 : 8 }, (_, i) => {
    const cloud = new Sprite(cloudMaterial)
    const side = i % 2 ? 1 : -1
    cloud.position.set(side * (20 + Math.random() * 45), 24 + Math.random() * 16, -i * 18 - 10)
    const size = 38 + Math.random() * 30
    cloud.scale.set(size, size * 0.5, 1)
    group.add(cloud)
    return cloud
  })

  // ---- dust ----
  {
    const count = small ? 60 : 130
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 36
      positions[i * 3 + 1] = Math.random() * 11
      positions[i * 3 + 2] = 10 - Math.random() * (zStart - zEnd - 20)
    }
    const geometry = kit.track(new BufferGeometry())
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    const material = kit.track(
      new PointsMaterial({
        color: 0xffffff,
        size: 0.07,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      }),
    )
    group.add(new Points(geometry, material))
  }

  // ---- a few tiny seeds drifting slowly down through the air around the camera ----
  const flakeCount = small ? 36 : 70
  const flakeSpan = 16 // half the width / depth of the box of air they live in
  const flakeTop = 7
  const flakeBottom = -4.5
  const flakePositions = new Float32Array(flakeCount * 3)
  const flakeSeeds = Array.from({ length: flakeCount }, () => ({
    speed: 0.2 + Math.random() * 0.25,
    phase: Math.random() * Math.PI * 2,
  }))
  for (let i = 0; i < flakeCount; i += 1) {
    flakePositions[i * 3] = (Math.random() * 2 - 1) * flakeSpan
    flakePositions[i * 3 + 1] = flakeBottom + Math.random() * (flakeTop - flakeBottom)
    flakePositions[i * 3 + 2] = (Math.random() * 2 - 1) * flakeSpan
  }
  const flakeGeometry = kit.track(new BufferGeometry())
  flakeGeometry.setAttribute('position', new Float32BufferAttribute(flakePositions, 3))
  const flakes = new Points(
    flakeGeometry,
    kit.track(
      new PointsMaterial({
        map: kit.glowTexture(),
        color: 0xffffff,
        size: 0.05,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      }),
    ),
  )
  flakes.frustumCulled = false
  group.add(flakes)

  // ---- sky dome and sun (not part of `group`: they follow the camera) ----
  const sky = (() => {
    const geometry = kit.track(new SphereGeometry(300, 24, 16))
    const position = geometry.attributes.position
    const colors = new Float32Array(position.count * 3)
    const horizon = new Color(FOG_COLOR)
    const mid = new Color(0x2e1580)
    const top = new Color(0x0b0332)
    const c = new Color()
    for (let i = 0; i < position.count; i += 1) {
      const ny = position.getY(i) / 300
      if (ny <= 0) c.copy(horizon).lerp(mid, smoothstep(0, -0.4, ny))
      else c.copy(horizon).lerp(mid, smoothstep(0, 0.3, ny)).lerp(top, smoothstep(0.3, 0.95, ny))
      colors.set([c.r, c.g, c.b], i * 3)
    }
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
    const material = kit.track(
      new MeshBasicMaterial({ vertexColors: true, side: BackSide, fog: false, depthWrite: false }),
    )
    const mesh = new Mesh(geometry, material)
    mesh.renderOrder = -3
    return mesh
  })()

  const sun = (() => {
    const texture = kit.tex('sun', 256, 256, (ctx, w, h) => {
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
      g.addColorStop(0, 'rgba(255,246,238,1)')
      g.addColorStop(0.1, 'rgba(255,214,226,1)')
      g.addColorStop(0.22, 'rgba(255,150,200,0.85)')
      g.addColorStop(0.5, 'rgba(235,125,225,0.25)')
      g.addColorStop(1, 'rgba(200,120,240,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    })
    const mesh = new Mesh(
      kit.track(new PlaneGeometry(190, 190)),
      kit.track(
        new MeshBasicMaterial({
          map: texture,
          transparent: true,
          fog: false,
          depthWrite: false,
          toneMapped: false,
        }),
      ),
    )
    mesh.renderOrder = -2
    mesh.position.set(0, 44, end.z - 190)
    return mesh
  })()

  return {
    group,
    sky,
    sun,
    sample,
    update(dt, time = 0, focus) {
      // the seeds move with the camera, drift down and sway a little, and start again at the top
      if (focus) flakes.position.copy(focus)
      const positions = flakeGeometry.attributes.position
      for (let i = 0; i < flakeCount; i += 1) {
        const seed = flakeSeeds[i]
        let x = positions.getX(i) + Math.sin(time * 0.6 + seed.phase) * 0.12 * dt
        let y = positions.getY(i) - seed.speed * dt
        let z = positions.getZ(i) + Math.cos(time * 0.5 + seed.phase) * 0.1 * dt
        if (y < flakeBottom) {
          y = flakeTop
          x = (Math.random() * 2 - 1) * flakeSpan
          z = (Math.random() * 2 - 1) * flakeSpan
        }
        positions.setXYZ(i, x, y, z)
      }
      positions.needsUpdate = true
      clouds.forEach((cloud, i) => {
        cloud.position.x += dt * (0.3 + (i % 3) * 0.12) * (i % 2 ? 1 : -1)
        if (Math.abs(cloud.position.x) > 80) cloud.position.x *= -0.9
      })
    },
  }
}

