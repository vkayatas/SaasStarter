import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const resourceShares = pgTable(
  'resource_shares',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    resourceType: varchar('resource_type', { length: 50 }).notNull(),
    resourceId: uuid('resource_id').notNull(),
    ownerId: uuid('owner_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    slug: varchar('slug', { length: 64 }).notNull().unique(),
    accessLevel: varchar('access_level', { length: 20 }).default('public').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    uniqueResource: unique().on(table.resourceType, table.resourceId),
  }),
);

export const shareInvites = pgTable(
  'share_invites',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    shareId: uuid('share_id')
      .references(() => resourceShares.id, { onDelete: 'cascade' })
      .notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    token: varchar('token', { length: 128 }).notNull().unique(),
    role: varchar('role', { length: 20 }).default('viewer').notNull(),
    acceptedAt: timestamp('accepted_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    uniqueInvitePerShare: unique().on(table.shareId, table.email),
  }),
);
