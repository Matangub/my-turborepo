import { fail, redirect } from '@sveltejs/kit';
import {
  badges,
  deleteJobSchema,
  insertBadgeSchema,
  insertJobSchema,
  jobs
} from '../../lib/schema';
import { db } from '../../lib/server/db';
import type { Actions, PageServerLoad } from './$types';

import { and, eq, sql } from 'drizzle-orm';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { PAGE_SIZE } from '../../lib/consts';
import { auth } from '../../lib/server/lucia';
import { NeonDbError } from '@neondatabase/serverless';

const paginationSchema = z.object({
  page: z.number().min(1).default(1)
});

const insertJobWithBadges = insertJobSchema.extend({
  badges: z.array(insertBadgeSchema.shape.label).min(1).max(3)
});

const DEFAULT_PAGE = 1;

export const load = (async ({ locals, url: { searchParams } }) => {
  const session = await locals.auth.validate();
  const paginationData = paginationSchema.parse({
    page: Number(searchParams.get('page') ?? DEFAULT_PAGE)
  });

  const data = await db.query.jobs.findMany({
    limit: PAGE_SIZE,
    offset: (paginationData.page - 1) * PAGE_SIZE,
    with: {
      badges: true
    }
  });

  const totalJobsCount = +(await db.select({ count: sql<number>`count(*)` }).from(jobs))[0].count;

  const insertForm = await superValidate(insertJobWithBadges);
  const deleteForm = await superValidate(deleteJobSchema);

  return { session, data, paginationData, insertForm, deleteForm, totalJobsCount };
}) satisfies PageServerLoad;

export const actions: Actions = {
  addJob: async (event) => {
    const session = await event.locals.auth.validate();
    const form = await superValidate(event, insertJobWithBadges);

    if (!form.valid) {
      return fail(422, { form });
    }

    const { badges: nextBadges, ...job } = form.data;
    const nextJobId = crypto.randomUUID();
    try {
      await db.insert(jobs).values({ ...job, id: nextJobId, user_id: session!.user.userId });

      await Promise.all(
        nextBadges.map(async (nextBadge) =>
          db.insert(badges).values({ jobs_id: nextJobId, label: nextBadge })
        )
      );
      return { form };
    } catch (e) {
      if (e instanceof NeonDbError && e.code === '23505') {
        return setError(form, 'User is only allowed to create 1 job post');
      }

      return fail(500, { form });
    }
  },
  deleteJob: async (event) => {
    const session = await event.locals.auth.validate();
    const form = await superValidate(event, deleteJobSchema);

    if (!form.valid) {
      return fail(422, { form });
    }

    const deletedJob = await db
      .delete(jobs)
      .where(and(eq(jobs.id, form.data.id), eq(jobs.user_id, session!.user.userId)))
      .returning();

    return { form, deletedJob };
  },
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
