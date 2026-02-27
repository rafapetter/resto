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
        { id: "freight-forwarding", name: l(locale, "Freight Forwarding", "Agenciamento de Cargas"), emoji: "🚢" },
        { id: "ocean-freight", name: l(locale, "Ocean Freight", "Frete Marítimo"), emoji: "🌊" },
        { id: "air-cargo", name: l(locale, "Air Cargo", "Carga Aérea"), emoji: "✈️" },
        { id: "customs-brokerage", name: l(locale, "Customs Brokerage", "Despacho Aduaneiro"), emoji: "🛃" },
        { id: "warehousing", name: l(locale, "Warehousing", "Armazenagem"), emoji: "🏭" },
        { id: "intermodal-transport", name: l(locale, "Intermodal Transport", "Transporte Intermodal"), emoji: "🚛" },
      ],
      verticals: [
        { id: "shipment-tracking", name: l(locale, "Shipment Tracking", "Rastreamento de Embarques") },
        { id: "customs-compliance", name: l(locale, "Customs Compliance", "Conformidade Aduaneira") },
        { id: "rate-management", name: l(locale, "Rate Management", "Gestão de Tarifas") },
        { id: "warehouse-operations", name: l(locale, "Warehouse Operations", "Operações de Armazém") },
      ],
      features: [
        { id: "bol-awb-generation", name: l(locale, "BOL/AWB Generation", "Geração de BL/AWB") },
        { id: "container-tracking", name: l(locale, "Container Tracking", "Rastreamento de Contêineres") },
        { id: "customs-declaration", name: l(locale, "Customs Declaration", "Declaração Aduaneira") },
        { id: "rate-quoting", name: l(locale, "Rate Quoting", "Cotação de Frete") },
        { id: "document-management", name: l(locale, "Document Management", "Gestão de Documentos") },
        { id: "cargo-insurance", name: l(locale, "Cargo Insurance", "Seguro de Carga") },
      ],
      autoSelections: {
        industry: "freight-forwarding",
        vertical: "shipment-tracking",
        features: ["bol-awb-generation", "container-tracking", "customs-declaration", "rate-quoting"],
        autonomy: {
          "bol-awb-generation": "full",
          "container-tracking": "full",
          "customs-declaration": "supervised",
          "rate-quoting": "supervised",
          "document-management": "full",
          "cargo-insurance": "supervised",
        },
      },
      projectName: "CargoFlow Global",
      projectDescription: l(locale, "AI-powered freight forwarding platform with real-time container tracking, automated customs declarations, and intelligent rate optimization across ocean, air, and intermodal lanes.", "Plataforma de agenciamento de cargas com IA, rastreamento de contêineres em tempo real, declarações aduaneiras automatizadas e otimização inteligente de tarifas em rotas marítimas, aéreas e intermodais."),
    },

    // ─── Dashboard ─────────────────────────────────────────────────────
    dashboard: {
      projectName: "CargoFlow Global",
      projectBadge: l(locale, "Freight Forwarding", "Agenciamento de Cargas"),
      projectDescription: l(locale, "Orchestrate global shipments with AI-driven container tracking, automated customs filings, dynamic rate quoting, and end-to-end document management.", "Orquestre embarques globais com rastreamento de contêineres orientado por IA, declarações aduaneiras automatizadas, cotação dinâmica de frete e gestão de documentos de ponta a ponta."),
    },

    // ─── Chat ──────────────────────────────────────────────────────────
    chat: {
      script: [
        {
          role: "assistant",
          content: l(locale, "Good morning. You have 47 active shipments in transit today. Container MSCU-7294810 on the Maersk Valencia is currently held at Long Beach — customs has flagged an HTS classification discrepancy on the ceramics consignment. Two booking confirmations are pending your review, and Nakamura Trading is requesting a rate quote for 3x40HC Shanghai to Rotterdam.", "Bom dia. Você tem 47 embarques ativos em trânsito hoje. O contêiner MSCU-7294810 no Maersk Valencia está retido em Long Beach — a alfândega sinalizou uma discrepância na classificação HTS da remessa de cerâmicas. Duas confirmações de reserva aguardam sua revisão, e a Nakamura Trading está solicitando uma cotação para 3x40HC de Shanghai para Roterdã."),
        },
        {
          role: "user",
          content: l(locale, "What's the issue with the ceramics container? And what's the current ETA on the Maersk Valencia?", "Qual é o problema com o contêiner de cerâmicas? E qual é a previsão de chegada atual do Maersk Valencia?"),
        },
        {
          role: "assistant",
          content: l(locale, "Container MSCU-7294810 — the CBP system flagged HTS code 6911.10 (porcelain tableware) but the commercial invoice lists the goods as \"decorative ceramic tiles,\" which should fall under 6907.40. The duty rate difference is 4.5% vs 8.7%. The original shipper in Foshan likely used the wrong classification. The Maersk Valencia arrived at Long Beach on Feb 18 but the container won't be released until the classification is corrected. I can prepare an amended entry with the correct HTS code and supporting product specs. Want me to proceed?", "Contêiner MSCU-7294810 — o sistema CBP sinalizou o código HTS 6911.10 (louça de porcelana), mas a fatura comercial lista os produtos como \"azulejos decorativos de cerâmica\", que deveriam estar classificados sob 6907.40. A diferença na alíquota é de 4,5% vs 8,7%. O exportador original em Foshan provavelmente usou a classificação errada. O Maersk Valencia chegou em Long Beach em 18/fev, mas o contêiner não será liberado até a classificação ser corrigida. Posso preparar uma retificação com o código HTS correto e as especificações do produto. Deseja que eu prossiga?"),
        },
        {
          role: "user",
          content: l(locale, "Yes, file the amendment. Also, what about Nakamura's rate request? Give me the best options for Shanghai to Rotterdam, 3x40HC, sailing within the next 10 days.", "Sim, registre a retificação. E sobre o pedido de cotação da Nakamura? Me dê as melhores opções para Shanghai a Roterdã, 3x40HC, saindo nos próximos 10 dias."),
        },
        {
          role: "assistant",
          content: l(locale, "I'm preparing the amended customs entry now. For Nakamura Trading's Shanghai-Rotterdam lane, here are the top 3 options:\n\n1. **MSC Isabella** — ETD Feb 24, ETA Mar 28 (32 days). Rate: $2,180/40HC. Via Tanjung Pelepas.\n2. **CMA CGM Marco Polo** — ETD Feb 26, ETA Mar 26 (28 days). Rate: $2,450/40HC. Direct service.\n3. **Evergreen Triton** — ETD Mar 1, ETA Apr 2 (32 days). Rate: $1,920/40HC. Via Colombo.\n\nThe CMA CGM direct service saves 4 transit days but costs $810 more across 3 containers. Based on Nakamura's usual preference for speed, I'd recommend option 2. Shall I send the quote and lock in the booking?", "Estou preparando a retificação aduaneira agora. Para a rota Shanghai-Roterdã da Nakamura Trading, aqui estão as 3 melhores opções:\n\n1. **MSC Isabella** — Saída 24/fev, Chegada 28/mar (32 dias). Tarifa: $2.180/40HC. Via Tanjung Pelepas.\n2. **CMA CGM Marco Polo** — Saída 26/fev, Chegada 26/mar (28 dias). Tarifa: $2.450/40HC. Serviço direto.\n3. **Evergreen Triton** — Saída 1/mar, Chegada 2/abr (32 dias). Tarifa: $1.920/40HC. Via Colombo.\n\nO serviço direto da CMA CGM economiza 4 dias de trânsito, mas custa $810 a mais nos 3 contêineres. Com base na preferência habitual da Nakamura por velocidade, recomendo a opção 2. Deseja que eu envie a cotação e confirme a reserva?"),
        },
        {
          role: "user",
          content: l(locale, "Go with CMA CGM. Send the quote to Nakamura and draft the booking confirmation. Also make sure the BOL is prepped once they confirm.", "Vá com a CMA CGM. Envie a cotação para a Nakamura e prepare a confirmação de reserva. E garanta que o BL esteja pronto assim que confirmarem."),
        },
        {
          role: "assistant",
          content: l(locale, "Done. I've sent the rate quote to Nakamura Trading at hiroshi.tanaka@nakamura-trading.co.jp with the CMA CGM Marco Polo details. Booking reference CMQ-2026-88412 is held until Feb 22 pending their confirmation. I've pre-populated the Bill of Lading template with shipper/consignee details, container specs, and the Shanghai Yangshan terminal cutoff (Feb 25, 16:00 CST). One more item — the cargo insurance certificate for the Apex Industries shipment on voyage HMM-4471 expires tomorrow. The policy needs renewal before the vessel reaches Busan.", "Feito. Enviei a cotação para a Nakamura Trading em hiroshi.tanaka@nakamura-trading.co.jp com os detalhes do CMA CGM Marco Polo. A referência de reserva CMQ-2026-88412 está mantida até 22/fev aguardando confirmação. Pré-preenchi o modelo de Conhecimento de Embarque com dados do exportador/importador, especificações dos contêineres e o cutoff do terminal Shanghai Yangshan (25/fev, 16:00 CST). Mais um item — o certificado de seguro de carga da Apex Industries na viagem HMM-4471 expira amanhã. A apólice precisa ser renovada antes que o navio chegue a Busan."),
          action: {
            type: "approval",
            title: l(locale, "Renew Cargo Insurance Policy", "Renovar Apólice de Seguro de Carga"),
            description: l(locale, "Renew marine cargo insurance for Apex Industries shipment (HMM-4471, 2x20GP, auto parts valued at $184,000). Current policy with TK Marine Underwriters expires Feb 21. Renewal premium: $1,380. Coverage: ICC(A) all-risk, warehouse-to-warehouse.", "Renovar seguro de carga marítima para o embarque da Apex Industries (HMM-4471, 2x20GP, autopeças avaliadas em $184.000). Apólice atual com TK Marine Underwriters expira em 21/fev. Prêmio de renovação: $1.380. Cobertura: ICC(A) todos os riscos, armazém a armazém."),
          },
        },
      ],
    },

    // ─── Voice ─────────────────────────────────────────────────────────
    voice: {
      transcript: [
        { speaker: "agent", text: l(locale, "Good morning. Here's your freight operations briefing for today, February 20th.", "Bom dia. Aqui está seu briefing de operações de frete para hoje, 20 de fevereiro."), durationMs: 3200 },
        { speaker: "agent", text: l(locale, "You have 47 shipments in transit across 12 ocean carriers and 3 air cargo operators. Six containers are expected at Long Beach today, with two requiring same-day customs clearance. The Maersk Valencia shipment is on customs hold due to an HTS classification issue — I've prepared an amended entry for your review.", "Você tem 47 embarques em trânsito com 12 armadores marítimos e 3 operadores de carga aérea. Seis contêineres são esperados em Long Beach hoje, sendo que dois precisam de desembaraço aduaneiro no mesmo dia. O embarque do Maersk Valencia está retido na alfândega devido a um problema de classificação HTS — preparei uma retificação para sua revisão."), durationMs: 9800 },
        { speaker: "agent", text: l(locale, "Three booking requests came in overnight: Nakamura Trading needs 3x40HC Shanghai to Rotterdam, GlobalTech wants air freight for 2 pallets of server equipment Shenzhen to Chicago O'Hare, and Meridian Foods has a reefer container of frozen seafood from Oslo to Yokohama. I've compiled rate options for each.", "Três solicitações de reserva chegaram durante a noite: Nakamura Trading precisa de 3x40HC Shanghai para Roterdã, GlobalTech quer frete aéreo para 2 pallets de equipamentos de servidor Shenzhen para Chicago O'Hare, e Meridian Foods tem um contêiner reefer de frutos do mar congelados de Oslo para Yokohama. Compilei opções de tarifa para cada um."), durationMs: 10200 },
        { speaker: "agent", text: l(locale, "Administrative items: four Bills of Lading are pending your signature, the Apex Industries cargo insurance expires tomorrow and needs renewal, and your quarterly CTPAT compliance audit is due by end of month. Shall I prioritize the customs amendment first?", "Itens administrativos: quatro Conhecimentos de Embarque aguardam sua assinatura, o seguro de carga da Apex Industries expira amanhã e precisa de renovação, e sua auditoria trimestral de conformidade CTPAT vence no final do mês. Devo priorizar a retificação aduaneira primeiro?"), durationMs: 9400 },
      ],
      summary: l(locale, "Morning briefing covered 47 active shipments, customs hold on MSCU-7294810 requiring HTS amendment, 3 overnight booking requests (ocean and air), 4 pending BOLs, an expiring cargo insurance policy, and an upcoming CTPAT compliance audit.", "O briefing matinal cobriu 47 embarques ativos, retenção aduaneira do MSCU-7294810 exigindo retificação HTS, 3 solicitações de reserva noturnas (marítimo e aéreo), 4 BLs pendentes, uma apólice de seguro de carga expirando e uma auditoria de conformidade CTPAT próxima."),
    },

    // ─── Integrations ──────────────────────────────────────────────────
    integrations: {
      integrations: [
        { name: "CargoWise One", icon: "ship", category: "TMS", description: l(locale, "End-to-end freight management, customs entries, and accounting integration", "Gestão de frete de ponta a ponta, declarações aduaneiras e integração contábil") },
        { name: "Flexport API", icon: "package", category: l(locale, "Logistics", "Logística"), description: l(locale, "Digital freight booking, tracking, and supply chain visibility", "Reserva de frete digital, rastreamento e visibilidade da cadeia de suprimentos") },
        { name: "AES/ABI Direct", icon: "shield-check", category: l(locale, "Customs", "Alfândega"), description: l(locale, "Electronic customs filing for export declarations and import entries", "Declaração aduaneira eletrônica para exportações e importações") },
        { name: "MarineTraffic", icon: "navigation", category: l(locale, "Tracking", "Rastreamento"), description: l(locale, "Real-time vessel AIS tracking, port calls, and ETA predictions", "Rastreamento AIS de navios em tempo real, escalas portuárias e previsões de ETA") },
        { name: "Port Community System", icon: "building-2", category: l(locale, "Port Ops", "Operações Portuárias"), description: l(locale, "Terminal appointments, container availability, and gate transactions", "Agendamentos no terminal, disponibilidade de contêineres e transações de portão") },
        { name: "INTTRA / CargoSmart", icon: "globe", category: l(locale, "Ocean", "Marítimo"), description: l(locale, "Carrier booking, shipping instructions, and ocean bill of lading management", "Reserva com armadores, instruções de embarque e gestão de conhecimento de embarque marítimo") },
        CI.googleEmail,
        CI.calendar,
        CI.slack,
        CI.stripe,
        CI.github,
        CI.vercel,
        CI.sentry,
        CI.analytics,
      ],
    },

    // ─── Build ─────────────────────────────────────────────────────────
    build: {
      checklist: [
        { title: l(locale, "Define shipment data schema & multi-modal transport model", "Definir schema de dados de embarque e modelo de transporte multimodal"), stage: "plan", status: "complete" },
        { title: l(locale, "Map carrier API integrations (ocean, air, ground)", "Mapear integrações de API de transportadoras (marítimo, aéreo, terrestre)"), stage: "plan", status: "complete" },
        { title: l(locale, "Build container tracking engine with AIS & milestone events", "Construir motor de rastreamento de contêineres com AIS e eventos de marco"), stage: "build", status: "complete" },
        { title: l(locale, "Implement customs declaration workflow with AES/ABI filing", "Implementar fluxo de declaração aduaneira com registro AES/ABI"), stage: "build", status: "complete" },
        { title: l(locale, "Create rate management system with dynamic quoting", "Criar sistema de gestão de tarifas com cotação dinâmica"), stage: "build", status: "active" },
        { title: l(locale, "Build document generation pipeline (BOL, AWB, packing lists)", "Construir pipeline de geração de documentos (BL, AWB, packing lists)"), stage: "build", status: "pending" },
        { title: l(locale, "Configure role-based access & audit trail logging", "Configurar acesso baseado em perfis e registro de trilha de auditoria"), stage: "launch", status: "pending" },
        { title: l(locale, "Deploy with carrier sandbox testing and go-live validation", "Implantar com testes em sandbox de transportadoras e validação de go-live"), stage: "launch", status: "pending" },
      ],
      fileTree: [
        {
          name: "app", type: "folder", children: [
            { name: "layout.tsx", type: "file" },
            { name: "page.tsx", type: "file" },
            {
              name: "dashboard", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "shipments", type: "folder", children: [
                  { name: "page.tsx", type: "file" },
                  { name: "[shipmentId]", type: "folder", children: [
                    { name: "page.tsx", type: "file" },
                    { name: "tracking.tsx", type: "file" },
                    { name: "documents.tsx", type: "file" },
                  ] },
                ] },
                { name: "bookings", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
                { name: "customs", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
                { name: "rates", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
                { name: "warehouse", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ],
            },
            {
              name: "api", type: "folder", children: [
                { name: "shipments", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "bookings", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "customs", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "tracking", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "rates", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "documents", type: "folder", children: [
                  { name: "bol", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                  { name: "awb", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                ] },
                { name: "webhooks", type: "folder", children: [
                  { name: "carrier-events", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                  { name: "customs-status", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                  { name: "port-updates", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                ] },
              ],
            },
            { name: "portal", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "track", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "quotes", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ] },
          ],
        },
        {
          name: "lib", type: "folder", children: [
            { name: "carrier-client.ts", type: "file" },
            { name: "customs-filing.ts", type: "file" },
            { name: "ais-tracker.ts", type: "file" },
            { name: "rate-engine.ts", type: "file" },
            { name: "document-gen.ts", type: "file" },
          ],
        },
      ],
    },

    // ─── Knowledge ─────────────────────────────────────────────────────
    knowledge: {
      categories: [
        { name: l(locale, "Incoterms & Trade Rules", "Incoterms e Regras de Comércio"), icon: "scale", count: 22 },
        { name: l(locale, "Customs Regulations", "Regulamentações Aduaneiras"), icon: "shield", count: 38 },
        { name: l(locale, "Tariff Classifications", "Classificações Tarifárias"), icon: "file-text", count: 45 },
        { name: l(locale, "Carrier Agreements", "Acordos com Transportadoras"), icon: "handshake", count: 28 },
        { name: l(locale, "Dangerous Goods Regs", "Regulamentações de Cargas Perigosas"), icon: "alert-triangle", count: 16 },
      ],
      documents: [
        { title: l(locale, "Incoterms 2020 Complete Guide", "Guia Completo de Incoterms 2020"), category: l(locale, "Incoterms & Trade Rules", "Incoterms e Regras de Comércio"), tier: "index", lines: 120, crossRefs: [l(locale, "FOB vs CIF Decision Matrix", "Matriz de Decisão FOB vs CIF"), l(locale, "Carrier Liability by Incoterm", "Responsabilidade da Transportadora por Incoterm")] },
        { title: l(locale, "FOB vs CIF Decision Matrix", "Matriz de Decisão FOB vs CIF"), category: l(locale, "Incoterms & Trade Rules", "Incoterms e Regras de Comércio"), tier: "detail", lines: 280 },
        { title: l(locale, "Carrier Liability by Incoterm", "Responsabilidade da Transportadora por Incoterm"), category: l(locale, "Incoterms & Trade Rules", "Incoterms e Regras de Comércio"), tier: "detail", lines: 195 },
        { title: l(locale, "US Customs Entry Procedures (CBP)", "Procedimentos de Entrada Aduaneira dos EUA (CBP)"), category: l(locale, "Customs Regulations", "Regulamentações Aduaneiras"), tier: "summary", lines: 210, crossRefs: [l(locale, "HTS Classification Handbook", "Manual de Classificação HTS"), l(locale, "AES Filing Requirements", "Requisitos de Declaração AES")] },
        { title: l(locale, "HTS Classification Handbook", "Manual de Classificação HTS"), category: l(locale, "Tariff Classifications", "Classificações Tarifárias"), tier: "index", lines: 150, crossRefs: [l(locale, "Duty Rate Schedule 2026", "Tabela de Alíquotas 2026"), l(locale, "Anti-Dumping & CVD Orders", "Ordens Antidumping e de Direitos Compensatórios")] },
        { title: l(locale, "Duty Rate Schedule 2026", "Tabela de Alíquotas 2026"), category: l(locale, "Tariff Classifications", "Classificações Tarifárias"), tier: "detail", lines: 920 },
        { title: l(locale, "Anti-Dumping & CVD Orders", "Ordens Antidumping e de Direitos Compensatórios"), category: l(locale, "Tariff Classifications", "Classificações Tarifárias"), tier: "detail", lines: 480 },
        { title: l(locale, "AES Filing Requirements", "Requisitos de Declaração AES"), category: l(locale, "Customs Regulations", "Regulamentações Aduaneiras"), tier: "detail", lines: 310 },
        { title: l(locale, "IMDG Code Summary — Dangerous Goods by Sea", "Resumo do Código IMDG — Cargas Perigosas por Via Marítima"), category: l(locale, "Dangerous Goods Regs", "Regulamentações de Cargas Perigosas"), tier: "summary", lines: 260, crossRefs: [l(locale, "IATA DGR Air Cargo Provisions", "Disposições IATA DGR para Carga Aérea")] },
        { title: l(locale, "IATA DGR Air Cargo Provisions", "Disposições IATA DGR para Carga Aérea"), category: l(locale, "Dangerous Goods Regs", "Regulamentações de Cargas Perigosas"), tier: "detail", lines: 340 },
      ],
    },

    // ─── Analytics ─────────────────────────────────────────────────────
    analytics: {
      charts: [
        {
          label: l(locale, "Shipment Volume (Last 6 Months)", "Volume de Embarques (Últimos 6 Meses)"),
          type: "bar",
          data: [
            { name: l(locale, "Sep", "Set"), value: 1842 },
            { name: l(locale, "Oct", "Out"), value: 2105 },
            { name: "Nov", value: 2380 },
            { name: l(locale, "Dec", "Dez"), value: 1965 },
            { name: "Jan", value: 2240 },
            { name: l(locale, "Feb", "Fev"), value: 2468 },
          ],
        },
        {
          label: l(locale, "On-Time Delivery Rate (%)", "Taxa de Entrega no Prazo (%)"),
          type: "line",
          data: [
            { name: l(locale, "Sep", "Set"), value: 88 },
            { name: l(locale, "Oct", "Out"), value: 91 },
            { name: "Nov", value: 89 },
            { name: l(locale, "Dec", "Dez"), value: 93 },
            { name: "Jan", value: 95 },
            { name: l(locale, "Feb", "Fev"), value: 96 },
          ],
        },
      ],
    },
    orchestration: {
      agents: [
        { name: l(locale, "Operations Manager", "Gerente de Operações"), role: l(locale, "Orchestrates end-to-end freight operations and shipment lifecycle", "Orquestra as operações de frete de ponta a ponta e o ciclo de vida dos embarques"), avatar: "🚢", color: "blue", tasks: [l(locale, "Shipment prioritization", "Priorização de embarques"), l(locale, "Exception management", "Gestão de exceções"), l(locale, "Carrier coordination", "Coordenação com transportadoras")] },
        { name: l(locale, "Booking Agent", "Agente de Reservas"), role: l(locale, "Manages carrier bookings, space allocation, and sailing schedules", "Gerencia reservas com armadores, alocação de espaço e programações de navegação"), avatar: "📋", color: "emerald", tasks: [l(locale, "Booking confirmation", "Confirmação de reservas"), l(locale, "Space allocation", "Alocação de espaço"), l(locale, "Schedule optimization", "Otimização de programações")], reportsTo: l(locale, "Operations Manager", "Gerente de Operações") },
        { name: l(locale, "Customs Agent", "Agente Aduaneiro"), role: l(locale, "Handles customs declarations, HTS classification, and regulatory compliance", "Processa declarações aduaneiras, classificação HTS e conformidade regulatória"), avatar: "🛃", color: "violet", tasks: [l(locale, "Entry filing", "Registro de declarações"), l(locale, "HTS classification", "Classificação HTS"), l(locale, "Duty calculation", "Cálculo de impostos")], reportsTo: l(locale, "Operations Manager", "Gerente de Operações") },
        { name: l(locale, "Tracking Agent", "Agente de Rastreamento"), role: l(locale, "Monitors real-time container and cargo positions across all modes", "Monitora posições de contêineres e cargas em tempo real em todos os modais"), avatar: "📡", color: "amber", tasks: [l(locale, "AIS vessel tracking", "Rastreamento AIS de navios"), l(locale, "Milestone updates", "Atualizações de marcos"), l(locale, "ETA prediction", "Previsão de ETA")], reportsTo: l(locale, "Operations Manager", "Gerente de Operações") },
        { name: l(locale, "Document Agent", "Agente de Documentos"), role: l(locale, "Generates and manages shipping documents — BOL, AWB, packing lists, COO", "Gera e gerencia documentos de embarque — BL, AWB, packing lists, COO"), avatar: "📄", color: "rose", tasks: [l(locale, "BOL generation", "Geração de BL"), l(locale, "AWB preparation", "Preparação de AWB"), l(locale, "Document validation", "Validação de documentos")], reportsTo: l(locale, "Operations Manager", "Gerente de Operações") },
        { name: l(locale, "Rate Optimizer", "Otimizador de Tarifas"), role: l(locale, "Analyzes carrier rates, negotiates contracts, and optimizes lane costs", "Analisa tarifas de transportadoras, negocia contratos e otimiza custos por rota"), avatar: "💹", color: "cyan", tasks: [l(locale, "Rate benchmarking", "Benchmarking de tarifas"), l(locale, "Contract negotiation", "Negociação de contratos"), l(locale, "Lane cost analysis", "Análise de custo por rota")], reportsTo: l(locale, "Operations Manager", "Gerente de Operações") },
        { name: l(locale, "Customer Liaison", "Relacionamento com Clientes"), role: l(locale, "Manages shipper and consignee communications and status updates", "Gerencia comunicações com exportadores e importadores e atualizações de status"), avatar: "🤝", color: "green", tasks: [l(locale, "Status notifications", "Notificações de status"), l(locale, "Quote delivery", "Envio de cotações"), l(locale, "Exception alerts", "Alertas de exceções")], reportsTo: l(locale, "Booking Agent", "Agente de Reservas") },
      ],
      humanReviewPoints: [
        { agent: l(locale, "Customs Agent", "Agente Aduaneiro"), task: l(locale, "Amended customs entry for HTS reclassification", "Retificação de declaração aduaneira para reclassificação HTS"), reason: l(locale, "Tariff classification changes affect duty liability and require licensed customs broker sign-off", "Mudanças na classificação tarifária afetam a responsabilidade tributária e exigem aprovação de despachante aduaneiro licenciado") },
        { agent: l(locale, "Rate Optimizer", "Otimizador de Tarifas"), task: l(locale, "Carrier contract rate negotiation above threshold", "Negociação de tarifa contratual acima do limite"), reason: l(locale, "Rate commitments exceeding $50,000 annual volume require management approval", "Compromissos de tarifa acima de $50.000 de volume anual exigem aprovação da gerência") },
        { agent: l(locale, "Document Agent", "Agente de Documentos"), task: l(locale, "Bill of Lading release for high-value cargo", "Liberação de Conhecimento de Embarque para carga de alto valor"), reason: l(locale, "Original BOL surrender for shipments over $200,000 requires verified authorization to prevent fraud", "A entrega do BL original para embarques acima de $200.000 exige autorização verificada para prevenir fraude") },
      ],
    },

    // ─── Channels ──────────────────────────────────────────────────────
    channels: {
      channels: channels.map((ch) => ({
        ...ch,
        previewMessage:
          ch.name === "Web Portal" ? l(locale, "Track shipments, manage bookings, file customs entries, and view rate analytics", "Rastreie embarques, gerencie reservas, registre declarações aduaneiras e visualize análises de tarifas") :
          ch.name === "WhatsApp" ? l(locale, "\"Container MSCU-7294810 cleared customs at Long Beach. ETA to warehouse: Feb 22, 10:00 AM.\"", "\"Contêiner MSCU-7294810 liberado pela alfândega em Long Beach. ETA no armazém: 22/fev, 10:00.\"") :
          ch.name === "Telegram" ? l(locale, "Quick container tracking lookups and shipment milestone alerts", "Consultas rápidas de rastreamento de contêineres e alertas de marcos de embarque") :
          ch.name === "Discord" ? l(locale, "Operations team coordination — discuss bookings, customs holds, and carrier updates", "Coordenação da equipe de operações — discuta reservas, retenções aduaneiras e atualizações de transportadoras") :
          ch.name === "Slack" ? l(locale, "Use /track, /book, or /rates to manage freight operations from Slack", "Use /track, /book ou /rates para gerenciar operações de frete pelo Slack") :
          ch.name === "Email" ? l(locale, "Daily shipment digest, customs clearance alerts, and booking confirmations", "Resumo diário de embarques, alertas de desembaraço aduaneiro e confirmações de reserva") :
          ch.previewMessage,
      })),
    },

    // ─── Deploy ────────────────────────────────────────────────────────
    deploy: {
      terminalLines: makeDeployTerminal("cargoflow-global", "https://cargoflow-global.vercel.app"),
      projectUrl: "https://cargoflow-global.vercel.app",
      stats: [
        { label: l(locale, "Shipments Tracked", "Embarques Rastreados"), value: "12,000+" },
        { label: l(locale, "Customs Clearance", "Desembaraço Aduaneiro"), value: "98%" },
        { label: l(locale, "Avg Transit Savings", "Economia Média de Trânsito"), value: "22%" },
        { label: l(locale, "Document Accuracy", "Precisão dos Documentos"), value: "99.5%" },
      ],
    },
  };
}
