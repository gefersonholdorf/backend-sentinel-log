import { int, mysqlEnum, mysqlTable, serial, varchar, boolean, timestamp } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['super_admin', 'admin', 'member']).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  cpf: varchar('cpf', { length: 14 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  clientId: int('client_id'),
  createdAt: timestamp('created_at')
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at')
  .notNull()
  .defaultNow()
  .onUpdateNow(),
});