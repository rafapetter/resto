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
      { id: "property-casualty", name: l(locale, "Property & Casualty", "Patrimonial & Responsabilidade"), emoji: "🏠" },
      { id: "life-insurance", name: l(locale, "Life Insurance", "Seguro de Vida"), emoji: "🛡️" },
      { id: "health-insurance", name: l(locale, "Health Insurance", "Seguro Saúde"), emoji: "🏥" },
      { id: "auto-insurance", name: l(locale, "Auto Insurance", "Seguro Auto"), emoji: "🚗" },
      { id: "commercial-insurance", name: l(locale, "Commercial Insurance", "Seguro Empresarial"), emoji: "🏢" },
      { id: "reinsurance", name: l(locale, "Reinsurance", "Resseguro"), emoji: "🔄" },
    ],
    verticals: [
      { id: "policy-admin", name: l(locale, "Policy Administration", "Administração de Apólices") },
      { id: "claims-processing", name: l(locale, "Claims Processing", "Processamento de Sinistros") },
      { id: "underwriting", name: l(locale, "Underwriting", "Subscrição") },
      { id: "risk-assessment", name: l(locale, "Risk Assessment", "Avaliação de Riscos") },
    ],
    features: [
      { id: "policy-management", name: l(locale, "Policy Management", "Gestão de Apólices") },
      { id: "claims-automation", name: l(locale, "Claims Automation", "Automação de Sinistros") },
      { id: "underwriting-engine", name: l(locale, "Underwriting Engine", "Motor de Subscrição") },
      { id: "risk-scoring", name: l(locale, "Risk Scoring", "Pontuação de Risco") },
      { id: "agent-portal", name: l(locale, "Agent Portal", "Portal do Corretor") },
      { id: "compliance-reporting", name: l(locale, "Compliance Reporting", "Relatórios de Conformidade") },
    ],
    autoSelections: {
      industry: "property-casualty",
      vertical: "claims-processing",
      features: ["policy-management", "claims-automation", "underwriting-engine", "risk-scoring"],
      autonomy: {
        "policy-management": "full",
        "claims-automation": "full",
        "underwriting-engine": "supervised",
        "risk-scoring": "full",
        "agent-portal": "full",
        "compliance-reporting": "full",
      },
    },
    projectName: "InsureNet",
    projectDescription: l(locale,
      "AI-powered insurance operations platform with automated claims processing, intelligent underwriting, real-time risk scoring, and regulatory compliance management for modern insurers.",
      "Plataforma de operações de seguros com IA, processamento automatizado de sinistros, subscrição inteligente, pontuação de risco em tempo real e gestão de conformidade regulatória para seguradoras modernas."
    ),
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "InsureNet",
    projectBadge: l(locale, "Insurance", "Seguros"),
    projectDescription: l(locale,
      "Streamline insurance operations end-to-end — from policy issuance and underwriting to claims adjudication and fraud detection, with built-in regulatory compliance and agent performance tracking.",
      "Otimize operações de seguros de ponta a ponta — da emissão de apólices e subscrição à regulação de sinistros e detecção de fraude, com conformidade regulatória integrada e rastreamento de desempenho de corretores."
    ),
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: l(locale,
          "Good morning. Operations snapshot: 847 claims in the active queue — 312 are pending initial review, 189 require adjuster assignment, and 46 are flagged for potential fraud. Underwriting queue has 73 applications, with 12 high-value commercial policies awaiting senior review. Policy renewals: 1,240 policies are due within the next 30 days, and the NAIC quarterly filing deadline is in 18 days.",
          "Bom dia. Resumo das operações: 847 sinistros na fila ativa — 312 aguardando análise inicial, 189 precisam de atribuição de regulador, e 46 estão sinalizados para possível fraude. A fila de subscrição tem 73 solicitações, com 12 apólices comerciais de alto valor aguardando análise sênior. Renovações de apólices: 1.240 apólices vencem nos próximos 30 dias, e o prazo do relatório trimestral da SUSEP é em 18 dias."
        ),
      },
      {
        role: "user",
        content: l(locale,
          "Let's start with the fraud flags. What's the AI picking up on those 46 claims?",
          "Vamos começar pelos alertas de fraude. O que a IA está detectando nesses 46 sinistros?"
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "The fraud detection engine flagged 46 claims across three risk tiers:\n\n**Critical (8 claims, $1.2M total exposure)**:\n• 3 staged auto collision claims — same body shop across all three, filed within 72 hours of each other\n• 2 water damage claims in the same apartment complex — both filed the same day with identical contractor estimates\n• 3 medical claims with billing anomalies — CPT code patterns inconsistent with stated injuries\n\n**High (16 claims, $890K exposure)**:\n• Policy inception-to-claim timing under 45 days on 9 claims\n• 4 claims with claimant address mismatches vs. policy records\n• 3 property claims where damage photos have metadata inconsistencies\n\n**Moderate (22 claims, $340K exposure)**:\n• Mostly pattern-based triggers — repeat claimants, above-average amounts for claim type\n\nThe 8 critical claims have a 94% confidence score. I recommend routing them to your Special Investigations Unit immediately.",
          "O motor de detecção de fraude sinalizou 46 sinistros em três níveis de risco:\n\n**Crítico (8 sinistros, R$ 6M de exposição total)**:\n• 3 sinistros de colisão auto encenados — mesma oficina nos três, registrados em 72 horas\n• 2 sinistros de danos por água no mesmo condomínio — ambos registrados no mesmo dia com orçamentos idênticos\n• 3 sinistros médicos com anomalias de faturamento — padrões de códigos inconsistentes com as lesões declaradas\n\n**Alto (16 sinistros, R$ 4,5M de exposição)**:\n• Tempo entre início da apólice e sinistro inferior a 45 dias em 9 sinistros\n• 4 sinistros com endereço do reclamante divergente dos registros da apólice\n• 3 sinistros patrimoniais com fotos de danos com inconsistências nos metadados\n\n**Moderado (22 sinistros, R$ 1,7M de exposição)**:\n• Principalmente gatilhos baseados em padrões — reclamantes recorrentes, valores acima da média para o tipo de sinistro\n\nOs 8 sinistros críticos têm pontuação de confiança de 94%. Recomendo encaminhá-los à Unidade de Investigação Especial imediatamente."
        ),
        action: {
          type: "approval",
          title: l(locale, "Route Critical Fraud Cases to SIU", "Encaminhar Sinistros Críticos de Fraude para UIE"),
          description: l(locale,
            "Route 8 critical fraud-flagged claims ($1.2M total exposure) to the Special Investigations Unit for immediate review. Includes 3 staged collision claims, 2 suspicious water damage claims, and 3 medical billing anomaly claims. Auto-generates SIU referral packets with evidence summaries.",
            "Encaminhar 8 sinistros sinalizados como fraude crítica (R$ 6M de exposição total) para a Unidade de Investigação Especial para análise imediata. Inclui 3 sinistros de colisão encenados, 2 sinistros suspeitos de danos por água e 3 sinistros médicos com anomalias de faturamento. Gera automaticamente pacotes de referência UIE com resumos de evidências."
          ),
        },
      },
      {
        role: "user",
        content: l(locale,
          "Approved. Now walk me through the underwriting queue — especially those 12 commercial policies.",
          "Aprovado. Agora me explique a fila de subscrição — especialmente essas 12 apólices comerciais."
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "SIU referrals submitted. Now for the underwriting queue:\n\n**12 Commercial Policies Pending Senior Review:**\n\n• **Meridian Construction Group** — $5M general liability + $2M umbrella. Risk score: 72/100. Clean loss history but expanding into seismic zone operations. Needs reinsurance treaty review.\n• **Pacific Coast Logistics** — $3.5M fleet policy, 84 vehicles. Risk score: 65/100. Three prior claims in 24 months, all under $50K. Telematics data shows improving driver behavior.\n• **Harborview Hotels** — $8M property + liability package. Risk score: 58/100. Two properties in hurricane-prone zones. Current rates are 18% below market for the risk profile.\n\nThe remaining 9 are mid-market accounts in the $500K-$2M range with risk scores above 75 — those can be auto-approved per your underwriting guidelines.\n\nFor the three I highlighted, I've prepared risk assessment reports with pricing recommendations. Harborview needs a rate adjustment — my actuarial model suggests a 22% increase to achieve target loss ratio.",
          "Referências UIE enviadas. Agora sobre a fila de subscrição:\n\n**12 Apólices Comerciais Aguardando Análise Sênior:**\n\n• **Meridian Construction Group** — R$ 25M responsabilidade civil geral + R$ 10M guarda-chuva. Pontuação de risco: 72/100. Histórico de sinistralidade limpo, mas expandindo para operações em zona sísmica. Precisa de revisão do tratado de resseguro.\n• **Pacific Coast Logistics** — Apólice de frota R$ 17,5M, 84 veículos. Pontuação de risco: 65/100. Três sinistros anteriores em 24 meses, todos abaixo de R$ 250K. Dados de telemática mostram melhoria no comportamento dos motoristas.\n• **Harborview Hotels** — Pacote patrimonial + responsabilidade R$ 40M. Pontuação de risco: 58/100. Duas propriedades em zonas propensas a furacões. Taxas atuais estão 18% abaixo do mercado para o perfil de risco.\n\nAs 9 restantes são contas de médio porte na faixa de R$ 2,5M-R$ 10M com pontuações de risco acima de 75 — podem ser aprovadas automaticamente conforme suas diretrizes de subscrição.\n\nPara as três que destaquei, preparei relatórios de avaliação de risco com recomendações de precificação. Harborview precisa de ajuste tarifário — meu modelo atuarial sugere aumento de 22% para atingir a meta de sinistralidade."
        ),
      },
      {
        role: "user",
        content: l(locale,
          "Auto-approve the 9 mid-market policies. Flag Harborview for re-rating and schedule a review call with the broker. What about the renewal pipeline?",
          "Aprove automaticamente as 9 apólices de médio porte. Sinalize Harborview para reavaliação tarifária e agende uma ligação de revisão com o corretor. E quanto ao pipeline de renovações?"
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "Done — 9 mid-market policies approved and bound. Harborview flagged for re-rating, and I've requested a call slot with their broker for Wednesday at 2 PM.\n\nRenewal pipeline for the next 30 days:\n\n• **1,240 total policies due** — estimated premium volume of $18.6M\n• **Auto-renew eligible**: 892 policies (72%) — clean loss history, no material changes, within rate guidelines\n• **Rate adjustment needed**: 214 policies (17%) — actuarial models indicate premium changes ranging from -5% to +30%\n• **At-risk of non-renewal**: 134 policies (11%) — 68 have received competitor quotes, 42 have filed complaints, 24 are in claims-heavy segments\n\nThe at-risk group represents $4.2M in annual premium. I've prepared retention offers for the top 50 by premium value — a combination of loyalty discounts, coverage enhancements, and bundling incentives. Estimated retention lift: 35-40%.",
          "Feito — 9 apólices de médio porte aprovadas e vinculadas. Harborview sinalizada para reavaliação tarifária, e solicitei um horário de ligação com o corretor para quarta às 14h.\n\nPipeline de renovações para os próximos 30 dias:\n\n• **1.240 apólices no total** — volume estimado de prêmios de R$ 93M\n• **Elegíveis para renovação automática**: 892 apólices (72%) — histórico de sinistralidade limpo, sem mudanças materiais, dentro das diretrizes tarifárias\n• **Ajuste tarifário necessário**: 214 apólices (17%) — modelos atuariais indicam mudanças de prêmio variando de -5% a +30%\n• **Em risco de não renovação**: 134 apólices (11%) — 68 receberam cotações de concorrentes, 42 registraram reclamações, 24 estão em segmentos com alta sinistralidade\n\nO grupo em risco representa R$ 21M em prêmio anual. Preparei ofertas de retenção para os 50 maiores por valor de prêmio — uma combinação de descontos de fidelidade, melhorias de cobertura e incentivos de pacote. Estimativa de aumento de retenção: 35-40%."
        ),
      },
      {
        role: "user",
        content: l(locale,
          "Launch the auto-renewals and send retention offers to the top 50 at-risk accounts. Make sure compliance signs off on the rate adjustments before they go out.",
          "Lance as renovações automáticas e envie ofertas de retenção para as 50 contas em risco mais relevantes. Certifique-se de que compliance aprove os ajustes tarifários antes do envio."
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "Processing now:\n\n• **Auto-renewals**: 892 policies queued for renewal processing — certificates and declarations will be generated and sent to policyholders 15 days before expiration per state requirements\n• **Retention offers**: 50 personalized retention packages being routed to assigned agents for delivery — each includes a comparison sheet showing current vs. proposed coverage\n• **Rate adjustments**: 214 policies flagged for compliance review — submitted to the Compliance Officer agent for state-by-state rate filing verification before policyholder notification\n\nTimeline: Auto-renewals begin processing today. Retention offers will reach agents by end of day. Rate adjustments will be cleared through compliance within 48 hours — any that require state DOI approval will be escalated to you.\n\nI'll also generate the NAIC quarterly filing draft this week so you have time to review before the deadline.",
          "Processando agora:\n\n• **Renovações automáticas**: 892 apólices na fila de processamento de renovação — certificados e declarações serão gerados e enviados aos segurados 15 dias antes do vencimento conforme requisitos regulatórios\n• **Ofertas de retenção**: 50 pacotes personalizados de retenção sendo encaminhados aos corretores designados — cada um inclui uma planilha comparativa mostrando cobertura atual vs. proposta\n• **Ajustes tarifários**: 214 apólices sinalizadas para revisão de compliance — enviadas ao Agente de Compliance para verificação de registro tarifário estado por estado antes da notificação ao segurado\n\nCronograma: Renovações automáticas começam a ser processadas hoje. Ofertas de retenção chegarão aos corretores até o final do dia. Ajustes tarifários serão aprovados por compliance em 48 horas — qualquer um que exija aprovação da SUSEP será escalado para você.\n\nTambém gerarei o rascunho do relatório trimestral da SUSEP esta semana para que você tenha tempo de revisar antes do prazo."
        ),
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: l(locale, "Good morning. Here's your InsureNet operations briefing for February 20th.", "Bom dia. Aqui está seu briefing de operações InsureNet para 20 de fevereiro."), durationMs: 3200 },
      { speaker: "agent", text: l(locale, "Claims queue stands at 847 active claims with 46 flagged for potential fraud totaling $2.4 million in exposure. Eight critical fraud cases have a 94% confidence score and should be routed to your Special Investigations Unit today. The remaining claims pipeline is processing within SLA targets.", "A fila de sinistros está em 847 sinistros ativos com 46 sinalizados para possível fraude totalizando R$ 12 milhões em exposição. Oito sinistros críticos de fraude têm pontuação de confiança de 94% e devem ser encaminhados à Unidade de Investigação Especial hoje. O restante do pipeline de sinistros está sendo processado dentro das metas de SLA."), durationMs: 10800 },
      { speaker: "agent", text: l(locale, "Underwriting has 73 pending applications. Twelve high-value commercial policies require senior review, including an $8 million Harborview Hotels package that needs re-rating — current premiums are 18% below market for the risk profile. Nine mid-market policies are eligible for auto-approval per your guidelines.", "A subscrição tem 73 solicitações pendentes. Doze apólices comerciais de alto valor precisam de análise sênior, incluindo um pacote Harborview Hotels de R$ 40 milhões que precisa de reavaliação — prêmios atuais estão 18% abaixo do mercado para o perfil de risco. Nove apólices de médio porte são elegíveis para aprovação automática conforme suas diretrizes."), durationMs: 9600 },
      { speaker: "agent", text: l(locale, "Renewal pipeline shows 1,240 policies due within 30 days representing $18.6 million in premium. 134 policies are at risk of non-renewal with $4.2 million in annual premium at stake. Retention offers are prepared for the top 50. Also, your NAIC quarterly filing deadline is in 18 days — I'll have the draft ready for your review by end of this week.", "O pipeline de renovações mostra 1.240 apólices vencendo em 30 dias representando R$ 93 milhões em prêmios. 134 apólices estão em risco de não renovação com R$ 21 milhões em prêmio anual em jogo. Ofertas de retenção estão preparadas para as 50 maiores. Além disso, o prazo do relatório trimestral da SUSEP é em 18 dias — terei o rascunho pronto para sua revisão até o final desta semana."), durationMs: 11200 },
    ],
    summary: l(locale,
      "Operations briefing covered 847 active claims with 46 fraud flags, 73 underwriting applications including 12 high-value commercial policies, 1,240 upcoming renewals with 134 at-risk accounts, and the NAIC quarterly filing deadline in 18 days.",
      "Briefing de operações cobriu 847 sinistros ativos com 46 alertas de fraude, 73 solicitações de subscrição incluindo 12 apólices comerciais de alto valor, 1.240 renovações próximas com 134 contas em risco, e prazo do relatório trimestral da SUSEP em 18 dias."
    ),
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "Guidewire", icon: "shield", category: l(locale, "Policy Admin", "Admin. de Apólices"), description: l(locale, "Policy administration, billing, and claims management platform", "Plataforma de administração de apólices, faturamento e gestão de sinistros") },
      { name: "Verisk", icon: "bar-chart-2", category: l(locale, "Data Analytics", "Análise de Dados"), description: l(locale, "Insurance data analytics, risk assessment, and actuarial modeling", "Analytics de dados de seguros, avaliação de riscos e modelagem atuarial") },
      { name: "LexisNexis Risk", icon: "search", category: l(locale, "Risk Intelligence", "Inteligência de Risco"), description: l(locale, "Identity verification, claims history, and risk scoring data", "Verificação de identidade, histórico de sinistros e dados de pontuação de risco") },
      { name: "Actuarial Workbench", icon: "calculator", category: l(locale, "Actuarial", "Atuarial"), description: l(locale, "Loss reserving, pricing models, and mortality/morbidity tables", "Reserva de sinistros, modelos de precificação e tábuas de mortalidade/morbidade") },
      { name: "ClaimsPro", icon: "file-check", category: l(locale, "Claims", "Sinistros"), description: l(locale, "Claims adjudication, FNOL intake, and settlement workflows", "Regulação de sinistros, intake FNOL e fluxos de liquidação") },
      { name: "RiskMeter", icon: "activity", category: l(locale, "Underwriting", "Subscrição"), description: l(locale, "Automated underwriting rules engine with real-time risk scoring", "Motor automatizado de regras de subscrição com pontuação de risco em tempo real") },
      CI.stripe,
      CI.googleEmail,
      CI.calendar,
      CI.slack,
      CI.analytics,
      CI.sentry,
      CI.github,
      CI.vercel,
    ],
  },

  // ─── Build ─────────────────────────────────────────────────────────
  build: {
    checklist: [
      { title: l(locale, "Design policy and claims data models with state-specific compliance fields", "Projetar modelos de dados de apólices e sinistros com campos de conformidade por estado"), stage: "plan", status: "complete" },
      { title: l(locale, "Map Guidewire API endpoints and configure webhook event subscriptions", "Mapear endpoints da API Guidewire e configurar assinaturas de eventos webhook"), stage: "plan", status: "complete" },
      { title: l(locale, "Build policy management dashboard with lifecycle tracking and endorsements", "Construir dashboard de gestão de apólices com rastreamento de ciclo de vida e endossos"), stage: "build", status: "complete" },
      { title: l(locale, "Implement claims intake and automated triage with fraud detection scoring", "Implementar intake de sinistros e triagem automatizada com pontuação de detecção de fraude"), stage: "build", status: "complete" },
      { title: l(locale, "Create underwriting rules engine with risk scoring and auto-bind logic", "Criar motor de regras de subscrição com pontuação de risco e lógica de vinculação automática"), stage: "build", status: "active" },
      { title: l(locale, "Build agent portal with commission tracking and book-of-business views", "Construir portal do corretor com rastreamento de comissões e visão da carteira"), stage: "build", status: "pending" },
      { title: l(locale, "Integrate regulatory compliance reporting for NAIC and state DOI filings", "Integrar relatórios de conformidade regulatória para SUSEP e órgãos estaduais"), stage: "launch", status: "pending" },
      { title: l(locale, "Deploy with SOC 2 compliance checks and disaster recovery configuration", "Deploy com verificações de conformidade SOC 2 e configuração de recuperação de desastres"), stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "dashboard", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "policies", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[policyId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
              { name: "claims", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[claimId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
              { name: "underwriting", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "risk", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "agents", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "compliance", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "policies", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "claims", type: "folder", children: [
                { name: "route.ts", type: "file" },
                { name: "fraud-check", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
              { name: "underwriting", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "risk", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "agents", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "webhooks", type: "folder", children: [
                { name: "guidewire", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "claims-intake", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "guidewire-client.ts", type: "file" },
          { name: "underwriting-engine.ts", type: "file" },
          { name: "fraud-detector.ts", type: "file" },
          { name: "risk-scorer.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: l(locale, "Insurance Regulations", "Regulamentações de Seguros"), icon: "scale", count: 42 },
      { name: l(locale, "Underwriting Guidelines", "Diretrizes de Subscrição"), icon: "clipboard-check", count: 28 },
      { name: l(locale, "Claims Procedures", "Procedimentos de Sinistros"), icon: "file-text", count: 36 },
      { name: l(locale, "Actuarial Tables", "Tábuas Atuariais"), icon: "calculator", count: 19 },
      { name: l(locale, "Compliance Requirements", "Requisitos de Conformidade"), icon: "shield-check", count: 24 },
    ],
    documents: [
      { title: l(locale, "NAIC Model Laws & Regulations Reference", "Referência de Leis e Regulamentos SUSEP"), category: l(locale, "Insurance Regulations", "Regulamentações de Seguros"), tier: "index", lines: 120, crossRefs: [l(locale, "State Filing Requirements Guide", "Guia de Requisitos de Registro por Estado"), l(locale, "Compliance Audit Checklist", "Checklist de Auditoria de Conformidade")] },
      { title: l(locale, "State Filing Requirements Guide", "Guia de Requisitos de Registro por Estado"), category: l(locale, "Insurance Regulations", "Regulamentações de Seguros"), tier: "detail", lines: 380 },
      { title: l(locale, "Commercial Lines Underwriting Manual", "Manual de Subscrição de Linhas Comerciais"), category: l(locale, "Underwriting Guidelines", "Diretrizes de Subscrição"), tier: "summary", lines: 290, crossRefs: [l(locale, "Risk Classification Standards", "Padrões de Classificação de Risco"), l(locale, "Actuarial Pricing Models", "Modelos de Precificação Atuarial")] },
      { title: l(locale, "Risk Classification Standards", "Padrões de Classificação de Risco"), category: l(locale, "Underwriting Guidelines", "Diretrizes de Subscrição"), tier: "detail", lines: 240 },
      { title: l(locale, "Claims Adjudication Procedures", "Procedimentos de Regulação de Sinistros"), category: l(locale, "Claims Procedures", "Procedimentos de Sinistros"), tier: "summary", lines: 210, crossRefs: [l(locale, "Fraud Investigation Protocols", "Protocolos de Investigação de Fraude")] },
      { title: l(locale, "Fraud Investigation Protocols", "Protocolos de Investigação de Fraude"), category: l(locale, "Claims Procedures", "Procedimentos de Sinistros"), tier: "detail", lines: 320 },
      { title: l(locale, "Actuarial Pricing Models — P&C Lines", "Modelos de Precificação Atuarial — Linhas P&C"), category: l(locale, "Actuarial Tables", "Tábuas Atuariais"), tier: "detail", lines: 450, crossRefs: [l(locale, "Commercial Lines Underwriting Manual", "Manual de Subscrição de Linhas Comerciais")] },
      { title: l(locale, "Loss Reserve Development Triangles", "Triângulos de Desenvolvimento de Reserva de Sinistros"), category: l(locale, "Actuarial Tables", "Tábuas Atuariais"), tier: "detail", lines: 280 },
      { title: l(locale, "Compliance Audit Checklist", "Checklist de Auditoria de Conformidade"), category: l(locale, "Compliance Requirements", "Requisitos de Conformidade"), tier: "summary", lines: 155, crossRefs: [l(locale, "NAIC Model Laws & Regulations Reference", "Referência de Leis e Regulamentos SUSEP")] },
      { title: l(locale, "Anti-Fraud Program Standards", "Padrões do Programa Antifraude"), category: l(locale, "Compliance Requirements", "Requisitos de Conformidade"), tier: "detail", lines: 195, crossRefs: [l(locale, "Fraud Investigation Protocols", "Protocolos de Investigação de Fraude"), l(locale, "Claims Adjudication Procedures", "Procedimentos de Regulação de Sinistros")] },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: l(locale, "Claims Processed (Weekly)", "Sinistros Processados (Semanal)"),
        type: "bar",
        data: [
          { name: "W1", value: 312 },
          { name: "W2", value: 348 },
          { name: "W3", value: 295 },
          { name: "W4", value: 387 },
          { name: "W5", value: 410 },
          { name: "W6", value: 365 },
          { name: "W7", value: 422 },
        ],
      },
      {
        label: l(locale, "Loss Ratio (%)", "Índice de Sinistralidade (%)"),
        type: "line",
        data: [
          { name: l(locale, "Sep", "Set"), value: 68 },
          { name: l(locale, "Oct", "Out"), value: 65 },
          { name: "Nov", value: 71 },
          { name: l(locale, "Dec", "Dez"), value: 74 },
          { name: "Jan", value: 62 },
          { name: l(locale, "Feb", "Fev"), value: 59 },
        ],
      },
    ],
  },

  // ─── Orchestration ──────────────────────────────────────────────────
  orchestration: {
    agents: [
      { name: l(locale, "Chief Underwriter AI", "IA Subscritor Chefe"), role: l(locale, "Orchestrates all insurance operations, underwriting decisions, and risk management", "Orquestra todas as operações de seguros, decisões de subscrição e gestão de riscos"), avatar: "🛡️", color: "blue", tasks: [l(locale, "Underwriting oversight", "Supervisão de subscrição"), l(locale, "Risk portfolio management", "Gestão de portfólio de riscos"), l(locale, "Operations coordination", "Coordenação de operações")] },
      { name: l(locale, "Claims Adjuster", "Regulador de Sinistros"), role: l(locale, "Processes and evaluates insurance claims for settlement", "Processa e avalia sinistros de seguros para liquidação"), avatar: "📋", color: "emerald", tasks: [l(locale, "Claim evaluation", "Avaliação de sinistros"), l(locale, "Settlement calculation", "Cálculo de liquidação"), l(locale, "Adjuster assignment", "Atribuição de regulador")], reportsTo: l(locale, "Chief Underwriter AI", "IA Subscritor Chefe") },
      { name: l(locale, "Policy Manager", "Gestor de Apólices"), role: l(locale, "Handles policy lifecycle from issuance to renewal", "Gerencia ciclo de vida da apólice desde a emissão até a renovação"), avatar: "📄", color: "violet", tasks: [l(locale, "Policy issuance", "Emissão de apólices"), l(locale, "Endorsement processing", "Processamento de endossos"), l(locale, "Renewal management", "Gestão de renovações")], reportsTo: l(locale, "Chief Underwriter AI", "IA Subscritor Chefe") },
      { name: l(locale, "Risk Assessor", "Avaliador de Riscos"), role: l(locale, "Evaluates and scores risk profiles for underwriting decisions", "Avalia e pontua perfis de risco para decisões de subscrição"), avatar: "📊", color: "amber", tasks: [l(locale, "Risk scoring", "Pontuação de risco"), l(locale, "Exposure analysis", "Análise de exposição"), l(locale, "Portfolio risk modeling", "Modelagem de risco de portfólio")], reportsTo: l(locale, "Chief Underwriter AI", "IA Subscritor Chefe") },
      { name: l(locale, "Fraud Detector", "Detector de Fraude"), role: l(locale, "Identifies suspicious claims and patterns indicative of fraud", "Identifica sinistros suspeitos e padrões indicativos de fraude"), avatar: "🔍", color: "rose", tasks: [l(locale, "Pattern analysis", "Análise de padrões"), l(locale, "Red flag detection", "Detecção de alertas"), l(locale, "SIU referral generation", "Geração de referências UIE")], reportsTo: l(locale, "Claims Adjuster", "Regulador de Sinistros") },
      { name: l(locale, "Compliance Officer", "Oficial de Conformidade"), role: l(locale, "Ensures regulatory compliance across all insurance operations", "Garante conformidade regulatória em todas as operações de seguros"), avatar: "⚖️", color: "cyan", tasks: [l(locale, "Rate filing verification", "Verificação de registro tarifário"), l(locale, "NAIC reporting", "Relatórios SUSEP"), l(locale, "State DOI compliance", "Conformidade com órgãos reguladores")], reportsTo: l(locale, "Chief Underwriter AI", "IA Subscritor Chefe") },
      { name: l(locale, "Customer Service Agent", "Agente de Atendimento ao Cliente"), role: l(locale, "Handles policyholder inquiries, quotes, and service requests", "Atende consultas de segurados, cotações e solicitações de serviço"), avatar: "💬", color: "green", tasks: [l(locale, "Quote generation", "Geração de cotações"), l(locale, "Policy inquiries", "Consultas de apólices"), l(locale, "Claims status updates", "Atualizações de status de sinistros")], reportsTo: l(locale, "Policy Manager", "Gestor de Apólices") },
    ],
    humanReviewPoints: [
      { agent: l(locale, "Chief Underwriter AI", "IA Subscritor Chefe"), task: l(locale, "High-value commercial policy binding", "Vinculação de apólice comercial de alto valor"), reason: l(locale, "Commercial policies exceeding $5M in coverage require senior underwriter sign-off and reinsurance treaty verification", "Apólices comerciais com cobertura acima de R$ 25M exigem aprovação do subscritor sênior e verificação do tratado de resseguro") },
      { agent: l(locale, "Claims Adjuster", "Regulador de Sinistros"), task: l(locale, "Claim settlement above authority limit", "Liquidação de sinistro acima do limite de autoridade"), reason: l(locale, "Settlements exceeding $100K require claims manager approval and may need reserve adjustment authorization", "Liquidações acima de R$ 500K exigem aprovação do gerente de sinistros e podem precisar de autorização de ajuste de reserva") },
      { agent: l(locale, "Fraud Detector", "Detector de Fraude"), task: l(locale, "SIU referral for organized fraud ring", "Referência UIE para quadrilha de fraude organizada"), reason: l(locale, "Multi-claim fraud patterns involving potential organized rings require legal counsel review before investigation escalation", "Padrões de fraude com múltiplos sinistros envolvendo possíveis quadrilhas organizadas exigem revisão jurídica antes de escalar a investigação") },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: channels.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? l(locale, "Full insurance operations dashboard — policies, claims, underwriting, and compliance reporting", "Dashboard completo de operações de seguros — apólices, sinistros, subscrição e relatórios de conformidade") :
        ch.name === "WhatsApp" ? l(locale, "\"Claim #CLM-4821 approved for $12,400 settlement. Policyholder notified.\"", "\"Sinistro #CLM-4821 aprovado para liquidação de R$ 62.000. Segurado notificado.\"") :
        ch.name === "Telegram" ? l(locale, "Real-time claims alerts, fraud flags, and underwriting queue updates", "Alertas de sinistros em tempo real, alertas de fraude e atualizações da fila de subscrição") :
        ch.name === "Discord" ? l(locale, "Team operations room — coordinate claims reviews, underwriting decisions, and compliance filings", "Sala de operações da equipe — coordene revisões de sinistros, decisões de subscrição e relatórios de conformidade") :
        ch.name === "Slack" ? l(locale, "Use /claims, /policies, or /underwriting for instant insurance operations data", "Use /sinistros, /apolices ou /subscricao para dados instantâneos de operações de seguros") :
        ch.name === "Email" ? l(locale, "Daily claims digest, renewal pipeline reports, and regulatory deadline reminders", "Resumo diário de sinistros, relatórios de pipeline de renovação e lembretes de prazos regulatórios") :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("insurenet", "https://insurenet.vercel.app"),
    projectUrl: "https://insurenet.vercel.app",
    stats: [
      { label: l(locale, "Policies Managed", "Apólices Gerenciadas"), value: "50,000+" },
      { label: l(locale, "Claims Auto-Processed", "Sinistros Auto-Processados"), value: "72%" },
      { label: l(locale, "Fraud Detection Rate", "Taxa de Detecção de Fraude"), value: "96%" },
      { label: l(locale, "Underwriting Speed", "Velocidade de Subscrição"), value: l(locale, "3x faster", "3x mais rápido") },
    ],
  },
  };
}
