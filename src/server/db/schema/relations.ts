import { relations } from "drizzle-orm";
import { tenants } from "./tenants";
import { projects } from "./projects";
import { onboardingProgress } from "./onboarding";
import { conversations } from "./conversations";
import { checklistItems } from "./checklist";
import { knowledgeFiles, knowledgeEmbeddings } from "./knowledge";
import { integrationCredentials } from "./credentials";
import { auditLog } from "./audit";
import { autonomySettings } from "./autonomy";
import { usageRecords } from "./usage";

export const tenantsRelations = relations(tenants, ({ many }) => ({
  projects: many(projects),
  auditLogs: many(auditLog),
  usageRecords: many(usageRecords),
  autonomySettings: many(autonomySettings),
  credentials: many(integrationCredentials),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [projects.tenantId],
    references: [tenants.id],
  }),
  onboardingProgress: many(onboardingProgress),
  conversations: many(conversations),
  checklistItems: many(checklistItems),
  knowledgeFiles: many(knowledgeFiles),
  credentials: many(integrationCredentials),
  autonomySettings: many(autonomySettings),
  usageRecords: many(usageRecords),
}));

export const onboardingProgressRelations = relations(
  onboardingProgress,
  ({ one }) => ({
    tenant: one(tenants, {
      fields: [onboardingProgress.tenantId],
      references: [tenants.id],
    }),
    project: one(projects, {
      fields: [onboardingProgress.projectId],
      references: [projects.id],
    }),
  })
);

export const conversationsRelations = relations(conversations, ({ one }) => ({
  tenant: one(tenants, {
    fields: [conversations.tenantId],
    references: [tenants.id],
  }),
  project: one(projects, {
    fields: [conversations.projectId],
    references: [projects.id],
  }),
}));

export const checklistItemsRelations = relations(
  checklistItems,
  ({ one }) => ({
    tenant: one(tenants, {
      fields: [checklistItems.tenantId],
      references: [tenants.id],
    }),
    project: one(projects, {
      fields: [checklistItems.projectId],
      references: [projects.id],
    }),
  })
);

export const knowledgeFilesRelations = relations(
  knowledgeFiles,
  ({ one, many }) => ({
    tenant: one(tenants, {
      fields: [knowledgeFiles.tenantId],
      references: [tenants.id],
    }),
    project: one(projects, {
      fields: [knowledgeFiles.projectId],
      references: [projects.id],
    }),
    embeddings: many(knowledgeEmbeddings),
  })
);

export const knowledgeEmbeddingsRelations = relations(
  knowledgeEmbeddings,
  ({ one }) => ({
    file: one(knowledgeFiles, {
      fields: [knowledgeEmbeddings.fileId],
      references: [knowledgeFiles.id],
    }),
  })
);

export const integrationCredentialsRelations = relations(
  integrationCredentials,
  ({ one }) => ({
    tenant: one(tenants, {
      fields: [integrationCredentials.tenantId],
      references: [tenants.id],
    }),
    project: one(projects, {
      fields: [integrationCredentials.projectId],
      references: [projects.id],
    }),
  })
);

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  tenant: one(tenants, {
    fields: [auditLog.tenantId],
    references: [tenants.id],
  }),
  project: one(projects, {
    fields: [auditLog.projectId],
    references: [projects.id],
  }),
}));

export const autonomySettingsRelations = relations(
  autonomySettings,
  ({ one }) => ({
    tenant: one(tenants, {
      fields: [autonomySettings.tenantId],
      references: [tenants.id],
    }),
    project: one(projects, {
      fields: [autonomySettings.projectId],
      references: [projects.id],
    }),
  })
);

export const usageRecordsRelations = relations(usageRecords, ({ one }) => ({
  tenant: one(tenants, {
    fields: [usageRecords.tenantId],
    references: [tenants.id],
  }),
  project: one(projects, {
    fields: [usageRecords.projectId],
    references: [projects.id],
  }),
}));
