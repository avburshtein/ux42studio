import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// Функция для получения инстанса Drizzle внутри Server Actions / Route Handlers
export function getDb(d1: D1Database) {
  return drizzle(d1, { schema });
}