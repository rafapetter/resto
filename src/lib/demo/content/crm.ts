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
      { id: "saas", name: "SaaS", emoji: "☁️" },
      { id: "fintech", name: "Fintech", emoji: "💳" },
      { id: "consulting", name: l(locale, "Consulting", "Consultoria"), emoji: "📊" },
      { id: "manufacturing", name: l(locale, "Manufacturing", "Manufatura"), emoji: "🏭" },
      { id: "agency", name: l(locale, "Agency / Services", "Agência / Serviços"), emoji: "🎯" },
      { id: "marketplace", name: "Marketplace", emoji: "🛒" },
    ],
    verticals: [
      { id: "sales-pipeline", name: l(locale, "Sales Pipeline Management", "Gestão de Pipeline de Vendas") },
      { id: "account-management", name: l(locale, "Account Management", "Gestão de Contas") },
      { id: "lead-generation", name: l(locale, "Lead Generation & Scoring", "Geração e Pontuação de Leads") },
      { id: "customer-success", name: l(locale, "Customer Success", "Sucesso do Cliente") },
    ],
    features: [
      { id: "lead-scoring", name: l(locale, "AI Lead Scoring", "Pontuação de Leads com IA") },
      { id: "pipeline-automation", name: l(locale, "Pipeline Automation", "Automação de Pipeline") },
      { id: "email-sequences", name: l(locale, "Email Sequences", "Sequências de E-mail") },
      { id: "deal-forecasting", name: l(locale, "Deal Forecasting", "Previsão de Negócios") },
      { id: "territory-mapping", name: l(locale, "Territory Mapping", "Mapeamento de Territórios") },
      { id: "revenue-intelligence", name: l(locale, "Revenue Intelligence", "Inteligência de Receita") },
    ],
    autoSelections: {
      industry: "saas",
      vertical: "sales-pipeline",
      features: ["lead-scoring", "pipeline-automation", "email-sequences", "deal-forecasting"],
      autonomy: {
        "lead-scoring": "full",
        "pipeline-automation": "full",
        "email-sequences": "supervised",
        "deal-forecasting": "full",
        "territory-mapping": "full",
        "revenue-intelligence": "full",
      },
    },
    projectName: "PipelineIQ",
    projectDescription: l(locale,
      "AI-powered CRM with predictive lead scoring, automated outreach sequences, and real-time deal forecasting for high-velocity sales teams.",
      "CRM com IA, pontuação preditiva de leads, sequências de prospecção automatizadas e previsão de negócios em tempo real para equipes de vendas de alta velocidade."
    ),
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "PipelineIQ",
    projectBadge: "CRM",
    projectDescription: l(locale,
      "Close more deals faster — intelligent lead routing, automated follow-ups, and revenue forecasting that keeps your pipeline healthy and predictable.",
      "Feche mais negócios mais rápido — roteamento inteligente de leads, follow-ups automatizados e previsão de receita que mantém seu pipeline saudável e previsível."
    ),
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: l(locale,
          "Good morning. Pipeline snapshot: $2.4M in active deals across 47 opportunities. 6 deals worth $680K are at risk of slipping past quarter-end — I've flagged them in your priority queue. Your top deal, Acme Corp ($320K), hasn't had contact in 8 days.",
          "Bom dia. Visão do pipeline: $2,4M em negócios ativos em 47 oportunidades. 6 negócios no valor de $680K correm risco de escapar do fim do trimestre — sinalizei na sua fila de prioridades. Seu principal negócio, Acme Corp ($320K), está sem contato há 8 dias."
        ),
      },
      {
        role: "user",
        content: l(locale,
          "What's happening with Acme Corp? Pull up the deal history.",
          "O que está acontecendo com a Acme Corp? Puxe o histórico do negócio."
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "Acme Corp — $320K ARR, Enterprise tier. Currently in Negotiation stage (day 12 of avg 15-day stage duration). Here's the timeline:\n\n• **Feb 5** — Demo completed, strong engagement from VP of Eng\n• **Feb 8** — Proposal sent, 3-year term with 15% volume discount\n• **Feb 12** — Brief email from Sarah Chen (champion) saying \"circulating internally\"\n• **No contact since Feb 12**\n\nSentiment analysis on recent emails suggests positive intent but possible internal budget review. Their fiscal year ends March 31, which aligns with urgency. I'd recommend a soft touch — maybe share a relevant case study from a similar company.",
          "Acme Corp — $320K ARR, tier Enterprise. Atualmente na fase de Negociação (dia 12 de uma duração média de 15 dias). Aqui está a linha do tempo:\n\n• **5 Fev** — Demo concluída, forte engajamento do VP de Engenharia\n• **8 Fev** — Proposta enviada, contrato de 3 anos com 15% de desconto por volume\n• **12 Fev** — E-mail breve da Sarah Chen (champion) dizendo \"circulando internamente\"\n• **Sem contato desde 12 Fev**\n\nA análise de sentimento dos e-mails recentes sugere intenção positiva, mas possível revisão orçamentária interna. O ano fiscal deles termina em 31 de março, o que se alinha com a urgência. Recomendo um contato suave — talvez compartilhar um case study relevante de uma empresa similar."
        ),
      },
      {
        role: "user",
        content: l(locale,
          "Draft a follow-up email for Sarah Chen. Keep it warm, share the Dataflow case study.",
          "Redija um e-mail de follow-up para a Sarah Chen. Mantenha o tom amigável, compartilhe o case study da Dataflow."
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "Here's a draft:\n\n**Subject:** Quick thought on your rollout plan\n\nHi Sarah,\n\nHope the internal review is going well. I wanted to share how Dataflow (similar team size, engineering-led org) achieved a 40% reduction in onboarding time after deploying — thought it might help frame the conversation with your team.\n\n[Case Study Link]\n\nHappy to jump on a quick call if any questions come up during the review. No rush at all.\n\nBest,\n[Your name]\n\nShall I send this from your connected Gmail, or would you like to tweak it first?",
          "Aqui está o rascunho:\n\n**Assunto:** Uma ideia sobre seu plano de implantação\n\nOi Sarah,\n\nEspero que a revisão interna esteja indo bem. Queria compartilhar como a Dataflow (tamanho de equipe similar, organização liderada por engenharia) alcançou uma redução de 40% no tempo de onboarding após a implantação — achei que poderia ajudar a embasar a conversa com sua equipe.\n\n[Link do Case Study]\n\nFico à disposição para uma ligação rápida se surgir alguma dúvida durante a revisão. Sem pressa alguma.\n\nAbraços,\n[Seu nome]\n\nDevo enviar pelo seu Gmail conectado, ou prefere ajustar antes?"
        ),
        action: {
          type: "approval",
          title: l(locale, "Send Follow-Up Email to Sarah Chen", "Enviar E-mail de Follow-Up para Sarah Chen"),
          description: l(locale,
            "Send the drafted follow-up email to Sarah Chen (sarah.chen@acmecorp.io) via connected Gmail with the Dataflow case study attachment. Deal: Acme Corp, $320K ARR.",
            "Enviar o e-mail de follow-up redigido para Sarah Chen (sarah.chen@acmecorp.io) via Gmail conectado com o anexo do case study da Dataflow. Negócio: Acme Corp, $320K ARR."
          ),
        },
      },
      {
        role: "user",
        content: l(locale,
          "Send it. What else needs my attention today?",
          "Envie. O que mais precisa da minha atenção hoje?"
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "Email sent and logged to the Acme Corp deal timeline. Here's your priority list for today:\n\n1. **NovaTech ($185K)** — Contract signature pending. DocuSign was sent Monday, no action yet. Recommend a quick check-in call.\n2. **3 new MQLs** scored above 85 — all from the webinar on Tuesday. Two are mid-market SaaS companies in your territory.\n3. **Quarterly forecast review** at 3 PM — current projection is $1.8M against $2.1M target. I've prepared a scenario analysis showing path to close the gap.\n4. **Renewal alert** — CloudBase Inc. ($95K) renewal is in 30 days. Usage data shows 72% adoption — slightly below healthy threshold. May need a CSM touchpoint.",
          "E-mail enviado e registrado na linha do tempo do negócio Acme Corp. Aqui está sua lista de prioridades para hoje:\n\n1. **NovaTech ($185K)** — Assinatura de contrato pendente. DocuSign foi enviado na segunda, sem ação ainda. Recomendo uma ligação rápida de acompanhamento.\n2. **3 novos MQLs** com pontuação acima de 85 — todos do webinar de terça-feira. Dois são empresas SaaS mid-market no seu território.\n3. **Revisão de previsão trimestral** às 15h — projeção atual é $1,8M contra meta de $2,1M. Preparei uma análise de cenários mostrando o caminho para fechar a lacuna.\n4. **Alerta de renovação** — CloudBase Inc. ($95K) renovação em 30 dias. Dados de uso mostram 72% de adoção — ligeiramente abaixo do limiar saudável. Pode precisar de um contato do CSM."
        ),
      },
      {
        role: "user",
        content: l(locale,
          "Route the MQLs to Jordan and Alex based on territory. I'll handle NovaTech myself.",
          "Distribua os MQLs para Jordan e Alex com base no território. Eu cuido da NovaTech pessoalmente."
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "Done. MQL routing:\n• **Prism Analytics** (San Francisco) → Jordan — matches West Coast territory\n• **StackBridge** (Austin) → Alex — matches Central territory\n• **Cortex AI** (Boston) → Jordan — matches East Coast territory (Alex is at capacity)\n\nAll three have been assigned with full lead intelligence packets. Jordan and Alex will get Slack notifications with the lead details. I've also added NovaTech to your call block this morning and pulled up the DocuSign status for quick reference.",
          "Feito. Distribuição de MQLs:\n• **Prism Analytics** (San Francisco) → Jordan — corresponde ao território Costa Oeste\n• **StackBridge** (Austin) → Alex — corresponde ao território Central\n• **Cortex AI** (Boston) → Jordan — corresponde ao território Costa Leste (Alex está no limite de capacidade)\n\nTodos os três foram atribuídos com pacotes completos de inteligência de leads. Jordan e Alex receberão notificações no Slack com os detalhes dos leads. Também adicionei a NovaTech ao seu bloco de ligações desta manhã e puxei o status do DocuSign para referência rápida."
        ),
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: l(locale, "Good morning. Here's your sales briefing for Thursday, February 20th.", "Bom dia. Aqui está seu briefing de vendas para quinta-feira, 20 de fevereiro."), durationMs: 3000 },
      { speaker: "agent", text: l(locale, "Your pipeline stands at $2.4 million across 47 active opportunities. Six deals worth $680K are at risk of slipping past quarter-end. The biggest is Acme Corp at $320K — they've gone silent for 8 days. I recommend a warm follow-up with a case study.", "Seu pipeline está em $2,4 milhões em 47 oportunidades ativas. Seis negócios no valor de $680K correm risco de escapar do fim do trimestre. O maior é a Acme Corp em $320K — estão em silêncio há 8 dias. Recomendo um follow-up amigável com um case study."), durationMs: 9800 },
      { speaker: "agent", text: l(locale, "Three new marketing-qualified leads scored above 85 from Tuesday's webinar. Two are mid-market SaaS companies in active buying cycles. They'll need routing to your reps today to maintain response-time SLA.", "Três novos leads qualificados de marketing pontuaram acima de 85 do webinar de terça. Dois são empresas SaaS mid-market em ciclos ativos de compra. Precisarão ser distribuídos aos seus representantes hoje para manter o SLA de tempo de resposta."), durationMs: 8200 },
      { speaker: "agent", text: l(locale, "Looking ahead: quarterly forecast review is at 3 PM. You're tracking at $1.8M against a $2.1M target. I've modeled three scenarios showing how the gap can be closed with the current pipeline. Also, CloudBase renewal is in 30 days with below-average adoption — flagging for customer success intervention.", "Olhando adiante: a revisão de previsão trimestral é às 15h. Você está em $1,8M contra uma meta de $2,1M. Modelei três cenários mostrando como a lacuna pode ser fechada com o pipeline atual. Além disso, a renovação da CloudBase é em 30 dias com adoção abaixo da média — sinalizando para intervenção do time de sucesso do cliente."), durationMs: 11500 },
    ],
    summary: l(locale,
      "Sales briefing covered $2.4M pipeline status, 6 at-risk deals, 3 high-scoring MQLs needing routing, quarterly forecast gap analysis, and an upcoming renewal risk.",
      "Briefing de vendas cobriu status do pipeline de $2,4M, 6 negócios em risco, 3 MQLs com pontuação alta precisando de distribuição, análise de lacuna na previsão trimestral e um risco de renovação próximo."
    ),
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "Salesforce", icon: "cloud", category: "CRM", description: l(locale, "Bi-directional sync for contacts, deals, and activity tracking", "Sincronização bidirecional de contatos, negócios e rastreamento de atividades") },
      { name: "LinkedIn Sales Nav", icon: "linkedin", category: l(locale, "Prospecting", "Prospecção"), description: l(locale, "Lead intelligence, InMail automation, and relationship mapping", "Inteligência de leads, automação de InMail e mapeamento de relacionamentos") },
      { name: "Gong", icon: "mic", category: l(locale, "Revenue Intel", "Intel de Receita"), description: l(locale, "Call recording, conversation analytics, and deal risk scoring", "Gravação de chamadas, analytics de conversas e pontuação de risco de negócios") },
      { name: "DocuSign", icon: "pen-tool", category: l(locale, "Contracts", "Contratos"), description: l(locale, "Electronic signature workflows and contract lifecycle management", "Fluxos de assinatura eletrônica e gestão do ciclo de vida de contratos") },
      { name: "Clearbit", icon: "database", category: l(locale, "Enrichment", "Enriquecimento"), description: l(locale, "Company and contact data enrichment for lead scoring", "Enriquecimento de dados de empresas e contatos para pontuação de leads") },
      { name: "Outreach", icon: "send", category: l(locale, "Engagement", "Engajamento"), description: l(locale, "Multi-channel sales sequences and engagement tracking", "Sequências de vendas multicanal e rastreamento de engajamento") },
      CI.hubspot,
      CI.googleEmail,
      CI.calendar,
      CI.slack,
      CI.stripe,
      CI.analytics,
      CI.github,
      CI.vercel,
    ],
  },

  // ─── Build ─────────────────────────────────────────────────────────
  build: {
    checklist: [
      { title: l(locale, "Design deal pipeline schema with custom stage configuration", "Projetar schema do pipeline de negócios com configuração de estágios personalizados"), stage: "plan", status: "complete" },
      { title: l(locale, "Define lead scoring model with behavioral and firmographic signals", "Definir modelo de pontuação de leads com sinais comportamentais e firmográficos"), stage: "plan", status: "complete" },
      { title: l(locale, "Build pipeline kanban board with drag-and-drop stage management", "Construir quadro kanban do pipeline com gestão de estágios por arrastar e soltar"), stage: "build", status: "complete" },
      { title: l(locale, "Implement AI lead scoring engine with Clearbit enrichment", "Implementar motor de pontuação de leads com IA e enriquecimento Clearbit"), stage: "build", status: "complete" },
      { title: l(locale, "Create email sequence builder with A/B testing support", "Criar construtor de sequências de e-mail com suporte a testes A/B"), stage: "build", status: "active" },
      { title: l(locale, "Build revenue forecasting dashboard with scenario modeling", "Construir dashboard de previsão de receita com modelagem de cenários"), stage: "build", status: "pending" },
      { title: l(locale, "Integrate Salesforce bi-directional sync", "Integrar sincronização bidirecional com Salesforce"), stage: "launch", status: "pending" },
      { title: l(locale, "Deploy with SSO configuration and sales team onboarding", "Deploy com configuração de SSO e onboarding da equipe de vendas"), stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "dashboard", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "pipeline", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "deals", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[dealId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
              { name: "contacts", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "leads", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "forecast", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "sequences", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "deals", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "contacts", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "leads", type: "folder", children: [
                { name: "route.ts", type: "file" },
                { name: "score", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
              { name: "sequences", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "webhooks", type: "folder", children: [
                { name: "salesforce", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "email-events", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "lead-scorer.ts", type: "file" },
          { name: "forecast-engine.ts", type: "file" },
          { name: "salesforce-sync.ts", type: "file" },
          { name: "sequence-runner.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: l(locale, "Sales Playbooks", "Playbooks de Vendas"), icon: "target", count: 18 },
      { name: l(locale, "Product Knowledge", "Conhecimento de Produto"), icon: "package", count: 35 },
      { name: l(locale, "Competitive Intel", "Inteligência Competitiva"), icon: "swords", count: 22 },
      { name: l(locale, "Case Studies", "Estudos de Caso"), icon: "trophy", count: 28 },
      { name: l(locale, "Pricing & Packaging", "Precificação & Pacotes"), icon: "credit-card", count: 12 },
    ],
    documents: [
      { title: l(locale, "Enterprise Sales Playbook", "Playbook de Vendas Enterprise"), category: l(locale, "Sales Playbooks", "Playbooks de Vendas"), tier: "index", lines: 110, crossRefs: [l(locale, "Objection Handling Guide", "Guia de Tratamento de Objeções"), l(locale, "ROI Calculator Framework", "Framework de Calculadora de ROI")] },
      { title: l(locale, "Objection Handling Guide", "Guia de Tratamento de Objeções"), category: l(locale, "Sales Playbooks", "Playbooks de Vendas"), tier: "detail", lines: 340 },
      { title: l(locale, "ROI Calculator Framework", "Framework de Calculadora de ROI"), category: l(locale, "Sales Playbooks", "Playbooks de Vendas"), tier: "detail", lines: 185 },
      { title: l(locale, "Competitive Landscape Q1 2026", "Cenário Competitivo Q1 2026"), category: l(locale, "Competitive Intel", "Inteligência Competitiva"), tier: "summary", lines: 220, crossRefs: [l(locale, "Feature Comparison Matrix", "Matriz de Comparação de Funcionalidades")] },
      { title: l(locale, "Feature Comparison Matrix", "Matriz de Comparação de Funcionalidades"), category: l(locale, "Competitive Intel", "Inteligência Competitiva"), tier: "detail", lines: 450 },
      { title: l(locale, "Dataflow Case Study", "Estudo de Caso Dataflow"), category: l(locale, "Case Studies", "Estudos de Caso"), tier: "summary", lines: 95, crossRefs: [l(locale, "Enterprise Sales Playbook", "Playbook de Vendas Enterprise")] },
      { title: l(locale, "Mid-Market Pricing Guide", "Guia de Precificação Mid-Market"), category: l(locale, "Pricing & Packaging", "Precificação & Pacotes"), tier: "detail", lines: 160 },
      { title: l(locale, "Product Feature Deep-Dive: AI Lead Scoring", "Aprofundamento de Funcionalidade: Pontuação de Leads com IA"), category: l(locale, "Product Knowledge", "Conhecimento de Produto"), tier: "detail", lines: 280, crossRefs: [l(locale, "ROI Calculator Framework", "Framework de Calculadora de ROI")] },
      { title: l(locale, "Discovery Call Framework", "Framework de Ligação de Descoberta"), category: l(locale, "Sales Playbooks", "Playbooks de Vendas"), tier: "summary", lines: 125 },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: l(locale, "Monthly Closed Revenue ($K)", "Receita Mensal Fechada ($K)"),
        type: "bar",
        data: [
          { name: l(locale, "Sep", "Set"), value: 380 },
          { name: l(locale, "Oct", "Out"), value: 420 },
          { name: "Nov", value: 510 },
          { name: l(locale, "Dec", "Dez"), value: 680 },
          { name: l(locale, "Jan", "Jan"), value: 445 },
          { name: l(locale, "Feb", "Fev"), value: 390 },
        ],
      },
      {
        label: l(locale, "Lead-to-Close Conversion Rate (%)", "Taxa de Conversão Lead-para-Fechamento (%)"),
        type: "line",
        data: [
          { name: l(locale, "Sep", "Set"), value: 12 },
          { name: l(locale, "Oct", "Out"), value: 14 },
          { name: "Nov", value: 15 },
          { name: l(locale, "Dec", "Dez"), value: 18 },
          { name: l(locale, "Jan", "Jan"), value: 16 },
          { name: l(locale, "Feb", "Fev"), value: 17 },
        ],
      },
    ],
  },
  orchestration: {
    agents: [
      { name: l(locale, "Revenue Strategist", "Estrategista de Receita"), role: l(locale, "Orchestrates sales operations and pipeline health", "Orquestra operações de vendas e saúde do pipeline"), avatar: "💼", color: "blue", tasks: [l(locale, "Pipeline health monitoring", "Monitoramento da saúde do pipeline"), l(locale, "Quota tracking", "Rastreamento de cotas"), l(locale, "Territory balancing", "Balanceamento de territórios")] },
      { name: l(locale, "Lead Intelligence", "Inteligência de Leads"), role: l(locale, "Scores, enriches, and routes inbound leads", "Pontua, enriquece e roteia leads inbound"), avatar: "🎯", color: "emerald", tasks: [l(locale, "Lead scoring", "Pontuação de leads"), l(locale, "Data enrichment", "Enriquecimento de dados"), l(locale, "Smart routing", "Roteamento inteligente")], reportsTo: l(locale, "Revenue Strategist", "Estrategista de Receita") },
      { name: l(locale, "Outreach Agent", "Agente de Prospecção"), role: l(locale, "Manages email sequences and multi-touch campaigns", "Gerencia sequências de e-mail e campanhas multi-toque"), avatar: "📧", color: "violet", tasks: [l(locale, "Sequence execution", "Execução de sequências"), l(locale, "A/B testing", "Testes A/B"), l(locale, "Reply detection", "Detecção de respostas")], reportsTo: l(locale, "Revenue Strategist", "Estrategista de Receita") },
      { name: l(locale, "Deal Analyst", "Analista de Negócios"), role: l(locale, "Monitors deal health and predicts close probability", "Monitora a saúde dos negócios e prevê probabilidade de fechamento"), avatar: "📊", color: "amber", tasks: [l(locale, "Deal scoring", "Pontuação de negócios"), l(locale, "Risk flagging", "Sinalização de riscos"), l(locale, "Stage progression analysis", "Análise de progressão de estágio")], reportsTo: l(locale, "Revenue Strategist", "Estrategista de Receita") },
      { name: l(locale, "Forecast Engine", "Motor de Previsão"), role: l(locale, "Generates revenue forecasts with scenario modeling", "Gera previsões de receita com modelagem de cenários"), avatar: "📈", color: "rose", tasks: [l(locale, "Weighted pipeline analysis", "Análise ponderada do pipeline"), l(locale, "Scenario modeling", "Modelagem de cenários"), l(locale, "Quota attainment projection", "Projeção de atingimento de cota")], reportsTo: l(locale, "Revenue Strategist", "Estrategista de Receita") },
      { name: l(locale, "Competitive Intel", "Intel Competitiva"), role: l(locale, "Tracks competitor movements and prepares battle cards", "Rastreia movimentos de concorrentes e prepara battle cards"), avatar: "⚔️", color: "cyan", tasks: [l(locale, "Competitor monitoring", "Monitoramento de concorrentes"), l(locale, "Battle card updates", "Atualizações de battle cards"), l(locale, "Win/loss analysis", "Análise de ganhos/perdas")], reportsTo: l(locale, "Deal Analyst", "Analista de Negócios") },
      { name: l(locale, "Contract Agent", "Agente de Contratos"), role: l(locale, "Manages proposals, contracts, and signature workflows", "Gerencia propostas, contratos e fluxos de assinatura"), avatar: "📝", color: "green", tasks: [l(locale, "Proposal generation", "Geração de propostas"), l(locale, "DocuSign tracking", "Rastreamento DocuSign"), l(locale, "Renewal management", "Gestão de renovações")], reportsTo: l(locale, "Deal Analyst", "Analista de Negócios") },
      { name: l(locale, "CRM Sync Agent", "Agente de Sincronização CRM"), role: l(locale, "Maintains data integrity across connected systems", "Mantém integridade de dados entre sistemas conectados"), avatar: "🔄", color: "slate", tasks: [l(locale, "Salesforce sync", "Sincronização Salesforce"), l(locale, "Duplicate detection", "Detecção de duplicatas"), l(locale, "Activity logging", "Registro de atividades")], reportsTo: l(locale, "Revenue Strategist", "Estrategista de Receita") },
    ],
    humanReviewPoints: [
      { agent: l(locale, "Outreach Agent", "Agente de Prospecção"), task: l(locale, "Enterprise cold outreach approval", "Aprovação de prospecção fria enterprise"), reason: l(locale, "Outbound emails to C-suite contacts at strategic accounts require sales leader review before sending", "E-mails outbound para contatos C-level em contas estratégicas requerem revisão do líder de vendas antes do envio") },
      { agent: l(locale, "Contract Agent", "Agente de Contratos"), task: l(locale, "Non-standard discount approval", "Aprovação de desconto fora do padrão"), reason: l(locale, "Discounts exceeding 20% or custom payment terms require VP of Sales sign-off", "Descontos acima de 20% ou termos de pagamento personalizados requerem aprovação do VP de Vendas") },
      { agent: l(locale, "Deal Analyst", "Analista de Negócios"), task: l(locale, "Deal stage regression", "Regressão de estágio de negócio"), reason: l(locale, "Moving a deal backward in the pipeline requires rep justification and manager acknowledgment", "Mover um negócio para trás no pipeline requer justificativa do representante e reconhecimento do gerente") },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: channels.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? l(locale, "Full CRM dashboard — pipeline, deals, forecasts, and lead management", "Painel CRM completo — pipeline, negócios, previsões e gestão de leads") :
        ch.name === "WhatsApp" ? l(locale, "\"Acme Corp just opened your proposal. Sarah Chen viewed it for 4 minutes.\"", "\"A Acme Corp acabou de abrir sua proposta. Sarah Chen visualizou por 4 minutos.\"") :
        ch.name === "Telegram" ? l(locale, "Quick deal updates and lead alerts on the go", "Atualizações rápidas de negócios e alertas de leads em movimento") :
        ch.name === "Discord" ? l(locale, "Sales team war room — deal strategy and competitive intel sharing", "Sala de guerra da equipe de vendas — estratégia de negócios e compartilhamento de intel competitiva") :
        ch.name === "Slack" ? l(locale, "Use /pipeline, /deals, or /forecast for instant CRM data in any channel", "Use /pipeline, /deals ou /forecast para dados CRM instantâneos em qualquer canal") :
        ch.name === "Email" ? l(locale, "Daily pipeline digest, deal alerts, and weekly forecast summaries", "Resumo diário do pipeline, alertas de negócios e resumos semanais de previsão") :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("pipelineiq", "https://pipelineiq.vercel.app"),
    projectUrl: "https://pipelineiq.vercel.app",
    stats: [
      { label: l(locale, "Pipeline Value", "Valor do Pipeline"), value: "$2.4M" },
      { label: l(locale, "Lead Response Time", "Tempo de Resposta a Leads"), value: "<5 min" },
      { label: l(locale, "Conversion Lift", "Aumento de Conversão"), value: "+34%" },
      { label: l(locale, "Forecast Accuracy", "Precisão da Previsão"), value: "91%" },
    ],
  },
  };
}
