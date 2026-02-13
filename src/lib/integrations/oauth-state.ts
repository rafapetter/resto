import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "crypto";
import { env } from "@/lib/env";
import type { OAuthState } from "./types";

const ALGORITHM = "aes-256-gcm" as const;
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const STATE_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

function deriveStateKey(): Buffer {
  const masterKey = env.ENCRYPTION_MASTER_KEY;
  if (!masterKey) {
    throw new Error("ENCRYPTION_MASTER_KEY required for OAuth state encryption");
  }
  return Buffer.from(
    hkdfSync("sha256", masterKey, "atr-oauth-state", "atr-state-v1", 32)
  );
}

export function encryptOAuthState(state: OAuthState): string {
  const key = deriveStateKey();
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const plaintext = JSON.stringify(state);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Pack: iv (12) + authTag (16) + ciphertext
  const packed = Buffer.concat([iv, authTag, encrypted]);
  return packed.toString("base64url");
}

export function decryptOAuthState(encoded: string): OAuthState {
  const key = deriveStateKey();
  const packed = Buffer.from(encoded, "base64url");

  if (packed.length < IV_LENGTH + AUTH_TAG_LENGTH + 1) {
    throw new Error("Invalid OAuth state: too short");
  }

  const iv = packed.subarray(0, IV_LENGTH);
  const authTag = packed.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = packed.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  const state = JSON.parse(decrypted.toString("utf8")) as OAuthState;

  // Validate freshness
  const age = Date.now() - state.timestamp;
  if (age > STATE_MAX_AGE_MS) {
    throw new Error("OAuth state expired");
  }

  return state;
}
