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
        { id: "hospital", name: l(locale, "Hospital Systems", "Sistemas Hospitalares"), emoji: "🏥" },
        { id: "urgent-care", name: l(locale, "Urgent Care", "Pronto-Socorro"), emoji: "🚑" },
        { id: "rehabilitation", name: l(locale, "Rehabilitation", "Reabilitação"), emoji: "🦽" },
        { id: "surgical-center", name: l(locale, "Surgical Centers", "Centros Cirúrgicos"), emoji: "🔪" },
        { id: "long-term-care", name: l(locale, "Long-Term Care", "Cuidados de Longa Duração"), emoji: "🏠" },
        { id: "behavioral-health", name: l(locale, "Behavioral Health", "Saúde Mental"), emoji: "🧠" },
      ],
      verticals: [
        { id: "bed-management", name: l(locale, "Bed & Capacity Management", "Gestão de Leitos e Capacidade") },
        { id: "staff-scheduling", name: l(locale, "Staff Scheduling", "Escala de Funcionários") },
        { id: "patient-flow", name: l(locale, "Patient Flow Optimization", "Otimização do Fluxo de Pacientes") },
        { id: "quality-metrics", name: l(locale, "Quality & Safety Metrics", "Métricas de Qualidade e Segurança") },
      ],
      features: [
        { id: "census-tracking", name: l(locale, "Real-Time Census Tracking", "Rastreamento de Censo em Tempo Real") },
        { id: "nurse-scheduling", name: l(locale, "Nurse Scheduling", "Escala de Enfermagem") },
        { id: "discharge-planning", name: l(locale, "Discharge Planning", "Planejamento de Alta") },
        { id: "incident-reporting", name: l(locale, "Incident Reporting", "Registro de Incidentes") },
        { id: "supply-management", name: l(locale, "Supply Chain Management", "Gestão da Cadeia de Suprimentos") },
        { id: "patient-satisfaction", name: l(locale, "Patient Satisfaction Surveys", "Pesquisas de Satisfação do Paciente") },
      ],
      autoSelections: {
        industry: "hospital",
        vertical: "bed-management",
        features: ["census-tracking", "nurse-scheduling", "discharge-planning", "incident-reporting"],
        autonomy: {
          "census-tracking": "full",
          "nurse-scheduling": "supervised",
          "discharge-planning": "supervised",
          "incident-reporting": "full",
          "supply-management": "full",
          "patient-satisfaction": "full",
        },
      },
      projectName: "CareHub Hospital",
      projectDescription: l(locale, "Enterprise hospital management platform with real-time census tracking, AI-driven staff scheduling, and predictive discharge planning.", "Plataforma corporativa de gestão hospitalar com rastreamento de censo em tempo real, escala de funcionários orientada por IA e planejamento preditivo de alta."),
    },

    // ─── Dashboard ─────────────────────────────────────────────────────
    dashboard: {
      projectName: "CareHub Hospital",
      projectBadge: l(locale, "Hospital Ops", "Operações Hospitalares"),
      projectDescription: l(locale, "Unify hospital operations across departments — real-time bed management, predictive staffing, and quality metric dashboards for multi-site health systems.", "Unifique as operações hospitalares entre departamentos — gestão de leitos em tempo real, escala preditiva e painéis de métricas de qualidade para sistemas de saúde multi-unidades."),
    },

    // ─── Chat ──────────────────────────────────────────────────────────
    chat: {
      script: [
        {
          role: "assistant",
          content: l(locale, "Good morning. Current hospital census: 312 of 340 beds occupied (91.8% capacity). ICU is at 96% — 24 of 25 beds filled. I've identified 8 patients across med-surg who meet discharge criteria within the next 12 hours.", "Bom dia. Censo hospitalar atual: 312 de 340 leitos ocupados (91,8% da capacidade). UTI está em 96% — 24 de 25 leitos preenchidos. Identifiquei 8 pacientes na clínica médica que atendem aos critérios de alta nas próximas 12 horas."),
        },
        {
          role: "user",
          content: l(locale, "We're expecting a surge from the ER — what's our capacity projection for the next 6 hours?", "Estamos esperando um pico do pronto-socorro — qual é a nossa projeção de capacidade para as próximas 6 horas?"),
        },
        {
          role: "assistant",
          content: l(locale, "Based on current ER volume (42 patients, 11 pending admission) and historical Thursday patterns, I project we'll need 18 additional beds by 4 PM. With the 8 anticipated discharges and 3 scheduled transfers to skilled nursing, net availability should be 13 beds. I recommend activating the surge protocol for the East Wing to cover the 5-bed gap.", "Com base no volume atual do PS (42 pacientes, 11 aguardando internação) e padrões históricos de quinta-feira, projeto que precisaremos de 18 leitos adicionais até as 16h. Com as 8 altas previstas e 3 transferências agendadas para enfermagem especializada, a disponibilidade líquida deve ser de 13 leitos. Recomendo ativar o protocolo de superlotação para a Ala Leste para cobrir o déficit de 5 leitos."),
        },
        {
          role: "user",
          content: l(locale, "Activate the surge protocol. Also, how's our nursing coverage for tonight's shift?", "Ative o protocolo de superlotação. E como está a cobertura de enfermagem para o plantão de hoje à noite?"),
        },
        {
          role: "assistant",
          content: l(locale, "Surge protocol activated for East Wing — environmental services has been notified to prep 6 beds. For tonight's night shift: we're staffed at 94% across units, but the Cardiac Step-Down unit is short 1 RN. I found two float pool nurses available — Sarah Kim (cardiac-certified, 4.8 rating) and Marcus Chen (general med-surg). I'd recommend Sarah given the unit specialization.", "Protocolo de superlotação ativado para a Ala Leste — a equipe de higienização foi notificada para preparar 6 leitos. Para o plantão noturno de hoje: estamos com 94% da equipe em todas as unidades, mas a Unidade de Cuidados Cardíacos está com 1 enfermeiro(a) a menos. Encontrei dois enfermeiros do pool flutuante disponíveis — Sarah Kim (certificada em cardiologia, nota 4.8) e Marcus Chen (clínica médica geral). Recomendo Sarah pela especialização da unidade."),
          action: {
            type: "approval",
            title: l(locale, "Assign Float Nurse to Cardiac Step-Down", "Designar Enfermeiro(a) Flutuante para Cuidados Cardíacos"),
            description: l(locale, "Assign Sarah Kim (RN, BSN, Cardiac-Certified) from float pool to Cardiac Step-Down Unit for tonight's night shift (7 PM – 7 AM). This fills the staffing gap and maintains required nurse-to-patient ratio of 1:4.", "Designar Sarah Kim (Enfermeira, BSN, Certificada em Cardiologia) do pool flutuante para a Unidade de Cuidados Cardíacos no plantão noturno de hoje (19h – 7h). Isso preenche a vaga e mantém a proporção enfermeiro-paciente exigida de 1:4."),
          },
        },
        {
          role: "user",
          content: l(locale, "Approve Sarah. What about the quality metrics for this week?", "Aprovar Sarah. E as métricas de qualidade desta semana?"),
        },
        {
          role: "assistant",
          content: l(locale, "Sarah is confirmed for tonight's shift. Here's the weekly quality snapshot:\n\n• **HCAHPS Score**: 4.2/5.0 (up from 4.0 last week)\n• **Falls**: 2 incidents (both low-harm, per protocol) — down from 5\n• **CLABSI Rate**: 0 this month (meeting Zero Harm target)\n• **Door-to-Bed Time**: Average 38 min (target: <45 min)\n• **30-Day Readmission**: 8.4% (below national avg of 11.2%)\n\nThe falls reduction is significant — the new bedside handoff protocol appears to be working. I've drafted a summary for the Patient Safety Committee meeting on Friday.", "Sarah está confirmada para o plantão de hoje. Veja o resumo semanal de qualidade:\n\n• **Pontuação HCAHPS**: 4,2/5,0 (subiu de 4,0 na semana passada)\n• **Quedas**: 2 incidentes (ambos de baixo dano, conforme protocolo) — queda de 5\n• **Taxa de CLABSI**: 0 neste mês (atingindo a meta Dano Zero)\n• **Tempo Porta-Leito**: Média de 38 min (meta: <45 min)\n• **Readmissão em 30 Dias**: 8,4% (abaixo da média nacional de 11,2%)\n\nA redução de quedas é significativa — o novo protocolo de passagem de plantão à beira do leito parece estar funcionando. Elaborei um resumo para a reunião do Comitê de Segurança do Paciente na sexta-feira."),
        },
        {
          role: "user",
          content: l(locale, "Great. Send the summary to the committee and remind me 30 minutes before the meeting.", "Ótimo. Envie o resumo para o comitê e me lembre 30 minutos antes da reunião."),
        },
        {
          role: "assistant",
          content: l(locale, "Done. The quality metrics summary has been distributed to the 9 Patient Safety Committee members, and I've set a reminder for you at 1:30 PM Friday. I've also flagged that Dr. Rodriguez requested an additional agenda item about the new sepsis screening protocol — I've added it to the meeting doc.", "Feito. O resumo de métricas de qualidade foi distribuído aos 9 membros do Comitê de Segurança do Paciente, e defini um lembrete para você às 13h30 de sexta-feira. Também sinalizei que o Dr. Rodriguez solicitou um item adicional na pauta sobre o novo protocolo de triagem de sepse — adicionei ao documento da reunião."),
        },
      ],
    },

    // ─── Voice ─────────────────────────────────────────────────────────
    voice: {
      transcript: [
        { speaker: "agent", text: l(locale, "Good morning. Here's your hospital operations briefing for Thursday, February 20th.", "Bom dia. Aqui está seu briefing de operações hospitalares para quinta-feira, 20 de fevereiro."), durationMs: 3400 },
        { speaker: "agent", text: l(locale, "Overall census is 312 of 340 beds, or 91.8% occupancy. ICU is near capacity at 96%. The Emergency Department currently has 42 patients, with 11 awaiting inpatient admission. Projected bed demand over the next 6 hours exceeds current availability by approximately 5 beds.", "O censo geral é de 312 de 340 leitos, ou 91,8% de ocupação. A UTI está próxima da capacidade em 96%. O Pronto-Socorro tem atualmente 42 pacientes, com 11 aguardando internação. A demanda projetada de leitos para as próximas 6 horas excede a disponibilidade atual em aproximadamente 5 leitos."), durationMs: 10200 },
        { speaker: "agent", text: l(locale, "Staffing: day shift is fully covered across all units. Night shift has one gap in Cardiac Step-Down — a float pool assignment is pending your approval. Overtime hours are trending 12% below last month, which is on track for the budget target.", "Equipe: o turno diurno está totalmente coberto em todas as unidades. O plantão noturno tem uma vaga na Unidade de Cuidados Cardíacos — uma designação do pool flutuante aguarda sua aprovação. As horas extras estão 12% abaixo do mês passado, o que está dentro da meta orçamentária."), durationMs: 9500 },
        { speaker: "agent", text: l(locale, "Quality update: zero hospital-acquired infections this week, HCAHPS trending upward at 4.2, and the Patient Safety Committee meets Friday at 2 PM. One supply alert — surgical glove inventory in OR Suite 3 is below par level. A reorder has been submitted automatically.", "Atualização de qualidade: zero infecções hospitalares esta semana, HCAHPS em tendência de alta em 4,2, e o Comitê de Segurança do Paciente se reúne sexta-feira às 14h. Um alerta de suprimentos — o estoque de luvas cirúrgicas na Sala Cirúrgica 3 está abaixo do nível mínimo. Um pedido de reposição foi enviado automaticamente."), durationMs: 10800 },
      ],
      summary: l(locale, "Briefing covered hospital census (91.8%), ER surge projections, staffing gaps in Cardiac Step-Down, quality metrics improvements, and a supply reorder for OR Suite 3.", "O briefing cobriu o censo hospitalar (91,8%), projeções de superlotação do PS, vagas de equipe nos Cuidados Cardíacos, melhorias nas métricas de qualidade e um pedido de reposição para a Sala Cirúrgica 3."),
    },

    // ─── Integrations ──────────────────────────────────────────────────
    integrations: {
      integrations: [
        { name: "Epic Cerner", icon: "heart-pulse", category: l(locale, "Clinical", "Clínico"), description: l(locale, "Hospital-wide EHR for clinical documentation, CPOE, and patient records", "Prontuário eletrônico hospitalar para documentação clínica, prescrição eletrônica e registros de pacientes") },
        { name: "TeleTracking", icon: "bed", category: l(locale, "Operations", "Operações"), description: l(locale, "Real-time bed management, patient flow, and transport coordination", "Gestão de leitos em tempo real, fluxo de pacientes e coordenação de transporte") },
        { name: "Kronos Workforce", icon: "clock", category: "HR", description: l(locale, "Nurse scheduling, time tracking, and labor analytics", "Escala de enfermagem, controle de ponto e análise de mão de obra") },
        { name: "Pyxis MedStation", icon: "pill", category: l(locale, "Pharmacy", "Farmácia"), description: l(locale, "Automated medication dispensing and controlled substance tracking", "Dispensação automatizada de medicamentos e rastreamento de substâncias controladas") },
        { name: "Press Ganey", icon: "star", category: l(locale, "Quality", "Qualidade"), description: l(locale, "Patient satisfaction surveys and HCAHPS score management", "Pesquisas de satisfação do paciente e gestão de pontuação HCAHPS") },
        { name: "RL Datix", icon: "alert-triangle", category: l(locale, "Safety", "Segurança"), description: l(locale, "Incident reporting, risk management, and safety event tracking", "Registro de incidentes, gestão de riscos e rastreamento de eventos de segurança") },
        { name: "GHX Supply Chain", icon: "package", category: l(locale, "Supply Chain", "Cadeia de Suprimentos"), description: l(locale, "Medical supply procurement, inventory management, and vendor contracts", "Compra de suprimentos médicos, gestão de estoque e contratos com fornecedores") },
        CI.googleEmail,
        CI.slack,
        CI.calendar,
        CI.twilio,
        CI.github,
        CI.vercel,
        CI.sentry,
        CI.analytics,
      ],
    },

    // ─── Build ─────────────────────────────────────────────────────────
    build: {
      checklist: [
        { title: l(locale, "Design real-time census data model with HL7 FHIR mapping", "Projetar modelo de dados de censo em tempo real com mapeamento HL7 FHIR"), stage: "plan", status: "complete" },
        { title: l(locale, "Define staffing ratio rules and scheduling constraints", "Definir regras de proporção de equipe e restrições de escala"), stage: "plan", status: "complete" },
        { title: l(locale, "Build live bed management dashboard with unit views", "Construir painel de gestão de leitos ao vivo com visão por unidade"), stage: "build", status: "complete" },
        { title: l(locale, "Implement nurse scheduling engine with float pool logic", "Implementar motor de escala de enfermagem com lógica de pool flutuante"), stage: "build", status: "complete" },
        { title: l(locale, "Create discharge prediction model using historical data", "Criar modelo de previsão de alta usando dados históricos"), stage: "build", status: "active" },
        { title: l(locale, "Build quality metrics dashboard with HCAHPS integration", "Construir painel de métricas de qualidade com integração HCAHPS"), stage: "build", status: "pending" },
        { title: l(locale, "Set up real-time alerting for capacity and safety events", "Configurar alertas em tempo real para eventos de capacidade e segurança"), stage: "launch", status: "pending" },
        { title: l(locale, "Deploy with HA configuration and disaster recovery plan", "Implantar com configuração de alta disponibilidade e plano de recuperação de desastres"), stage: "launch", status: "pending" },
      ],
      fileTree: [
        {
          name: "app", type: "folder", children: [
            { name: "layout.tsx", type: "file" },
            { name: "page.tsx", type: "file" },
            {
              name: "dashboard", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "census", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
                { name: "beds", type: "folder", children: [
                  { name: "page.tsx", type: "file" },
                  { name: "[unitId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
                ] },
                { name: "staffing", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
                { name: "quality", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
                { name: "incidents", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
                { name: "discharge", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ],
            },
            {
              name: "api", type: "folder", children: [
                { name: "census", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "beds", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "staffing", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "incidents", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "webhooks", type: "folder", children: [
                  { name: "hl7", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                  { name: "alerts", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                ] },
              ],
            },
          ],
        },
        {
          name: "lib", type: "folder", children: [
            { name: "hl7-parser.ts", type: "file" },
            { name: "bed-optimizer.ts", type: "file" },
            { name: "staff-scheduler.ts", type: "file" },
            { name: "discharge-predictor.ts", type: "file" },
          ],
        },
      ],
    },

    // ─── Knowledge ─────────────────────────────────────────────────────
    knowledge: {
      categories: [
        { name: l(locale, "Operational Protocols", "Protocolos Operacionais"), icon: "clipboard-list", count: 32 },
        { name: l(locale, "Regulatory Compliance", "Conformidade Regulatória"), icon: "shield", count: 28 },
        { name: l(locale, "Clinical Guidelines", "Diretrizes Clínicas"), icon: "heart-pulse", count: 45 },
        { name: l(locale, "Quality Standards", "Padrões de Qualidade"), icon: "award", count: 22 },
      ],
      documents: [
        { title: l(locale, "Hospital Surge Protocol", "Protocolo de Superlotação Hospitalar"), category: l(locale, "Operational Protocols", "Protocolos Operacionais"), tier: "index", lines: 95, crossRefs: [l(locale, "Bed Management SOP", "POP de Gestão de Leitos"), l(locale, "Emergency Department Overflow Plan", "Plano de Superlotação do Pronto-Socorro")] },
        { title: l(locale, "Bed Management SOP", "POP de Gestão de Leitos"), category: l(locale, "Operational Protocols", "Protocolos Operacionais"), tier: "detail", lines: 420 },
        { title: l(locale, "Emergency Department Overflow Plan", "Plano de Superlotação do Pronto-Socorro"), category: l(locale, "Operational Protocols", "Protocolos Operacionais"), tier: "detail", lines: 310 },
        { title: l(locale, "Joint Commission Readiness Guide", "Guia de Preparação Joint Commission"), category: l(locale, "Regulatory Compliance", "Conformidade Regulatória"), tier: "summary", lines: 240, crossRefs: [l(locale, "HCAHPS Survey Administration Protocol", "Protocolo de Administração da Pesquisa HCAHPS")] },
        { title: l(locale, "Nurse-to-Patient Ratio Requirements by State", "Requisitos de Proporção Enfermeiro-Paciente por Estado"), category: l(locale, "Regulatory Compliance", "Conformidade Regulatória"), tier: "detail", lines: 580 },
        { title: l(locale, "HCAHPS Survey Administration Protocol", "Protocolo de Administração da Pesquisa HCAHPS"), category: l(locale, "Quality Standards", "Padrões de Qualidade"), tier: "summary", lines: 165 },
        { title: l(locale, "Sepsis Screening Protocol (CMS SEP-1)", "Protocolo de Triagem de Sepse (CMS SEP-1)"), category: l(locale, "Clinical Guidelines", "Diretrizes Clínicas"), tier: "detail", lines: 390, crossRefs: [l(locale, "Hospital Surge Protocol", "Protocolo de Superlotação Hospitalar")] },
        { title: l(locale, "Falls Prevention Program Guide", "Guia do Programa de Prevenção de Quedas"), category: l(locale, "Quality Standards", "Padrões de Qualidade"), tier: "summary", lines: 210, crossRefs: [l(locale, "Joint Commission Readiness Guide", "Guia de Preparação Joint Commission")] },
      ],
    },

    // ─── Analytics ─────────────────────────────────────────────────────
    analytics: {
      charts: [
        {
          label: l(locale, "Bed Occupancy Rate (%)", "Taxa de Ocupação de Leitos (%)"),
          type: "line",
          data: [
            { name: l(locale, "Sep", "Set"), value: 84 },
            { name: l(locale, "Oct", "Out"), value: 87 },
            { name: "Nov", value: 91 },
            { name: l(locale, "Dec", "Dez"), value: 95 },
            { name: "Jan", value: 89 },
            { name: l(locale, "Feb", "Fev"), value: 92 },
          ],
        },
        {
          label: l(locale, "Overtime Hours by Department", "Horas Extras por Departamento"),
          type: "bar",
          data: [
            { name: "UTI", value: 186 },
            { name: l(locale, "Med-Surg", "Clínica Médica"), value: 142 },
            { name: "ER", value: 210 },
            { name: l(locale, "OR", "CC"), value: 98 },
            { name: l(locale, "L&D", "Obstetrícia"), value: 64 },
            { name: l(locale, "Rehab", "Reab."), value: 45 },
          ],
        },
      ],
    },
    orchestration: {
      agents: [
        { name: l(locale, "Operations Commander", "Comandante de Operações"), role: l(locale, "Orchestrates hospital-wide operations and resource allocation", "Orquestra as operações hospitalares e a alocação de recursos"), avatar: "🏥", color: "blue", tasks: [l(locale, "Census management", "Gestão de censo"), l(locale, "Surge protocol activation", "Ativação do protocolo de superlotação"), l(locale, "Cross-department coordination", "Coordenação entre departamentos")] },
        { name: l(locale, "Bed Manager", "Gestor de Leitos"), role: l(locale, "Optimizes bed assignments and patient placement", "Otimiza a atribuição de leitos e o posicionamento de pacientes"), avatar: "🛏️", color: "emerald", tasks: [l(locale, "Bed assignment optimization", "Otimização de atribuição de leitos"), l(locale, "Transfer coordination", "Coordenação de transferências"), l(locale, "Housekeeping dispatch", "Despacho de higienização")], reportsTo: l(locale, "Operations Commander", "Comandante de Operações") },
        { name: l(locale, "Staffing Coordinator", "Coordenador de Equipe"), role: l(locale, "Manages nurse scheduling and float pool assignments", "Gerencia a escala de enfermagem e designações do pool flutuante"), avatar: "👩‍⚕️", color: "violet", tasks: [l(locale, "Shift scheduling", "Escala de turnos"), l(locale, "Float pool deployment", "Designação de pool flutuante"), l(locale, "Overtime monitoring", "Monitoramento de horas extras")], reportsTo: l(locale, "Operations Commander", "Comandante de Operações") },
        { name: l(locale, "Discharge Planner", "Planejador de Alta"), role: l(locale, "Predicts and facilitates patient discharges", "Prevê e facilita as altas dos pacientes"), avatar: "📋", color: "amber", tasks: [l(locale, "Discharge readiness scoring", "Pontuação de prontidão para alta"), l(locale, "Care transition plans", "Planos de transição de cuidados"), l(locale, "Follow-up scheduling", "Agendamento de acompanhamento")], reportsTo: l(locale, "Operations Commander", "Comandante de Operações") },
        { name: l(locale, "Quality Sentinel", "Sentinela de Qualidade"), role: l(locale, "Monitors patient safety and quality indicators", "Monitora indicadores de segurança do paciente e qualidade"), avatar: "⭐", color: "rose", tasks: [l(locale, "Incident tracking", "Rastreamento de incidentes"), l(locale, "HCAHPS monitoring", "Monitoramento HCAHPS"), l(locale, "Compliance audits", "Auditorias de conformidade")], reportsTo: l(locale, "Operations Commander", "Comandante de Operações") },
        { name: l(locale, "Supply Agent", "Agente de Suprimentos"), role: l(locale, "Tracks inventory levels and automates reorders", "Rastreia níveis de estoque e automatiza pedidos de reposição"), avatar: "📦", color: "cyan", tasks: [l(locale, "Par level monitoring", "Monitoramento de nível mínimo"), l(locale, "Auto-reorder triggers", "Gatilhos de reposição automática"), l(locale, "Vendor management", "Gestão de fornecedores")], reportsTo: l(locale, "Operations Commander", "Comandante de Operações") },
        { name: l(locale, "ED Flow Agent", "Agente de Fluxo do PS"), role: l(locale, "Manages emergency department throughput", "Gerencia o fluxo do pronto-socorro"), avatar: "🚑", color: "red", tasks: [l(locale, "Triage queue optimization", "Otimização da fila de triagem"), l(locale, "Admission bed requests", "Solicitações de leito para internação"), l(locale, "Wait time management", "Gestão de tempo de espera")], reportsTo: l(locale, "Bed Manager", "Gestor de Leitos") },
        { name: l(locale, "Transport Agent", "Agente de Transporte"), role: l(locale, "Coordinates patient transport across facilities", "Coordena o transporte de pacientes entre unidades"), avatar: "🚶", color: "slate", tasks: [l(locale, "Transport dispatch", "Despacho de transporte"), l(locale, "Route optimization", "Otimização de rotas"), l(locale, "Equipment tracking", "Rastreamento de equipamentos")], reportsTo: l(locale, "Bed Manager", "Gestor de Leitos") },
        { name: l(locale, "Compliance Reporter", "Relator de Conformidade"), role: l(locale, "Generates regulatory reports and audit documentation", "Gera relatórios regulatórios e documentação de auditoria"), avatar: "📊", color: "green", tasks: [l(locale, "CMS reporting", "Relatórios CMS"), l(locale, "State survey prep", "Preparação para vistorias estaduais"), l(locale, "Joint Commission documentation", "Documentação Joint Commission")], reportsTo: l(locale, "Quality Sentinel", "Sentinela de Qualidade") },
      ],
      humanReviewPoints: [
        { agent: l(locale, "Staffing Coordinator", "Coordenador de Equipe"), task: l(locale, "Mandatory overtime assignment", "Designação obrigatória de hora extra"), reason: l(locale, "Labor agreements require nurse manager approval before mandating overtime shifts", "Acordos trabalhistas exigem aprovação do gestor de enfermagem antes de obrigar turnos de hora extra") },
        { agent: l(locale, "Discharge Planner", "Planejador de Alta"), task: l(locale, "Against-medical-advice discharge", "Alta contra orientação médica"), reason: l(locale, "AMA discharges require physician review and patient risk acknowledgment documentation", "Altas contra orientação médica exigem revisão médica e documentação de reconhecimento de risco do paciente") },
        { agent: l(locale, "Quality Sentinel", "Sentinela de Qualidade"), task: l(locale, "Sentinel event escalation", "Escalação de evento sentinela"), reason: l(locale, "Serious safety events require immediate executive review and root cause analysis initiation", "Eventos graves de segurança exigem revisão executiva imediata e início de análise de causa raiz") },
      ],
    },

    // ─── Channels ──────────────────────────────────────────────────────
    channels: {
      channels: channels.map((ch) => ({
        ...ch,
        previewMessage:
          ch.name === "Web Portal" ? l(locale, "Full hospital command center — census, staffing, quality, and supply dashboards", "Centro de comando hospitalar completo — painéis de censo, equipe, qualidade e suprimentos") :
          ch.name === "WhatsApp" ? l(locale, "\"ICU bed 14 is available. Transfer from ER for Mr. Johnson is ready to proceed.\"", "\"Leito 14 da UTI está disponível. Transferência do PS para o Sr. Johnson está pronta para prosseguir.\"") :
          ch.name === "Telegram" ? l(locale, "Real-time bed availability and staffing alerts on the go", "Disponibilidade de leitos em tempo real e alertas de equipe em movimento") :
          ch.name === "Discord" ? l(locale, "Department coordination channels for charge nurses and house supervisors", "Canais de coordenação departamental para enfermeiros-chefe e supervisores") :
          ch.name === "Slack" ? l(locale, "Use /census, /beds, or /staff to pull live hospital data from any channel", "Use /census, /beds ou /staff para consultar dados hospitalares ao vivo de qualquer canal") :
          ch.name === "Email" ? l(locale, "Shift handoff summaries, quality reports, and compliance notifications", "Resumos de passagem de plantão, relatórios de qualidade e notificações de conformidade") :
          ch.previewMessage,
      })),
    },

    // ─── Deploy ────────────────────────────────────────────────────────
    deploy: {
      terminalLines: makeDeployTerminal("carehub-hospital", "https://carehub-hospital.vercel.app"),
      projectUrl: "https://carehub-hospital.vercel.app",
      stats: [
        { label: l(locale, "Beds Managed", "Leitos Gerenciados"), value: "340" },
        { label: l(locale, "Avg. Discharge Time", "Tempo Médio de Alta"), value: "-2.1 hrs" },
        { label: l(locale, "Staff Utilization", "Utilização da Equipe"), value: "94%" },
        { label: l(locale, "Patient Satisfaction", "Satisfação do Paciente"), value: "4.2/5" },
      ],
    },
  };
}
