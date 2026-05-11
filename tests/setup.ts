import { config } from 'dotenv';

// Load .env so DATABASE_URL is available during unit/integration tests.
// In CI, these vars come from the environment directly.
config();
