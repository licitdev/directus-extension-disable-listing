import { defineHook } from '@directus/extensions-sdk';
import { RequestHandler } from 'express';

export default defineHook(({ init }, { exceptions }) => {
	const bypassCollections: string[] = [];

	const bypassRoutes = process.env.EXT_DISABLE_LISTING_BYPASS_ROUTES
		? process.env.EXT_DISABLE_LISTING_BYPASS_ROUTES.split(',').map((route) => {
				if (route.startsWith('items/')) {
					const collection = route.split('/')[1];

					if (collection) {
						bypassCollections.push(collection);
					}
					return;
				}
				return route;
		  })
		: ['auth'];

	const bypassMethods = process.env.EXT_DISABLE_LISTING_BYPASS_METHODS
		? process.env.EXT_DISABLE_LISTING_BYPASS_METHODS.split(',')
		: [];

	const allowAuthenticated =
		process.env.EXT_DISABLE_LISTING_ALLOW_AUTHENTICATED !== undefined
			? !!process.env.EXT_DISABLE_LISTING_ALLOW_AUTHENTICATED
			: false;

	init('routes.after', (data) => {
		for (const topRoute of data.app._router.stack) {
			const regexp = String(topRoute.regexp);
			if (topRoute.name !== 'router' || !regexp.endsWith('\\/?(?=\\/|$)/i') || regexp.length <= 15) {
				continue;
			}

			const topRoutePath = regexp.slice(4, -13);

			if (bypassRoutes.includes(topRoutePath)) {
				continue;
			}

			const checkFilterPath = topRoutePath === 'items' ? '/:collection' : '/';

			for (const filteredRoute of topRoute.handle.stack) {
				if (
					!filteredRoute.route ||
					filteredRoute.route.path !== checkFilterPath ||
					bypassMethods.includes(Object.keys(filteredRoute.route.methods)[0] ?? '')
				) {
					continue;
				}

				const childRoute = filteredRoute.route.stack[0];
				const currentHandle = childRoute.handle;
				const newHandle: RequestHandler = async (req, res, next) => {
					if (
						(topRoutePath === 'items' && bypassCollections.includes(req.url.slice(1))) ||
						(req.accountability &&
							(req.accountability.admin ||
								req.accountability.app ||
								req.accountability.share ||
								(allowAuthenticated && req.accountability.user)))
					) {
						return currentHandle(req, res, next);
					}

					return next(new exceptions.ForbiddenException());
				};

				childRoute.handle = newHandle;
			}
		}
	});
});
