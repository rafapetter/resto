"use client";

import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export function RestoChat() {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <CopilotChat
        className="flex-1"
        labels={{
          title: "Resto",
          initial:
            "Hi! I'm Resto, your AI co-founder. How can I help with your project today?",
          placeholder: "Ask me anything about your project...",
        }}
      />
    </div>
  );
}
