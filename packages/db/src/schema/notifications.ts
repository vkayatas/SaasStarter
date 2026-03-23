import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  boolean,
  index,
} from 'drizzle-orm/pg-core';
import { user } from './auth';

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    type: varchar('type', { length: 50 }).notNull(), // e.g. 'info', 'success', 'warning', 'share_invite'
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    read: boolean('read').default(false).notNull(),
    actionUrl: text('action_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userUnreadIdx: index('notifications_user_unread_idx').on(table.userId, table.read),
  }),
);
