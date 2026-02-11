import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

async function seed() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const sql = neon(DATABASE_URL);
  const db = drizzle({ client: sql, schema });

  console.log("Seeding database...");

  // Create a test tenant
  const [tenant] = await db
    .insert(schema.tenants)
    .values({
      clerkUserId: "seed_user_001",
      name: "Test User",
      email: "test@example.com",
    })
    .returning();

  console.log("Created tenant:", tenant.id);

  // Create a test project
  const [project] = await db
    .insert(schema.projects)
    .values({
      tenantId: tenant.id,
      name: "My First Project",
      description: "A test project created by the seed script",
      status: "active",
    })
    .returning();

  console.log("Created project:", project.id);

  // Create default autonomy settings
  const categories: (typeof schema.autonomyCategory.enumValues)[number][] = [
    "knowledge_management",
    "code_generation",
    "deployment",
    "integrations",
    "communications",
    "financial",
  ];

  const defaultLevels: Record<string, (typeof schema.autonomyLevel.enumValues)[number]> = {
    knowledge_management: "full_auto",
    code_generation: "notify_after",
    deployment: "detailed_approval",
    integrations: "quick_confirm",
    communications: "detailed_approval",
    financial: "manual_only",
  };

  for (const category of categories) {
    await db.insert(schema.autonomySettings).values({
      tenantId: tenant.id,
      projectId: project.id,
      category,
      level: defaultLevels[category],
    });
  }

  console.log("Created default autonomy settings");

  // Create sample checklist items
  const checklistData = [
    { title: "Define business model", stage: "plan" as const, sortOrder: 1 },
    { title: "Set up domain", stage: "build" as const, sortOrder: 2 },
    { title: "Configure hosting", stage: "build" as const, sortOrder: 3 },
    { title: "Deploy MVP", stage: "launch" as const, sortOrder: 4 },
    { title: "Set up analytics", stage: "grow" as const, sortOrder: 5 },
  ];

  for (const item of checklistData) {
    await db.insert(schema.checklistItems).values({
      tenantId: tenant.id,
      projectId: project.id,
      title: item.title,
      stage: item.stage,
      sortOrder: item.sortOrder,
    });
  }

  console.log("Created sample checklist items");
  console.log("Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
