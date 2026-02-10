// db.js
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });

const prisma = global.prisma || new PrismaClient({ adapter, log: ['query', 'error', 'warn'], });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
