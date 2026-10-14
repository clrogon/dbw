# Image Asset Briefs

This doc started as a replacement brief for every AI-generated placeholder image
on the site. Status as of this update:

- **Done** — hero background, "Treinos Personalizados", and "Aulas em Grupo" are
  now real, licensed stock photography (Unsplash License, free for commercial
  use). See each section below for the source/credit.
- **Still AI-generated placeholder, not yet replaced** — "Actividades Aquáticas"
  and "Ginástica Laboral" service images (both judged an acceptable-enough fit
  to not force a weaker stock substitute — see their sections).
- **Deliberately NOT swapped for stock photos** — the 3 instructor portraits.
  Read why in section 1 before touching them.

All site images are WebP. Replace a file in place with whatever comes out of a
real shoot, a new AI generation, or a better stock pick; re-export as WebP
(quality 80–85) rather than reintroducing JPEG.

---

## 1. Instructor portraits — commission real photos, don't regenerate (and don't use stock either)

**A stock photo under these three real names is not a fix — it's arguably worse than
the AI version.** A random, identifiable stranger's licensed stock photo, captioned
"Domingos — Co-Fundador & Instrutor Principal" with real stated credentials and fed
into structured data, misrepresents an actual third party's likeness as a specific
named staff member. That's a different and more serious problem than an AI-generated
face: it's not just "synthetic", it's a real person being misidentified. The
recommendation below is unchanged from when this doc started: real photos of
Domingos, Baltazar, and William, or pull the credential claims until you have them.

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

## 2. Homepage hero background — DONE

**File:** `hero-pool.webp` (2400×1350, ~249KB), replacing the earlier stopgap
(a square `services-aquatic.webp` force-cropped into the widescreen hero).

**Source:** licensed stock photo, [Unsplash License](https://unsplash.com/license)
(free for commercial use, no attribution legally required). Photo by Patrick
Robert Doyle (@teapowered) on Unsplash:
https://unsplash.com/photos/a-large-indoor-swimming-pool-with-a-view-of-the-trees-ls2i2Mh0M4Q

**Why this one:** an elegant symmetric indoor pool with a colonnade and tree view,
no visible text/logos/signage, reads as "serious, premium fitness facility" under
the hero's dark overlay (`bg-foreground/75`). It doesn't show an active coaching
session (the original brief below wanted mid-session energy with people) — no
free, logo-free, real-photograph stock match for that specific combination was
found in this pass. If a better match turns up later, or real photography becomes
available, the spec and original brief below still apply.

**Spec (for any future replacement):**
- 16:9 or wider, minimum 1920×1080 (ideally 2400×1350 for retina/large displays)
- Rendered with `object-cover` under a dark overlay (`bg-foreground/75` — see
  `HeroSection.tsx`), so the image can and should be visually busier/brighter
  than final — the overlay darkens everything by ~75%, text sits on top
- Export as WebP, quality 80–85, target under 250KB
- Composition needs breathing room: keep the main subject roughly centered
  with open space top-and-bottom, since mobile crops this tighter vertically
  than desktop

**Original brief** (an instructor-led session, if a better photo or a real shoot
becomes available): An indoor pool or training space, mid-session energy — an
instructor actively coaching, water in motion, genuine effort on people's faces,
not posed smiling-at-camera stock energy. Warm, slightly golden light if possible
(plays well with the brand's red accent `#C0392B`).

**AI prompt** (if generating rather than sourcing another stock/real photo):

> Wide-angle photo of a modern indoor swimming pool training session, Luanda
> Angola, late afternoon warm light through large windows, one Black male
> swim instructor actively coaching two Black adult swimmers mid-stroke,
> visible water splash and motion, clean minimalist pool architecture with
> teal tile accents, shallow depth of field on the instructor, candid
> documentary photography style, not posed, 16:9 aspect ratio, high detail,
> natural skin tones, no visible text or logos or signage in frame

---

## 3. Service images

**Shared spec for all four:** square or 4:5, minimum 1200×1200, rendered at
`aspect-square`/`aspect-[3/4]` with `object-cover` depending on the component
(`ServicesPreview.tsx`, `Services.tsx`, `ServiceDetail.tsx`) — center the main
subject, avoid putting anything important in the outer 10% on any edge.

Each service now has its own distinct image (previously only 3 photos were
shared across 4 services, so one always reused another's — fixed, including the
same reuse inside `Gallery.tsx`'s fallback photos).

### Actividades Aquáticas (swimming / water activities) — still AI placeholder
Currently: `services-aquatic.webp` (group pool class — good fit, keep as-is for
now; no replacement needed, this one already works).
**Brief:** Small group aquatic class, mixed ages including at least one child,
instructor in the water actively guiding, bright clean indoor pool.
**Prompt:** `Indoor swimming pool, small group lesson, Black swim instructor in
the water guiding two Black children and one adult, bright teal-tiled pool,
daylight through skylights, candid joyful expressions, water motion, square
crop, documentary photography, natural light, no text or logos`

### Treinos Personalizados (personal training) — DONE
**File:** `services-training.webp` (1200×1200, licensed stock), replacing the
old mismatched `services-swim.webp` (an overhead swim-coaching photo, wrong
theme entirely for personal training — it's now correctly used only for its
one accurate role, the "Natação" gallery caption).

**Source:** Unsplash License, free for commercial use. Photo by TSquared Lab
on Unsplash:
https://unsplash.com/photos/woman-performs-exercise-with-trainer-at-gym-cCJQzTPkoFg

A trainer actively coaching one client through a sled-push exercise, genuine
effort visible, modern gym interior — matches the original brief below closely.

**Original brief:** One-on-one personal training session, NOT in a pool — a
gym floor or functional training space, trainer actively spotting/coaching one
client through a strength or functional movement, visible effort and focus.
**AI prompt** (if a future regeneration is wanted instead): `Personal training
session in a modern gym, Black male personal trainer coaching one Black adult
client through a kettlebell or functional movement exercise, trainer actively
spotting, clean minimalist gym interior, natural daylight, genuine effort on
client's face, square crop, documentary photography style, no visible text or
logos`

### Ginástica Laboral (corporate workplace wellness) — still AI placeholder
Currently: `services-wellness.webp` (yoga/meditation by a pool — reasonable fit,
though the poolside setting undersells "at your office"). No free, logo-free,
real-photograph stock match for "multiple office workers mid-stretch-break,
desks and plants visible" was found in this pass (every usable free candidate
was a single person, not a group) — left as-is rather than forcing a weak
substitute.
**Brief:** A short workplace wellness session happening IN an office
environment — desks or an office common area visible — not a spa/pool
setting, to make clear this comes to the client's workplace.
**Prompt:** `Small group office wellness session, 3-4 professionals in business
casual doing a short stretching or seated exercise break in a modern open-plan
office, desks and plants visible in background, natural window light, relaxed
genuine smiles, square crop, documentary corporate photography, no visible
text, logos or screens`

### Aulas em Grupo (group fitness classes — spinning/aerobics/functional) — DONE
**File:** `services-group-fitness.webp` (1200×1200, licensed stock), replacing
the old reused `services-aquatic.webp` (a pool photo for an explicitly
non-aquatic service — same reuse was also wrong in `Gallery.tsx`'s "Aula de
grupo" caption, fixed there too).

**Source:** Unsplash License, free for commercial use. Photo by Trust "Tru"
Katsande on Unsplash:
https://unsplash.com/photos/women-taking-exercise-on-black-stationary-bikes-in-front-of-gray-concrete-wall-A_ftsTh53lM
— a row of women on stationary bikes, engaged and in focus, clean concrete-wall
background, no visible branding.

**Original brief:** Energetic group fitness class, NOT water-based — spinning
bikes or a functional/aerobics studio, multiple participants mid-movement,
motivated group energy.
**AI prompt** (if a future regeneration is wanted instead): `Group fitness
class in a modern studio, 5-6 diverse adults on spin bikes or doing a
functional circuit, mid-motion energy, instructor visible leading at the
front, dynamic lighting with red accent lighting, motivated expressions,
square crop, dynamic action photography, no visible text or logos`

---

## Performance note (applies to all new images, not just these briefs)

The original seven site images were converted from JPEG to WebP (quality 82), a
straight format swap with no component changes needed beyond the import paths — combined
source size dropped from 384,578 bytes to 277,774 bytes (~28% smaller) for the
same pixels. The 3 new licensed-stock images (hero, personal training, group
fitness) were exported directly as WebP at quality 74–82. The PWA icons and
favicon were separately found to be mis-sized (declared as 192×192/512×512 but
actually much larger source images) and were re-exported at their real declared
dimensions.

This was a format-only change — there are still no responsive `srcset` variants
(e.g. 800w/1600w for the hero) and no `<picture>`/multiple-size wiring in any
component. Whatever replaces these images per the briefs above, export as WebP
quality 80–85 (not higher — diminishing returns, bigger files). A `srcset` pass
remains a "nice to have alongside" a future performance pass, not a blocker for
getting real images in place.
