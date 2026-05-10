import { initPrisma, getPrisma } from '@aow/database';

import { env } from './env.js';

initPrisma(env.DATABASE_URL);

export { getPrisma as prisma };
