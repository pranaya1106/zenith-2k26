import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  DoubleSide,
  FrontSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
} from 'three'

/* Brand palette plus the neutral materials the dioramas are built from */
export const PAL = {
  white: 0xf4f2f6,
  pink: 0xfb57a6,
  mint: 0x20e399,
  gold: 0xe0a93c,
  violet: 0x8a63f5,
  deep: 0x2c1380,
  stage: 0x4a28b8,
  ink: 0x1b0a52,
  concrete: 0x2b2745,
  charcoal: 0x1d1a2e,
  steel: 0xbcc0cc,
  fabric: 0x3d3180,
}

/*
  Shares geometries, materials and textures between objects and remembers them
  so the whole world can be disposed of in one call. Surfaces are physically
  based (MeshStandardMaterial) and picked up by the scene's environment map.
*/
export function createKit() {
  const geometries = new Map()
  const materials = new Map()
  const textures = new Map()
  const extras = []

  /** A shared geometry, built once per key. */
  const geo = (key, make) => {
    if (!geometries.has(key)) geometries.set(key, make())
    return geometries.get(key)
  }

  /** A physically based material. `glow` makes it self-lit; `metal` is 0 to 1. */
  const std = (color, options = {}) => {
    const {
      rough = 0.6,
      metal = 0,
      glow = 0,
      glowColor = color,
      double = false,
      opacity = 1,
      envIntensity = 1,
    } = options
    const key = `s${color}-${rough}-${metal}-${glow}-${glowColor}-${double}-${opacity}-${envIntensity}`
    if (!materials.has(key)) {
      materials.set(
        key,
        new MeshStandardMaterial({
          color,
          roughness: rough,
          metalness: metal,
          emissive: glow ? glowColor : 0x000000,
          emissiveIntensity: glow,
          side: double ? DoubleSide : FrontSide,
          transparent: opacity < 1,
          opacity,
          depthWrite: opacity >= 1,
          envMapIntensity: envIntensity,
        }),
      )
    }
    return materials.get(key)
  }

  /** Satin painted / plastic surface with a soft sheen */
  const lit = (color, glow = 0, double = false) =>
    std(color, { rough: 0.42, glow, double, envIntensity: 1.3 })

  /** A glossy lacquered / leather-like surface with a clear coat on top */
  const glossy = (color, { rough = 0.35, clearcoat = 0.9, clearcoatRough = 0.1, envIntensity = 1.5 } = {}) => {
    const key = `g${color}-${rough}-${clearcoat}-${clearcoatRough}-${envIntensity}`
    if (!materials.has(key)) {
      materials.set(
        key,
        new MeshPhysicalMaterial({
          color,
          roughness: rough,
          metalness: 0,
          clearcoat,
          clearcoatRoughness: clearcoatRough,
          envMapIntensity: envIntensity,
        }),
      )
    }
    return materials.get(key)
  }

  /** Woven cloth: very rough with a soft sheen along the edges, like cotton or satin */
  const fabric = (color, rough = 0.95) => {
    const key = `f${color}-${rough}`
    if (!materials.has(key)) {
      materials.set(
        key,
        new MeshPhysicalMaterial({
          color,
          roughness: rough,
          metalness: 0,
          sheen: 1,
          sheenRoughness: 0.5,
          sheenColor: new Color(color).lerp(new Color(0xffffff), 0.5),
          side: DoubleSide,
        }),
      )
    }
    return materials.get(key)
  }

  /** Polished or brushed metal */
  const metal = (color, rough = 0.28, double = false) => std(color, { rough, metal: 1, double })

  /** An unlit material (screens, lamps, light strips, light cones) */
  const flat = (color, options = {}) => {
    const key = `b${color}-${JSON.stringify(options)}`
    if (!materials.has(key)) materials.set(key, new MeshBasicMaterial({ color, ...options }))
    return materials.get(key)
  }

  /** A canvas-drawn texture (screens, signs). `draw(ctx, width, height)` runs once. */
  const tex = (key, width, height, draw) => {
    if (!textures.has(key)) {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      draw(canvas.getContext('2d'), width, height)
      const texture = new CanvasTexture(canvas)
      texture.colorSpace = SRGBColorSpace
      texture.anisotropy = 4
      textures.set(key, texture)
    }
    return textures.get(key)
  }

  /** A soft round glow (white centre fading to nothing), tinted by `color` */
  const glowTexture = () =>
    tex('glow', 128, 128, (ctx, w, h) => {
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(0.25, 'rgba(255,255,255,0.45)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    })

  /** A soft blob for smoke and haze: several overlapping round gradients */
  const puffTexture = () =>
    tex('puff', 128, 128, (ctx, w, h) => {
      const blobs = [
        [0.5, 0.5, 0.42],
        [0.34, 0.56, 0.3],
        [0.66, 0.54, 0.3],
        [0.46, 0.36, 0.26],
        [0.58, 0.64, 0.24],
      ]
      blobs.forEach(([x, y, r]) => {
        const g = ctx.createRadialGradient(x * w, y * h, 0, x * w, y * h, r * w)
        g.addColorStop(0, 'rgba(255,255,255,0.55)')
        g.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      })
    })

  /** An unlit, textured surface for screens and signs (kept at its drawn colours) */
  const screen = (texture, options = {}) => {
    const key = `scr${texture.uuid}-${JSON.stringify(options)}`
    if (!materials.has(key)) {
      materials.set(key, new MeshBasicMaterial({ map: texture, toneMapped: false, ...options }))
    }
    return materials.get(key)
  }

  /** An additive glow billboard */
  const glowSprite = (color, size, opacity = 0.6) => {
    const material = new SpriteMaterial({
      map: glowTexture(),
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    extras.push(material)
    const sprite = new Sprite(material)
    sprite.scale.set(size, size, 1)
    return sprite
  }

  /** A mesh at a position (and optional rotation), added to `parent`. */
  const put = (parent, geometry, material, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
    const mesh = new Mesh(geometry, material)
    mesh.position.set(x, y, z)
    mesh.rotation.set(rx, ry, rz)
    parent.add(mesh)
    return mesh
  }

  /** Anything created outside the kit that also needs disposing later. */
  const track = (disposable) => {
    extras.push(disposable)
    return disposable
  }

  const dispose = () => {
    geometries.forEach((g) => g.dispose())
    materials.forEach((m) => m.dispose())
    textures.forEach((t) => t.dispose())
    extras.forEach((e) => e.dispose?.())
    geometries.clear()
    materials.clear()
    textures.clear()
    extras.length = 0
  }

  return {
    geo,
    std,
    fabric,
    glossy,
    lit,
    metal,
    flat,
    screen,
    tex,
    glowTexture,
    puffTexture,
    glowSprite,
    put,
    track,
    dispose,
    Group,
  }
}
