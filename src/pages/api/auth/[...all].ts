// Catch-all route: handles /api/auth/sign-in, /api/auth/sign-out, etc.
// better-auth's handler is a standard Request → Response function, which
// maps directly to Astro's API route signature.
import type { APIRoute } from 'astro';
import { auth } from '../../../lib/auth';

export const ALL: APIRoute = ({ request }) => auth.handler(request);
