import { encryptOAuthState, decryptOAuthState } from "./oauth-state";
import type { OAuthState } from "./types";

describe("encryptOAuthState / decryptOAuthState", () => {
  const validState: OAuthState = {
    projectId: "proj-123",
    tenantId: "tenant-456",
    provider: "github",
    timestamp: Date.now(),
  };

  it("round-trips: encrypt then decrypt preserves state", () => {
    const encoded = encryptOAuthState(validState);
    const decoded = decryptOAuthState(encoded);
    expect(decoded).toEqual(validState);
  });

  it("produces a base64url-encoded string", () => {
    const encoded = encryptOAuthState(validState);
    expect(typeof encoded).toBe("string");
    // base64url chars only: A-Z, a-z, 0-9, -, _
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("produces different ciphertext for same state (random IV)", () => {
    const a = encryptOAuthState(validState);
    const b = encryptOAuthState(validState);
    expect(a).not.toBe(b);
  });

  it("throws on tampered ciphertext", () => {
    const encoded = encryptOAuthState(validState);
    // Flip a character in the middle
    const chars = encoded.split("");
    const midIdx = Math.floor(chars.length / 2);
    chars[midIdx] = chars[midIdx] === "A" ? "B" : "A";
    const tampered = chars.join("");
    expect(() => decryptOAuthState(tampered)).toThrow();
  });

  it("throws on truncated payload", () => {
    const encoded = encryptOAuthState(validState);
    const truncated = encoded.slice(0, 10);
    expect(() => decryptOAuthState(truncated)).toThrow();
  });

  it("throws 'too short' for very short input", () => {
    expect(() => decryptOAuthState("abc")).toThrow("too short");
  });

  it("throws on expired state (>10 minutes old)", () => {
    const oldState: OAuthState = {
      ...validState,
      timestamp: Date.now() - 11 * 60 * 1000, // 11 minutes ago
    };
    const encoded = encryptOAuthState(oldState);
    expect(() => decryptOAuthState(encoded)).toThrow("expired");
  });

  it("accepts state within 10 minute window", () => {
    const recentState: OAuthState = {
      ...validState,
      timestamp: Date.now() - 9 * 60 * 1000, // 9 minutes ago
    };
    const encoded = encryptOAuthState(recentState);
    expect(() => decryptOAuthState(encoded)).not.toThrow();
  });

  it("preserves all fields including provider and project ID", () => {
    const state: OAuthState = {
      projectId: "proj-specific",
      tenantId: "tenant-specific",
      provider: "vercel",
      timestamp: Date.now(),
    };
    const decoded = decryptOAuthState(encryptOAuthState(state));
    expect(decoded.projectId).toBe("proj-specific");
    expect(decoded.tenantId).toBe("tenant-specific");
    expect(decoded.provider).toBe("vercel");
  });
});
