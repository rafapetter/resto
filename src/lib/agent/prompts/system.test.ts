import { buildSystemPrompt } from "./system";

describe("buildSystemPrompt", () => {
  it("returns base prompt with no context", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain("You are Resto");
    expect(prompt).toContain("AI co-founder");
    expect(prompt).toContain("## Your Personality");
    expect(prompt).toContain("## Your Capabilities");
    expect(prompt).toContain("## Guidelines");
    expect(prompt).toContain("## Available Actions");
  });

  it("includes project name when provided", () => {
    const prompt = buildSystemPrompt({ projectName: "My Startup" });
    expect(prompt).toContain("## Current Project: My Startup");
  });

  it("includes project description when provided", () => {
    const prompt = buildSystemPrompt({
      projectName: "My Startup",
      projectDescription: "A SaaS platform for restaurants",
    });
    expect(prompt).toContain("A SaaS platform for restaurants");
  });

  it("includes checklist stage when provided", () => {
    const prompt = buildSystemPrompt({
      projectName: "My Startup",
      checklistStage: "build",
    });
    expect(prompt).toContain("Current stage: build");
  });

  it("does not include project section without projectName", () => {
    const prompt = buildSystemPrompt({
      projectDescription: "Some description",
    });
    expect(prompt).not.toContain("## Current Project");
  });

  it("includes knowledge summary when provided", () => {
    const prompt = buildSystemPrompt({
      knowledgeSummary: "Key finding: product-market fit validated",
    });
    expect(prompt).toContain("## Project Knowledge Summary");
    expect(prompt).toContain("Key finding: product-market fit validated");
  });

  it("includes autonomy preferences and replaces underscores", () => {
    const prompt = buildSystemPrompt({
      autonomyPreferences: [
        { category: "code_generation", level: "quick_confirm" },
        { category: "knowledge_management", level: "full_auto" },
      ],
    });
    expect(prompt).toContain("## Autonomy System");
    expect(prompt).toContain("code generation: quick confirm");
    expect(prompt).toContain("knowledge management: full auto");
  });

  it("explains all 5 approval levels when autonomy is present", () => {
    const prompt = buildSystemPrompt({
      autonomyPreferences: [
        { category: "deployment", level: "detailed_approval" },
      ],
    });
    expect(prompt).toContain('"full auto"');
    expect(prompt).toContain('"notify after"');
    expect(prompt).toContain('"quick confirm"');
    expect(prompt).toContain('"detailed approval"');
    expect(prompt).toContain('"manual only"');
  });

  it("does not include autonomy section when preferences is empty", () => {
    const prompt = buildSystemPrompt({ autonomyPreferences: [] });
    expect(prompt).not.toContain("## Autonomy System");
  });

  it("includes integration summary when provided", () => {
    const prompt = buildSystemPrompt({
      integrationsSummary: "GitHub: connected (org/repo), Stripe: connected",
    });
    expect(prompt).toContain("## Connected Integrations");
    expect(prompt).toContain("GitHub: connected (org/repo)");
  });

  it("includes first visit message when isFirstVisit is true", () => {
    const prompt = buildSystemPrompt({ isFirstVisit: true });
    expect(prompt).toContain("## Important: First Conversation");
    expect(prompt).toContain("Welcome them warmly");
  });

  it("does not include first visit section when isFirstVisit is false/undefined", () => {
    const prompt = buildSystemPrompt({});
    expect(prompt).not.toContain("## Important: First Conversation");
  });

  it("lists all expected action tools", () => {
    const prompt = buildSystemPrompt();
    const expectedTools = [
      "searchKnowledgeBase",
      "createKnowledgeEntry",
      "createChecklistItem",
      "updateChecklistItem",
      "getProjectChecklist",
      "checkIntegrations",
      "getIntegrationSetupUrl",
      "generateCode",
      "createRepository",
      "pushCodeToRepo",
      "createVercelProject",
      "deployProject",
      "checkDeploymentStatus",
    ];
    for (const tool of expectedTools) {
      expect(prompt).toContain(tool);
    }
  });

  it("includes code generation workflow steps", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain("## Code Generation & Deployment Workflow");
    expect(prompt).toContain("1. Discuss requirements");
    expect(prompt).toContain("7. Monitor with checkDeploymentStatus");
  });

  it("combines all sections when all context is provided", () => {
    const prompt = buildSystemPrompt({
      projectName: "Foodly",
      projectDescription: "Restaurant ordering platform",
      checklistStage: "launch",
      knowledgeSummary: "MVP complete, beta testing",
      autonomyPreferences: [
        { category: "deployment", level: "quick_confirm" },
      ],
      integrationsSummary: "GitHub: connected",
      isFirstVisit: true,
    });
    expect(prompt).toContain("## Current Project: Foodly");
    expect(prompt).toContain("Restaurant ordering platform");
    expect(prompt).toContain("Current stage: launch");
    expect(prompt).toContain("## Project Knowledge Summary");
    expect(prompt).toContain("## Autonomy System");
    expect(prompt).toContain("## Connected Integrations");
    expect(prompt).toContain("## Important: First Conversation");
  });
});
