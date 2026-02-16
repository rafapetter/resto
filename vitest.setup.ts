// Set minimum required env vars for test modules that import env.ts transitively
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_placeholder";
process.env.CLERK_SECRET_KEY = "sk_test_placeholder";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.OPENAI_API_KEY = "sk-test-placeholder";
process.env.ANTHROPIC_API_KEY = "sk-ant-test-placeholder";
process.env.ENCRYPTION_MASTER_KEY = "test-master-key-that-is-32-chars!";
