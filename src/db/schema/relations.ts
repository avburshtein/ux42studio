import { defineRelations } from 'drizzle-orm';
import * as schema from './index';

export const relations = defineRelations(schema, (r) => ({
  users: {
    profile: r.one.profiles({
      from: r.users.id,
      to: r.profiles.userId,
    }),
  },

  profiles: {
    user: r.one.users({
      from: r.profiles.userId,
      to: r.users.id,
    }),
    socialLinks: r.many.socialLinks({
      from: r.profiles.id,
      to: r.socialLinks.profileId,
    }),
    projects: r.many.projects({
      from: r.profiles.id,
      to: r.projects.profileId,
    }),
  },

  socialLinks: {
    profile: r.one.profiles({
      from: r.socialLinks.profileId,
      to: r.profiles.id,
    }),
  },

  projects: {
    profile: r.one.profiles({
      from: r.projects.profileId,
      to: r.profiles.id,
    }),
    projectCategories: r.many.projectCategories({
      from: r.projects.id,
      to: r.projectCategories.projectId,
    }),
    keyMetrics: r.many.projectKeyMetrics({
      from: r.projects.id,
      to: r.projectKeyMetrics.projectId,
    }),
  },

  projectCategories: {
    project: r.one.projects({
      from: r.projectCategories.projectId,
      to: r.projects.id,
    }),
    category: r.one.categories({
      from: r.projectCategories.categoryId,
      to: r.categories.id,
    }),
  },

  projectKeyMetrics: {
    project: r.one.projects({
      from: r.projectKeyMetrics.projectId,
      to: r.projects.id,
    }),
  },
}));