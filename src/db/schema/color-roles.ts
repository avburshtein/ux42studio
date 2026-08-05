import { sqliteTable, text, real, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { projects } from './projects';

export const colorRoles = sqliteTable('color_roles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  
  lightColor1: text('light_color1').notNull(),
  lightColor2: text('light_color2').notNull(),
  darkColor1: text('dark_color1').notNull(),
  darkColor2: text('dark_color2').notNull(),
  
  lightContrastRatio: real('light_contrast_ratio'),
  darkContrastRatio: real('dark_contrast_ratio'),
  
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
});

export const projectColorRoles = sqliteTable('project_color_roles', {
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  roleId: text('role_id').notNull().references(() => colorRoles.id, { onDelete: 'cascade' }),
  order: integer('order').notNull().default(0),
}, (t) => ({
  pk: primaryKey({ columns: [t.projectId, t.roleId] }),
}));