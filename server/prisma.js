import { PrismaClient } from '@prisma/client';

// Singleton для Prisma Client
const prisma = new PrismaClient();

export default prisma;
