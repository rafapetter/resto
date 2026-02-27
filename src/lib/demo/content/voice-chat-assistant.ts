import type { UseCaseDemoContent } from "../types";
import type { Locale } from "../i18n/types";
import { getCommonChannels, getCommonIntegrations, makeDeployTerminal, l } from "./_shared";

export default function getContent(locale: Locale): UseCaseDemoContent {
  const CI = getCommonIntegrations(locale);
  const channels = getCommonChannels(locale);

  return {
  // ─── Onboarding ────────────────────────────────────────────────────
  onboarding: {
    industries: [
      { id: "customer-service", name: l(locale, "Customer Service", "Atendimento ao Cliente"), emoji: "🎧" },
      { id: "hospitality", name: l(locale, "Hospitality", "Hotelaria"), emoji: "🏨" },
      { id: "telecom", name: l(locale, "Telecom", "Telecomunicações"), emoji: "📡" },
      { id: "banking", name: l(locale, "Banking", "Bancário"), emoji: "🏦" },
      { id: "utilities", name: l(locale, "Utilities", "Serviços Públicos"), emoji: "⚡" },
      { id: "government", name: l(locale, "Government Services", "Serviços Governamentais"), emoji: "🏛️" },
    ],
    verticals: [
      { id: "inbound-support", name: l(locale, "Inbound Support", "Suporte Receptivo") },
      { id: "outbound-campaigns", name: l(locale, "Outbound Campaigns", "Campanhas Ativas") },
      { id: "virtual-receptionist", name: l(locale, "Virtual Receptionist", "Recepcionista Virtual") },
      { id: "ivr-replacement", name: l(locale, "IVR Replacement", "Substituição de URA") },
    ],
    features: [
      { id: "voice-recognition", name: l(locale, "Voice Recognition & NLU", "Reconhecimento de Voz e NLU") },
      { id: "sentiment-analysis", name: l(locale, "Real-Time Sentiment Analysis", "Análise de Sentimento em Tempo Real") },
      { id: "agent-handoff", name: l(locale, "Smart Agent Handoff", "Transferência Inteligente para Agente") },
      { id: "call-summarization", name: l(locale, "Call Summarization", "Resumo de Chamadas") },
      { id: "multilingual", name: l(locale, "Multilingual Support", "Suporte Multilíngue") },
      { id: "voice-cloning", name: l(locale, "Custom Voice Cloning", "Clonagem de Voz Personalizada") },
    ],
    autoSelections: {
      industry: "customer-service",
      vertical: "inbound-support",
      features: ["voice-recognition", "sentiment-analysis", "agent-handoff", "call-summarization"],
      autonomy: {
        "voice-recognition": "full",
        "sentiment-analysis": "full",
        "agent-handoff": "supervised",
        "call-summarization": "full",
        "multilingual": "full",
        "voice-cloning": "supervised",
      },
    },
    projectName: "AssistPro",
    projectDescription: l(locale, "Enterprise voice and chat AI assistant with natural language understanding, real-time sentiment analysis, and seamless human handoff for omnichannel support.", "Assistente de IA para voz e chat empresarial com compreensão de linguagem natural, análise de sentimento em tempo real e transferência fluida para humanos em suporte omnichannel."),
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "AssistPro",
    projectBadge: l(locale, "Voice & Chat", "Voz e Chat"),
    projectDescription: l(locale, "Replace legacy IVR with conversational AI — handle 80% of support calls autonomously while routing complex issues to the right human agent with full context.", "Substitua a URA legada por IA conversacional — resolva 80% das chamadas de suporte de forma autônoma enquanto encaminha questões complexas para o agente humano certo com contexto completo."),
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: l(locale, "Good morning. AssistPro handled 1,247 conversations yesterday — 982 voice calls and 265 chat sessions. Resolution rate: 78% without human escalation. Average handle time dropped to 3.2 minutes, down from 4.8 minutes last month. Sentiment scores averaged 4.1/5.", "Bom dia. O AssistPro atendeu 1.247 conversas ontem — 982 chamadas de voz e 265 sessões de chat. Taxa de resolução: 78% sem escalonamento humano. O tempo médio de atendimento caiu para 3,2 minutos, contra 4,8 minutos no mês passado. A pontuação de sentimento ficou em média 4,1/5."),
      },
      {
        role: "user",
        content: l(locale, "What were the top reasons for human escalation yesterday?", "Quais foram os principais motivos de escalonamento para humanos ontem?"),
      },
      {
        role: "assistant",
        content: l(locale, "Top escalation reasons (271 total handoffs):\n\n1. **Billing disputes** — 82 calls (30.3%). Customers disputing charges beyond the $50 auto-resolution threshold.\n2. **Account cancellation requests** — 54 calls (19.9%). Retention flow triggered but customer insisted on speaking with a person.\n3. **Technical troubleshooting (Tier 2)** — 48 calls (17.7%). Issues requiring access to internal diagnostic tools.\n4. **Emotional distress detected** — 41 calls (15.1%). Sentiment analysis flagged high frustration — policy requires human empathy.\n5. **Regulatory/compliance queries** — 46 calls (17.0%). Legal-adjacent questions routed per compliance rules.\n\nI've noticed billing disputes are trending up 12% week-over-week. The recent price increase may be driving this. Should I adjust the auto-resolution threshold or add a proactive price-change acknowledgment to the call flow?", "Principais motivos de escalonamento (271 transferências no total):\n\n1. **Disputas de cobrança** — 82 chamadas (30,3%). Clientes contestando cobranças acima do limite de resolução automática de $50.\n2. **Solicitações de cancelamento** — 54 chamadas (19,9%). Fluxo de retenção ativado, mas o cliente insistiu em falar com uma pessoa.\n3. **Suporte técnico (Nível 2)** — 48 chamadas (17,7%). Problemas que exigem acesso a ferramentas de diagnóstico internas.\n4. **Angústia emocional detectada** — 41 chamadas (15,1%). Análise de sentimento sinalizou alta frustração — a política exige empatia humana.\n5. **Consultas regulatórias/compliance** — 46 chamadas (17,0%). Perguntas jurídicas encaminhadas conforme regras de compliance.\n\nNotei que as disputas de cobrança estão subindo 12% semana a semana. O recente aumento de preço pode estar causando isso. Devo ajustar o limite de resolução automática ou adicionar um reconhecimento proativo de mudança de preço ao fluxo de chamadas?"),
      },
      {
        role: "user",
        content: l(locale, "Add the proactive acknowledgment. Also, can we improve the retention flow for cancellations?", "Adicione o reconhecimento proativo. E podemos melhorar o fluxo de retenção para cancelamentos?"),
      },
      {
        role: "assistant",
        content: l(locale, "I've drafted two changes:\n\n**1. Proactive Price Acknowledgment** — When a caller mentions \"bill\" or \"charges,\" the AI will proactively say: \"I see your plan recently changed. Let me walk you through the adjustment and any options available.\" This should deflect ~30% of billing escalations.\n\n**2. Enhanced Retention Flow** — Adding three new retention offers:\n• Loyalty discount (15% for 3 months) for customers with 12+ months tenure\n• Plan downgrade option with feature comparison\n• Pause subscription for up to 60 days\n\nThe retention offers would be presented conversationally before the cancellation handoff. Want me to activate these in the staging environment for A/B testing?", "Preparei duas mudanças:\n\n**1. Reconhecimento Proativo de Preço** — Quando o chamador mencionar \"conta\" ou \"cobrança\", a IA dirá proativamente: \"Vejo que seu plano mudou recentemente. Deixe-me explicar o ajuste e as opções disponíveis.\" Isso deve desviar ~30% dos escalonamentos de cobrança.\n\n**2. Fluxo de Retenção Aprimorado** — Adicionando três novas ofertas de retenção:\n• Desconto fidelidade (15% por 3 meses) para clientes com 12+ meses\n• Opção de downgrade de plano com comparação de recursos\n• Pausa de assinatura por até 60 dias\n\nAs ofertas de retenção serão apresentadas de forma conversacional antes da transferência de cancelamento. Deseja que eu ative no ambiente de staging para testes A/B?"),
        action: {
          type: "approval",
          title: l(locale, "Deploy Updated Call Flows to Staging", "Implantar Fluxos de Chamada Atualizados em Staging"),
          description: l(locale, "Push the proactive billing acknowledgment script and enhanced retention flow (3 new offers) to the staging environment for A/B testing. Test group: 20% of inbound calls for 7 days. Success metrics: escalation rate reduction and retention save rate.", "Enviar o script de reconhecimento proativo de cobrança e o fluxo de retenção aprimorado (3 novas ofertas) para o ambiente de staging para testes A/B. Grupo de teste: 20% das chamadas recebidas por 7 dias. Métricas de sucesso: redução da taxa de escalonamento e taxa de retenção."),
        },
      },
      {
        role: "user",
        content: l(locale, "Deploy to staging. What's the voice quality looking like?", "Implante em staging. Como está a qualidade de voz?"),
      },
      {
        role: "assistant",
        content: l(locale, "Deployed to staging. Voice quality metrics for the past 7 days:\n\n• **Speech recognition accuracy**: 96.8% (up from 95.2% after the February model update)\n• **Intent classification**: 94.1% first-try accuracy\n• **Average latency**: 320ms response time (target: <500ms)\n• **Voice naturalness rating**: 4.3/5 from post-call surveys\n• **Language coverage**: English (98.2%), Spanish (94.5%), French (91.8%), Mandarin (89.4%)\n\nOne thing to flag: Mandarin accuracy dropped 2% this week. Root cause appears to be a new batch of calls from Cantonese speakers being misclassified. I recommend adding a Cantonese language model to the recognition pipeline.", "Implantado em staging. Métricas de qualidade de voz dos últimos 7 dias:\n\n• **Precisão de reconhecimento de fala**: 96,8% (subiu de 95,2% após a atualização do modelo de fevereiro)\n• **Classificação de intenção**: 94,1% de precisão na primeira tentativa\n• **Latência média**: 320ms de tempo de resposta (meta: <500ms)\n• **Avaliação de naturalidade de voz**: 4,3/5 em pesquisas pós-chamada\n• **Cobertura de idiomas**: Inglês (98,2%), Espanhol (94,5%), Francês (91,8%), Mandarim (89,4%)\n\nUm ponto a sinalizar: a precisão do Mandarim caiu 2% esta semana. A causa raiz parece ser um novo lote de chamadas de falantes de Cantonês sendo classificadas incorretamente. Recomendo adicionar um modelo de idioma Cantonês ao pipeline de reconhecimento."),
      },
      {
        role: "user",
        content: l(locale, "Add Cantonese support to the roadmap. Anything else I should know?", "Adicione o suporte a Cantonês ao roadmap. Mais alguma coisa que eu deva saber?"),
      },
      {
        role: "assistant",
        content: l(locale, "Cantonese support added to the Q2 roadmap. A few more items:\n\n1. **Peak hour alert**: Call volume spikes 40% between 10-11 AM. I've pre-scaled the voice infrastructure to handle the load, but we're approaching the 200 concurrent call limit on the current plan.\n2. **New integration request**: The support team asked for Zendesk ticket creation directly from call summaries. I can wire that up — it would auto-create tickets with full call transcript and sentiment tags.\n3. **Monthly report**: February's containment rate is on track to hit 80%, which would be a new high. Cost per interaction is down to $0.42 vs. $3.80 for human-handled calls.\n\nThe ROI story is strong — shall I generate a stakeholder report for the quarterly review?", "Suporte ao Cantonês adicionado ao roadmap do Q2. Mais alguns itens:\n\n1. **Alerta de horário de pico**: O volume de chamadas sobe 40% entre 10-11h. Pré-escalei a infraestrutura de voz para suportar a carga, mas estamos nos aproximando do limite de 200 chamadas simultâneas no plano atual.\n2. **Nova solicitação de integração**: A equipe de suporte pediu criação de tickets no Zendesk diretamente dos resumos de chamadas. Posso configurar isso — criaria tickets automaticamente com transcrição completa e tags de sentimento.\n3. **Relatório mensal**: A taxa de contenção de fevereiro está a caminho de atingir 80%, o que seria um novo recorde. O custo por interação caiu para $0,42 contra $3,80 para chamadas atendidas por humanos.\n\nA história de ROI é forte — devo gerar um relatório para stakeholders para a revisão trimestral?"),
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: l(locale, "Good morning. Here's your AssistPro operations briefing for February 20th.", "Bom dia. Aqui está seu briefing operacional do AssistPro para 20 de fevereiro."), durationMs: 3000 },
      { speaker: "agent", text: l(locale, "Yesterday we handled 1,247 conversations — 982 voice and 265 chat. Resolution without escalation was 78%, and average handle time dropped to 3.2 minutes. Customer sentiment averaged 4.1 out of 5.", "Ontem atendemos 1.247 conversas — 982 por voz e 265 por chat. A resolução sem escalonamento foi de 78%, e o tempo médio de atendimento caiu para 3,2 minutos. O sentimento do cliente ficou em média 4,1 de 5."), durationMs: 9200 },
      { speaker: "agent", text: l(locale, "Top escalation driver is billing disputes at 30% of handoffs, trending up 12% week over week likely due to the recent price change. I've prepared a proactive acknowledgment script and enhanced retention flow for your review.", "O principal motivo de escalonamento são disputas de cobrança com 30% das transferências, subindo 12% semana a semana provavelmente devido à recente mudança de preço. Preparei um script de reconhecimento proativo e fluxo de retenção aprimorado para sua análise."), durationMs: 8800 },
      { speaker: "agent", text: l(locale, "Voice quality is strong at 96.8% recognition accuracy with 320 millisecond response latency. One flag: Mandarin accuracy dropped due to Cantonese misclassification. I recommend adding Cantonese as a supported language. Monthly containment rate is tracking toward 80%, a new record.", "A qualidade de voz está forte com 96,8% de precisão de reconhecimento e 320 milissegundos de latência de resposta. Um alerta: a precisão do Mandarim caiu devido a classificação incorreta de Cantonês. Recomendo adicionar Cantonês como idioma suportado. A taxa de contenção mensal está a caminho de 80%, um novo recorde."), durationMs: 10500 },
    ],
    summary: l(locale, "Briefing covered 1,247 daily conversations, 78% autonomous resolution, billing escalation trend, proactive script updates, voice quality metrics, and record-setting containment rate.", "Briefing cobriu 1.247 conversas diárias, 78% de resolução autônoma, tendência de escalonamento por cobrança, atualizações de scripts proativos, métricas de qualidade de voz e taxa de contenção recorde."),
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "Twilio Voice", icon: "phone", category: l(locale, "Telephony", "Telefonia"), description: l(locale, "Programmable voice calls with SIP trunking and call recording", "Chamadas de voz programáveis com tronco SIP e gravação de chamadas") },
      { name: "Deepgram", icon: "mic", category: l(locale, "Speech AI", "IA de Fala"), description: l(locale, "Real-time speech-to-text with speaker diarization and noise cancellation", "Transcrição de fala em tempo real com diarização de falantes e cancelamento de ruído") },
      { name: "ElevenLabs", icon: "audio-waveform", category: l(locale, "Voice Synthesis", "Síntese de Voz"), description: l(locale, "Custom voice cloning and text-to-speech with natural prosody", "Clonagem de voz personalizada e texto-para-fala com prosódia natural") },
      { name: "Zendesk", icon: "headphones", category: "Helpdesk", description: l(locale, "Ticket creation, agent routing, and support workflow management", "Criação de tickets, roteamento de agentes e gestão de fluxo de suporte") },
      { name: "Intercom", icon: "message-square", category: "Chat", description: l(locale, "Live chat widget, chatbot flows, and customer messaging platform", "Widget de chat ao vivo, fluxos de chatbot e plataforma de mensagens com clientes") },
      { name: "Five9", icon: "phone-call", category: l(locale, "Contact Center", "Central de Atendimento"), description: l(locale, "Cloud contact center with ACD, workforce management, and reporting", "Central de atendimento na nuvem com DAC, gestão de força de trabalho e relatórios") },
      CI.twilio,
      CI.slack,
      CI.claude,
      CI.googleEmail,
      CI.analytics,
      CI.posthog,
      CI.github,
      CI.vercel,
      CI.sentry,
    ],
  },

  // ─── Build ─────────────────────────────────────────────────────────
  build: {
    checklist: [
      { title: l(locale, "Design conversation state machine and intent taxonomy", "Projetar máquina de estados de conversa e taxonomia de intenções"), stage: "plan", status: "complete" },
      { title: l(locale, "Define escalation rules, sentiment thresholds, and handoff logic", "Definir regras de escalonamento, limites de sentimento e lógica de transferência"), stage: "plan", status: "complete" },
      { title: l(locale, "Build voice pipeline: STT → NLU → Dialog → TTS", "Construir pipeline de voz: STT → NLU → Diálogo → TTS"), stage: "build", status: "complete" },
      { title: l(locale, "Implement real-time sentiment analysis with escalation triggers", "Implementar análise de sentimento em tempo real com gatilhos de escalonamento"), stage: "build", status: "complete" },
      { title: l(locale, "Create agent handoff system with context transfer", "Criar sistema de transferência para agente com passagem de contexto"), stage: "build", status: "active" },
      { title: l(locale, "Build call analytics dashboard with recording playback", "Construir dashboard de análise de chamadas com reprodução de gravações"), stage: "build", status: "pending" },
      { title: l(locale, "Set up multi-language model routing", "Configurar roteamento de modelo multilíngue"), stage: "launch", status: "pending" },
      { title: l(locale, "Deploy with auto-scaling and telephony redundancy", "Deploy com auto-scaling e redundância de telefonia"), stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "dashboard", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "conversations", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[conversationId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
              { name: "call-flows", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "analytics", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "agents", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "settings", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "voice", type: "folder", children: [
                { name: "inbound", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "outbound", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
              { name: "chat", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "sentiment", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "transcribe", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "webhooks", type: "folder", children: [
                { name: "twilio", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "zendesk", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "dialog-engine.ts", type: "file" },
          { name: "sentiment-analyzer.ts", type: "file" },
          { name: "voice-pipeline.ts", type: "file" },
          { name: "handoff-router.ts", type: "file" },
          { name: "call-summarizer.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: l(locale, "Call Flow Scripts", "Scripts de Fluxo de Chamadas"), icon: "phone", count: 36 },
      { name: l(locale, "Intent Libraries", "Bibliotecas de Intenções"), icon: "brain", count: 28 },
      { name: l(locale, "Escalation Policies", "Políticas de Escalonamento"), icon: "alert-circle", count: 14 },
      { name: l(locale, "Product Knowledge Base", "Base de Conhecimento de Produto"), icon: "book-open", count: 52 },
    ],
    documents: [
      { title: l(locale, "Master Intent Taxonomy", "Taxonomia Mestre de Intenções"), category: l(locale, "Intent Libraries", "Bibliotecas de Intenções"), tier: "index", lines: 140, crossRefs: [l(locale, "Billing Intent Flows", "Fluxos de Intenção de Cobrança"), l(locale, "Technical Support Decision Tree", "Árvore de Decisão de Suporte Técnico")] },
      { title: l(locale, "Billing Intent Flows", "Fluxos de Intenção de Cobrança"), category: l(locale, "Call Flow Scripts", "Scripts de Fluxo de Chamadas"), tier: "detail", lines: 380 },
      { title: l(locale, "Technical Support Decision Tree", "Árvore de Decisão de Suporte Técnico"), category: l(locale, "Call Flow Scripts", "Scripts de Fluxo de Chamadas"), tier: "detail", lines: 450 },
      { title: l(locale, "Escalation Policy Framework", "Framework de Política de Escalonamento"), category: l(locale, "Escalation Policies", "Políticas de Escalonamento"), tier: "summary", lines: 165, crossRefs: [l(locale, "Sentiment Threshold Configuration", "Configuração de Limites de Sentimento")] },
      { title: l(locale, "Sentiment Threshold Configuration", "Configuração de Limites de Sentimento"), category: l(locale, "Escalation Policies", "Políticas de Escalonamento"), tier: "detail", lines: 120 },
      { title: l(locale, "Retention Offer Matrix", "Matriz de Ofertas de Retenção"), category: l(locale, "Call Flow Scripts", "Scripts de Fluxo de Chamadas"), tier: "summary", lines: 95, crossRefs: [l(locale, "Master Intent Taxonomy", "Taxonomia Mestre de Intenções")] },
      { title: l(locale, "Multilingual Response Templates", "Templates de Resposta Multilíngue"), category: l(locale, "Product Knowledge Base", "Base de Conhecimento de Produto"), tier: "detail", lines: 680 },
      { title: l(locale, "Voice Quality Standards & SLAs", "Padrões de Qualidade de Voz e SLAs"), category: l(locale, "Escalation Policies", "Políticas de Escalonamento"), tier: "summary", lines: 110 },
      { title: l(locale, "FAQ Knowledge Base — Tier 1", "Base de Conhecimento FAQ — Nível 1"), category: l(locale, "Product Knowledge Base", "Base de Conhecimento de Produto"), tier: "index", lines: 220, crossRefs: [l(locale, "Technical Support Decision Tree", "Árvore de Decisão de Suporte Técnico")] },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: l(locale, "Daily Conversations Handled", "Conversas Diárias Atendidas"),
        type: "bar",
        data: [
          { name: l(locale, "Mon", "Seg"), value: 1180 },
          { name: l(locale, "Tue", "Ter"), value: 1320 },
          { name: l(locale, "Wed", "Qua"), value: 1290 },
          { name: l(locale, "Thu", "Qui"), value: 1247 },
          { name: l(locale, "Fri", "Sex"), value: 1150 },
          { name: l(locale, "Sat", "Sáb"), value: 680 },
          { name: l(locale, "Sun", "Dom"), value: 420 },
        ],
      },
      {
        label: l(locale, "Autonomous Resolution Rate (%)", "Taxa de Resolução Autônoma (%)"),
        type: "line",
        data: [
          { name: l(locale, "Sep", "Set"), value: 62 },
          { name: l(locale, "Oct", "Out"), value: 67 },
          { name: "Nov", value: 71 },
          { name: l(locale, "Dec", "Dez"), value: 74 },
          { name: "Jan", value: 76 },
          { name: l(locale, "Feb", "Fev"), value: 78 },
        ],
      },
    ],
  },

  // ─── Orchestration ──────────────────────────────────────────────────
  orchestration: {
    agents: [
      { name: l(locale, "Conversation Orchestrator", "Orquestrador de Conversas"), role: l(locale, "Routes and manages all inbound voice and chat conversations", "Roteia e gerencia todas as conversas recebidas por voz e chat"), avatar: "🎧", color: "blue", tasks: [l(locale, "Channel routing", "Roteamento de canais"), l(locale, "Load balancing", "Balanceamento de carga"), l(locale, "Priority queuing", "Enfileiramento por prioridade")] },
      { name: l(locale, "Voice Agent", "Agente de Voz"), role: l(locale, "Handles voice calls with STT, NLU, and TTS pipeline", "Atende chamadas de voz com pipeline STT, NLU e TTS"), avatar: "🗣️", color: "emerald", tasks: [l(locale, "Speech recognition", "Reconhecimento de fala"), l(locale, "Intent classification", "Classificação de intenção"), l(locale, "Voice response generation", "Geração de resposta por voz")], reportsTo: l(locale, "Conversation Orchestrator", "Orquestrador de Conversas") },
      { name: l(locale, "Chat Agent", "Agente de Chat"), role: l(locale, "Manages text-based conversations across web and messaging", "Gerencia conversas por texto em web e mensageiros"), avatar: "💬", color: "violet", tasks: [l(locale, "Message processing", "Processamento de mensagens"), l(locale, "Quick reply suggestions", "Sugestões de resposta rápida"), l(locale, "Rich media responses", "Respostas com mídia rica")], reportsTo: l(locale, "Conversation Orchestrator", "Orquestrador de Conversas") },
      { name: l(locale, "Sentiment Monitor", "Monitor de Sentimento"), role: l(locale, "Analyzes customer emotion in real-time", "Analisa emoção do cliente em tempo real"), avatar: "😊", color: "amber", tasks: [l(locale, "Emotion detection", "Detecção de emoção"), l(locale, "Frustration alerts", "Alertas de frustração"), l(locale, "Satisfaction scoring", "Pontuação de satisfação")], reportsTo: l(locale, "Conversation Orchestrator", "Orquestrador de Conversas") },
      { name: l(locale, "Handoff Manager", "Gerente de Transferência"), role: l(locale, "Transfers conversations to human agents with full context", "Transfere conversas para agentes humanos com contexto completo"), avatar: "🤝", color: "rose", tasks: [l(locale, "Agent matching", "Seleção de agente"), l(locale, "Context packaging", "Empacotamento de contexto"), l(locale, "Warm transfer execution", "Execução de transferência assistida")], reportsTo: l(locale, "Conversation Orchestrator", "Orquestrador de Conversas") },
      { name: l(locale, "Knowledge Retriever", "Recuperador de Conhecimento"), role: l(locale, "Finds relevant answers from the knowledge base", "Encontra respostas relevantes na base de conhecimento"), avatar: "📚", color: "cyan", tasks: [l(locale, "Semantic search", "Busca semântica"), l(locale, "Answer extraction", "Extração de respostas"), l(locale, "Source citation", "Citação de fontes")], reportsTo: l(locale, "Voice Agent", "Agente de Voz") },
      { name: l(locale, "Quality Analyst", "Analista de Qualidade"), role: l(locale, "Scores conversations and identifies coaching opportunities", "Pontua conversas e identifica oportunidades de coaching"), avatar: "⭐", color: "green", tasks: [l(locale, "Call scoring", "Pontuação de chamadas"), l(locale, "Compliance checking", "Verificação de compliance"), l(locale, "Improvement recommendations", "Recomendações de melhoria")], reportsTo: l(locale, "Conversation Orchestrator", "Orquestrador de Conversas") },
      { name: l(locale, "Language Router", "Roteador de Idiomas"), role: l(locale, "Detects language and routes to appropriate model", "Detecta idioma e roteia para o modelo apropriado"), avatar: "🌐", color: "slate", tasks: [l(locale, "Language detection", "Detecção de idioma"), l(locale, "Model selection", "Seleção de modelo"), l(locale, "Translation fallback", "Fallback de tradução")], reportsTo: l(locale, "Voice Agent", "Agente de Voz") },
    ],
    humanReviewPoints: [
      { agent: l(locale, "Handoff Manager", "Gerente de Transferência"), task: l(locale, "VIP customer escalation", "Escalonamento de cliente VIP"), reason: l(locale, "High-value accounts flagged for dedicated support require manager-level agent assignment", "Contas de alto valor sinalizadas para suporte dedicado requerem atribuição a agente de nível gerencial") },
      { agent: l(locale, "Voice Agent", "Agente de Voz"), task: l(locale, "Legal or compliance-related inquiry", "Consulta jurídica ou de compliance"), reason: l(locale, "Regulatory questions must be routed to trained compliance agents per company policy", "Perguntas regulatórias devem ser encaminhadas a agentes de compliance treinados conforme política da empresa") },
      { agent: l(locale, "Sentiment Monitor", "Monitor de Sentimento"), task: l(locale, "Severe distress detection", "Detecção de angústia severa"), reason: l(locale, "When extreme negative sentiment or distress keywords are detected, immediate human intervention is required", "Quando sentimento extremamente negativo ou palavras-chave de angústia são detectados, intervenção humana imediata é necessária") },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: channels.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? l(locale, "Full conversation dashboard — live calls, transcripts, analytics, and flow editor", "Dashboard completo de conversas — chamadas ao vivo, transcrições, análises e editor de fluxos") :
        ch.name === "WhatsApp" ? l(locale, "\"Your support case #4821 has been resolved. Reply SURVEY to rate your experience.\"", "\"Seu chamado de suporte #4821 foi resolvido. Responda PESQUISA para avaliar sua experiência.\"") :
        ch.name === "Telegram" ? l(locale, "Monitor live call volume, escalation rate, and agent availability", "Monitore volume de chamadas ao vivo, taxa de escalonamento e disponibilidade de agentes") :
        ch.name === "Discord" ? l(locale, "Support team coordination — shared call reviews and coaching sessions", "Coordenação da equipe de suporte — revisões de chamadas e sessões de coaching") :
        ch.name === "Slack" ? l(locale, "Use /calls, /sentiment, or /escalations to pull live support metrics", "Use /calls, /sentiment ou /escalations para consultar métricas de suporte ao vivo") :
        ch.name === "Email" ? l(locale, "Daily conversation digest, quality scores, and escalation summaries", "Resumo diário de conversas, pontuações de qualidade e sumários de escalonamento") :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("assistpro", "https://assistpro.vercel.app"),
    projectUrl: "https://assistpro.vercel.app",
    stats: [
      { label: l(locale, "Daily Conversations", "Conversas Diárias"), value: "1,247" },
      { label: l(locale, "Autonomous Resolution", "Resolução Autônoma"), value: "78%" },
      { label: l(locale, "Avg. Handle Time", "Tempo Médio de Atendimento"), value: l(locale, "3.2 min", "3,2 min") },
      { label: l(locale, "Cost per Interaction", "Custo por Interação"), value: "$0.42" },
    ],
  },
  };
}
