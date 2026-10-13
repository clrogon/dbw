# Image Asset Briefs

Every photographic image currently on the site (`src/assets/*.webp`) is AI-generated
placeholder stock, not a real photo of DBW's people or facility. This doc is the
brief for replacing each one: what it's for, what's wrong with the current
placeholder, the exact spec to match the component it renders in, and a ready
prompt if you're regenerating with AI rather than commissioning a real shoot.

All site images were converted from JPEG to WebP (same pixels, ~28% smaller on
average) — see the Performance Note at the bottom. Replace the `.webp` files in
place with whatever comes out of a real shoot or a new AI generation; re-export
as WebP (quality 80–85) rather than reintroducing JPEG.

**Read the recommendation column before generating anything.** Two of these
(the instructors) should not stay AI-generated — see below.

---

## 1. Instructor portraits — commission real photos, don't regenerate

| File | Used in | Real person |
|---|---|---|
| `instructor-domingos.webp` | `/instrutores`, homepage CMS fallback | Domingos — Co-Fundador & Instrutor Principal |
| `instructor-baltazar.webp` | `/instrutores` | Baltazar — Co-Fundador & Instrutor de Natação |
| `instructor-william.webp` | `/instrutores` | William — Co-Fundador & Instrutor de Grupo |

**Why no AI prompt is given here:** the site names these three people, states their
real credentials ("Licenciado em Educação Física"), and feeds their names/photos
into the homepage's `LocalBusiness` structured data. A synthetic face standing in
for a named, credentialed real person is a trust problem that gets worse the longer
it's live — a prompt here would just be a better-looking version of the same
problem. This is the one place on the site where "AI-generated but good" is still
the wrong answer.

**Do this instead — a 30-minute phone shoot is enough:**
- Plain, light-neutral background (the current placeholders already use this —
  keep it, it's a good default and matches the site's clean aesthetic)
- 3:4 portrait crop (matches `aspect-[3/4] object-cover` in `Instructors.tsx`) —
  shoot vertical, leave headroom, the component crops to this ratio regardless
  of source dimensions
- Each person in DBW-branded kit (actual logo, not a generic brand) if you have
  it; plain solid-colour top otherwise — the current `domingos` placeholder has
  a half-visible orange logo that isn't DBW's, which is its own small tell
  that it's not a real photo
- Soft, even lighting (overcast daylight near a window works fine) — avoid hard
  shadows or a visible flash hotspot
- Export at minimum 1200×1600px, WebP (quality 80–85), sRGB, target 150–300KB
  after compression (current files are 48–64KB each and already look soft at
  full size — don't go lower than that)

If a proper shoot genuinely isn't possible before launch, the least-bad fallback
is removing the specific credential claims and named structured data until real
photos exist, rather than keeping the synthetic images under real names
indefinitely — flag this back if that's the path you want to take, it's a content
change not an image change.

---

## 2. Homepage hero background

**File:** was `hero-bg.jpg` (deleted — unrelated hotel pool photo with a visible
third-party ad banner). Currently repurposing `services-aquatic.webp` as a stopgap
in `HeroSection.tsx`. That's a placeholder, not the final answer — it's a square
(640×640) image being force-cropped into a full-bleed widescreen hero, which
loses people off the edges on wide viewports.

**Spec:**
- 16:9 or wider, minimum 1920×1080 (ideally 2400×1350 for retina/large displays)
- Rendered with `object-cover` under a dark overlay (`bg-foreground/75` — see
  `HeroSection.tsx`), so the image can and should be visually busier/brighter
  than final — the overlay darkens everything by ~75%, text sits on top
- Export as WebP, quality 80–85, target under 250KB (the build pipeline now
  imports `.webp` assets directly — see the Performance Note at the bottom)
- Composition needs breathing room: keep the main subject roughly centered
  with open space top-and-bottom, since mobile crops this tighter vertically
  than desktop

**Brief:** An indoor pool or training space, mid-session energy — an instructor
actively coaching, water in motion, genuine effort on people's faces, not posed
smiling-at-camera stock energy. Warm, slightly golden light if possible (plays
well with the brand's red accent `#C0392B`). Should read as "serious, modern,
professional fitness facility in Luanda" — not generic stock-photo gym.

**AI prompt** (if commissioning real photography isn't feasible before launch):

> Wide-angle photo of a modern indoor swimming pool training session, Luanda
> Angola, late afternoon warm light through large windows, one Black male
> swim instructor actively coaching two Black adult swimmers mid-stroke,
> visible water splash and motion, clean minimalist pool architecture with
> teal tile accents, shallow depth of field on the instructor, candid
> documentary photography style, not posed, 16:9 aspect ratio, high detail,
> natural skin tones, no visible text or logos or signage in frame

---

## 3. Service images — one distinct image per service

**Files:** `services-aquatic.webp`, `services-swim.webp`, `services-wellness.webp` —
only three images shared across four services (`src/data/services.ts`), so one
service always reuses another's photo. A previous pass fixed the worst mismatch
(the group pool-class photo was wired to "Treinos Personalizados" instead of
"Actividades Aquáticas"), but the underlying gap — three photos for four
services — is still real. Below is a dedicated brief + prompt per service, so a
future pass can give each one its own image.

**Shared spec for all four:** square or 4:5, minimum 1200×1200, rendered at
`aspect-square`/`aspect-[3/4]` with `object-cover` depending on the component
(`ServicesPreview.tsx`, `Services.tsx`, `ServiceDetail.tsx`) — center the main
subject, avoid putting anything important in the outer 10% on any edge.

### Actividades Aquáticas (swimming / water activities)
Currently: `services-aquatic.webp` (group pool class — good fit, keep).
**Brief:** Small group aquatic class, mixed ages including at least one child,
instructor in the water actively guiding, bright clean indoor pool.
**Prompt:** `Indoor swimming pool, small group lesson, Black swim instructor in
the water guiding two Black children and one adult, bright teal-tiled pool,
daylight through skylights, candid joyful expressions, water motion, square
crop, documentary photography, natural light, no text or logos`

### Treinos Personalizados (personal training)
Currently: `services-swim.webp` (overhead 1-on-1 swim coaching — imperfect
stopgap, still swim-themed not strength/training-themed).
**Brief:** One-on-one personal training session, NOT in a pool — a gym floor
or functional training space, trainer actively spotting/coaching one client
through a strength or functional movement, visible effort and focus.
**Prompt:** `Personal training session in a modern gym, Black male personal
trainer coaching one Black adult client through a kettlebell or functional
movement exercise, trainer actively spotting, clean minimalist gym interior,
natural daylight, genuine effort on client's face, square crop, documentary
photography style, no visible text or logos`

### Ginástica Laboral (corporate workplace wellness)
Currently: `services-wellness.webp` (yoga/meditation by a pool — reasonable fit,
though the poolside setting undersells "at your office").
**Brief:** A short workplace wellness session happening IN an office
environment — desks or an office common area visible — not a spa/pool
setting, to make clear this comes to the client's workplace.
**Prompt:** `Small group office wellness session, 3-4 professionals in business
casual doing a short stretching or seated exercise break in a modern open-plan
office, desks and plants visible in background, natural window light, relaxed
genuine smiles, square crop, documentary corporate photography, no visible
text, logos or screens`

### Aulas em Grupo (group fitness classes — spinning/aerobics/functional)
Currently: `services-aquatic.webp` (reused group pool photo — placeholder only;
this service is explicitly non-aquatic per its own copy, spinning/aeróbica).
**Brief:** Energetic group fitness class, NOT water-based — spinning bikes or
a functional/aerobics studio, multiple participants mid-movement, motivated
group energy.
**Prompt:** `Group fitness class in a modern studio, 5-6 diverse adults on
spin bikes or doing a functional circuit, mid-motion energy, instructor
visible leading at the front, dynamic lighting with red accent lighting,
motivated expressions, square crop, dynamic action photography, no visible
text or logos`

---

## Performance note (applies to all new images, not just these briefs)

All seven site images were converted from JPEG to WebP (quality 82), a
straight format swap with no component changes needed beyond the import paths — combined
source size dropped from 384,578 bytes to 277,774 bytes (~28% smaller) for the
same pixels. The PWA icons and favicon were separately found to be mis-sized
(declared as 192×192/512×512 but actually much larger source images) and were
re-exported at their real declared dimensions.

This was a format-only change — there are still no responsive `srcset` variants
(e.g. 800w/1600w for the hero) and no `<picture>`/multiple-size wiring in any
component. Whatever replaces these images per the briefs above, export as WebP
quality 80–85 (not higher — diminishing returns, bigger files). A `srcset` pass
remains a "nice to have alongside" a future performance pass, not a blocker for
getting real images in place.
