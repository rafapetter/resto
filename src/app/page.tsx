import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">ATR - All The Rest</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Your AI co-founder for building digital businesses
      </p>
      <Link
        href="/projects"
        className="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
      >
        Get Started
      </Link>
    </div>
  );
}
