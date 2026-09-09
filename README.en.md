# UX42 Studio & Portfolio Platform

[Русский](README.md) | English

Multi-tenant portfolio platform for designers built with Next.js + Cloudflare (D1, R2, Workers).

## Stack

- **Frontend:** Next.js (App Router, Server Actions)
- **Database:** Cloudflare D1 + Drizzle ORM
- **Storage:** Cloudflare R2
- **Styling:** Tailwind CSS v4 + Material Design 3 (seed: `#0B6E4F`)
- **Deployment:** Cloudflare Pages / Workers via `@opennextjs/cloudflare`

## Team & Areas of Responsibility

| Who | Area of responsibility |
| --- | --- |
| **Alex** ([@avburshtein](https://github.com/avburshtein)) | Markup and design system: public pages (designer home page, case study page), components in `src/components/portfolio/*` and `src/components/case/*`, design tokens and styles (`src/app/globals.css`, `src/tokens.md`), component UI specs (`Docs/ui/`), content editor UI in `/admin/profile`. Branches: `verstka`, `token`, `cursor/*` |
| **Denis Zakharchenko** (<den.zakh@gmail.com>) | Backend and platform: authentication (`src/middleware.ts`, `src/lib/jwt.ts`, `/api/auth`), Server Actions (`src/lib/actions/`), database schema and migrations (D1 + Drizzle), admin panel and super admin core (`/admin`, `/super-admin`), file uploads to R2, Cloudflare/Next.js configuration |

> Active development ran from August to September 2026. The admin UI layer (main page content editor) on top of the backend — Alex; the server side and admin core — Denis.

## Branches

- **`main`** — stable branch, integration point (PRs from `verstka`).
- **`verstka`** — active UI development (Alex), periodically merged into `main` via PRs.
- **`token`**, **`cursor/case-page-surface-tokens`**, **`cursor/agent-docs-and-guidelines`** — Alex's historical branches (design tokens, case page surface tokens, agent documentation), fully merged into `main`.

## Development

```bash
npm run dev        # Next.js dev server
npm run preview    # Local Cloudflare runtime
npm run deploy     # Deploy to Cloudflare
```

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
