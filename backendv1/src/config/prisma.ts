// src/config/prisma.ts

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client.js';

const adapter = new PrismaMariaDb({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'english_app',
  connectTimeout: 10000,
  connectionLimit: 5,
});

export const prisma = new PrismaClient({
  adapter,
});