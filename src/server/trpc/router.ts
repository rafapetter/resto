import { createRouter, createCallerFactory } from "./init";
import { authRouter } from "./routers/auth";
import { projectsRouter } from "./routers/projects";
import { onboardingRouter } from "./routers/onboarding";
import { chatRouter } from "./routers/chat";
import { knowledgeBaseRouter } from "./routers/knowledge-base";
import { tasksRouter } from "./routers/tasks";
import { credentialsRouter } from "./routers/credentials";
import { settingsRouter } from "./routers/settings";
import { autonomyRouter } from "./routers/autonomy";

export const appRouter = createRouter({
  auth: authRouter,
  projects: projectsRouter,
  onboarding: onboardingRouter,
  chat: chatRouter,
  knowledgeBase: knowledgeBaseRouter,
  tasks: tasksRouter,
  credentials: credentialsRouter,
  settings: settingsRouter,
  autonomy: autonomyRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
