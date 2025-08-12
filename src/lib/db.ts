import { PrismaClient } from '@prisma/client';

const g = global as unknown as { prisma?: PrismaClient };

// Production database configuration

export const prisma =
  g.prisma ??
  new PrismaClient({
    log: ['warn', 'error', 'info'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') g.prisma = prisma;
