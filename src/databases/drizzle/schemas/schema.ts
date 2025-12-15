import { int, mysqlEnum, mysqlTable, varchar, boolean, timestamp } from 'drizzle-orm/mysql-core';

export const clientsTable = mysqlTable('clients', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at')
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at')
  .notNull()
  .defaultNow()
  .onUpdateNow(),
})

export const usersTable = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['super_admin', 'admin', 'member']).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  cpf: varchar('cpf', { length: 14 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  clientId: int('client_id').references(() => clientsTable.id, { onDelete: "restrict", }),
  createdAt: timestamp('created_at')
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at')
  .notNull()
  .defaultNow()
  .onUpdateNow(),
});

export const apisTable = mysqlTable('apis', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  clientId: int('client_id').references(() => clientsTable.id, { onDelete: "restrict" }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expiresIn: timestamp('expires_in').notNull(),
  urlCallbackStatus: varchar('url_callback_status', { length: 255 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});