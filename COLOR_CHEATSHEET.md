# Wedding Website Color Cheat Sheet

Use this guide to quickly find and edit the colors shown on the live wedding website.

## Quick answer: where should I edit?

For a complete website recolor, check these files in this order:

1. `app/globals.css` — main website palette and shared color variables
2. `components/loader/loading-screen.css` — loading screen and main home hero overrides
3. `components/loader/envelope-invite.css` — envelope and invitation-opening overrides
4. `content/site.ts` — attire swatches and Gift Registry colors
5. `components/invitation-page.tsx` — animated Silk background

`app/layout.tsx` imports `app/globals.css`, so `app/globals.css` is the active global stylesheet. The separate `styles/globals.css` file is legacy and is not used by the live website.

## Current row/line quick index

These are the current line numbers. They can move after code is added or removed, so use the nearby search term if a row no longer matches.

| What you want to edit | File | Current row | Search term |
|---|---|---:|---|
| Main five-color theme | `app/globals.css` | 158 | `MOTIF COLORS` |
| Main background | `app/globals.css` | 209 | `--color-welcome-bg` |
| Main body text | `app/globals.css` | 220 | `--color-welcome-text` |
| QR-code colors | `app/globals.css` | 111 | `--color-qr-fg` |
| Couple-name colors | `app/globals.css` | 273 | `--couple-name-fill` |
| Circle-pattern colors | `app/globals.css` | 281 | `BACKGROUND - CIRCLE PATTERN` |
| Hero countdown colors | `app/globals.css` | 325 | `HERO COUNTDOWN` |
| Shared envelope variables | `app/globals.css` | 338 | `ENVELOPE - ROYAL NAVY + GOLD` |
| Buttons and highlights | `app/globals.css` | 364 | `OPTIONAL SEMANTIC COLORS` |
| Invitation text/card roles | `app/globals.css` | 391 | `INVITATION DESIGN SYSTEM` |
| Final plain-loader override | `components/loader/loading-screen.css` | 3947 | `Blush romance — loader` |
| Final plain-home-hero override | `components/loader/loading-screen.css` | 4026 | `Blush romance — home hero` |
| Shared pink paper wash | `components/loader/loading-screen.css` | 4222 | `.love-story-bg` |
| Envelope plain-color override | `components/loader/envelope-invite.css` | 2923 | `--env-sky: #E9CAD2` |
| Envelope navy override | `components/loader/envelope-invite.css` | 3329 | `--env-highlight` |
| Animated Silk background | `components/invitation-page.tsx` | 91 | `SILK_COLOR` |
| Page-opening transition color | `components/invitation-page.tsx` | 204 | `bg-[#FBF7F5]` |
| Guest dress-code palette | `content/site.ts` | 166 | `DRESS_CODE_PALETTE` |
| Entourage and sponsor palettes | `content/site.ts` | 180 | `const ATTIRE` |
| Plain/photo display mode | `content/site.ts` | 312 | `DISPLAY_MODE` |
| Loader configurable colors | `content/site.ts` | 440 | `plainTheme` |
| Event Details attire connection | `content/site.ts` | 674 | `attire:` |
| Gift Registry configuration | `content/site.ts` | 1227 | `registry:` |
| Gift Registry colors | `content/site.ts` | 1240 | `colors:` |

---

## Current main palette

| Color | Hex | Main use |
|---|---|---|
| Warm Ivory | `#F8F3F1` | Page backgrounds, cards and invitation paper |
| Royal Navy | `#172D4E` | Main text, headings, buttons and dark backgrounds |
| Dusty Pink | `#C58F9D` | Script text, romantic accents and hearts |
| Soft Blush | `#E9CAD2` | Soft backgrounds, bubbles and highlights |
| Champagne Gold | `#D4B47C` | Borders, frames, dividers and decorative details |

### Fastest full-theme replacement

Search the entire project for these five hex values and replace them carefully:

```text
#F8F3F1  Warm Ivory
#172D4E  Royal Navy
#C58F9D  Dusty Pink
#E9CAD2  Soft Blush
#D4B47C  Champagne Gold
```

Start in `app/globals.css`. After that, check the loader, hero and envelope override sections listed below because they repeat some colors directly.

---

## 1. Main global theme

File: `app/globals.css`

Search for:

```css
/* MOTIF COLORS */
```

The main editable variables are:

```css
--color-motif-cream: #F8F3F1;
--color-motif-yellow: #D4B47C;
--color-motif-soft: #F8F3F1;
--color-motif-accent: #C58F9D;
--color-motif-deep: #172D4E;
--color-motif-medium: #D4B47C;
--color-motif-teal-light: #E9CAD2;
--color-motif-blush: #E9CAD2;
--color-motif-silver: #D4B47C;
```

### What the most-used variables control

| Variable | What it controls |
|---|---|
| `--color-welcome-bg` | Main light background |
| `--color-welcome-bg-soft` | Soft card and section backgrounds |
| `--color-welcome-text` | Normal paragraph text |
| `--color-welcome-text-soft` | Secondary and muted text |
| `--color-welcome-heading` | Small headings, buttons and labels |
| `--color-welcome-navy` | Large headings and strong text |
| `--color-welcome-script` | Romantic script text |
| `--color-welcome-gold` | Gold decorative details |
| `--color-motif-accent` | Pink dots, hearts and highlights |
| `--color-motif-medium` | Borders, frames and dividers |
| `--color-motif-blush` | Blush surfaces and background decoration |
| `--color-bg-pattern-base` | Background behind the circle pattern |
| `--color-countdown-fade` | Dark fade behind the hero countdown |
| `--color-countdown-text` | Countdown heading and numbers |
| `--color-countdown-label` | Countdown unit labels |
| `--color-qr-fg` | QR-code foreground color |
| `--color-qr-bg` | QR-code background color |

### Color role guide

If you want to change only one visual role:

- Main text and titles: edit `--color-welcome-text`, `--color-welcome-heading`, and `--color-welcome-navy`.
- Script words: edit `--color-welcome-script` and `--color-highlight-deep`.
- Borders and decorative lines: edit `--color-motif-medium`, `--color-motif-yellow`, and `--color-deco`.
- Light page background: edit `--color-welcome-bg`, `--color-motif-cream`, and `--color-motif-soft`.
- Pink/blush background elements: edit `--color-motif-blush`, `--color-highlight`, and the `--color-bg-circle-*` variables.
- Buttons: edit `--color-primary`, `--color-primary-hover`, and `--invite-button`.
- Couple-name colors: edit `--couple-name-fill`, `--couple-name-fill-mid`, and `--couple-name-fill-accent`.

---

## 2. Loading screen

Files:

- `components/loader/LoadingScreen.tsx` — loading-screen structure
- `components/loader/loading-screen.css` — loading-screen colors

The site currently uses plain mode. This is set in `content/site.ts`:

```ts
const DISPLAY_MODE = "plain"
```

In `loading-screen.css`, search for:

```css
/* Blush romance — loader (plain). Kept last so it wins. */
```

Important local variables in that block:

```css
--ls-blush: #E9CAD2;
--ls-pastel: #F8F3F1;
--ls-ivory: #F8F3F1;
--ls-burgundy: #172D4E;
--ls-rose: #C58F9D;
--ls-rose-ink: #C58F9D;
--ls-sage: #D4B47C;
```

These declarations are near the end of the stylesheet and override earlier loader rules. Edit this block when the loading screen does not follow changes made in `app/globals.css`.

---

## 3. Main home hero

Files:

- `components/sections/hero.tsx` — home-hero structure
- `components/loader/loading-screen.css` — home-hero colors

In `loading-screen.css`, search for:

```css
/* Blush romance — home hero (plain) with a single cover photograph. */
```

Important local variables:

```css
--hh-navy: #172D4E;
--hh-blue: #C58F9D;
--hh-ink: #172D4E;
--hh-sky: #E9CAD2;
--hh-leaf: #D4B47C;
--hh-butter: #E9CAD2;
```

Also check the hard-coded hero background and script color in the same block:

```css
background: #F8F3F1;
color: #C58F9D;
```

---

## 4. Envelope invitation

Files:

- `components/loader/Hero.tsx` — envelope behavior and structure
- `components/loader/envelope-invite.css` — envelope colors

In `envelope-invite.css`, search for these variables:

```css
--env-sky
--env-blue
--env-navy
--env-ink
--env-leaf
--env-sun
--env-paper
--env-envelope
--env-fold
--env-base
--env-highlight
```

There are later override blocks in this file. When changing the envelope palette, search the whole file for the old hex value instead of editing only the first declaration.

Typical roles:

| Variable | Envelope part |
|---|---|
| `--env-envelope` | Main envelope paper |
| `--env-base` | Envelope back panel |
| `--env-fold` | Folded paper sections |
| `--env-highlight` | Paper highlights |
| `--env-border` | Gold outline and crease details |
| `--env-paper` | Invitation letter paper |
| `--env-ink` | Invitation letter text |
| `--env-navy` | Strong heading and button color |
| `--env-blue` | Pink/secondary text |
| `--env-leaf` | Gold botanical accents |

---

## 5. Animated page background

File: `components/invitation-page.tsx`

Search for:

```ts
const SILK_COLOR = "#172D4E"
```

This changes the animated Silk background behind the main invitation sections.

The same file also contains the light transition overlay:

```tsx
bg-[#FBF7F5]
```

---

## 6. Shared section backgrounds

| Visual element | File | What to search for |
|---|---|---|
| Animated circle pattern | `components/loader/plain-bubbles.css` | `--plain-bubble-*` |
| Frosted color blobs | `components/loader/plain-atmosphere.css` | `.invite-plain-atmosphere__blob` |
| Pink paper wash | `components/loader/loading-screen.css` | `.love-story-bg` |
| Rising pink hearts | `components/rising-hearts.tsx` | `--color-highlight-deep` |
| Shared background wrapper | `components/section-backdrop.tsx` | `SectionBackdrop` |
| Invitation background gradient | `lib/section-background.ts` | `sectionBackground` |
| Gold double frames | `app/globals.css` | `.deco-frame` |

The main circle colors come from these variables in `app/globals.css`:

```css
--color-bg-pattern-base
--color-bg-circle-deep
--color-bg-circle-mid
--color-bg-circle-light
--color-bg-circle-accent-1
--color-bg-circle-accent-2
--color-bg-circle-accent-3
--color-bg-circle-rose
--color-bg-circle-peach
```

---

## 7. Section-by-section color files

Most of these sections inherit their colors from `app/globals.css`. Edit the component only when you want that section to look different from the rest of the website.

| Website section | Component file | Color code starts near row |
|---|---|---:|
| Navigation | `components/navbar.tsx` | 129 |
| Welcome | `components/sections/welcome.tsx` | 33 |
| Love Story | `components/sections/love-story.tsx` and `components/StorySection.tsx` | 49 |
| Countdown | `components/sections/countdown.tsx` | 44 |
| Gallery | `components/sections/gallery.tsx` | 38 |
| Message Wall | `components/sections/messages.tsx` | 34 |
| Event Details | `components/sections/details.tsx` | 38 |
| Wedding Timeline | `components/sections/wedding-timeline.tsx` | 34 |
| Entourage | `components/sections/entourage.tsx` | 35 |
| Guest List | `components/sections/guest-list.tsx` | 52 |
| Book of Guests | `components/sections/book-of-guests.tsx` | 35 |
| FAQ | `components/sections/faq.tsx` | 35 |
| Gift Registry | `components/sections/registry.tsx` | 34 |
| Wedding Playlist | `components/sections/wedding-playlist.tsx` | 107 |
| Snap & Share | `components/sections/snap-share.tsx` | 33 |
| See You There | `components/sections/see-you-there.tsx` | 30 |
| Footer | `components/sections/footer.tsx` | 47 |

Useful search terms inside these files:

```text
var(--color-
#FFFFFF
bg-white
bg-black
text-white
color-mix(
```

White and black are intentionally used for photo overlays, video controls, modals, QR cards and contrast. They usually do not need to be changed during a normal theme update.

---

## 8. Attire and dress-code swatches

File: `content/site.ts`

### Guest palette

Search for:

```ts
const DRESS_CODE_PALETTE
```

Current colors:

```ts
Dusty Pink      #D49AA3
Blush Pink      #E7B8BE
Champagne Beige #DCC3AD
Charcoal Gray   #666269
Navy Blue       #29364F
```

### Entourage, family and sponsor palettes

Search for:

```ts
const ATTIRE
```

The actively displayed groups are controlled by:

```ts
show: ["entourage", "sponsors"]
```

Only the groups in this list are shown in the Event Details section.

Changing attire swatches does not change the overall website theme. These hex values only color the visible dress-code palette bars.

---

## 9. Gift Registry colors

File: `content/site.ts`

Search for the `registry` section, then find:

```ts
colors: {
```

The fields control:

| Field | Registry element |
|---|---|
| `title` | “Gift Guide” heading and account names |
| `script` | Script text and couple signature |
| `eyebrow` | Small labels and icons |
| `body` | Paragraph text |
| `soft` | Secondary text |
| `card` | Main letter card |
| `cardEdge` | Card border |
| `accountCard` | Bank/e-wallet account card |
| `button` | Tabs, buttons and seal |
| `line` | Decorative divider |
| `glow` | Borders and glow effects |
| `background` | Registry section background |

The Registry component reads these values in `components/sections/registry.tsx`.

---

## 10. QR-code colors

File: `app/globals.css`

Search for:

```css
--color-qr-fg: #172D4E;
--color-qr-bg: #FFFFFF;
```

Keep a strong dark-on-light contrast so phones can scan the QR codes reliably.

---

## 11. Floral and image colors

Files inside `public/` contain their own colors. CSS variables do not recolor most uploaded PNG, JPG or WebP artwork.

In `app/globals.css`:

```css
--deco-filter: none;
```

This means the floral images keep their original painted colors. To change those colors, edit or replace the actual image files rather than changing the global palette.

---

## Files that usually should not be edited for the live theme

These contain old or isolated colors but are not part of the current main invitation flow:

- `styles/globals.css` — unused legacy global stylesheet
- `components/footer.tsx` — older footer; the live footer is `components/sections/footer.tsx`
- `components/wedding-details.tsx` — older details component
- `components/sections/rsvp.tsx` — not rendered by the current invitation page
- `lib/coastal-palette.ts` — used by older components
- `components/sections/love-story.css` — not imported by the current Love Story component
- The old `dressCode` and root `colors` blocks near the bottom of `content/site.ts` — not used by the active Event Details design

---

## Recommended editing workflow

1. Write down the five new theme colors.
2. Update the primary palette in `app/globals.css`.
3. Update the final plain-loader override in `loading-screen.css`.
4. Update the final home-hero override in `loading-screen.css`.
5. Update matching overrides in `envelope-invite.css`.
6. Update `SILK_COLOR` in `components/invitation-page.tsx` if the background should change.
7. Update attire swatches in `content/site.ts` only if the dress-code palette changed.
8. Search the project for each old hex value to find any remaining local overrides.
9. Check text contrast, especially buttons, photo overlays and QR codes.
10. Preview the loading screen, envelope, hero, Event Details, Registry and footer on mobile and desktop.

## Handy project-wide searches

```powershell
rg -n "#F8F3F1|#172D4E|#C58F9D|#E9CAD2|#D4B47C" app components content lib
```

```powershell
rg -n "var\(--color-|var\(--invite-|var\(--env-|var\(--ls-|var\(--hh-" app components content lib
```

These searches only locate color usage; they do not change files.
