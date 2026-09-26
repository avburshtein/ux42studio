# UX42 Studio & Portfolio Platform

[Русский](README.md) | English

Multi-tenant portfolio platform for designers built with Next.js + Cloudflare (D1, R2, Workers).

## Stack

- **Frontend:** Next.js (App Router, Server Actions)
- **Database:** Cloudflare D1 + Drizzle ORM
- **Storage:** Cloudflare R2
- **Styling:** Tailwind CSS v4 + design tokens on CSS variables (seed: `#0B6E4F`)
- **Deployment:** Cloudflare Pages / Workers via `@opennextjs/cloudflare`

## Team & Areas of Responsibility

| Who | Area of responsibility |
| --- | --- |
| **Alex** ([@avburshtein](https://github.com/avburshtein)) | Markup and design system: public pages (`/`, `/platform`, the designer's page `/u/[slug]`, case study and its TL;DR/PDF), components in `src/components/portfolio/*` and `src/components/case/*`, design tokens and styles (`src/app/globals.css`, `src/tokens.md`), component UI specs (`Docs/ui/`), admin UI (profile editor, case wizard, section visibility, TL;DR/PDF). Branches: `verstka`, `token`, `cursor/*` |
| **Denis Zakharchenko** (<den.zakh@gmail.com>) | Backend and platform: authentication (`src/middleware.ts`, `src/lib/jwt.ts`, `/api/auth`), Server Actions (`src/lib/actions/`), database schema and migrations (D1 + Drizzle), admin panel and super admin core (`/admin`, `/super-admin`), file uploads to R2, Cloudflare/Next.js configuration |

> Active development ran from August to September 2026. The admin UI layer (main page content editor) on top of the backend — Alex; the server side and admin core — Denis.

## Branches

- **`main`** — stable branch, integration point (PRs from `verstka`).
- **`verstka`** — active UI development (Alex), periodically merged into `main` via PRs.
- **`token`**, **`cursor/case-page-surface-tokens`**, **`cursor/agent-docs-and-guidelines`** — Alex's historical branches (design tokens, case page surface tokens, agent documentation), fully merged into `main`.

## What's New in `verstka` (September 2026)

- **Designer home page & case page** — fully rebuilt from Figma specs (`Docs/ui/`), responsive mobile layout, gallery carousel, header with menu panel and hash navigation.
- **Main page content from DB** — "Main Page Content" editor in `/admin/profile` (sections, gallery, social links, OG cover, favicon); `/u/[slug]` renders content from D1.
- **Theme customization** — seed-based color theme (the palette is derived from a single source color), configurable header (transparent/solid) and page background, configurable floating elements with live preview.
- **SEO** — favicon, `robots.txt` + sitemap generated from D1, `generateMetadata` for case pages, Open Graph (og-cover 1200×630), noindex for admin/auth routes, 404 page.
- **Audience split** — `/` belongs to the studio (Hero → founder's cases → Approach → Studio → CTA), the designer-facing platform promo lives on `/platform` (benefits → 3 steps → live example), the personal page stays on `/u/[slug]`. The studio profile is set via the `STUDIO_PROFILE_SLUG` variable.
- **Case TL;DR & PDF** — a short case version for hiring managers (`/u/[slug]/[projectSlug]/short`) with share buttons and a "Download PDF" button (print CSS, `?print=1`, light theme when printing).
- **Case gallery** — selectable layout (editorial / masonry / justified) and a lightbox.
- **Case section visibility** — checkboxes in the wizard (Review step) on top of auto-hiding empty sections; section numbers are renumbered on the public page.
- **Admin** — image cropping before upload (avatar, cover, About, OG, favicon), separate Save and Save & Next buttons in the wizard, manual/auto case sorting (`profiles.case_sort_mode`), light/dark theme toggle in the private area.
- **Legal** — `/privacy` and `/terms` (EN + ES), cookies section.
- **Accessibility** — Lighthouse Accessibility 100/100 (desktop/mobile × light/dark).

## Pages

| Path | What it is |
| --- | --- |
| `/` | Studio homepage: Hero → cases → Approach → Studio → CTA |
| `/platform` | Designer-facing platform promo: benefits → 3 steps → live example |
| `/u/[slug]` | Designer's personal page (content from D1) |
| `/u/[slug]/[projectSlug]` | Case study: sections + visibility, gallery layouts, lightbox |
| `/u/[slug]/[projectSlug]/short` | TL;DR case version for hiring managers (+ PDF) |
| `/privacy`, `/terms` | Legal documents (EN + ES) |
| `/admin`, `/super-admin` | Private area (auth, case wizard, profile editor) |

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

**Site smoke test** — 41 checks against a running server (pages, the split
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
