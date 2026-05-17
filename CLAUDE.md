# Madrid Live Reports — agent notes

Project-specific guidance. General rules (conventional commits, pnpm-only,
`just` task runner) come from the global config and still apply.

## What this is

SSR Astro 5 site — a Madrid urban-intelligence platform. Spanish-language public
pages plus an authenticated admin editorial area. Postgres via Drizzle, auth via
better-auth.

## Architecture

- **SSR, not static.** `astro.config.mjs` sets `output: 'server'`. Pages run on
  the server — they query the DB and read the session directly.
- **Query layer.** All DB access goes through `src/lib/data/queries.ts` (public)
  and `admin-queries.ts` (admin). Pages/components do not build queries inline.
- **Content metadata.** `src/lib/content-labels.ts` is the single source of
  truth for category and status display (names, slugs, colours). Don't hardcode
  category labels elsewhere — import from here.
- **IDs are `text`, not serial.** Every primary/foreign key is a `text` column.
  Functions that take an id take a `string`.

## Conventions

- **UI strings are Spanish.** User-facing text, including error messages, is in
  Spanish. Code, comments, and identifiers are English.
- **`role` is a custom auth field.** It lives on the `user` table
  (`db/schema/auth.ts`) *and* must be declared in better-auth's
  `user.additionalFields` (`lib/auth/index.ts`) — otherwise the inferred session
  type won't carry it and `session.user.role` fails to typecheck.
- **Migrations are generated.** Change `db/schema/*`, then `just generate`.
  Never hand-edit files in `drizzle/`.

## Before committing

Run `just typecheck` — it runs `astro check` + `tsc --noEmit`. `.astro` files
are only checked by `astro check`, so a green `tsc` alone is not enough.

`just test` covers pure helpers only. The query layer (`lib/data/*`) has no
automated coverage yet — it needs a live Postgres. See `TODO.md`.

## Known check noise

`astro check` reports a false `submitUrl` "Could not find name" error in
`components/admin/ReportForm.astro` — the name is injected via `define:vars`
into an inline script that astro-check can't see into. It's a hint, not a real
error.
