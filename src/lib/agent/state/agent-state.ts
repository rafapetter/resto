export type AgentState = {
  projectId: string | null;
  projectName: string | null;
  tenantId: string | null;
  checklistStage: string | null;
  knowledgeContext: string[];
  activeTaskIds: string[];
  lastAction: string | null;
};

export function createInitialAgentState(): AgentState {
  return {
    projectId: null,
    projectName: null,
    tenantId: null,
    checklistStage: null,
    knowledgeContext: [],
    activeTaskIds: [],
    lastAction: null,
  };
}
