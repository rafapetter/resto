import React from "react";
import { sendEmail } from "./client";
import { ChecklistCompleteEmail } from "./templates/checklist-complete";
import { ProjectMilestoneEmail } from "./templates/project-milestone";
import { AutonomyDecisionEmail } from "./templates/autonomy-decision";
import { WeeklyDigestEmail } from "./templates/weekly-digest";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function sendChecklistCompleteEmail(opts: {
  to: string;
  projectName: string;
  itemTitle: string;
  projectId: string;
}): Promise<void> {
  await sendEmail({
    to: opts.to,
    subject: `Checklist complete: ${opts.itemTitle}`,
    react: React.createElement(ChecklistCompleteEmail, { ...opts, appUrl: APP_URL }),
  });
}

export async function sendProjectMilestoneEmail(opts: {
  to: string;
  projectName: string;
  projectId: string;
  event: "created" | "status_changed";
  newStatus?: string;
}): Promise<void> {
  const subject =
    opts.event === "created"
      ? `New project: ${opts.projectName}`
      : `Project updated: ${opts.projectName}`;
  await sendEmail({
    to: opts.to,
    subject,
    react: React.createElement(ProjectMilestoneEmail, { ...opts, appUrl: APP_URL }),
  });
}

export async function sendAutonomyDecisionEmail(opts: {
  to: string;
  actionType: string;
  decision: "approved" | "denied";
  projectName: string;
  projectId: string;
}): Promise<void> {
  await sendEmail({
    to: opts.to,
    subject: `Autonomy action ${opts.decision}: ${opts.actionType}`,
    react: React.createElement(AutonomyDecisionEmail, { ...opts, appUrl: APP_URL }),
  });
}

export async function sendWeeklyDigestEmail(opts: {
  to: string;
  tenantName: string;
  plan: string;
  tokensUsed: number;
  projectCount: number;
  kbStorageMb: number;
}): Promise<void> {
  await sendEmail({
    to: opts.to,
    subject: "Your weekly ATR Resto usage summary",
    react: React.createElement(WeeklyDigestEmail, { ...opts, appUrl: APP_URL }),
  });
}
