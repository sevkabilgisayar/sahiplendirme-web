  import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  // DATABASE_URL env var varsa kullan (production), yoksa schema.prisma'daki relative path geçerli
  const datasourceUrl = process.env.DATABASE_URL;
  return new PrismaClient(datasourceUrl ? { datasources: { db: { url: datasourceUrl } } } : undefined);
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db;
