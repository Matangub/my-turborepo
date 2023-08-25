import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';
import { homePageRoute, loginRoute, publicRoutes } from './lib/consts';

export const handle: Handle = async ({ event, resolve }) => {
	// we can pass `event` because we used the SvelteKit middleware
	event.locals.auth = auth.handleRequest(event);

	const session = await event.locals.auth.validate();

	const isPublicUrl = publicRoutes.some((route) => event.url.pathname?.startsWith(route));
	if (!isPublicUrl && !session) {
		throw redirect(302, loginRoute);
	}

	if ((isPublicUrl && session) || event.url.pathname === '/') {
		throw redirect(302, homePageRoute);
	}

	return await resolve(event);
};
