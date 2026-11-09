# UX42 Studio & Portfolio Platform

[Русский](README.md) | English

Multi-tenant portfolio platform for designers built with Next.js + Cloudflare (D1, R2, Workers).

## Stack

- **Frontend:** Next.js (App Router, Server Actions)
- **Database:** Cloudflare D1 + Drizzle ORM
- **Storage:** Cloudflare R2
- **Styling:** Tailwind CSS v4 + design tokens on CSS variables (seed: `#0B6E4F`)
- **Theme engine:** Chroma42 — a palette derived from a single seed color (`src/lib/chroma42/`); the Material 3 engine is still available as an alternative in the customizer
- **i18n:** bilingual admin area (ru/en) — `src/lib/i18n/`
- **Deployment:** Cloudflare Pages / Workers via `@opennextjs/cloudflare`

## Team & Areas of Responsibility

| Who | Area of responsibility |
| --- | --- |
| **Alex** ([@avburshtein](https://github.com/avburshtein)) | Markup and design system: public pages (`/`, `/platform`, `/help`, the designer's page `/u/[slug]`, case study and its TL;DR/PDF), components in `src/components/portfolio/*` and `src/components/case/*`, design tokens and styles (`src/app/globals.css`, `src/tokens.md`), the Chroma42 theme engine (`src/lib/chroma42/`), component UI specs (`Docs/ui/`), admin UI (profile editor, case wizard, section visibility, bilingual interface, TL;DR/PDF). Branches: `verstka`, `token`, `cursor/*` |
| **Denis Zakharchenko** (<den.zakh@gmail.com>) | Backend and platform: authentication (`src/middleware.ts`, `src/lib/jwt.ts`, `/api/auth`), Server Actions (`src/lib/actions/`), database schema and migrations (D1 + Drizzle), admin panel and super admin core (`/admin`, `/super-admin`), file uploads to R2, Cloudflare/Next.js configuration |

> Active development: August — November 2026 (`verstka` branch, 206 commits after the last merge into `main`). The admin UI layer (main page content editor) on top of the backend — Alex; the server side and admin core — Denis (last activity — 2026-08-24).

## Branches

- **`main`** — stable branch, integration point (PRs from `verstka`; last merge — 2026-08-24). Lags `verstka` by 206 commits.
- **`verstka`** — active UI development (Alex), periodically merged into `main` via PRs.
- **`token`**, **`cursor/case-page-surface-tokens`**, **`cursor/agent-docs-and-guidelines`** — Alex's historical branches (design tokens, case page surface tokens, agent documentation), fully merged into `main`.

## What's New in `verstka` (September — November 2026)

### October — November 2026

- **Chroma42 color theme engine** — the chosen seed color produces exactly the primary you picked (`#053820` → `#053820`), without being washed out to lightness 0.5. The Material 3 engine remains as an alternative (switcher in the customizer). New "page background" token, custom background across the whole page, M3 dark surface levels, a toggle for floating elements. A readability check replaces the "accessibility passport" — 184 contrast pairs, recalculated automatically on color change. Decisions D-019…D-026 (`Docs/decisions-log.md`).
- **Designer theme on case pages** — the custom theme now extends to cases (opt-in checkbox in section 06); surfaces blend with the palette instead of replacing it.
- **Bilingual admin area (ru/en)** — the whole private-area interface is translated, dictionaries in `src/lib/i18n/`, language switcher in the admin.
- **Subsections inside case sections** — the `project_subsections` table, an editor across five wizard steps, rendered on the public case page.
- **Rich text in cases** — links, lists and **bold** in headings, cards, annotations, Before/After and User story.
- **Personal page** — Experience and Education sections (drag-and-drop order), fact strip, a third CTA (CV), Tools groups, status badges, `jobTitle` and `metaDescription` SEO fields.
- **Help center** — a `/help` section with articles covering every platform feature.
- **Performance** — ISR/SSG in R2 for public pages and the admin area, static shells, transform quality 75 → 85, cover export 1600 → 2560 with a 2560 candidate in `srcSet`, a hero scrim that adapts to cover brightness.
- **Auth** — self-service password reset without signing in, case-insensitive email, invite emails, a real "Back" button on auth screens.
- **Case wizard** — draft previews, a publish toggle, a flexible review step, drag-and-drop gallery sorting, a first-class profile slug editor, instant case refresh after saving.

### September — October 2026

- **Designer home page & case page** — fully rebuilt from Figma specs (`Docs/ui/`), responsive mobile layout, gallery carousel, header with menu panel and hash navigation.
- **Main page content from DB** — "Main Page Content" editor in `/admin/profile` (sections, gallery, social links, OG cover, favicon); `/u/[slug]` renders content from D1.
- **Theme customization** — seed-based color theme (the palette is derived from a single source color), configurable header (transparent/solid) and page background, configurable floating elements with live preview.
- **SEO** — favicon, `robots.txt` + sitemap generated from D1, `generateMetadata` for case pages, Open Graph (og-cover 1200×630), noindex for admin/auth routes, 404 page.
- **Audience split** — `/` belongs to the studio (Hero → founder's cases → Approach → Studio → CTA), the designer-facing platform promo lives on `/platform` (benefits → 3 steps → live example), the personal page stays on `/u/[slug]`. The studio profile is set via the `STUDIO_PROFILE_SLUG` variable.
- **Case TL;DR & PDF** — a short case version for hiring managers (`/u/[slug]/[projectSlug]/short`) with share buttons and a "Download PDF" button (print CSS, `?print=1`, light theme when printing).
- **Case gallery** — selectable layout (editorial / masonry / justified) and a lightbox.
- **Case section visibility** — checkboxes in the wizard (Review step) on top of auto-hiding empty sections; section numbers are renumbered on the public page.
- **Admin** — image cropping before upload (avatar, cover, About, OG, favicon), separate Save and Save & Next buttons in the wizard, manual/auto case sorting (`profiles.case_sort_mode`), light/dark theme toggle in the private area, the Profile Settings section (`/admin/settings`).
- **Contact form** — a dialog instead of `mailto:` (opened from the hero, header and Approach), the `contact_messages` table, a honeypot against spam, reply emails and an inquiry log; a single contacts source `src/lib/contact.ts` + a mail audit in `Docs/MAIL.md` (Email Routing on `hello@ux42.studio`).
- **Legal** — `/privacy` and `/terms` (EN + ES), cookies section, contact form data in EN+ES, account deletion per GDPR Art. 17, invite and password-reset emails.
- **Accessibility & speed** — Lighthouse 13.4.1, production `ux42.studio/`, 2026-10-09 (reports: [`Lighthouse/`](Lighthouse/)):

  | | Performance | Accessibility | Best Practices | SEO |
  | --- | --- | --- | --- | --- |
  | Desktop | 100 | 100 | 100 | 100 |
  | Mobile | 95 | 100 | 100 | 100 |

  Plus a historical a11y measurement from 2026-09-11: desktop/mobile × light/dark → Accessibility 100 everywhere; global `prefers-reduced-motion`, 2px in-field focus indicators, WCAG contrast for components.
- **Site visibility** — the "Publish site" toggle hides the designer's page (`/admin/settings`).
- **Documentation** — changelog (`Docs/CHANGELOG.md`) and the decision log with decisions D-001…D-026 (`Docs/decisions-log.md`), the canonical design-system document (`Docs/design-system.md` + `Docs/figma-tokens.md`), specs (`Docs/specs/`, `Docs/ui/`), briefs and migrations (`Docs/roadmap/`), mail (`Docs/MAIL.md`), domain analytics snapshot (`Docs/ANALYTICS.md`).

## Pages

| Path | What it is |
| --- | --- |
| `/` | Studio homepage: Hero → cases → Approach → Studio → CTA |
| `/platform` | Designer-facing platform promo: benefits → 3 steps → live example |
| `/u/[slug]` | Designer's personal page (content from D1) |
| `/u/[slug]/[projectSlug]` | Case study: sections + visibility, gallery layouts, lightbox |
| `/u/[slug]/[projectSlug]/short` | TL;DR case version for hiring managers (+ PDF) |
| `/help`, `/help/[slug]` | Help center: articles covering the platform's features |
| `/privacy`, `/terms` | Legal documents (EN + ES) |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Public auth area (including self-service password reset) |
| `/admin`, `/super-admin` | Private area (auth, case wizard, profile editor, bilingual interface) |

## Development

```bash
npm run dev        # Next.js dev server
npm run preview    # Local Cloudflare runtime
npm run deploy     # Deploy to Cloudflare
```

## Checks

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run check       # both
npm run verify      # check + smoke test
```

**Site smoke test** — 45 checks against a running server (pages, the split
between the studio homepage and /platform, legal documents,
robots/sitemap/manifest, security headers, admin protection,
database availability). Start the server first:

```bash
npm run dev            # in one window
npm run smoke          # in another

# including designer and case pages:
PROFILE_SLUG=aleksandra-burshtein PROJECT_SLUG=clinical-workflow-automation npm run smoke

# check production after deploying:
npm run smoke:prod
```

Exit code `0` — all good, `1` — problems found. Details: `Docs/DEPLOY.md`.

## Creating the First Superadmin

### Locally

1. Create `.dev.vars` with the following variables:

    ```
    ADMIN_EMAIL=admin@ux42.studio
    ADMIN_PASSWORD=your-secure-password
    JWT_SECRET=your-secret-key
    ```

2. Run `npm run dev` and call:

    ```bash
    curl -X POST http://localhost:3000/api/auth/init
    ```

### Production

1. Set the secrets in Cloudflare:

    ```bash
    npx wrangler secret put ADMIN_EMAIL
    npx wrangler secret put ADMIN_PASSWORD
    npx wrangler secret put JWT_SECRET
    ```

2. Deploy and call **once**:

    ```bash
    curl -X POST https://ux42.studio/api/auth/init
    ```

3. **Right after the successful response** delete the secrets:

    ```bash
    npx wrangler secret delete ADMIN_EMAIL
    npx wrangler secret delete ADMIN_PASSWORD
    ```

    Keep `JWT_SECRET` — the middleware needs it.

4. Log in as the created admin at `/super-admin`. To assign other admins: `/super-admin/users` → "Set Admin".

> **Important:** the `/api/auth/init` endpoint fires only once. Calling it again returns `403 Forbidden`.

## License
This project is licensed under the [Apache License 2.0](./LICENSE).

Copyright 2026 avburshtein.

You may use, copy, modify, and distribute the software under the terms of the Apache License 2.0.
The license includes patent protection and requires preserving copyright and license notices in source distributions.
