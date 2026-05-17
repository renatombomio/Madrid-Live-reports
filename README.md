# Madrid Live Reports

Urban intelligence platform for Madrid — long-form reports and short news items
about transport, urban development, culture, environment and city life, broken
down across Madrid's 21 official districts.

The public site is Spanish-language; an authenticated admin area handles
editorial work (drafting, publishing, bulk operations).

## Stack

| Layer      | Choice                                            |
| ---------- | ------------------------------------------------- |
| Framework  | [Astro 5](https://astro.build) — SSR (`output: 'server'`, Node standalone adapter) |
| Database   | PostgreSQL 16 via [Drizzle ORM](https://orm.drizzle.team) |
| Auth       | [better-auth](https://better-auth.com) — email + password |
| Styling    | Tailwind CSS 4 (Vite plugin)                      |
| Tests      | Vitest (unit) + Playwright (e2e)                  |
| Tooling    | pnpm, `just`, Nix flake dev shell, Docker Compose |

## Quick start

Requires Node 22+, pnpm 9+, and Docker (for Postgres). With [Nix](https://nixos.org)
+ [direnv](https://direnv.net) installed, `cd` into the repo and the dev shell
loads automatically.

```sh
just setup      # install deps + create .env from .env.example
# edit .env — set BETTER_AUTH_SECRET (just gen-secret)
just db-up      # start the Postgres container
just migrate    # apply DB migrations
just seed       # load sample data
just dev        # start the dev server at http://localhost:4321
```

Create an admin user:

```sh
pnpm tsx scripts/create-user.ts
```

## Common tasks

Run `just` with no arguments to list every command. Frequently used:

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `just dev`       | Start the Astro dev server                   |
| `just build`     | Production build                             |
| `just typecheck` | `astro check` + `tsc --noEmit`               |
| `just test`      | Unit tests (Vitest)                          |
| `just e2e`       | End-to-end tests (Playwright; starts dev server) |
| `just migrate`   | Apply pending DB migrations                  |
| `just generate`  | Generate a migration from schema changes     |
| `just studio`    | Open Drizzle Studio                          |
| `just fmt`       | Format with Prettier                         |

## Project layout

```
src/
  components/      Astro UI components (admin/ for editorial)
  layouts/         Page shells (public, admin, report, base)
  pages/           Routes — public pages, admin/, api/
  layouts/         Shared page shells
  lib/
    auth/          better-auth server config
    data/          DB query helpers (queries.ts, admin-queries.ts)
    format.ts      Date/relative-time formatters
    slugify.ts     URL slug helper
    content-labels.ts  Category/status metadata — single source of truth
  db/
    schema/        Drizzle tables (content.ts, auth.ts)
    seed.ts        Sample-data seeder
drizzle/           Generated SQL migrations
tests/
  unit/            Vitest specs
  e2e/             Playwright specs
```

## Deployment

`docker compose up -d` builds the app image and starts it alongside Postgres.
The app listens on port 4321. See `docker-compose.yml` and `Dockerfile`.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs typecheck + unit tests on every
push and PR, and the Playwright e2e suite against a disposable Postgres service.
