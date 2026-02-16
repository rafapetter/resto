import { z } from "zod/v4";

const envSchema = z.object({
  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default("/sign-in"),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default("/sign-up"),

  // Database
  DATABASE_URL: z.string().url(),

  // OpenAI (for embeddings)
  OPENAI_API_KEY: z.string().min(1),

  // Anthropic
  ANTHROPIC_API_KEY: z.string().min(1),

  // Google AI
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1).optional(),

  // Vercel Blob
  BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),

  // Vercel KV
  KV_REST_API_URL: z.string().url().optional(),
  KV_REST_API_TOKEN: z.string().min(1).optional(),

  // Encryption
  ENCRYPTION_MASTER_KEY: z.string().min(32).optional(),

  // Integration OAuth providers
  GITHUB_CLIENT_ID: z.string().min(1).optional(),
  GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
  VERCEL_CLIENT_ID: z.string().min(1).optional(),
  VERCEL_CLIENT_SECRET: z.string().min(1).optional(),

  // Cron
  CRON_SECRET: z.string().min(16).optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  // Convert empty strings to undefined so optional() works with .env files
  const cleaned: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(process.env)) {
    cleaned[key] = value === "" ? undefined : value;
  }
  const parsed = envSchema.safeParse(cleaned);

  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.format());
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

// Lazy validation: only validate when env is first accessed (not at module load).
// This prevents build-time crashes when env vars aren't available during static generation.
let _env: Env | undefined;
export const env: Env = new Proxy({} as Env, {
  get(_target, prop: string) {
    if (!_env) {
      _env = validateEnv();
    }
    return _env[prop as keyof Env];
  },
});
