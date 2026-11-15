# Shlash 3D Hero — assets & node map

Cinematic scroll-driven R3D hero. Until GLBs are present, the scene runs on **procedural PBR fallbacks** (truck, worker, boxes). Drop the optimized assets below and the loaders switch automatically when `truck.opt.glb` + `worker.glb` respond to `HEAD`.

## File placement

| Asset | Path | Notes |
|---|---|---|
| Box truck (Draco + WebP) | `public/models/truck.opt.glb` | Prefer `gltf-transform optimize … --compress draco --texture-compress webp` |
| Worker (rigged + clips) | `public/models/worker.glb` | Clips listed below |
| Cardboard box | `public/models/box.glb` | Optional; procedural box used otherwise |
| HDRI (golden hour) | `public/textures/env.hdr` | Optional; falls back to drei `sunset` preset |
| Primary logo | `public/shlash_primary_logo_transparent.png` | Already in repo — **do not stretch / recolor** |
| Reduced-motion poster | `public/media/poster.jpg` | Used when `prefers-reduced-motion` |
| Reduced-motion video | `public/media/hero.mp4` | Short autoplay loop fallback |

### Optimize the truck

```bash
# Package name is @gltf-transform/cli (not gltf-transform)
npm i -D @gltf-transform/cli
npx gltf-transform optimize public/models/truck.glb public/models/truck.opt.glb --compress draco --texture-compress webp
```

## Expected truck node names

Canonical names live in `timeline.ts` → `NODE_NAMES`.

| Node | Role |
|---|---|
| `door_L` | Rear left door (hinge at outer edge) |
| `door_R` | Rear right door |
| `cab_door` | Driver cab door |
| `wheel_FL` / `wheel_FR` / `wheel_RL` / `wheel_RR` | Wheels (spin on departure) |
| `cargo_box` | Cargo volume (optional) |
| `logo_decal_L` / `logo_decal_R` | Side panels for `<Decal>` (optional) |

### If your exporter used different names

Edit `NODE_ALIASES` in `timeline.ts`:

```ts
export const NODE_ALIASES: Record<string, string> = {
  Door_L: "door_L",
  rear_door_L: "door_L",
  // …
};
```

Or rename nodes in Blender before export. The GLTF truck loader also does a case-insensitive fuzzy match as a last resort.

**Door convention:** rear doors start **open** (`rotation.y ≈ ±0.92π`). Scroll progress `0.55–0.65` lerps them shut with `power2.inOut`. Cab door opens around `0.70–0.72`, closes `0.76–0.78`.

## Worker animation clips

Scrubbed by scroll (`action.time = t * duration`, `paused = true`) — **not** realtime playback:

| Clip | Used during |
|---|---|
| `Idle` | Intro / gaps |
| `Walk` | To pallet / to cab |
| `PickUp` | At pallet |
| `CarryWalk` | Pallet → truck |
| `PlaceBox` | Into cargo |
| `CloseDoor` | `0.55–0.65` |
| `ClimbIn` | `0.72–0.76` |

If clip names differ, update `WORKER_CLIPS` / the fuzzy matcher in `Worker.tsx`.

## Scroll phases (`timeline.ts`)

| Progress | Phase |
|---|---|
| `0.00–0.10` | Intro push-in + title mask reveal |
| `0.10–0.55` | 8 load cycles (walk → pick → carry → place) |
| `0.55–0.65` | Close rear doors + logo close-up |
| `0.65–0.78` | Walk to cab → open → climb → close |
| `0.78–1.00` | Truck departure, wheels, dust, CTA |

Pin height: **600vh** (`PIN_VH`). Master timeline uses ScrollTrigger `scrub: 1`, driven through existing Lenis + `ScrollTrigger.update`.

## Logo decal rules

- Source: `shlash_primary_logo_transparent.png`
- Aspect **1889∶2076** (`SCENE.logoAspect`) — scale width/height accordingly
- Never stretch, rotate, recolor, or edit the artwork
- Applied with drei `<Decal>` on both cargo sides

## Components

```
ShlashHero.tsx      # client entry, dynamic ssr:false, reduced-motion
ShlashScene.tsx     # R3F canvas, lights, post, DPR clamp
Truck.tsx           # GLTF or procedural
Worker.tsx          # clip scrub or procedural posing
Boxes.tsx           # pallet + cargo stack (8)
Overlay.tsx         # Arabic captions, progress, CTA
timeline.ts         # all named timing constants
useScrollTimeline.ts
```

## Performance knobs

- DPR clamp `[1, 1.75]` (mobile `[1, 1.25]`)
- Mobile: lower shadow maps, **no DoF**
- `AdaptiveDpr` / `AdaptiveEvents`
- Draco GLBs + WebP/KTX2 textures when available
- GSAP `context().revert()` on unmount; Three materials disposed with procedural meshes via React tree teardown

## Fonts

- Arabic: Somar → Cairo → Plex (`--font-somar` currently aliases Cairo)
- Latin: Acumin → Outfit (`--font-acumin`)
- To add real Somar/Acumin: place files in `public/fonts` and add `@font-face` in `globals.css`
