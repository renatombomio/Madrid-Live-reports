import 'dotenv/config';
import { auth } from '../src/lib/auth';
import { db } from '../src/db';
import { user } from '../src/db/schema';
import { eq } from 'drizzle-orm';

const EMAIL = 'admin@madrid-live.test';
const PASSWORD = 'admin1234';
const NAME = 'Admin';
const ROLE = 'admin';

async function main() {
  const existing = await db.select().from(user).where(eq(user.email, EMAIL)).limit(1);
  if (existing.length > 0) {
    console.log(`User ${EMAIL} already exists.`);
    process.exit(0);
  }

  const result = await auth.api.signUpEmail({
    body: { email: EMAIL, password: PASSWORD, name: NAME },
  });

  if (!result?.user?.id) {
    console.error('Sign-up failed:', result);
    process.exit(1);
  }

  // Promote to admin role
  await db.update(user).set({ role: ROLE }).where(eq(user.id, result.user.id));

  console.log('');
  console.log('  Test user created');
  console.log('  ─────────────────────────────────────');
  console.log(`  Email   : ${EMAIL}`);
  console.log(`  Password: ${PASSWORD}`);
  console.log(`  Role    : ${ROLE}`);
  console.log('');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
