# TODO

Working roadmap for Madrid Live Reports. Done items are checked off as work
lands; new items are appended under "Next".

## Done

- [x] Bootstrap the checkout — `pnpm install` (node_modules was missing)
- [x] Fix 18 typecheck errors:
  - declare `role` as a better-auth `additionalField`
  - correct `getRelatedReports` id params (`number` → `string`)
  - type the homepage sidebar signals array explicitly
- [x] Track `flake.lock` in git
- [x] Unit tests for `format`, `slugify`, and `content-labels` helpers
- [x] Add `README.md`, project `CLAUDE.md`, and this roadmap
- [x] Schema-integrity tests — enum ↔ label-metadata cross-checks, table
      column presence (38 unit tests across 5 files)

## Next

### Testing
- [ ] Integration tests for the query layer (`lib/data/queries.ts`,
      `admin-queries.ts`) — all 11 query functions are untested; needs a
      disposable test Postgres. Candidates: `getHomepageData`,
      `getDistrictDetail`, `searchContent`, `getActivitySignals`,
      `getRelatedReports`, `getAdminOverview`, `getAdminReportsList`
- [ ] Expand e2e coverage beyond the home page — admin login + CRUD, search
      filters, district pages, news detail
- [ ] Cover the admin API routes (`api/admin/reports/*`) — auth gating,
      bulk ops, duplicate
- [ ] Enforce a coverage threshold in `vitest.config.ts`

### Build & tooling
- [ ] Approve the `esbuild` and `sharp` build scripts — pnpm 10 blocks them by
      default; add `pnpm.onlyBuiltDependencies` to `package.json`
- [ ] Align pnpm versions — CI (`pnpm/action-setup`) pins v9, local + lockfile
      are v10

### Cleanup
- [ ] Clear 8 typecheck hints — unused imports/vars in `seed.ts`, `bulk.ts`,
      `schema/content.ts`, `admin/reports/index.astro`, `reports/index.astro`

### Environment
- [ ] Provision the local DB in this checkout — `just db-up && just migrate &&
      just seed`
- [ ] Enable `requireEmailVerification` once an email provider is configured
