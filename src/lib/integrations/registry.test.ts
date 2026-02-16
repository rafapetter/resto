import { getAdapter, getAllProviders, getOAuthProviders, isProviderAvailable } from "./registry";

describe("getAdapter", () => {
  it("returns github adapter", () => {
    const adapter = getAdapter("github");
    expect(adapter).toBeDefined();
    expect(adapter!.config.id).toBe("github");
  });

  it("returns vercel adapter", () => {
    const adapter = getAdapter("vercel");
    expect(adapter).toBeDefined();
    expect(adapter!.config.id).toBe("vercel");
  });

  it("returns stripe adapter", () => {
    const adapter = getAdapter("stripe");
    expect(adapter).toBeDefined();
    expect(adapter!.config.id).toBe("stripe");
  });

  it("returns webhook adapter", () => {
    const adapter = getAdapter("webhook");
    expect(adapter).toBeDefined();
    expect(adapter!.config.id).toBe("webhook");
  });

  it("returns undefined for unknown provider", () => {
    expect(getAdapter("unknown")).toBeUndefined();
  });
});

describe("getAllProviders", () => {
  it("returns all 4 providers", () => {
    const providers = getAllProviders();
    expect(providers).toHaveLength(4);
  });

  it("each provider has id, name, description, authType", () => {
    for (const provider of getAllProviders()) {
      expect(provider.id).toBeTruthy();
      expect(provider.name).toBeTruthy();
      expect(provider.description).toBeTruthy();
      expect(["oauth2", "api_key", "webhook"]).toContain(provider.authType);
    }
  });
});

describe("getOAuthProviders", () => {
  it("returns only OAuth2 providers", () => {
    const oauthProviders = getOAuthProviders();
    for (const p of oauthProviders) {
      expect(p.authType).toBe("oauth2");
    }
  });

  it("includes github and vercel", () => {
    const ids = getOAuthProviders().map((p) => p.id);
    expect(ids).toContain("github");
    expect(ids).toContain("vercel");
  });

  it("does not include stripe or webhook", () => {
    const ids = getOAuthProviders().map((p) => p.id);
    expect(ids).not.toContain("stripe");
    expect(ids).not.toContain("webhook");
  });
});

describe("isProviderAvailable", () => {
  it("returns false for unknown provider", () => {
    expect(isProviderAvailable("nonexistent")).toBe(false);
  });

  it("returns true for stripe (no env vars needed)", () => {
    expect(isProviderAvailable("stripe")).toBe(true);
  });

  it("returns true for webhook (no env vars needed)", () => {
    expect(isProviderAvailable("webhook")).toBe(true);
  });

  it("checks env vars for github OAuth provider", () => {
    const saved = {
      id: process.env.GITHUB_CLIENT_ID,
      secret: process.env.GITHUB_CLIENT_SECRET,
    };

    // Without env vars
    delete process.env.GITHUB_CLIENT_ID;
    delete process.env.GITHUB_CLIENT_SECRET;
    expect(isProviderAvailable("github")).toBe(false);

    // With env vars
    process.env.GITHUB_CLIENT_ID = "test-id";
    process.env.GITHUB_CLIENT_SECRET = "test-secret";
    expect(isProviderAvailable("github")).toBe(true);

    // Restore
    if (saved.id) process.env.GITHUB_CLIENT_ID = saved.id;
    else delete process.env.GITHUB_CLIENT_ID;
    if (saved.secret) process.env.GITHUB_CLIENT_SECRET = saved.secret;
    else delete process.env.GITHUB_CLIENT_SECRET;
  });
});
