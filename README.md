# RIZZA · رزّة

Bilingual storefront for RIZZA, an Omani abaya label. Arabic-first, right-to-left
by default, with English as the alternate.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview  # serve the production build
```

Deployed from `main`. `vercel.json` and `netlify.toml` are both committed; Vercel
is the live target.

---

## Stack

React 18 · TypeScript · Vite 6 · Tailwind 3. No state library, no router — the
whole shop is one page with a locale in React state.

Fonts are bundled through `@fontsource`, not fetched from a CDN, so nothing is
blocked on a third party at first paint.

```
src/
├── App.tsx              locale, cart and dialog state; nothing else holds state
├── components/          one file per section, plus the dialogs and motion pieces
├── data/content.ts      ALL copy and product data — both languages, one file
├── hooks/
│   ├── useModalScrollLock.ts   reference-counted scroll lock for dialogs
│   └── usePremiumMotion.ts     the motion primitives described below
├── types.ts             Locale, Product, CartLine
└── index.css            design tokens, component classes, motion layer
```

**All copy lives in `src/data/content.ts`.** Every string is a
`{ ar, en }` pair read through `localize()`. Adding a language means widening
`Locale`; it does not mean touching components.

---

## Design system

Tokens are defined in `tailwind.config.ts` and used by name everywhere.

| Token | Hex | Use |
|---|---|---|
| `ink` | `#1C1417` | body text |
| `date` | `#27131D` | deep ground, header, footer |
| `pearl` | `#FFF9F2` | page ground, text on dark |
| `sand` | `#F5E8D8` | quiet fills |
| `copper` | `#B8744D` | the single accent — rules, focus, small marks |
| `copper-deep` | `#8E4F34` | copper as *text* on light grounds |
| `pomegranate` `jade` `saffron` | `#7B2142` `#155C55` `#C78B37` | the collection's own colours |
| `shade` `hair` | `#74645F` `#D9C5B4` | secondary text, hairlines |

Type: **Aref Ruqaa** for Arabic display, **Bodoni Moda** for Latin display,
**IBM Plex Sans Arabic** with **Manrope** for body. `tracking-editorial`
(`0.18em`) is the wordmark tracking.

### Colour is content here

Each product carries a `colorHex`, and the collection sequence paints that
colour across the whole page as the piece comes forward. The hero promises
«ألوانٌ لها حضور» — *colour, with presence* — and this is where the page makes
good on it.

`Product.groundHex` is an optional override used **only** where a swatch is too
light to carry pearl text at WCAG AA. Shams is the one case: its saffron
`#C06F27` measures 3.62:1 against pearl, so it grounds on `#7E4412` (7.38:1).
Jade and plum need no override — 7.46:1 and 14.68:1. The swatch colour itself is
never changed; it stays the accent.

**Check contrast before introducing a new ground.** Pearl on jade is the tightest
common case at 7.46:1, and `pearl/75` is the floor for body copy on it (4.98:1).

---

## The motion layer

Three rules hold across all of it:

1. **Only `transform` and `opacity` animate.** Nothing in the motion layer can
   trigger layout. `will-change` is set when an element starts moving and
   released when it stops.
2. **`prefers-reduced-motion` disables it entirely** — the entry sequence, the
   pinned sequence, parallax, the cursor and the grain all switch off, and the
   collection falls back to a plain stack of the same panels.
3. **Nothing hijacks scrolling.** Pinning is `position: sticky`, so momentum,
   rubber-banding, keyboard paging and assistive tech all still drive the page.

### Primitives — `src/hooks/usePremiumMotion.ts`

| Hook | Does |
|---|---|
| `useReducedMotion` / `useFinePointer` | media queries as state; both return `false` until proven, so the plain experience is the default |
| `useScrollDirection(locked)` | header retracts going down, returns going up; `locked` pins it open |
| `useActSequence(count)` | turns a tall section into `count` scroll-driven acts |
| `useExitProgress()` | how far the pinned hero has been scrolled past, 0–1 |
| `useParallax(strength)` | drift against scroll, gated by an IntersectionObserver |
| `useMagnetic(pull)` | pulls a control toward the pointer |

### How the opening works

The hero is `position: sticky` at `z-0` and everything after it rides over on an
opaque `z-10` layer. That overlap *is* the transition: as you scroll, the hero
image recedes and darkens while the collection climbs over it and floods jade
across the screen — and jade is act one's colour, so the sequence continues
without a seam.

This is why **any new top-level section must be inside the `z-10` wrapper in
`App.tsx` and must have an opaque background**, or the pinned hero shows through
behind it. The footer carries `relative z-10` for the same reason.

### Things that will bite you

- **Never split Arabic text per character.** Arabic letters join to their
  neighbours; wrapping each character forces every letter into its isolated form
  and destroys the word. The hero cascade splits on whitespace only.
- **Keep the inter-word space outside the animated span.** An `inline-block`
  trims its own trailing whitespace, which runs the words together.
- **A filled CSS animation outranks inline styles.** A keyframe ending in
  `transform: none` will permanently beat a JS-driven transform on the same
  element. The hero CTA's entry is opacity-only for exactly this reason.
- **A pinned act is one viewport tall.** Under `730px` of height the panel drops
  its description rather than clipping; the text is repeated in the product
  sheet regardless.
- **`useModalScrollLock` is reference counted** and deliberately does not move
  the document — read the comment in it before changing anything about how
  dialogs freeze the page. Smooth-scroll libraries were considered and rejected
  because they would need `stop`/`start` wired into this lock and reintroduce
  the mobile-WebKit bug it documents.

---

## Accessibility

- Every interactive control has a visible `focus-visible` ring and a ≥44px hit area.
- The hero `h1` carries an `aria-label`, so the word-by-word cascade is announced
  as one heading.
- Decorative layers — grain, cursor ring, ghost rules — are `aria-hidden` and
  `pointer-events: none`.
- The product and bag sheets are real `<dialog>` elements, so they take the top
  layer and correct focus behaviour for free.
- Text contrast is checked against its actual ground, not the nominal token. See
  the note under *Colour is content here*.
- Every piece stays reachable without motion: a plain list sits below the
  sequence, outside the pinned stage.

---

## Brand source

The palette and type above are the **live source of truth for this app**.

`brand_core.json` in the separate `Fashion_Launch_Package` folder is an earlier
brand draft that diverges from what is shipped here — different copper, different
ink, no pomegranate/jade/saffron, and a display face that was never licensed.
Treat this repo as authoritative for anything on the web, and reconcile the two
before commissioning print or packaging.
