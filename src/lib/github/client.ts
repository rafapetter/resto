import "server-only";
import { db } from "@/server/db";
import { integrationCredentials } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt } from "@/lib/crypto/encryption";

// ─── Types ──────────────────────────────────────────────────────────

export type Repo = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
  htmlUrl: string;
  cloneUrl: string;
  defaultBranch: string;
};

export type RepoContent = {
  name: string;
  path: string;
  type: "file" | "dir" | "symlink" | "submodule";
  size: number;
  sha: string;
};

export type CommitResult = {
  sha: string;
  message: string;
  htmlUrl: string;
};

// ─── Client ─────────────────────────────────────────────────────────

export class GitHubClient {
  private constructor(private token: string) {}

  static async fromProject(
    tenantId: string,
    projectId: string
  ): Promise<GitHubClient> {
    const cred = await db.query.integrationCredentials.findFirst({
      where: and(
        eq(integrationCredentials.tenantId, tenantId),
        eq(integrationCredentials.projectId, projectId),
        eq(integrationCredentials.provider, "github"),
        eq(integrationCredentials.status, "active")
      ),
    });

    if (!cred) {
      throw new Error(
        "GitHub not connected for this project. Connect GitHub in the Integrations settings first."
      );
    }

    const decrypted = decrypt({
      encryptedData: cred.encryptedData as Buffer,
      iv: cred.iv as Buffer,
      keyVersion: cred.keyVersion,
    });

    return new GitHubClient(decrypted.accessToken as string);
  }

  private async api<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const res = await fetch(`https://api.github.com${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`GitHub API error ${res.status}: ${body}`);
    }

    return res.json() as Promise<T>;
  }

  // ─── User ───────────────────────────────────────────────────────

  async getUser(): Promise<{ login: string; avatarUrl: string }> {
    const user = await this.api<{ login: string; avatar_url: string }>(
      "/user"
    );
    return { login: user.login, avatarUrl: user.avatar_url };
  }

  // ─── Repos ──────────────────────────────────────────────────────

  async listRepos(perPage = 30): Promise<Repo[]> {
    const repos = await this.api<
      Array<{
        id: number;
        name: string;
        full_name: string;
        description: string | null;
        private: boolean;
        html_url: string;
        clone_url: string;
        default_branch: string;
      }>
    >(`/user/repos?per_page=${perPage}&sort=updated`);

    return repos.map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      private: r.private,
      htmlUrl: r.html_url,
      cloneUrl: r.clone_url,
      defaultBranch: r.default_branch,
    }));
  }

  async createRepo(params: {
    name: string;
    description?: string;
    isPrivate?: boolean;
    autoInit?: boolean;
  }): Promise<Repo> {
    const repo = await this.api<{
      id: number;
      name: string;
      full_name: string;
      description: string | null;
      private: boolean;
      html_url: string;
      clone_url: string;
      default_branch: string;
    }>("/user/repos", {
      method: "POST",
      body: JSON.stringify({
        name: params.name,
        description: params.description,
        private: params.isPrivate ?? true,
        auto_init: params.autoInit ?? true,
      }),
    });

    return {
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      private: repo.private,
      htmlUrl: repo.html_url,
      cloneUrl: repo.clone_url,
      defaultBranch: repo.default_branch,
    };
  }

  // ─── Contents ───────────────────────────────────────────────────

  async getRepoContents(
    owner: string,
    repo: string,
    path = "",
    ref?: string
  ): Promise<RepoContent[]> {
    const query = ref ? `?ref=${encodeURIComponent(ref)}` : "";
    const contents = await this.api<
      Array<{
        name: string;
        path: string;
        type: "file" | "dir" | "symlink" | "submodule";
        size: number;
        sha: string;
      }>
    >(`/repos/${owner}/${repo}/contents/${path}${query}`);

    return contents.map((c) => ({
      name: c.name,
      path: c.path,
      type: c.type,
      size: c.size,
      sha: c.sha,
    }));
  }

  async getFileContent(
    owner: string,
    repo: string,
    path: string,
    ref?: string
  ): Promise<{ content: string; sha: string }> {
    const query = ref ? `?ref=${encodeURIComponent(ref)}` : "";
    const file = await this.api<{ content: string; sha: string }>(
      `/repos/${owner}/${repo}/contents/${path}${query}`
    );

    return {
      content: Buffer.from(file.content, "base64").toString("utf-8"),
      sha: file.sha,
    };
  }

  // ─── Push multiple files atomically ─────────────────────────────

  async pushMultipleFiles(params: {
    owner: string;
    repo: string;
    branch?: string;
    message: string;
    files: Array<{ path: string; content: string }>;
  }): Promise<{ commitSha: string }> {
    const { owner, repo, message, files } = params;
    const branch = params.branch ?? "main";

    // 1. Get the current commit SHA for the branch
    const ref = await this.api<{ object: { sha: string } }>(
      `/repos/${owner}/${repo}/git/ref/heads/${branch}`
    );
    const latestCommitSha = ref.object.sha;

    // 2. Get the tree SHA from that commit
    const commit = await this.api<{ tree: { sha: string } }>(
      `/repos/${owner}/${repo}/git/commits/${latestCommitSha}`
    );
    const baseTreeSha = commit.tree.sha;

    // 3. Create blobs for each file
    const treeItems: Array<{
      path: string;
      mode: string;
      type: string;
      sha: string;
    }> = [];

    for (const file of files) {
      const blob = await this.api<{ sha: string }>(
        `/repos/${owner}/${repo}/git/blobs`,
        {
          method: "POST",
          body: JSON.stringify({
            content: file.content,
            encoding: "utf-8",
          }),
        }
      );

      treeItems.push({
        path: file.path,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      });
    }

    // 4. Create tree
    const tree = await this.api<{ sha: string }>(
      `/repos/${owner}/${repo}/git/trees`,
      {
        method: "POST",
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: treeItems,
        }),
      }
    );

    // 5. Create commit
    const newCommit = await this.api<{ sha: string }>(
      `/repos/${owner}/${repo}/git/commits`,
      {
        method: "POST",
        body: JSON.stringify({
          message,
          tree: tree.sha,
          parents: [latestCommitSha],
        }),
      }
    );

    // 6. Update branch reference
    await this.api(
      `/repos/${owner}/${repo}/git/refs/heads/${branch}`,
      {
        method: "PATCH",
        body: JSON.stringify({ sha: newCommit.sha }),
      }
    );

    return { commitSha: newCommit.sha };
  }
}
