# Madrid Live Reports — task runner
# Run `just` to see all available commands.

set dotenv-load := true

# ─── Setup ─────────────────────────────────────────────────────────────────────

# First-time project setup
setup:
    @echo "Setting up Madrid Live Reports..."
    @[ -f .env ] || cp .env.example .env && echo "  ✓ .env created (edit it before running the app)"
    just install
    @echo ""
    @echo "  Next steps:"
    @echo "    just db-up    — start Postgres"
    @echo "    just migrate  — run DB migrations"
    @echo "    just dev      — start dev server"

# Install dependencies
install:
    pnpm install

# ─── Development ───────────────────────────────────────────────────────────────

# Start the Astro dev server
dev:
    pnpm dev

# Build for production
build:
    pnpm build

# Preview production build locally
preview:
    pnpm preview

# Type-check the entire project
typecheck:
    pnpm typecheck

# ─── Database ──────────────────────────────────────────────────────────────────

# Start the Postgres container
db-up:
    docker compose up db -d
    @echo "Waiting for Postgres to be ready..."
    @until docker compose exec db pg_isready -U madrid -d madrid_live_reports 2>/dev/null; do sleep 1; done
    @echo "  ✓ Postgres is ready at localhost:5432"

# Stop the Postgres container
db-down:
    docker compose stop db

# Generate SQL migrations from schema changes
generate:
    pnpm db:generate

# Apply pending migrations
migrate:
    pnpm db:migrate

# Push schema directly to DB (dev only — skips migration files)
db-push:
    pnpm db:push

# Open Drizzle Studio (visual DB browser)
studio:
    pnpm db:studio

# Seed the database with sample data
seed:
    pnpm db:seed

# Wipe all data and re-run migrations + seed
db-reset:
    @echo "This will DESTROY all data. Press Ctrl+C to cancel, Enter to continue."
    @read _
    docker compose down -v
    just db-up
    just migrate
    just seed

# ─── Docker ────────────────────────────────────────────────────────────────────

# Build the production Docker image
docker-build:
    docker compose build app

# Start all containers (DB + app)
up:
    docker compose up -d

# Stop all containers
down:
    docker compose down

# Stream container logs
logs service="app":
    docker compose logs -f {{service}}

# ─── Testing ───────────────────────────────────────────────────────────────────

# Run unit/integration tests
test:
    pnpm test

# Run tests in watch mode
test-watch:
    pnpm test:watch

# Run tests with coverage report
coverage:
    pnpm test:coverage

# Run end-to-end tests (requires dev server running)
e2e:
    pnpm test:e2e

# Run e2e tests with Playwright UI
e2e-ui:
    pnpm test:e2e:ui

# ─── Code quality ──────────────────────────────────────────────────────────────

# Format all files
fmt:
    pnpm format

# Check formatting without writing
fmt-check:
    pnpm format:check

# ─── Secrets ───────────────────────────────────────────────────────────────────

# Generate a secure BETTER_AUTH_SECRET value
gen-secret:
    @openssl rand -base64 32
