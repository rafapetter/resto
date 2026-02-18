export const APP_NAME = "ATR - All The Rest";
export const AGENT_NAME = "Resto";
export const DEFAULT_MODEL = "claude-sonnet-4-5-20250929" as const;

export const ROUTES = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  projects: "/projects",
  newProject: "/projects/new",
  settings: "/settings",
  project: (id: string) => `/projects/${id}`,
  projectChat: (id: string) => `/projects/${id}/chat`,
  projectChecklist: (id: string) => `/projects/${id}/checklist`,
  projectKnowledge: (id: string) => `/projects/${id}/knowledge`,
  projectIntegrations: (id: string) => `/projects/${id}/integrations`,
} as const;
