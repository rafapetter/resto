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
      { id: "corporate-law", name: l(locale, "Corporate Law", "Direito Empresarial"), emoji: "🏢" },
      { id: "family-law", name: l(locale, "Family Law", "Direito de Família"), emoji: "👨‍👩‍👧" },
      { id: "criminal-defense", name: l(locale, "Criminal Defense", "Defesa Criminal"), emoji: "⚖️" },
      { id: "real-estate-law", name: l(locale, "Real Estate Law", "Direito Imobiliário"), emoji: "🏠" },
      { id: "intellectual-property", name: l(locale, "Intellectual Property", "Propriedade Intelectual"), emoji: "💡" },
      { id: "immigration-law", name: l(locale, "Immigration Law", "Direito Imigratório"), emoji: "🌍" },
    ],
    verticals: [
      { id: "case-management", name: l(locale, "Case Management", "Gestão de Processos") },
      { id: "document-automation", name: l(locale, "Document Automation", "Automação de Documentos") },
      { id: "client-relations", name: l(locale, "Client Relations", "Relação com Clientes") },
      { id: "billing-trust", name: l(locale, "Billing & Trust Accounting", "Faturamento & Conta Fiduciária") },
    ],
    features: [
      { id: "case-tracking", name: l(locale, "Case Tracking", "Acompanhamento de Processos") },
      { id: "document-generation", name: l(locale, "Document Generation", "Geração de Documentos") },
      { id: "court-filing", name: l(locale, "Court Filing", "Peticionamento Judicial") },
      { id: "time-tracking", name: l(locale, "Time Tracking", "Controle de Horas") },
      { id: "client-portal", name: l(locale, "Client Portal", "Portal do Cliente") },
      { id: "conflict-checking", name: l(locale, "Conflict Checking", "Verificação de Conflitos") },
    ],
    autoSelections: {
      industry: "corporate-law",
      vertical: "case-management",
      features: ["case-tracking", "document-generation", "time-tracking", "conflict-checking"],
      autonomy: {
        "case-tracking": "full",
        "document-generation": "supervised",
        "court-filing": "supervised",
        "time-tracking": "full",
        "client-portal": "full",
        "conflict-checking": "full",
      },
    },
    projectName: "LegalEdge Law",
    projectDescription: l(locale,
      "AI-powered law firm management platform with intelligent case tracking, automated document generation, and integrated billing with IOLTA trust accounting.",
      "Plataforma de gestão de escritório de advocacia com IA, acompanhamento inteligente de processos, geração automatizada de documentos e faturamento integrado com conta fiduciária IOLTA."
    ),
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "LegalEdge Law",
    projectBadge: l(locale, "Legal", "Jurídico"),
    projectDescription: l(locale,
      "Streamline law firm operations with AI-driven case management, automated document drafting, conflict checking, and billable hour tracking across all practice areas.",
      "Otimize as operações do escritório de advocacia com gestão de processos por IA, redação automatizada de documentos, verificação de conflitos e controle de horas faturáveis em todas as áreas de atuação."
    ),
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: l(locale,
          "Good morning, Ms. Reeves. You have 14 active cases requiring attention today. The Henderson v. Marlow summary judgment motion is due Friday, the Zhang contract review is awaiting your final markup, and two new client intake consultations are scheduled this afternoon. I also ran overnight conflict checks on the 3 prospective clients — one flagged a potential conflict.",
          "Bom dia, Dra. Reeves. Você tem 14 processos ativos que precisam de atenção hoje. A moção de julgamento sumário Henderson v. Marlow vence na sexta-feira, a revisão do contrato Zhang aguarda sua marcação final, e duas consultas de novos clientes estão agendadas para esta tarde. Também executei verificações de conflito durante a noite nos 3 clientes potenciais — um sinalizou um possível conflito."
        ),
      },
      {
        role: "user",
        content: l(locale,
          "Start with the conflict flag. Which prospective client and what's the issue?",
          "Comece pelo alerta de conflito. Qual cliente potencial e qual é a questão?"
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "The conflict involves prospective client Rayburn Industries. They're seeking representation in a breach-of-contract dispute against Dillon Supply Co. The issue: Dillon Supply was a client of the firm in 2023 — associate James Park handled a vendor agreement negotiation for them. The matter is closed, but under Rule 1.9 (Duties to Former Clients), this may constitute a conflict if the current matter is substantially related. I've pulled the 2023 engagement file for your review.",
          "O conflito envolve o cliente potencial Rayburn Industries. Eles buscam representação em uma disputa por quebra de contrato contra a Dillon Supply Co. O problema: a Dillon Supply foi cliente do escritório em 2023 — o associado James Park conduziu uma negociação de contrato de fornecimento para eles. O caso está encerrado, mas de acordo com a Regra 1.9 (Deveres com Ex-Clientes), isso pode constituir um conflito se a matéria atual for substancialmente relacionada. Separei o arquivo de engajamento de 2023 para sua revisão."
        ),
      },
      {
        role: "user",
        content: l(locale,
          "Good catch. Table Rayburn for now until I review the file. What's the status on Henderson v. Marlow?",
          "Boa observação. Deixe Rayburn em espera por enquanto até eu revisar o arquivo. Qual é o status de Henderson v. Marlow?"
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "Henderson v. Marlow — summary judgment motion due Friday at 5 PM (Superior Court, Dept. 14). Here's where we stand:\n\n• **Statement of Undisputed Facts**: Drafted, 42 facts cited — needs your review\n• **Memorandum of Points & Authorities**: 80% complete, Research Agent identified 3 additional supporting cases from the 9th Circuit\n• **Declaration of Plaintiff**: Awaiting Henderson's signature — DocuSign sent yesterday, not yet signed\n• **Exhibits**: 18 of 22 exhibits compiled and Bates-stamped\n\nThe biggest risk is Henderson's unsigned declaration. Shall I have the paralegal follow up with a call?",
          "Henderson v. Marlow — moção de julgamento sumário com prazo na sexta às 17h (Tribunal Superior, Dept. 14). Aqui está o andamento:\n\n• **Declaração de Fatos Incontroversos**: Redigida, 42 fatos citados — precisa da sua revisão\n• **Memorando de Fundamentos & Jurisprudência**: 80% completo, o Agente de Pesquisa identificou 3 casos adicionais de apoio do 9º Circuito\n• **Declaração do Autor**: Aguardando assinatura de Henderson — DocuSign enviado ontem, ainda não assinado\n• **Anexos**: 18 de 22 anexos compilados e numerados Bates\n\nO maior risco é a declaração não assinada de Henderson. Quer que o paralegal ligue para ele?"
        ),
      },
      {
        role: "user",
        content: l(locale,
          "Yes, have them call Henderson immediately. Also, log 1.5 hours to Henderson for my review this morning and prep the filing package.",
          "Sim, peça para ligarem para Henderson imediatamente. Também registre 1,5 hora em Henderson pela minha revisão desta manhã e prepare o pacote de peticionamento."
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "Done — 1.5 hours logged to Henderson v. Marlow (matter #2024-0847) under your billing code at $425/hr. Paralegal team has been notified to call Henderson for the declaration signature. I'm assembling the e-filing package for Superior Court and will have the final bundle ready for your review by 3 PM tomorrow. One more item — the Zhang Industries contract review. Their general counsel is requesting the redline by end of day today.",
          "Feito — 1,5 hora registrada em Henderson v. Marlow (processo #2024-0847) no seu código de faturamento a $425/hr. A equipe de paralegais foi notificada para ligar para Henderson sobre a assinatura da declaração. Estou montando o pacote de peticionamento eletrônico para o Tribunal Superior e terei o pacote final pronto para sua revisão até às 15h de amanhã. Mais um item — a revisão do contrato da Zhang Industries. O diretor jurídico deles está solicitando o redline até o final do dia."
        ),
        action: {
          type: "approval",
          title: l(locale, "Submit Court Filing Package", "Enviar Pacote de Peticionamento"),
          description: l(locale,
            "Authorize preparation and e-filing of the Henderson v. Marlow summary judgment motion with the Superior Court (Case No. 2024-CV-03291, Dept. 14). Filing fee: $60. Package includes memorandum, statement of facts, plaintiff declaration (pending signature), and 22 exhibits.",
            "Autorizar preparação e peticionamento eletrônico da moção de julgamento sumário Henderson v. Marlow no Tribunal Superior (Processo nº 2024-CV-03291, Dept. 14). Taxa de peticionamento: $60. Pacote inclui memorando, declaração de fatos, declaração do autor (pendente assinatura) e 22 anexos."
          ),
        },
      },
      {
        role: "user",
        content: l(locale,
          "Approve the filing prep, but hold submission until Henderson signs. Send Zhang's GC a note that the redline will be over by 6 PM.",
          "Aprove a preparação do peticionamento, mas segure o envio até Henderson assinar. Envie uma nota ao diretor jurídico da Zhang dizendo que o redline será enviado até às 18h."
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "Filing package preparation approved — I'll hold the e-filing submission and alert you the moment Henderson's DocuSign comes through. I've sent a courtesy email to Zhang Industries' general counsel, Linda Park, confirming the redline delivery by 6 PM today. Your billable hours for this week are currently at 32.5 — you're on pace to exceed your 38-hour weekly target. The two intake consultations this afternoon are at 2:00 PM (estate planning referral) and 3:30 PM (commercial lease dispute). Intake questionnaires and conflict check results are already in your briefing folder.",
          "Preparação do pacote de peticionamento aprovada — vou segurar o envio eletrônico e avisar assim que o DocuSign de Henderson chegar. Enviei um e-mail de cortesia para a diretora jurídica da Zhang Industries, Linda Park, confirmando a entrega do redline até às 18h hoje. Suas horas faturáveis desta semana estão em 32,5 — você está no ritmo para superar sua meta semanal de 38 horas. As duas consultas de novos clientes desta tarde são às 14:00 (encaminhamento de planejamento patrimonial) e 15:30 (disputa de locação comercial). Questionários de intake e resultados de verificação de conflito já estão na sua pasta de briefing."
        ),
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: l(locale, "Good morning, Ms. Reeves. Here's your legal operations briefing for Thursday, February 20th.", "Bom dia, Dra. Reeves. Aqui está seu briefing de operações jurídicas para quinta-feira, 20 de fevereiro."), durationMs: 3400 },
      { speaker: "agent", text: l(locale, "You have 3 court deadlines this week. The Henderson v. Marlow summary judgment motion is due Friday — the filing package is 80% complete and awaiting a client declaration signature. The Lopez immigration petition has a USCIS response deadline on Monday, and the Greenfield LLC operating agreement needs to be executed by the partners before Wednesday.", "Você tem 3 prazos judiciais esta semana. A moção de julgamento sumário Henderson v. Marlow vence na sexta — o pacote de peticionamento está 80% completo e aguardando assinatura da declaração do cliente. A petição de imigração Lopez tem prazo de resposta do USCIS na segunda, e o contrato social da Greenfield LLC precisa ser assinado pelos sócios antes de quarta."), durationMs: 11200 },
      { speaker: "agent", text: l(locale, "Today's schedule includes 6 billable matters, 2 new client intake consultations this afternoon, and a 4:30 PM call with co-counsel on the DataStream patent case. A conflict check flagged a potential issue with prospective client Rayburn Industries — details are in your case queue for review.", "A agenda de hoje inclui 6 assuntos faturáveis, 2 consultas de novos clientes à tarde e uma ligação às 16:30 com co-counsel no caso de patente DataStream. Uma verificação de conflito sinalizou uma possível questão com o cliente potencial Rayburn Industries — detalhes estão na sua fila de processos para revisão."), durationMs: 10500 },
      { speaker: "agent", text: l(locale, "Billing update: the firm logged 847 billable hours this month across all attorneys, with a 94% collection rate. Three client invoices totaling $42,600 are past 30 days. The IOLTA trust account balance is $318,400 with two scheduled disbursements pending your authorization today.", "Atualização de faturamento: o escritório registrou 847 horas faturáveis este mês entre todos os advogados, com taxa de cobrança de 94%. Três faturas de clientes totalizando $42.600 estão vencidas há mais de 30 dias. O saldo da conta fiduciária IOLTA é de $318.400 com dois desembolsos programados aguardando sua autorização hoje."), durationMs: 10800 },
    ],
    summary: l(locale,
      "Morning briefing covered 3 court deadlines (summary judgment, USCIS petition, LLC agreement), 2 new client intake sessions, a conflict check flag on Rayburn Industries, and billing status including 94% collection rate and pending IOLTA disbursements.",
      "Briefing matinal cobriu 3 prazos judiciais (julgamento sumário, petição USCIS, contrato social LLC), 2 consultas de novos clientes, alerta de conflito sobre Rayburn Industries e status de faturamento incluindo taxa de cobrança de 94% e desembolsos IOLTA pendentes."
    ),
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "Clio Manage", icon: "briefcase", category: l(locale, "Practice Mgmt", "Gestão do Escritório"), description: l(locale, "Legal practice management — cases, contacts, calendaring, and billing", "Gestão do escritório de advocacia — processos, contatos, agenda e faturamento") },
      { name: "Westlaw Edge", icon: "search", category: l(locale, "Legal Research", "Pesquisa Jurídica"), description: l(locale, "AI-powered legal research, case law, statutes, and secondary sources", "Pesquisa jurídica com IA, jurisprudência, legislação e fontes secundárias") },
      { name: "LexisNexis", icon: "book-open", category: l(locale, "Legal Research", "Pesquisa Jurídica"), description: l(locale, "Legal research, public records, and litigation analytics", "Pesquisa jurídica, registros públicos e analytics de litígios") },
      { name: "Tyler Technologies", icon: "gavel", category: l(locale, "Court Filing", "Peticionamento Judicial"), description: l(locale, "E-filing integration for state and federal court submissions", "Integração de peticionamento eletrônico para tribunais estaduais e federais") },
      { name: "DocuSign", icon: "pen-tool", category: l(locale, "Document Signing", "Assinatura de Documentos"), description: l(locale, "Electronic signatures for client agreements, declarations, and contracts", "Assinaturas eletrônicas para acordos, declarações e contratos com clientes") },
      { name: "LawPay", icon: "landmark", category: l(locale, "Trust Accounting", "Conta Fiduciária"), description: l(locale, "IOLTA-compliant payment processing and trust account management", "Processamento de pagamentos e gestão de conta fiduciária em conformidade com IOLTA") },
      CI.googleEmail,
      CI.calendar,
      CI.slack,
      CI.twilio,
      CI.stripe,
      CI.github,
      CI.vercel,
      CI.sentry,
    ],
  },

  // ─── Build ─────────────────────────────────────────────────────────
  build: {
    checklist: [
      { title: l(locale, "Design case and matter data model with relational linking", "Projetar modelo de dados de processos e assuntos com vinculação relacional"), stage: "plan", status: "complete" },
      { title: l(locale, "Define conflict-of-interest rules engine and entity resolution", "Definir motor de regras de conflito de interesse e resolução de entidades"), stage: "plan", status: "complete" },
      { title: l(locale, "Build case management dashboard with deadlines and status tracking", "Construir dashboard de gestão de processos com prazos e acompanhamento de status"), stage: "build", status: "complete" },
      { title: l(locale, "Implement document generation engine with clause library", "Implementar motor de geração de documentos com biblioteca de cláusulas"), stage: "build", status: "complete" },
      { title: l(locale, "Create e-filing integration with court submission APIs", "Criar integração de peticionamento eletrônico com APIs dos tribunais"), stage: "build", status: "active" },
      { title: l(locale, "Build time tracking and IOLTA trust accounting system", "Construir sistema de controle de horas e conta fiduciária IOLTA"), stage: "build", status: "pending" },
      { title: l(locale, "Set up client portal with secure document sharing", "Configurar portal do cliente com compartilhamento seguro de documentos"), stage: "launch", status: "pending" },
      { title: l(locale, "Deploy with ABA compliance audit and data encryption at rest", "Deploy com auditoria de conformidade OAB e criptografia de dados em repouso"), stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "dashboard", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "cases", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[caseId]", type: "folder", children: [
                  { name: "page.tsx", type: "file" },
                  { name: "documents.tsx", type: "file" },
                  { name: "timeline.tsx", type: "file" },
                ] },
              ] },
              { name: "clients", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[clientId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
              { name: "documents", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "billing", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "calendar", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "conflicts", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "cases", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "clients", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "documents", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "billing", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "court-filings", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "conflicts", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "webhooks", type: "folder", children: [
                { name: "docusign", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "court-updates", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
          { name: "portal", type: "folder", children: [
            { name: "page.tsx", type: "file" },
            { name: "documents", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            { name: "messages", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
          ] },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "conflict-checker.ts", type: "file" },
          { name: "document-generator.ts", type: "file" },
          { name: "court-efiling.ts", type: "file" },
          { name: "iolta-ledger.ts", type: "file" },
          { name: "time-tracker.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: l(locale, "Legal Procedures", "Procedimentos Jurídicos"), icon: "gavel", count: 38 },
      { name: l(locale, "Court Rules", "Regras Processuais"), icon: "scale", count: 45 },
      { name: l(locale, "Practice Area Guides", "Guias por Área de Atuação"), icon: "book-open", count: 26 },
      { name: l(locale, "Ethics Opinions", "Pareceres de Ética"), icon: "shield", count: 22 },
      { name: l(locale, "Fee Schedules & Billing", "Tabelas de Honorários & Faturamento"), icon: "receipt", count: 18 },
    ],
    documents: [
      { title: l(locale, "Civil Litigation Procedure Manual", "Manual de Procedimentos de Litígio Civil"), category: l(locale, "Legal Procedures", "Procedimentos Jurídicos"), tier: "index", lines: 110, crossRefs: [l(locale, "Summary Judgment Motion Checklist", "Checklist de Moção de Julgamento Sumário"), l(locale, "Discovery Protocol Guide", "Guia de Protocolo de Instrução Processual")] },
      { title: l(locale, "Summary Judgment Motion Checklist", "Checklist de Moção de Julgamento Sumário"), category: l(locale, "Legal Procedures", "Procedimentos Jurídicos"), tier: "detail", lines: 380 },
      { title: l(locale, "Discovery Protocol Guide", "Guia de Protocolo de Instrução Processual"), category: l(locale, "Legal Procedures", "Procedimentos Jurídicos"), tier: "detail", lines: 460 },
      { title: l(locale, "State Superior Court Local Rules", "Regras Locais do Tribunal Estadual"), category: l(locale, "Court Rules", "Regras Processuais"), tier: "summary", lines: 520, crossRefs: [l(locale, "E-Filing Requirements by Jurisdiction", "Requisitos de Peticionamento Eletrônico por Jurisdição")] },
      { title: l(locale, "E-Filing Requirements by Jurisdiction", "Requisitos de Peticionamento Eletrônico por Jurisdição"), category: l(locale, "Court Rules", "Regras Processuais"), tier: "detail", lines: 340 },
      { title: l(locale, "Federal Rules of Civil Procedure Reference", "Referência do Código de Processo Civil Federal"), category: l(locale, "Court Rules", "Regras Processuais"), tier: "detail", lines: 890 },
      { title: l(locale, "Conflict of Interest Rules (ABA Model Rules 1.7-1.9)", "Regras de Conflito de Interesse (Código de Ética OAB 1.7-1.9)"), category: l(locale, "Ethics Opinions", "Pareceres de Ética"), tier: "summary", lines: 210, crossRefs: [l(locale, "Civil Litigation Procedure Manual", "Manual de Procedimentos de Litígio Civil")] },
      { title: l(locale, "IOLTA Trust Account Compliance Guide", "Guia de Conformidade de Conta Fiduciária IOLTA"), category: l(locale, "Fee Schedules & Billing", "Tabelas de Honorários & Faturamento"), tier: "summary", lines: 275, crossRefs: [l(locale, "State Bar Fee Schedule 2025", "Tabela de Honorários da OAB 2025")] },
      { title: l(locale, "State Bar Fee Schedule 2025", "Tabela de Honorários da OAB 2025"), category: l(locale, "Fee Schedules & Billing", "Tabelas de Honorários & Faturamento"), tier: "detail", lines: 190 },
      { title: l(locale, "Corporate M&A Due Diligence Playbook", "Playbook de Due Diligence em Fusões & Aquisições"), category: l(locale, "Practice Area Guides", "Guias por Área de Atuação"), tier: "summary", lines: 430, crossRefs: [l(locale, "Discovery Protocol Guide", "Guia de Protocolo de Instrução Processual")] },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: l(locale, "Cases Resolved (Last 6 Months)", "Processos Resolvidos (Últimos 6 Meses)"),
        type: "bar",
        data: [
          { name: l(locale, "Sep", "Set"), value: 28 },
          { name: l(locale, "Oct", "Out"), value: 34 },
          { name: "Nov", value: 31 },
          { name: l(locale, "Dec", "Dez"), value: 22 },
          { name: "Jan", value: 37 },
          { name: l(locale, "Feb", "Fev"), value: 41 },
        ],
      },
      {
        label: l(locale, "Billable Hours by Practice Area", "Horas Faturáveis por Área de Atuação"),
        type: "bar",
        data: [
          { name: l(locale, "Corporate", "Empresarial"), value: 312 },
          { name: l(locale, "Litigation", "Litígio"), value: 287 },
          { name: l(locale, "Real Estate", "Imobiliário"), value: 164 },
          { name: "IP", value: 198 },
          { name: l(locale, "Family", "Família"), value: 142 },
          { name: l(locale, "Immigration", "Imigração"), value: 118 },
        ],
      },
    ],
  },

  // ─── Orchestration ──────────────────────────────────────────────────
  orchestration: {
    agents: [
      { name: l(locale, "Managing Partner AI", "IA Sócio Gestor"), role: l(locale, "Orchestrates firm-wide operations, case allocation, and strategic decisions", "Orquestra operações do escritório, alocação de processos e decisões estratégicas"), avatar: "⚖️", color: "blue", tasks: [l(locale, "Case assignment", "Atribuição de processos"), l(locale, "Firm performance oversight", "Supervisão de desempenho do escritório"), l(locale, "Resource allocation", "Alocação de recursos")] },
      { name: l(locale, "Case Manager", "Gestor de Processos"), role: l(locale, "Tracks case progress, deadlines, and deliverables across all matters", "Acompanha progresso, prazos e entregas em todos os processos"), avatar: "📂", color: "emerald", tasks: [l(locale, "Deadline monitoring", "Monitoramento de prazos"), l(locale, "Task assignment", "Atribuição de tarefas"), l(locale, "Status reporting", "Relatórios de status")], reportsTo: l(locale, "Managing Partner AI", "IA Sócio Gestor") },
      { name: l(locale, "Research Agent", "Agente de Pesquisa"), role: l(locale, "Conducts legal research and identifies relevant case law and statutes", "Realiza pesquisa jurídica e identifica jurisprudência e legislação relevantes"), avatar: "🔍", color: "violet", tasks: [l(locale, "Case law research", "Pesquisa de jurisprudência"), l(locale, "Statutory analysis", "Análise legislativa"), l(locale, "Precedent identification", "Identificação de precedentes")], reportsTo: l(locale, "Case Manager", "Gestor de Processos") },
      { name: l(locale, "Document Agent", "Agente de Documentos"), role: l(locale, "Drafts, assembles, and manages legal documents and filings", "Redige, monta e gerencia documentos jurídicos e petições"), avatar: "📝", color: "amber", tasks: [l(locale, "Document generation", "Geração de documentos"), l(locale, "Contract redlining", "Redline de contratos"), l(locale, "Filing package assembly", "Montagem de pacote de peticionamento")], reportsTo: l(locale, "Case Manager", "Gestor de Processos") },
      { name: l(locale, "Billing Agent", "Agente de Faturamento"), role: l(locale, "Manages time entries, invoicing, and trust accounting", "Gerencia registros de horas, faturamento e conta fiduciária"), avatar: "💰", color: "green", tasks: [l(locale, "Time entry processing", "Processamento de registros de horas"), l(locale, "Invoice generation", "Geração de faturas"), l(locale, "IOLTA reconciliation", "Conciliação IOLTA")], reportsTo: l(locale, "Managing Partner AI", "IA Sócio Gestor") },
      { name: l(locale, "Client Intake Agent", "Agente de Intake de Clientes"), role: l(locale, "Handles new client onboarding, conflict checks, and engagement letters", "Gerencia onboarding de novos clientes, verificação de conflitos e cartas de engajamento"), avatar: "🤝", color: "cyan", tasks: [l(locale, "Intake questionnaires", "Questionários de intake"), l(locale, "Conflict screening", "Triagem de conflitos"), l(locale, "Engagement letter drafting", "Redação de cartas de engajamento")], reportsTo: l(locale, "Managing Partner AI", "IA Sócio Gestor") },
      { name: l(locale, "Compliance Monitor", "Monitor de Conformidade"), role: l(locale, "Ensures ethics compliance, deadline adherence, and regulatory obligations", "Garante conformidade ética, cumprimento de prazos e obrigações regulatórias"), avatar: "🛡️", color: "rose", tasks: [l(locale, "Ethics rule monitoring", "Monitoramento de regras éticas"), l(locale, "Bar compliance tracking", "Rastreamento de conformidade com a OAB"), l(locale, "Statute of limitations alerts", "Alertas de prescrição")], reportsTo: l(locale, "Managing Partner AI", "IA Sócio Gestor") },
    ],
    humanReviewPoints: [
      { agent: l(locale, "Document Agent", "Agente de Documentos"), task: l(locale, "Court filing submission", "Envio de peticionamento judicial"), reason: l(locale, "All court filings require attorney review and signature before submission per bar association rules", "Todos os peticionamentos judiciais exigem revisão e assinatura de advogado antes do envio conforme regras da OAB") },
      { agent: l(locale, "Client Intake Agent", "Agente de Intake de Clientes"), task: l(locale, "Conflict of interest resolution", "Resolução de conflito de interesse"), reason: l(locale, "Potential conflicts under Rules 1.7-1.9 require partner-level review and client consent determination", "Conflitos potenciais sob as Regras 1.7-1.9 exigem revisão de sócio e determinação de consentimento do cliente") },
      { agent: l(locale, "Billing Agent", "Agente de Faturamento"), task: l(locale, "IOLTA trust disbursement", "Desembolso da conta fiduciária IOLTA"), reason: l(locale, "Trust account disbursements require attorney authorization to comply with state bar trust accounting rules", "Desembolsos de conta fiduciária requerem autorização de advogado para conformidade com regras de contabilidade fiduciária da OAB") },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: channels.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? l(locale, "Full case management dashboard — matters, documents, billing, and court deadlines", "Dashboard completo de gestão de processos — assuntos, documentos, faturamento e prazos judiciais") :
        ch.name === "WhatsApp" ? l(locale, "\"Ms. Reeves, Henderson signed the declaration via DocuSign. Filing package is ready.\"", "\"Dra. Reeves, Henderson assinou a declaração via DocuSign. O pacote de peticionamento está pronto.\"") :
        ch.name === "Telegram" ? l(locale, "Quick case status checks and deadline alerts on the go", "Verificações rápidas de status de processos e alertas de prazos em movimento") :
        ch.name === "Discord" ? l(locale, "Practice group channels for case strategy discussions and research sharing", "Canais de grupos de prática para discussões de estratégia e compartilhamento de pesquisa") :
        ch.name === "Slack" ? l(locale, "Use /case, /conflicts, or /billing to pull live firm data from any channel", "Use /processo, /conflitos ou /faturamento para acessar dados do escritório de qualquer canal") :
        ch.name === "Email" ? l(locale, "Daily docket summaries, filing confirmations, and client communication logs", "Resumos diários de pauta, confirmações de peticionamento e logs de comunicação com clientes") :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("legaledge-law", "https://legaledge-law.vercel.app"),
    projectUrl: "https://legaledge-law.vercel.app",
    stats: [
      { label: l(locale, "Cases Managed", "Processos Gerenciados"), value: "1,200+" },
      { label: l(locale, "Document Automation", "Automação de Documentos"), value: "85%" },
      { label: l(locale, "Billable Recovery", "Recuperação Faturável"), value: "94%" },
      { label: l(locale, "Conflict Check Speed", "Velocidade de Verificação de Conflitos"), value: "<2s" },
    ],
  },
  };
}
