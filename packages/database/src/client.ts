import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

let _prisma: PrismaClient | null = null;

export function initPrisma(connectionString: string): PrismaClient {
  _prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  return _prisma;
}

export function getPrisma(): PrismaClient {
  if (!_prisma)
    throw new Error('Prisma не инициализирован. Вызови initPrisma() первым.');
  return _prisma;
}
