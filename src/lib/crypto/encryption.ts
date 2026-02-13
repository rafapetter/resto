import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "crypto";
import { env } from "@/lib/env";

// ─── Types ──────────────────────────────────────────────────────────

export type EncryptedPayload = {
  encryptedData: Buffer;
  iv: Buffer;
  keyVersion: number;
};

export type DecryptedCredential = Record<string, unknown>;

// ─── Constants ──────────────────────────────────────────────────────

const CURRENT_KEY_VERSION = 1;
const ALGORITHM = "aes-256-gcm" as const;
const IV_LENGTH = 12; // 96 bits, recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits
const HKDF_SALT = "atr-salt";

// ─── Key Derivation ─────────────────────────────────────────────────

function getMasterKey(): string {
  const key = env.ENCRYPTION_MASTER_KEY;
  if (!key) {
    throw new Error(
      "ENCRYPTION_MASTER_KEY is not set. Required for credential encryption."
    );
  }
  return key;
}

function deriveKey(masterKey: string, version: number): Buffer {
  return Buffer.from(
    hkdfSync("sha256", masterKey, HKDF_SALT, `atr-cred-v${version}`, 32)
  );
}

// ─── Encrypt ────────────────────────────────────────────────────────

export function encrypt(data: DecryptedCredential): EncryptedPayload {
  const masterKey = getMasterKey();
  const key = deriveKey(masterKey, CURRENT_KEY_VERSION);
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const plaintext = JSON.stringify(data);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  // Append auth tag to ciphertext
  const authTag = cipher.getAuthTag();
  const encryptedData = Buffer.concat([encrypted, authTag]);

  return {
    encryptedData,
    iv,
    keyVersion: CURRENT_KEY_VERSION,
  };
}

// ─── Decrypt ────────────────────────────────────────────────────────

export function decrypt(payload: EncryptedPayload): DecryptedCredential {
  const masterKey = getMasterKey();
  const key = deriveKey(masterKey, payload.keyVersion);

  // Extract auth tag from last 16 bytes
  const encryptedData = payload.encryptedData.subarray(0, -AUTH_TAG_LENGTH);
  const authTag = payload.encryptedData.subarray(-AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, payload.iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString("utf8")) as DecryptedCredential;
}

// ─── Key Rotation ───────────────────────────────────────────────────

export function rotateKey(
  payload: EncryptedPayload,
  newVersion: number
): EncryptedPayload {
  const data = decrypt(payload);
  const masterKey = getMasterKey();
  const key = deriveKey(masterKey, newVersion);
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const plaintext = JSON.stringify(data);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();
  const encryptedData = Buffer.concat([encrypted, authTag]);

  return {
    encryptedData,
    iv,
    keyVersion: newVersion,
  };
}
