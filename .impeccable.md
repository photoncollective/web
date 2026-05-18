## Design Context

### Users

**Primary audience (~80%): Operations leadership** — COO, Head of Operations, ops managers at investment firms. They feel workflow pain daily: scattered data, manual handoffs, legacy tools, and technology overhead that doesn’t match how the team actually works. They’re evaluating whether Photon can modernize operations with **minimal friction** and deliver systems the team will trust.

**Secondary audience (~20%): Technical leadership** — CTO or engineering lead, often brought in after ops interest or to vet the build. They care about security, shipping quality, and whether the team can own what gets built—not slide decks.

**Occasional influencers:** Investment leadership (CIO, Partner) may forward the site or join late-stage calls, but copy and hierarchy should **lead with operational outcomes**, not portfolio alpha or engineering novelty.

**Context:** Visitors arrive during evaluation—comparing vendors, validating credibility before a discovery call, or forwarding the site internally (often ops → CTO). The primary job is **trust and clarity**: understand what Photon fixes, see proof (process + case studies), feel safe (security page matters for the 20%), and **book a call**.

**Emotional goal:** Leave feeling **precise, confident, and calm**—not sold to, not hyped.

### Brand Personality

**Three words:** Precise · Trusted · Calm

**Voice:** Direct and substantive. Lead with outcomes and proof, not buzzwords. “Built by AI scientists, refined by world-class designers” is a credential line, not the whole story—human-centered partnership and low-friction delivery matter more in body copy.

**Tone:** Institutional without being stiff. Technical without being cold. Ambitious without startup bravado.

### Aesthetic Direction

**Visual tone:** Dark, editorial finance—grid-framed layouts, bolt motif, serif display paired with clean UI sans. Feels like a serious tools partner for investment managers, not a consumer app or crypto product.

**Theme recommendation:** **Dark primary** (evolve the current direction, do not flip to light by default). Rationale: audience evaluates in focused sessions; finance tooling culture skews dark; existing identity (wordmark, grid rails, data viz) is built for dark surfaces. Consider light mode later for accessibility or print, not as v1 priority.

**Evolution mandate:** **Evolve noticeably**—keep brand recognition (bolt, grid, typography pairing, dark base) but push craft beyond template tells. Higher typographic hierarchy, intentional color (OKLCH, brand-tinted neutrals), and motion that feels deliberate—not decorative.

**References (implicit from current site):** Editorial grid composition, restrained blue accents in data/step visuals, pill CTAs with purposeful micro-interaction.

**Anti-references (explicit):**
- AI-generated template sites (gradient text, colored side-stripes on cards, identical icon+heading grids, neon accents)
- Crypto / Web3 hype (glow borders, maximal gradients, “future of finance” posturing)
- Generic fintech SaaS clones

### Design Principles

1. **Precision over decoration** — Every visual element supports comprehension or trust; remove anything that reads as “design for design’s sake.”
2. **Trust through substance** — Process, case studies, security, and team credentials do the persuading—not hero metrics or vague superlatives.
3. **Calm confidence** — Restrained palette, measured motion, generous negative space; urgency lives in copy and CTA, not visual noise.
4. **Evolve the identity, don’t reboot it** — Preserve bolt, grid frames, and serif/sans pairing; improve tokens, typography scale, and component craft.
5. **Pass the AI Slop Test** — If a visitor could mistake the UI for a 2024 AI landing page, it failed. Solid text, no gradient fills on type, no accent border stripes on cards.

### Technical Constraints

- **Stack:** Static HTML, shared `css/styles.css`, vanilla `js/main.js`—no framework unless explicitly scoped.
- **Performance:** Marketing site; optimize fonts, images, and animation for fast first paint; respect `prefers-reduced-motion`.
- **Accessibility:** Target WCAG 2.1 AA for text contrast on dark surfaces; visible focus states; semantic structure already in place—maintain and improve.

### Existing Brand Assets (from codebase)

| Asset | Notes |
|-------|--------|
| Logo | SVG wordmark + double-bolt mark (`#wordmark`, `#bolt-path`) |
| Typography (current) | Cormorant Infant (display/headings), Inter (UI) — **user-approved, do not replace** |
| Colors (current) | `#000` bg, white text, gray surfaces, blue accent on hover (`#365aff`) |
| Layout | 1200px container, grid lines at `--pad-x`, section rhythm `--section-y` |
| Pages | Home, Security, About Us, Booking |
