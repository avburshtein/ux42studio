import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { users } from './users';
import { files } from './files';

export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  slug: text('slug').notNull().unique(), // /u/[user-slug]
  fullName: text('full_name').notNull(),
  headline: text('headline'),
  bio: text('bio'),
  avatarFileId: text('avatar_file_id').references(() => files.id),
  coverFileId: text('cover_file_id').references(() => files.id),
  location: text('location'),
  website: text('website'),
  isPublic: integer('is_public').notNull().default(1),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`),
});

export const socialLinks = sqliteTable('social_links', {
  id: text('id').primaryKey(),
  profileId: text('profile_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(), // 'github' | 'behance' | 'dribbble' | 'telegram' | 'custom'
  title: text('title').notNull(),
  url: text('url').notNull(),
  order: integer('order').notNull().default(0),
});