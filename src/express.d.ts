import { Accountability } from '@directus/shared/types';

declare global {
	namespace Express {
		export interface Request {
			accountability?: Accountability;
		}
	}
}
