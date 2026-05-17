import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../../db';
import * as schema from '../../db/schema';

export const auth = betterAuth({
  // Drizzle adapter — better-auth reads/writes its own tables through Drizzle
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  // `role` lives on the `user` table (see db/schema/auth.ts) but better-auth
  // only surfaces columns it's told about — declare it so the inferred
  // session type carries it. Not settable at signup; defaults to 'viewer'.
  user: {
    additionalFields: {
      role: { type: 'string', input: false },
    },
  },

  // Email + password is the primary auth method for editors/admins
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // enable once an email provider is configured
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5-minute client-side session cache
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
