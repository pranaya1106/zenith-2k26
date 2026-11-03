import { useEffect, useRef } from 'react'
import {
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  DoubleSide,
  Fog,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  NeutralToneMapping,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'
import { createKit } from './story3d/kit'
import { buildProp } from './story3d/props'
import { buildWorld, FOG_COLOR } from './story3d/world'
import { PATH_OVERRUN } from './storyChapters'

/*
  The 3D world for the story: a stylised valley at dusk with a winding road.
  Each stop on the road has its own small diorama beside it (story3d/props.js),
  the land, sky and sun are in story3d/world.js.

  Kept light enough for phones:
  - flat-shaded lit materials only; no textures, shadows or post-processing
  - terrain, lamps and trees are one mesh each (lamps and trees are instanced)
  - only dioramas within a couple of stops of the camera are drawn
  - pixel ratio capped (1.25 on phones, 1.75 elsewhere), no antialiasing and a
    30 fps cap on phones, nothing drawn while the story is off screen

  The camera rides the path; its position along it is the page's scroll
  progress (state.current.value, 0 to 1), eased so it glides.
*/

const SEGMENTS = 240 // along the path
const RADIAL = 5 // around the path's tube
const GAP = 7.5 // distance between stops along z
const FINAL_AHEAD = 17.5 // the winners' podium stands this far beyond the end of the curve

const damp = (from, to, rate, dt) => from + (to - from) * (1 - Math.exp(-rate * dt))
const clamp01 = (v) => Math.max(0, Math.min(1, v))

export default function StoryCanvas({ state, count }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const small = window.matchMedia('(max-width: 760px), (pointer: coarse)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer
    try {
      renderer = new WebGLRenderer({
        canvas,
        antialias: !small,
        powerPreference: 'low-power',
      })
    } catch {
      // No WebGL: the text and the purple stage still work without the scene
      return undefined
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.75))
    renderer.setClearColor(FOG_COLOR)
    // Neutral tone mapping keeps the brand colours while rolling off highlights
    renderer.toneMapping = NeutralToneMapping
    renderer.toneMappingExposure = 0.82
    // Real shadows on desktop only; phones skip them
    if (!small) {
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = PCFSoftShadowMap
    }

    const kit = createKit()
    const scene = new Scene()
    scene.fog = new Fog(FOG_COLOR, 20, 95)

    const camera = new PerspectiveCamera(48, 1, 0.3, 600)

    // Light: a soft sky/ground fill, a warm key light that follows the active
    // stop (and casts its shadows on desktop), and the environment map below
    scene.add(new HemisphereLight(0xc9bcff, 0x1a0d4a, 0.3))
    const keyLight = new DirectionalLight(0xffd9c4, 2.0)
    const keyDirection = new Vector3(-0.45, 0.8, 0.55).normalize()
    if (!small) {
      keyLight.castShadow = true
      keyLight.shadow.mapSize.set(1024, 1024)
      const cam = keyLight.shadow.camera
      cam.left = -11
      cam.right = 11
      cam.top = 11
      cam.bottom = -11
      cam.near = 5
      cam.far = 60
      // Generous bias: the large flat pads otherwise show striped shadow acne
      keyLight.shadow.bias = -0.0015
      keyLight.shadow.normalBias = 0.09
    }
    scene.add(keyLight, keyLight.target)

    // ---- the path ----
    // A long, gentle S-bend. The curve is fitted through many closely spaced points on a smooth
    // function, so it has no corners and no tight bends (the tightest radius is about 40 units).
    const sampleCount = 160
    const points = Array.from({ length: sampleCount + 1 }, (_, n) => {
      const s = (n / sampleCount) * (count - 1)
      return new Vector3(
        Math.sin(s * 0.62) * 3.2,
        Math.sin(s * 0.5 + 0.8) * 0.9 + s * 0.1,
        -s * GAP,
      )
    })
    const curve = new CatmullRomCurve3(points, false, 'catmullrom', 0.5)
    // a finer lookup table, so points taken by distance along the curve are evenly spaced
    curve.arcLengthDivisions = 2000
    curve.updateArcLengths()

    // ---- the land, sky and sun ----
    const world = buildWorld(kit, curve, { small })
    scene.add(world.group, world.sky, world.sun)

    // The road carries straight on past the last stop, so the camera can run on through the
    // winners' arch. `onRoad` gives the point and heading at distance fraction t (1 = end of curve).
    const length = curve.getLength()
    const end = curve.getPointAt(1)
    const endHeading = curve.getTangentAt(1)
    endHeading.y = 0
    endHeading.normalize()
    const onRoad = (t, point, headingOut) => {
      if (t <= 1) {
        curve.getPointAt(Math.max(t, 0), point)
        curve.getTangentAt(Math.max(t, 0), headingOut)
      } else {
        point.copy(end).addScaledVector(endHeading, (t - 1) * length)
        headingOut.copy(endHeading)
      }
    }

    // ---- reflections: a small cube map of the sky, sun and an overhead softbox ----
    const pmrem = new PMREMGenerator(renderer)
    const envScene = new Scene()
    envScene.add(world.sky.clone())
    const envSun = world.sun.clone()
    envSun.position.set(0, 60, -150)
    envScene.add(envSun)
    const softbox = new Mesh(
      new PlaneGeometry(140, 140),
      new MeshBasicMaterial({ color: new Color(2, 1.8, 1.7), side: DoubleSide, toneMapped: false }),
    )
    softbox.position.set(0, 80, 0)
    softbox.rotation.x = Math.PI / 2
    envScene.add(softbox)
    const envTarget = pmrem.fromScene(envScene, 0.03, 0.1, 1000)
    scene.environment = envTarget.texture
    scene.environmentIntensity = 0.7
    softbox.geometry.dispose()
    softbox.material.dispose()
    pmrem.dispose()

    // ---- the lit line on the road: faint for the whole route, mint for what's travelled ----
    const tubeGeometry = new TubeGeometry(curve, SEGMENTS, 0.04, RADIAL, false)
    const progressGeometry = tubeGeometry.clone()
    const lineMaterial = new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
    const progressMaterial = new MeshBasicMaterial({ color: 0x20e399 })
    const progressLine = new Mesh(progressGeometry, progressMaterial)
    progressLine.scale.setScalar(1.001)
    scene.add(new Mesh(tubeGeometry, lineMaterial), progressLine)

    // ---- one diorama per stop, on the right-hand side of the road ----
    const sideOffset = small ? 3.7 : 4.3
    const clearance = small ? 3.7 : 4.5
    const propScale = small ? 0.78 : 1
    const tangent = new Vector3()
    const stops = Array.from({ length: count }, (_, i) => {
      const u = count > 1 ? i / (count - 1) : 0
      const onPath = curve.getPointAt(u)
      curve.getTangentAt(u, tangent)
      tangent.y = 0
      tangent.normalize()
      // Start beside the road, then move out until the pad clears every bend of it
      let distance = sideOffset
      let x = onPath.x - tangent.z * distance
      let z = onPath.z + tangent.x * distance
      for (let tries = 0; tries < 10 && world.sample(x, z).d < clearance; tries += 1) {
        distance += 0.5
        x = onPath.x - tangent.z * distance
        z = onPath.z + tangent.x * distance
      }
      // The last stop is not beside the road: the winners' podium stands on the road itself,
      // beyond the end of the curve, with the arch across the road in front of it
      const isFinal = i === count - 1
      if (isFinal) {
        distance = 0
        x = end.x + endHeading.x * FINAL_AHEAD
        z = end.z + endHeading.z * FINAL_AHEAD
      }
      const prop = buildProp(kit, i)
      prop.group.position.set(x, world.sample(x, z).h - 0.02, z)
      // Front of the diorama faces back down the road, turned slightly towards it
      prop.group.rotation.y = isFinal
        ? Math.atan2(-endHeading.x, -endHeading.z)
        : Math.atan2(-tangent.x, -tangent.z) - 0.45
      prop.group.scale.setScalar(isFinal ? 1 : propScale)
      scene.add(prop.group)
      return { ...prop, active: 0, distance }
    })


    // ---- sizing: the scene sits to the right of the text (desktop) or above it (phones) ----
    let needsDraw = true
    const resize = () => {
      const host = canvas.parentElement
      const width = host.clientWidth
      const height = host.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      if (width > 760) camera.setViewOffset(width, height, -width * 0.17, 0, width, height)
      else camera.setViewOffset(width, height, 0, height * 0.14, width, height)
      camera.updateProjectionMatrix()
      needsDraw = true
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas.parentElement)
    resize()

    // ---- a little pointer parallax on desktop ----
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 }
    const onPointer = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2
    }
    if (!small && !reduceMotion) window.addEventListener('pointermove', onPointer, { passive: true })

    // ---- loop ----
    const position = new Vector3()
    const ahead = new Vector3()
    const heading = new Vector3()
    const scratch = new Vector3()
    const smoothHeading = new Vector3(0, 0, -1)
    let headingReady = false
    const offset = small ? new Vector3(0, 2.2, 9.4) : new Vector3(0, 2.0, 7.6)
    const frameGap = small ? 1000 / 30 : 0
    let travelled = state.current.value
    let raf = 0
    let lastTime = performance.now()
    let ready = false

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      if (!state.current.visible || document.hidden) {
        lastTime = now
        return
      }
      if (frameGap && now - lastTime < frameGap) return
      const dt = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      const target = state.current.value
      const moving = Math.abs(target - travelled) > 0.0001
      travelled = damp(travelled, target, 5, dt)

      // With reduced motion only draw when the scroll position moved
      if (reduceMotion && !moving && !needsDraw) return
      needsDraw = false

      const time = reduceMotion ? 0 : now / 1000
      const step = reduceMotion ? 0 : dt
      pointer.sx = damp(pointer.sx, pointer.x, 3, dt)
      pointer.sy = damp(pointer.sy, pointer.y, 3, dt)

      // Camera: behind and above the road, looking ahead and a little towards the diorama
      // The camera sits a fixed distance behind the point it follows, along the road's own
      // (smoothed) heading, so it always looks straight down the road however the road bends.
      const pathT = travelled * (1 + PATH_OVERRUN)
      onRoad(pathT, position, heading)
      heading.y = 0
      heading.normalize()
      if (headingReady) smoothHeading.lerp(heading, 1 - Math.exp(-6 * dt)).normalize()
      else {
        smoothHeading.copy(heading)
        headingReady = true
      }
      onRoad(pathT + 0.05, ahead, scratch)
      const hx = smoothHeading.x
      const hz = smoothHeading.z
      camera.position.set(
        position.x - hx * offset.z - hz * pointer.sx * 0.6,
        position.y + offset.y - pointer.sy * 0.4,
        position.z - hz * offset.z + hx * pointer.sx * 0.6,
      )
      // Look a little towards the nearby dioramas, however far out they sit
      const stopFloat = Math.min(pathT, 1) * (count - 1)
      const lower = Math.floor(stopFloat)
      const upper = Math.min(lower + 1, count - 1)
      const lateral =
        (stops[lower].distance +
          (stops[upper].distance - stops[lower].distance) * (stopFloat - lower)) *
        (small ? 0.62 : 0.77)
      camera.lookAt(ahead.x - hz * lateral, ahead.y + 0.6, ahead.z + hx * lateral)

      // The sky and sun stay put relative to the camera, so they read as far away
      world.sky.position.copy(camera.position)
      world.sun.lookAt(camera.position)

      // Dioramas: only those near the camera are drawn and animated
      const f = Math.min(pathT, 1) * (count - 1)
      const nearest = Math.round(f)
      stops.forEach((stop, i) => {
        const distance = Math.abs(f - i)
        stop.group.visible = distance < 2.6
        if (!stop.group.visible) return
        stop.active = clamp01(1.4 - distance * 2.2)
        stop.update(step, time, stop.active)
      })

      const lead = stops[nearest]
      keyLight.target.position.copy(lead.group.position)
      keyLight.position.copy(lead.group.position).addScaledVector(keyDirection, 30)

      world.update(step, time, camera.position)
      progressGeometry.setDrawRange(0, Math.floor(Math.min(pathT, 1) * SEGMENTS) * RADIAL * 6)

      renderer.render(scene, camera)

      if (!ready) {
        ready = true
        canvas.classList.add('is-ready')
      }
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('pointermove', onPointer)
      kit.dispose()
      envTarget.dispose()
      tubeGeometry.dispose()
      progressGeometry.dispose()
      lineMaterial.dispose()
      progressMaterial.dispose()
      renderer.dispose()
    }
  }, [state, count])

  return <canvas className="story__canvas" ref={canvasRef} aria-hidden="true" />
}
