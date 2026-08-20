# Empires Jewelry — Design System

Empires Jewelry is a jewelry brand positioning itself as accessible luxury: elegant, contemporary, warm, and premium — not a traditional or rigid jewelry-store aesthetic. The brand's ambition goes beyond selling pieces: it wants to be recognized by its packaging, photography, content, and in-store experience, eventually anchored by a flagship physical store designed entirely around the brand identity (warm lighting, neutral tones, stone/glass/wood/metal materials).

**Sources provided:** a written brand-concept brief (goals, 5-year vision, in-store experience) and one brand moodboard image (`uploads/moodboard.png`) showing the logo lockup, color palette, typography choices, icon set, business cards, and packaging (box, bag, tag, Instagram grid). No codebase, Figma file, or additional decks were provided — everything here is derived from those two sources. If a Figma file or storefront codebase exists, attach it so this system can be verified/extended against real screens.

## Index

- `styles.css` — root stylesheet, imports all tokens (link this one file from consumers)
- `tokens/` — `colors.css`, `typography.css` (incl. `@font-face`), `spacing.css`
- `assets/logo/` — logo lockup + mark crops from the moodboard
- `assets/imagery/` — product photography, packaging photography, social grid
- `assets/icons/` — reference icon sheet (line icons)
- `guidelines/` — 15 foundation specimen cards (Colors, Type, Spacing, Brand)
- `components/` — reusable React UI primitives (forms, feedback, navigation, commerce)
- `ui_kits/storefront/` — e-commerce storefront recreation (home, PDP, cart, checkout confirmation)
- `SKILL.md` — Claude Code–compatible skill wrapper

## Content fundamentals

- **Language:** Spanish (Colombia/LatAm market). Copy in the source material is entirely in Spanish — keep new copy in Spanish unless told otherwise.
- **Address form:** informal "tú" ("acompaña**tu** estilo") is implied by the warm, personal tone; brand statements often use inclusive "nosotros" framing ("Amamos lo que hacemos", "Seleccionamos lo lo mejor para ti").
- **Casing:** short brand phrases are set in tracked-out uppercase (e.g. "ELEGANCIA QUE TE ACOMPAÑA SIEMPRE.", "CALIDAD", "CONFIANZA"). Section labels are uppercase with wide letter-spacing. Sentence case is used for longer supporting copy ("Seleccionamos lo mejor para ti.").
- **Tone:** understated and aspirational, never hype-driven or discount-y. Short declarative lines, no exclamation points, no emoji.
- **Vibe:** "lujo accesible, elegante y contemporáneo" (accessible, elegant, contemporary luxury) — fine and exclusive without being distant.
- **Values vocabulary** (used verbatim across packaging/brand materials): Calidad ("Seleccionamos lo mejor para ti"), Confianza ("Seguridad en cada compra"), Pasión ("Amamos lo que hacemos y se nota"), Exclusividad ("Piezas únicas para personas únicas").
- **Emoji:** none observed. Do not introduce emoji.

## Visual foundations

- **Color:** a warm, muted neutral palette — cream (`#F5EDE6`), taupe (`#8A8176`), stone grey (`#CFC7BE`), gold/tan (`#D4B48C`), and near-black ink (`#3A332D`). No saturated brights. Gold is the only "accent" — used sparingly for warmth, not as a loud CTA color. Backgrounds alternate between cream and ink; taupe and stone are mid-tone supporting surfaces.
- **Type:** two-font pairing. **Cinzel** (serif, classical capitals) for the wordmark and display headlines — always with generous letterspacing, often in full caps. **Montserrat Light** for body copy, labels, and UI text — light weight throughout, never bold body text. Headline hierarchy leans on size and spacing, not weight.
- **Spacing:** generous, airy whitespace; the moodboard's grid uses large, evenly divided blocks rather than dense stacking. Favor a 4px-based scale with roomy multiples (24–96px) between sections.
- **Backgrounds:** full-bleed macro photography of jewelry on soft draped fabric (warm beige silk/satin), shot with shallow depth of field and soft, warm light — no hard flash, no studio-white seamless. No illustration, no repeating pattern/texture, no gradients observed anywhere in the source material.
- **Animation:** not evidenced in source material — no motion specified. Recommend restrained, slow fades/opacity transitions consistent with the calm, premium tone; avoid bouncy or playful easing.
- **Hover states:** not evidenced directly; recommended default for this palette is a subtle darken (gold → gold-dark, taupe → taupe-dark) rather than a color-family jump, consistent with "elegant, not flashy."
- **Press states:** recommended subtle scale-down (~0.98) or slight opacity dip; nothing bouncy.
- **Borders:** thin, low-contrast hairlines (taupe at low opacity) — used to separate photo/color blocks in the moodboard grid rather than boxes around every element.
- **Shadows:** the source material is flat (print-style brand sheet, no UI shadows). For interactive surfaces, use soft, low-opacity ink-tinted shadows (see `--shadow-sm/md/lg`) — never a hard black drop shadow.
- **Corner radii:** the moodboard's applications (business cards, tags) are sharp-cornered or barely-rounded. Keep radii small (2–8px) for cards/buttons; use a full pill only for tags/badges.
- **Cards:** minimal — flat surface, hairline border or soft shadow, small radius, generous internal padding. No colored left-border accent cards.
- **Transparency/blur:** not evidenced; if needed (e.g. a sticky nav), use a light cream-tinted translucency, not heavy blur.
- **Imagery color vibe:** warm, golden, slightly desaturated skin-tone-adjacent neutrals; product photography always includes warm metal tones (gold) against beige fabric — never cool/blue lighting, never black-and-white, no visible grain.
- **Layout rules:** the moodboard itself is built as a strict block grid (unequal column splits, full-bleed photo blocks flush against color blocks) — carry this into UI as clean full-bleed sections with hard edges between color/photo blocks rather than rounded "cards floating on a background."

## Iconography

- Source shows a small set of **thin-outline line icons** (1–1.5px stroke, no fill, rounded joins): diamond, ring, necklace, shopping bag, shield-check, gift. These sit alongside brand-value copy (Calidad/Confianza/Pasión/Exclusividad) and in an "ICONOGRAFÍA" swatch panel.
- No icon font, SVG library, or codebase was provided — only a rendered reference sheet, copied to `assets/icons/icons-sheet.png`. No individual vector icon files exist in source, so components needing icons in this system use inline SVG redrawn to match the observed stroke weight (1.5px, round caps, no fill), rather than inventing a different icon style.
- No emoji or unicode-character icons are used anywhere in the source.
- **Recommendation:** if Empires has (or commissions) a proper icon set, replace the redrawn SVGs in `components/` with the real vector files for pixel-accurate iconography.

## Components

Standard set authored from scratch (no source component library was provided — see Caveats). Grouped by concern:

- **core/**: `Icon` (redrawn line-icon set), `Card` (flat base surface)
- **forms/**: `Button`, `IconButton`, `Input`, `Select`, `Checkbox`, `QuantityStepper`
- **feedback/**: `Badge`, `Tag`
- **navigation/**: `Tabs`
- **commerce/**: `ProductCard`

## Logo

A real logo was provided (in the moodboard) — a faceted-gem mark above the "EMPIRES JEWERLY" wordmark, set in Cinzel with wide tracking, mark in taupe. Cropped straight from the source into `assets/logo/logo-lockup-cream.png` (full lockup) and `assets/logo/mark-only-taupe.png` (mark only). Do not redraw or recreate this logo — always reference these image files.

## Caveats / asks

- **Fonts:** Cinzel and Montserrat match the moodboard exactly (no substitution needed) but are loaded from a public CDN (jsDelivr Fontsource mirror) since no font files were attached — please share the licensed `.woff2`/`.ttf` files if you have them, so we can self-host.
- **Icons** are a redrawn approximation of the 6 icons visible in the moodboard photo (diamond, ring, necklace, bag, shield-check, gift) — please share the original vector/icon-font files if they exist so we can swap in the real ones.
- **No codebase or Figma file** was attached, so the UI kit (storefront) is an original, brand-consistent design rather than a recreation of an existing product screen. If Empires already has a live site or app, attach it so the kit can be corrected to match.
- Everything here is built from a single moodboard image — as the brand produces more material (real photography, packaging specs, a live site), send it over and this system should be updated to match exactly.
