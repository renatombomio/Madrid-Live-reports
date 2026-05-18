/**
 * Playwright globalSetup — runs once before all test projects.
 *
 * Creates the E2E admin user by:
 * 1. Signing up via the public better-auth API endpoint.
 * 2. Promoting the account role to 'admin' directly in the DB, because
 *    better-auth's sign-up always creates accounts with the default role
 *    and there is no admin API for promotion.
 *
 * Re-running is safe: sign-up is idempotent (we ignore "already exists"
 * errors) and the UPDATE is a no-op when the role is already 'admin'.
 */

import { config }   from 'dotenv';
import { resolve }  from 'node:path';
import postgres     from 'postgres';
import { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, BASE_URL } from './credentials';

config({ path: resolve(process.cwd(), '.env') });

export default async function globalSetup() {
  // 1 ── Create user via better-auth sign-up endpoint ─────────────────────────
  const signUpRes = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': BASE_URL,
    },
    body: JSON.stringify({
      email:    E2E_ADMIN_EMAIL,
      password: E2E_ADMIN_PASSWORD,
      name:     'E2E Admin',
    }),
  });

  if (!signUpRes.ok) {
    const body = await signUpRes.text();
    // 422 = user already exists — that is fine
    if (signUpRes.status !== 422 && !body.includes('already')) {
      throw new Error(`E2E sign-up failed (${signUpRes.status}): ${body}`);
    }
  }

  // 2 ── Promote to admin via raw SQL ─────────────────────────────────────────
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('DATABASE_URL is not set — cannot promote E2E user to admin');

  const pg = postgres(dbUrl, { max: 1 });
  try {
    await pg`UPDATE "user" SET role = 'admin' WHERE email = ${E2E_ADMIN_EMAIL}`;
  } finally {
    await pg.end();
  }
}
