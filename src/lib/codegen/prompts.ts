export function buildCodeGenPrompt(params: {
  description: string;
  framework: string;
  projectContext: string;
}): string {
  const frameworkLabel =
    params.framework === "nextjs"
      ? "Next.js (App Router) with Tailwind CSS"
      : params.framework;

  const parts = [
    `## Task`,
    `Generate a complete, production-ready ${frameworkLabel} application based on this description:`,
    ``,
    params.description,
    ``,
    `## Project Context (from knowledge base)`,
    params.projectContext || "No existing context available.",
    ``,
    `## Requirements`,
    `- Use TypeScript with strict mode`,
    `- Use Tailwind CSS for styling`,
    `- Create a responsive, mobile-friendly design`,
    `- Include proper error handling`,
    `- Write clean, well-organized code with clear file structure`,
    `- Include a README.md with setup instructions`,
  ];

  if (params.framework === "nextjs") {
    parts.push(
      ``,
      `## Framework: Next.js App Router with Tailwind CSS`,
      `- Use \`app/\` directory structure (App Router)`,
      `- Use Server Components by default, add "use client" only when needed`,
      `- Use Tailwind CSS for styling (no CSS modules)`,
      `- Include \`package.json\` with all dependencies`,
      `- Include \`tailwind.config.ts\` and \`next.config.ts\``
    );
  }

  parts.push(
    ``,
    `Write all files now. Start with the project structure, then implement each file.`
  );

  return parts.join("\n");
}
