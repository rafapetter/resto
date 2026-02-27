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
      { id: "healthcare", name: l(locale, "Healthcare", "Saúde"), emoji: "🏥" },
      { id: "telemedicine", name: l(locale, "Telemedicine", "Telemedicina"), emoji: "📱" },
      { id: "dental", name: l(locale, "Dental Practice", "Clínica Odontológica"), emoji: "🦷" },
      { id: "dermatology", name: l(locale, "Dermatology", "Dermatologia"), emoji: "🔬" },
      { id: "pediatrics", name: l(locale, "Pediatrics", "Pediatria"), emoji: "👶" },
      { id: "mental-health", name: l(locale, "Mental Health", "Saúde Mental"), emoji: "🧠" },
    ],
    verticals: [
      { id: "patient-management", name: l(locale, "Patient Management", "Gestão de Pacientes") },
      { id: "clinical-workflows", name: l(locale, "Clinical Workflows", "Fluxos Clínicos") },
      { id: "billing-insurance", name: l(locale, "Billing & Insurance", "Faturamento & Convênios") },
      { id: "telehealth", name: l(locale, "Telehealth Platform", "Plataforma de Telemedicina") },
    ],
    features: [
      { id: "ehr-integration", name: l(locale, "EHR Integration", "Integração com Prontuário Eletrônico") },
      { id: "appointment-scheduling", name: l(locale, "Appointment Scheduling", "Agendamento de Consultas") },
      { id: "prescription-management", name: l(locale, "Prescription Management", "Gestão de Receitas") },
      { id: "patient-portal", name: l(locale, "Patient Portal", "Portal do Paciente") },
      { id: "lab-results", name: l(locale, "Lab Results Tracking", "Acompanhamento de Exames") },
      { id: "hipaa-compliance", name: l(locale, "HIPAA Compliance", "Conformidade LGPD/HIPAA") },
    ],
    autoSelections: {
      industry: "healthcare",
      vertical: "clinical-workflows",
      features: ["ehr-integration", "appointment-scheduling", "prescription-management", "hipaa-compliance"],
      autonomy: {
        "appointment-scheduling": "full",
        "prescription-management": "supervised",
        "patient-portal": "full",
        "lab-results": "supervised",
        "ehr-integration": "supervised",
        "hipaa-compliance": "full",
      },
    },
    projectName: "MedFlow Clinic",
    projectDescription: l(locale,
      "AI-powered clinical management system with EHR integration, smart scheduling, and HIPAA-compliant patient workflows.",
      "Sistema de gestão clínica com IA, integração com prontuário eletrônico, agendamento inteligente e fluxos de pacientes em conformidade com LGPD."
    ),
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "MedFlow Clinic",
    projectBadge: l(locale, "Healthcare", "Saúde"),
    projectDescription: l(locale,
      "Streamline clinical operations with AI-driven patient scheduling, automated prescription refills, and intelligent triage routing.",
      "Otimize operações clínicas com agendamento inteligente de pacientes, renovação automática de receitas e triagem inteligente."
    ),
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: l(locale,
          "Good morning, Dr. Patel. You have 23 patients scheduled today. I've flagged 3 patients with overdue lab panels and 1 prior-auth request pending for Mrs. Tanaka's MRI.",
          "Bom dia, Dr. Patel. Você tem 23 pacientes agendados hoje. Sinalizei 3 pacientes com exames laboratoriais atrasados e 1 solicitação de autorização prévia pendente para a ressonância da Sra. Tanaka."
        ),
      },
      {
        role: "user",
        content: l(locale,
          "Pull up Mrs. Tanaka's chart and check if the prior-auth was submitted to Blue Cross.",
          "Abra o prontuário da Sra. Tanaka e verifique se a autorização prévia foi enviada para o convênio."
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "Mrs. Tanaka (DOB 04/15/1968) — the prior-auth for her lumbar MRI was submitted on Feb 14. Blue Cross acknowledged receipt but status is still \"Under Review.\" Her last visit note mentions chronic lower back pain with radiculopathy, L4-L5. Would you like me to call the payer line for an expedited review?",
          "Sra. Tanaka (DN 15/04/1968) — a autorização prévia para a ressonância lombar foi enviada em 14/02. O convênio confirmou recebimento mas o status ainda é \"Em Análise\". A última consulta menciona dor lombar crônica com radiculopatia, L4-L5. Gostaria que eu ligue para o convênio para agilizar a análise?"
        ),
      },
      {
        role: "user",
        content: l(locale,
          "Yes, escalate that. Also, reschedule the 2:30 follow-up with Mr. Davis to next Thursday — he called saying he has a conflict.",
          "Sim, escale isso. Também remarque o retorno das 14:30 com o Sr. Davis para quinta-feira que vem — ele ligou dizendo que tem um compromisso."
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "I've initiated the payer escalation call for Mrs. Tanaka's prior-auth. For Mr. Davis, next Thursday at 2:30 PM is available. I'll send him a confirmation via the patient portal and SMS. I also noticed his A1C results came back at 7.2% — slightly above target. Should I add a diabetes management discussion to his visit agenda?",
          "Iniciei a ligação de escalação para a autorização da Sra. Tanaka. Para o Sr. Davis, quinta-feira às 14:30 está disponível. Enviarei confirmação pelo portal do paciente e SMS. Também notei que os resultados de A1C dele voltaram em 7,2% — ligeiramente acima da meta. Devo adicionar uma discussão sobre gestão do diabetes na agenda da consulta?"
        ),
      },
      {
        role: "user",
        content: l(locale,
          "Good catch. Yes, flag that for discussion and prep the latest ADA guidelines summary.",
          "Boa observação. Sim, sinalize isso para discussão e prepare o resumo das últimas diretrizes da SBD."
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "Done. I've attached the 2025 ADA Standards of Care summary to Mr. Davis's chart and flagged the A1C trend (was 6.9% three months ago). One more item — Dr. Kim's referral for patient James Ortiz needs your co-signature on the cardiology consult note before end of day.",
          "Pronto. Anexei o resumo das Diretrizes 2025 ao prontuário do Sr. Davis e sinalizei a tendência do A1C (era 6,9% há três meses). Mais um item — o encaminhamento do Dr. Kim para o paciente James Ortiz precisa da sua co-assinatura na nota de consulta cardiológica antes do fim do dia."
        ),
        action: {
          type: "approval",
          title: l(locale, "Co-sign Cardiology Consult", "Co-assinar Consulta Cardiológica"),
          description: l(locale,
            "Review and co-sign the cardiology referral note for James Ortiz (DOB 11/03/1955). Referred for evaluation of exercise-induced chest tightness with borderline stress test.",
            "Revise e co-assine a nota de encaminhamento cardiológico para James Ortiz (DN 03/11/1955). Encaminhado para avaliação de aperto no peito induzido por exercício com teste de esforço limítrofe."
          ),
        },
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: l(locale, "Good morning, Dr. Patel. Here's your clinical briefing for today, February 20th.", "Bom dia, Dr. Patel. Aqui está seu briefing clínico para hoje, 20 de fevereiro."), durationMs: 3200 },
      { speaker: "agent", text: l(locale, "You have 23 appointments across three exam rooms. Your first patient is at 8:15 AM — Maria Santos, a 42-year-old presenting for her annual wellness visit. Her lipid panel from last week shows elevated LDL at 162. No medication changes since her last visit.", "Você tem 23 consultas em três consultórios. Sua primeira paciente é às 8:15 — Maria Santos, 42 anos, para seu check-up anual. O perfil lipídico da semana passada mostra LDL elevado em 162. Sem alterações de medicação desde a última consulta."), durationMs: 8500 },
      { speaker: "agent", text: l(locale, "Three patients flagged as urgent: Mrs. Tanaka still awaiting MRI prior-auth, Mr. Chen has an abnormal ECG that needs review, and baby Avery Thompson's newborn screening results require follow-up. I've prioritized these at the top of your task queue.", "Três pacientes sinalizados como urgentes: Sra. Tanaka ainda aguardando autorização da ressonância, Sr. Chen tem um ECG anormal que precisa de revisão, e os resultados do teste do pezinho do bebê Avery Thompson requerem acompanhamento. Priorizei estes no topo da sua fila de tarefas."), durationMs: 9200 },
      { speaker: "agent", text: l(locale, "Administrative items: two prescription refill requests are ready for your approval, the monthly quality metrics report is due Friday, and your CME credits for Q1 need 4 more hours. Shall I schedule a block for those this week?", "Itens administrativos: duas solicitações de renovação de receita estão prontas para sua aprovação, o relatório mensal de métricas de qualidade vence na sexta, e seus créditos de educação continuada do Q1 precisam de mais 4 horas. Devo agendar um bloco para isso esta semana?"), durationMs: 8800 },
    ],
    summary: l(locale,
      "Morning briefing covered 23 scheduled patients, 3 urgent flags (pending prior-auth, abnormal ECG, newborn screening), 2 refill requests, and upcoming administrative deadlines.",
      "Briefing matinal cobriu 23 pacientes agendados, 3 alertas urgentes (autorização pendente, ECG anormal, teste do pezinho), 2 solicitações de renovação e prazos administrativos próximos."
    ),
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "Epic EHR", icon: "heart-pulse", category: l(locale, "Clinical", "Clínico"), description: l(locale, "Full EHR integration for patient charts, orders, and clinical documentation", "Integração completa com prontuário eletrônico para fichas, pedidos e documentação clínica") },
      { name: "Surescripts", icon: "pill", category: l(locale, "Pharmacy", "Farmácia"), description: l(locale, "E-prescribing network for medication orders and refill management", "Rede de prescrição eletrônica para pedidos de medicamentos e gestão de renovações") },
      { name: "Lab Corp Portal", icon: "flask-conical", category: l(locale, "Diagnostics", "Diagnósticos"), description: l(locale, "Lab order submission, result retrieval, and abnormal value alerts", "Envio de pedidos laboratoriais, recuperação de resultados e alertas de valores anormais") },
      { name: "Availity", icon: "shield-check", category: l(locale, "Insurance", "Convênios"), description: l(locale, "Real-time eligibility verification and prior-authorization workflows", "Verificação de elegibilidade em tempo real e fluxos de autorização prévia") },
      { name: "Doxy.me", icon: "video", category: l(locale, "Telehealth", "Telemedicina"), description: l(locale, "HIPAA-compliant video consultations embedded in patient workflows", "Consultas por vídeo em conformidade com LGPD integradas aos fluxos de pacientes") },
      { name: "DrChrono", icon: "clipboard-list", category: l(locale, "Practice Mgmt", "Gestão da Clínica"), description: l(locale, "Scheduling, billing, and practice analytics dashboard", "Dashboard de agendamento, faturamento e analytics da clínica") },
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
      { title: l(locale, "Define patient data schema & HIPAA compliance layer", "Definir schema de dados do paciente e camada de conformidade LGPD"), stage: "plan", status: "complete" },
      { title: l(locale, "Map EHR integration endpoints (Epic FHIR R4)", "Mapear endpoints de integração com prontuário (Epic FHIR R4)"), stage: "plan", status: "complete" },
      { title: l(locale, "Build appointment scheduling engine with conflict detection", "Construir motor de agendamento com detecção de conflitos"), stage: "build", status: "complete" },
      { title: l(locale, "Implement e-prescribing workflow with Surescripts", "Implementar fluxo de prescrição eletrônica com Surescripts"), stage: "build", status: "complete" },
      { title: l(locale, "Create patient portal with secure messaging", "Criar portal do paciente com mensagens seguras"), stage: "build", status: "active" },
      { title: l(locale, "Build lab results dashboard with trend visualization", "Construir dashboard de resultados laboratoriais com visualização de tendências"), stage: "build", status: "pending" },
      { title: l(locale, "Configure HIPAA-compliant audit logging", "Configurar registro de auditoria em conformidade com LGPD"), stage: "launch", status: "pending" },
      { title: l(locale, "Deploy with BAA-covered hosting and penetration testing", "Deploy com hospedagem coberta por BAA e teste de penetração"), stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "dashboard", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "patients", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[patientId]", type: "folder", children: [
                  { name: "page.tsx", type: "file" },
                  { name: "chart.tsx", type: "file" },
                ] },
              ] },
              { name: "schedule", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "prescriptions", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "lab-results", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "patients", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "appointments", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "prescriptions", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "ehr", type: "folder", children: [{ name: "fhir", type: "folder", children: [{ name: "route.ts", type: "file" }] }] },
              { name: "webhooks", type: "folder", children: [
                { name: "lab-results", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "insurance", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
          { name: "portal", type: "folder", children: [
            { name: "page.tsx", type: "file" },
            { name: "messages", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
          ] },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "fhir-client.ts", type: "file" },
          { name: "hipaa-audit.ts", type: "file" },
          { name: "surescripts.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: l(locale, "Clinical Protocols", "Protocolos Clínicos"), icon: "stethoscope", count: 24 },
      { name: l(locale, "HIPAA & Compliance", "LGPD & Conformidade"), icon: "shield", count: 18 },
      { name: l(locale, "Insurance Policies", "Políticas de Convênios"), icon: "file-text", count: 31 },
      { name: l(locale, "Drug Formularies", "Formulários de Medicamentos"), icon: "pill", count: 42 },
      { name: l(locale, "Patient Education", "Educação do Paciente"), icon: "book-open", count: 15 },
    ],
    documents: [
      { title: l(locale, "HIPAA Privacy Rule Summary", "Resumo da Lei de Privacidade LGPD"), category: l(locale, "HIPAA & Compliance", "LGPD & Conformidade"), tier: "index", lines: 85, crossRefs: [l(locale, "BAA Requirements Checklist", "Checklist de Requisitos BAA"), l(locale, "Audit Logging Standards", "Padrões de Registro de Auditoria")] },
      { title: l(locale, "BAA Requirements Checklist", "Checklist de Requisitos BAA"), category: l(locale, "HIPAA & Compliance", "LGPD & Conformidade"), tier: "detail", lines: 340 },
      { title: l(locale, "Audit Logging Standards", "Padrões de Registro de Auditoria"), category: l(locale, "HIPAA & Compliance", "LGPD & Conformidade"), tier: "detail", lines: 210 },
      { title: l(locale, "Type 2 Diabetes Management Protocol", "Protocolo de Gestão de Diabetes Tipo 2"), category: l(locale, "Clinical Protocols", "Protocolos Clínicos"), tier: "summary", lines: 180, crossRefs: [l(locale, "ADA 2025 Standards of Care", "Diretrizes SBD 2025"), l(locale, "Insulin Titration Guidelines", "Diretrizes de Titulação de Insulina")] },
      { title: l(locale, "ADA 2025 Standards of Care", "Diretrizes SBD 2025"), category: l(locale, "Clinical Protocols", "Protocolos Clínicos"), tier: "detail", lines: 520 },
      { title: l(locale, "Insulin Titration Guidelines", "Diretrizes de Titulação de Insulina"), category: l(locale, "Clinical Protocols", "Protocolos Clínicos"), tier: "detail", lines: 275 },
      { title: l(locale, "Blue Cross Prior-Auth Requirements", "Requisitos de Autorização Prévia do Convênio"), category: l(locale, "Insurance Policies", "Políticas de Convênios"), tier: "summary", lines: 160, crossRefs: [l(locale, "CPT Code Reference 2025", "Referência de Códigos TUSS 2025")] },
      { title: l(locale, "CPT Code Reference 2025", "Referência de Códigos TUSS 2025"), category: l(locale, "Insurance Policies", "Políticas de Convênios"), tier: "detail", lines: 890 },
      { title: l(locale, "Common Drug Interactions Reference", "Referência de Interações Medicamentosas"), category: l(locale, "Drug Formularies", "Formulários de Medicamentos"), tier: "index", lines: 120, crossRefs: [l(locale, "Type 2 Diabetes Management Protocol", "Protocolo de Gestão de Diabetes Tipo 2")] },
      { title: l(locale, "Patient Discharge Instructions Template", "Modelo de Instruções de Alta do Paciente"), category: l(locale, "Patient Education", "Educação do Paciente"), tier: "summary", lines: 95 },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: l(locale, "Patient Volume (Last 6 Months)", "Volume de Pacientes (Últimos 6 Meses)"),
        type: "bar",
        data: [
          { name: l(locale, "Sep", "Set"), value: 412 },
          { name: l(locale, "Oct", "Out"), value: 438 },
          { name: "Nov", value: 395 },
          { name: l(locale, "Dec", "Dez"), value: 362 },
          { name: l(locale, "Jan", "Jan"), value: 451 },
          { name: l(locale, "Feb", "Fev"), value: 467 },
        ],
      },
      {
        label: l(locale, "Average Wait Time (minutes)", "Tempo Médio de Espera (minutos)"),
        type: "line",
        data: [
          { name: l(locale, "Sep", "Set"), value: 22 },
          { name: l(locale, "Oct", "Out"), value: 19 },
          { name: "Nov", value: 17 },
          { name: l(locale, "Dec", "Dez"), value: 15 },
          { name: l(locale, "Jan", "Jan"), value: 13 },
          { name: l(locale, "Feb", "Fev"), value: 11 },
        ],
      },
    ],
  },
  orchestration: {
    agents: [
      { name: l(locale, "Clinical Coordinator", "Coordenador Clínico"), role: l(locale, "Orchestrates patient flow and clinical workflows", "Orquestra fluxo de pacientes e fluxos clínicos"), avatar: "🩺", color: "blue", tasks: [l(locale, "Patient triage routing", "Roteamento de triagem"), l(locale, "Schedule optimization", "Otimização de agenda"), l(locale, "Care gap identification", "Identificação de lacunas de cuidado")] },
      { name: l(locale, "Scheduling Agent", "Agente de Agendamento"), role: l(locale, "Manages appointments and provider calendars", "Gerencia consultas e agendas médicas"), avatar: "📅", color: "emerald", tasks: [l(locale, "Appointment booking", "Agendamento de consultas"), l(locale, "Conflict resolution", "Resolução de conflitos"), l(locale, "Reminder dispatch", "Envio de lembretes")], reportsTo: l(locale, "Clinical Coordinator", "Coordenador Clínico") },
      { name: l(locale, "Rx Manager", "Gestor de Receitas"), role: l(locale, "Handles prescriptions, refills, and drug interactions", "Gerencia receitas, renovações e interações medicamentosas"), avatar: "💊", color: "violet", tasks: [l(locale, "Refill processing", "Processamento de renovações"), l(locale, "Interaction checking", "Verificação de interações"), l(locale, "Prior-auth for medications", "Autorização prévia de medicamentos")], reportsTo: l(locale, "Clinical Coordinator", "Coordenador Clínico") },
      { name: l(locale, "Insurance Agent", "Agente de Convênios"), role: l(locale, "Verifies eligibility and manages prior-authorizations", "Verifica elegibilidade e gerencia autorizações prévias"), avatar: "🛡️", color: "amber", tasks: [l(locale, "Eligibility verification", "Verificação de elegibilidade"), l(locale, "Prior-auth submission", "Envio de autorização prévia"), l(locale, "Claim status tracking", "Rastreamento de guias")], reportsTo: l(locale, "Clinical Coordinator", "Coordenador Clínico") },
      { name: l(locale, "Lab Analyst", "Analista Laboratorial"), role: l(locale, "Tracks lab orders and flags abnormal results", "Rastreia pedidos laboratoriais e sinaliza resultados anormais"), avatar: "🔬", color: "rose", tasks: [l(locale, "Order tracking", "Rastreamento de pedidos"), l(locale, "Critical value alerts", "Alertas de valores críticos"), l(locale, "Trend analysis", "Análise de tendências")], reportsTo: l(locale, "Clinical Coordinator", "Coordenador Clínico") },
      { name: l(locale, "Patient Comms", "Comunicação com Pacientes"), role: l(locale, "Manages patient-facing communications", "Gerencia comunicações com pacientes"), avatar: "💬", color: "cyan", tasks: [l(locale, "Portal messages", "Mensagens do portal"), l(locale, "SMS reminders", "Lembretes SMS"), l(locale, "Post-visit summaries", "Resumos pós-consulta")], reportsTo: l(locale, "Scheduling Agent", "Agente de Agendamento") },
      { name: l(locale, "Compliance Monitor", "Monitor de Conformidade"), role: l(locale, "Ensures HIPAA and regulatory compliance", "Garante conformidade com LGPD e regulamentações"), avatar: "📋", color: "slate", tasks: [l(locale, "Audit log review", "Revisão de logs de auditoria"), l(locale, "Access control monitoring", "Monitoramento de controle de acesso"), l(locale, "Incident reporting", "Relatório de incidentes")], reportsTo: l(locale, "Clinical Coordinator", "Coordenador Clínico") },
      { name: l(locale, "Billing Agent", "Agente de Faturamento"), role: l(locale, "Processes claims and manages revenue cycle", "Processa guias e gerencia ciclo de receita"), avatar: "💰", color: "green", tasks: [l(locale, "Claim submission", "Envio de guias"), l(locale, "Denial management", "Gestão de negativas"), l(locale, "Payment posting", "Registro de pagamentos")], reportsTo: l(locale, "Insurance Agent", "Agente de Convênios") },
    ],
    humanReviewPoints: [
      { agent: l(locale, "Rx Manager", "Gestor de Receitas"), task: l(locale, "Prescription approval for controlled substances", "Aprovação de receitas para substâncias controladas"), reason: l(locale, "DEA regulations require physician sign-off on all Schedule II-V prescriptions", "Regulamentações exigem assinatura médica em todas as receitas de substâncias controladas") },
      { agent: l(locale, "Insurance Agent", "Agente de Convênios"), task: l(locale, "Prior-auth clinical justification", "Justificativa clínica de autorização prévia"), reason: l(locale, "Clinical narrative must be reviewed by provider before payer submission", "A narrativa clínica deve ser revisada pelo médico antes do envio ao convênio") },
      { agent: l(locale, "Lab Analyst", "Analista Laboratorial"), task: l(locale, "Critical lab value escalation", "Escalação de valor laboratorial crítico"), reason: l(locale, "Abnormal critical values require immediate physician notification and clinical decision", "Valores críticos anormais requerem notificação médica imediata e decisão clínica") },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: channels.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? l(locale, "Access patient charts, scheduling, lab results, and clinical dashboards", "Acesse prontuários, agendamento, resultados de exames e dashboards clínicos") :
        ch.name === "WhatsApp" ? l(locale, "\"Dr. Patel, Mrs. Tanaka's MRI prior-auth was approved. Shall I schedule her?\"", "\"Dr. Patel, a autorização da ressonância da Sra. Tanaka foi aprovada. Devo agendar?\"") :
        ch.name === "Telegram" ? l(locale, "Quick view of today's patient schedule and urgent flags", "Visualização rápida da agenda de pacientes e alertas urgentes") :
        ch.name === "Discord" ? l(locale, "Clinical team coordination — discuss cases and share updates", "Coordenação da equipe clínica — discuta casos e compartilhe atualizações") :
        ch.name === "Slack" ? l(locale, "Use /schedule, /labs, or /rx to manage clinical tasks from Slack", "Use /agenda, /exames ou /receitas para gerenciar tarefas clínicas pelo Slack") :
        ch.name === "Email" ? l(locale, "Daily patient panel summary, pending tasks, and compliance alerts", "Resumo diário do painel de pacientes, tarefas pendentes e alertas de conformidade") :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("medflow-clinic", "https://medflow-clinic.vercel.app"),
    projectUrl: "https://medflow-clinic.vercel.app",
    stats: [
      { label: l(locale, "Patients Managed", "Pacientes Gerenciados"), value: "2,400+" },
      { label: l(locale, "Avg. Wait Reduction", "Redução Média de Espera"), value: "48%" },
      { label: l(locale, "Claims Auto-Filed", "Guias Auto-Enviadas"), value: "92%" },
      { label: l(locale, "HIPAA Compliance", "Conformidade LGPD"), value: "100%" },
    ],
  },
  };
}
