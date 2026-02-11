type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type ExtractionResult = {
  title: string;
  content: string;
  confidence: number;
};

export function extractKeyDecisions(messages: Message[]): ExtractionResult[] {
  const results: ExtractionResult[] = [];
  const patterns = [
    /(?:decided|chosen|going with|let's go with|we'll use|selected)\s+(.+)/i,
    /(?:the plan is|strategy is|approach is)\s+(.+)/i,
  ];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role !== "assistant") continue;

    for (const pattern of patterns) {
      const match = msg.content.match(pattern);
      if (match) {
        // Get surrounding context
        const prevMsg = messages[i - 1];
        const context = prevMsg
          ? `Q: ${prevMsg.content.slice(0, 200)}\nA: ${msg.content.slice(0, 500)}`
          : msg.content.slice(0, 500);

        results.push({
          title: `Decision: ${match[1].slice(0, 80)}`,
          content: context,
          confidence: 0.7,
        });
      }
    }
  }

  return results;
}

export function extractActionItems(messages: Message[]): ExtractionResult[] {
  const results: ExtractionResult[] = [];
  const patterns = [
    /(?:need to|should|must|will)\s+(.+)/i,
    /(?:next step|todo|action item):\s*(.+)/i,
  ];

  for (const msg of messages) {
    if (msg.role !== "assistant") continue;

    for (const pattern of patterns) {
      const match = msg.content.match(pattern);
      if (match) {
        results.push({
          title: `Action: ${match[1].slice(0, 80)}`,
          content: msg.content.slice(0, 500),
          confidence: 0.5,
        });
      }
    }
  }

  return results;
}
