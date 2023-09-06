import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { z } from 'zod';
import { auth } from '../../lib/server/lucia';

const paginationSchema = z.object({
  page: z.number().default(1)
});

const DEFAULT_PAGE = 1;

export const load = (async ({ locals, url: { searchParams } }) => {
  const session = await locals.auth.validate();

  return { session };
}) satisfies PageServerLoad;

export const actions: Actions = {
  logout: async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      return fail(401);
    }

    await auth.invalidateSession(session.sessionId); // invalidate session
    locals.auth.setSession(null); // remove cookie
    throw redirect(302, '/login'); // redirect to login page
  }
};
