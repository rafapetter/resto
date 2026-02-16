import { randomBytes } from "crypto";
import { encrypt, decrypt, rotateKey } from "./encryption";

describe("encrypt / decrypt round-trip", () => {
  it("encrypts and decrypts a simple object", () => {
    const data = { token: "abc123", provider: "github" };
    const payload = encrypt(data);
    const result = decrypt(payload);
    expect(result).toEqual(data);
  });

  it("encrypts and decrypts nested objects", () => {
    const data = { credentials: { key: "val", nested: [1, 2, 3] } };
    const payload = encrypt(data);
    const result = decrypt(payload);
    expect(result).toEqual(data);
  });

  it("encrypts and decrypts empty object", () => {
    const data = {};
    const payload = encrypt(data);
    const result = decrypt(payload);
    expect(result).toEqual(data);
  });

  it("produces different ciphertext for same plaintext (random IV)", () => {
    const data = { token: "same-value" };
    const payload1 = encrypt(data);
    const payload2 = encrypt(data);
    expect(payload1.encryptedData.equals(payload2.encryptedData)).toBe(false);
  });

  it("returns correct keyVersion", () => {
    const payload = encrypt({ foo: "bar" });
    expect(payload.keyVersion).toBe(1);
  });

  it("returns Buffer for iv and encryptedData", () => {
    const payload = encrypt({ foo: "bar" });
    expect(Buffer.isBuffer(payload.iv)).toBe(true);
    expect(Buffer.isBuffer(payload.encryptedData)).toBe(true);
    expect(payload.iv.length).toBe(12); // 96-bit IV
  });
});

describe("decrypt - tamper detection", () => {
  it("throws on corrupted ciphertext", () => {
    const payload = encrypt({ token: "secret" });
    const corrupted = Buffer.from(payload.encryptedData);
    corrupted[0] ^= 0xff;
    expect(() =>
      decrypt({ ...payload, encryptedData: corrupted })
    ).toThrow();
  });

  it("throws on corrupted auth tag", () => {
    const payload = encrypt({ token: "secret" });
    const corrupted = Buffer.from(payload.encryptedData);
    corrupted[corrupted.length - 1] ^= 0xff;
    expect(() =>
      decrypt({ ...payload, encryptedData: corrupted })
    ).toThrow();
  });

  it("throws on truncated payload", () => {
    const payload = encrypt({ token: "secret" });
    const truncated = payload.encryptedData.subarray(0, 4);
    expect(() =>
      decrypt({ ...payload, encryptedData: truncated })
    ).toThrow();
  });

  it("throws on wrong IV", () => {
    const payload = encrypt({ token: "secret" });
    const wrongIv = randomBytes(12);
    expect(() => decrypt({ ...payload, iv: wrongIv })).toThrow();
  });
});

describe("decrypt - wrong key", () => {
  it("throws when decrypting with different key version", () => {
    const payload = encrypt({ token: "secret" });
    // Different version derives a different key via HKDF
    expect(() => decrypt({ ...payload, keyVersion: 99 })).toThrow();
  });
});

describe("rotateKey", () => {
  it("re-encrypts to new version and data survives round-trip", () => {
    const original = { token: "rotate-me" };
    const v1 = encrypt(original);
    const v2 = rotateKey(v1, 2);
    const result = decrypt(v2);
    expect(result).toEqual(original);
  });

  it("output has the new keyVersion", () => {
    const v1 = encrypt({ key: "val" });
    const v2 = rotateKey(v1, 42);
    expect(v2.keyVersion).toBe(42);
  });

  it("output has different ciphertext than input", () => {
    const v1 = encrypt({ key: "val" });
    const v2 = rotateKey(v1, 2);
    expect(v1.encryptedData.equals(v2.encryptedData)).toBe(false);
  });
});

describe("getMasterKey guard", () => {
  it("throws if ENCRYPTION_MASTER_KEY is undefined", async () => {
    vi.resetModules();
    const saved = process.env.ENCRYPTION_MASTER_KEY;
    delete process.env.ENCRYPTION_MASTER_KEY;
    try {
      const { encrypt: encryptNoKey } = await import("./encryption");
      expect(() => encryptNoKey({ foo: "bar" })).toThrow(
        "ENCRYPTION_MASTER_KEY is not set"
      );
    } finally {
      process.env.ENCRYPTION_MASTER_KEY = saved;
    }
  });
});
