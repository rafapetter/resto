import "server-only";
import { db } from "@/server/db";
import { integrationCredentials } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt } from "@/lib/crypto/encryption";

// ─── Types ──────────────────────────────────────────────────────────

export type VercelProject = {
  id: string;
  name: string;
  framework: string | null;
  link?: {
    type: string;
    repo: string;
  };
  targets?: {
    production?: { url: string };
  };
};

export type Deployment = {
  id: string;
  name: string;
  url: string;
  state:
    | "BUILDING"
    | "ERROR"
    | "INITIALIZING"
    | "QUEUED"
    | "READY"
    | "CANCELED";
  target: string | null;
  createdAt: number;
  readyAt?: number;
};

// ─── Client ─────────────────────────────────────────────────────────

export class VercelClient {
  private constructor(private token: string) {}

  static async fromProject(
    tenantId: string,
    projectId: string
  ): Promise<VercelClient> {
    const cred = await db.query.integrationCredentials.findFirst({
      where: and(
        eq(integrationCredentials.tenantId, tenantId),
        eq(integrationCredentials.projectId, projectId),
        eq(integrationCredentials.provider, "vercel"),
        eq(integrationCredentials.status, "active")
      ),
    });

    if (!cred) {
      throw new Error(
        "Vercel not connected for this project. Connect Vercel in the Integrations settings first."
      );
    }

    const decrypted = decrypt({
      encryptedData: cred.encryptedData as Buffer,
      iv: cred.iv as Buffer,
      keyVersion: cred.keyVersion,
    });

    return new VercelClient(decrypted.accessToken as string);
  }

  private async api<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const res = await fetch(`https://api.vercel.com${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Vercel API error ${res.status}: ${body}`);
    }

    return res.json() as Promise<T>;
  }

  // ─── Projects ───────────────────────────────────────────────────

  async listProjects(): Promise<VercelProject[]> {
    const data = await this.api<{ projects: VercelProject[] }>(
      "/v9/projects"
    );
    return data.projects;
  }

  async createProject(params: {
    name: string;
    framework?: string;
    gitRepository?: { repo: string; type: string };
  }): Promise<VercelProject> {
    return this.api<VercelProject>("/v10/projects", {
      method: "POST",
      body: JSON.stringify({
        name: params.name,
        framework: params.framework ?? "nextjs",
        gitRepository: params.gitRepository,
      }),
    });
  }

  async getProject(nameOrId: string): Promise<VercelProject> {
    return this.api<VercelProject>(
      `/v9/projects/${encodeURIComponent(nameOrId)}`
    );
  }

  // ─── Deployments ────────────────────────────────────────────────

  async createDeployment(params: {
    name: string;
    target?: string;
  }): Promise<Deployment> {
    const data = await this.api<{
      id: string;
      name: string;
      url: string;
      status: string;
      target: string | null;
      createdAt: number;
    }>("/v13/deployments", {
      method: "POST",
      body: JSON.stringify({
        name: params.name,
        target: params.target ?? "production",
        gitSource: {
          type: "github",
          ref: "main",
        },
      }),
    });

    return {
      id: data.id,
      name: data.name,
      url: data.url,
      state: "BUILDING",
      target: data.target,
      createdAt: data.createdAt,
    };
  }

  async getDeployment(id: string): Promise<Deployment> {
    const data = await this.api<{
      id: string;
      name: string;
      url: string;
      readyState: Deployment["state"];
      target: string | null;
      createdAt: number;
      ready?: number;
    }>(`/v13/deployments/${id}`);

    return {
      id: data.id,
      name: data.name,
      url: data.url,
      state: data.readyState,
      target: data.target,
      createdAt: data.createdAt,
      readyAt: data.ready,
    };
  }

  // ─── Environment Variables ──────────────────────────────────────

  async setEnvironmentVariables(
    projectId: string,
    variables: Array<{
      key: string;
      value: string;
      target: Array<"production" | "preview" | "development">;
    }>
  ): Promise<void> {
    await this.api(
      `/v10/projects/${encodeURIComponent(projectId)}/env`,
      {
        method: "POST",
        body: JSON.stringify(variables),
      }
    );
  }
}
