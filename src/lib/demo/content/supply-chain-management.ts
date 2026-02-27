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
      { id: "manufacturing", name: l(locale, "Manufacturing", "Manufatura"), emoji: "🏭" },
      { id: "retail", name: l(locale, "Retail", "Varejo"), emoji: "🏬" },
      { id: "food-bev", name: l(locale, "Food & Beverage", "Alimentos e Bebidas"), emoji: "🍕" },
      { id: "pharma", name: l(locale, "Pharmaceuticals", "Farmacêutico"), emoji: "💊" },
      { id: "automotive", name: l(locale, "Automotive", "Automotivo"), emoji: "🚗" },
      { id: "electronics", name: l(locale, "Electronics", "Eletrônicos"), emoji: "🔌" },
    ],
    verticals: [
      { id: "procurement", name: l(locale, "Procurement", "Compras") },
      { id: "inventory-management", name: l(locale, "Inventory Management", "Gestão de Estoque") },
      { id: "demand-planning", name: l(locale, "Demand Planning", "Planejamento de Demanda") },
      { id: "supplier-relations", name: l(locale, "Supplier Relations", "Relacionamento com Fornecedores") },
    ],
    features: [
      { id: "purchase-orders", name: l(locale, "Purchase Orders", "Ordens de Compra") },
      { id: "inventory-tracking", name: l(locale, "Inventory Tracking", "Rastreamento de Estoque") },
      { id: "demand-forecasting", name: l(locale, "Demand Forecasting", "Previsão de Demanda") },
      { id: "supplier-scoring", name: l(locale, "Supplier Scoring", "Avaliação de Fornecedores") },
      { id: "quality-control", name: l(locale, "Quality Control", "Controle de Qualidade") },
      { id: "warehouse-management", name: l(locale, "Warehouse Management", "Gestão de Armazém") },
    ],
    autoSelections: {
      industry: "manufacturing",
      vertical: "procurement",
      features: ["purchase-orders", "inventory-tracking", "demand-forecasting", "supplier-scoring"],
      autonomy: {
        "purchase-orders": "supervised",
        "inventory-tracking": "full",
        "demand-forecasting": "full",
        "supplier-scoring": "full",
        "quality-control": "supervised",
        "warehouse-management": "full",
      },
    },
    projectName: "ChainSync",
    projectDescription: l(locale, "AI-powered supply chain platform with real-time inventory tracking, predictive demand forecasting, automated procurement workflows, and supplier performance management for end-to-end visibility.", "Plataforma de cadeia de suprimentos com IA, rastreamento de estoque em tempo real, previsão de demanda preditiva, fluxos de compras automatizados e gestão de desempenho de fornecedores para visibilidade ponta a ponta."),
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "ChainSync",
    projectBadge: l(locale, "Supply Chain", "Cadeia de Suprimentos"),
    projectDescription: l(locale, "Optimize your entire supply chain — from procurement to delivery — with AI-driven demand planning, real-time inventory visibility, and automated supplier management that reduces costs and eliminates stockouts.", "Otimize toda sua cadeia de suprimentos — de compras à entrega — com planejamento de demanda orientado por IA, visibilidade de estoque em tempo real e gestão automatizada de fornecedores que reduz custos e elimina rupturas."),
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: l(locale, "Morning briefing: Inventory health across 3 warehouses is at 87% optimal. Two critical alerts this morning — raw aluminum stock at the Dallas DC is down to 4 days of supply (threshold: 7 days), and Supplier #SL-4092 (Pacific Components) missed their delivery window by 36 hours on PO-28417. Demand forecast models updated overnight showing a 22% spike in Q2 orders for the EV motor assembly line.", "Briefing matinal: Saúde do estoque nos 3 armazéns está em 87% do ideal. Dois alertas críticos esta manhã — o estoque de alumínio bruto no CD de Dallas caiu para 4 dias de suprimento (limite: 7 dias), e o Fornecedor #SL-4092 (Pacific Components) perdeu a janela de entrega em 36 horas na OC-28417. Modelos de previsão de demanda atualizados durante a noite mostram um aumento de 22% nos pedidos do Q2 para a linha de montagem de motores EV."),
      },
      {
        role: "user",
        content: l(locale, "What's happening with Pacific Components? Pull up their supplier scorecard.", "O que está acontecendo com a Pacific Components? Mostre o scorecard do fornecedor."),
      },
      {
        role: "assistant",
        content: l(locale, "Pacific Components (SL-4092) — Tier 2 supplier, precision circuit boards. Current scorecard:\n\n• **On-Time Delivery**: 78% (down from 91% last quarter)\n• **Quality Rate**: 96.3% (within tolerance)\n• **Lead Time Avg**: 14.2 days (contracted: 10 days)\n• **Open POs**: 3 orders worth $284K\n• **Last 5 deliveries**: 2 late, 1 partial shipment, 2 on-time\n\nRoot cause analysis suggests they're capacity-constrained after losing a production line to maintenance. Their account manager confirmed a 3-week recovery timeline. I've identified two pre-qualified alternates — Vertex Electronics (98% OTD, 12-day lead) and NanoCircuit Ltd (94% OTD, 9-day lead) — both can absorb the overflow volume.", "Pacific Components (SL-4092) — Fornecedor Tier 2, placas de circuito de precisão. Scorecard atual:\n\n• **Entrega no Prazo**: 78% (queda de 91% no trimestre anterior)\n• **Taxa de Qualidade**: 96,3% (dentro da tolerância)\n• **Lead Time Médio**: 14,2 dias (contratado: 10 dias)\n• **OCs Abertas**: 3 pedidos no valor de $284K\n• **Últimas 5 entregas**: 2 atrasadas, 1 entrega parcial, 2 no prazo\n\nA análise de causa raiz sugere que estão com capacidade limitada após perderem uma linha de produção para manutenção. O gerente de conta confirmou um prazo de recuperação de 3 semanas. Identifiquei dois fornecedores alternativos pré-qualificados — Vertex Electronics (98% OTD, lead de 12 dias) e NanoCircuit Ltd (94% OTD, lead de 9 dias) — ambos podem absorver o volume excedente."),
      },
      {
        role: "user",
        content: l(locale, "Split the next two POs between Vertex and NanoCircuit. Also trigger an emergency restock on aluminum for Dallas.", "Divida as próximas duas OCs entre Vertex e NanoCircuit. Também acione um reabastecimento emergencial de alumínio para Dallas."),
      },
      {
        role: "assistant",
        content: l(locale, "I've prepared the following actions:\n\n**PO Rerouting:**\n• PO-28523 ($142K, 5,000 units) → Vertex Electronics — est. delivery in 12 days\n• PO-28541 ($97K, 3,200 units) → NanoCircuit Ltd — est. delivery in 9 days\n• Pacific Components notified of volume reduction with performance improvement plan\n\n**Emergency Aluminum Restock:**\n• Supplier: Alcoa Direct (preferred vendor, 99.1% OTD)\n• Quantity: 18 metric tons (covers 14 days of supply)\n• Expedited freight via rail + last-mile truck\n• Est. arrival: 3 business days at Dallas DC\n• Cost: $47,200 (12% premium for expedited shipping)\n\nShall I execute both actions?", "Preparei as seguintes ações:\n\n**Redirecionamento de OCs:**\n• OC-28523 ($142K, 5.000 unidades) → Vertex Electronics — entrega estimada em 12 dias\n• OC-28541 ($97K, 3.200 unidades) → NanoCircuit Ltd — entrega estimada em 9 dias\n• Pacific Components notificada da redução de volume com plano de melhoria de desempenho\n\n**Reabastecimento Emergencial de Alumínio:**\n• Fornecedor: Alcoa Direct (fornecedor preferencial, 99,1% OTD)\n• Quantidade: 18 toneladas métricas (cobre 14 dias de suprimento)\n• Frete expresso via ferrovia + caminhão última milha\n• Chegada estimada: 3 dias úteis no CD de Dallas\n• Custo: $47.200 (12% de prêmio por frete expresso)\n\nDevo executar ambas as ações?"),
        action: {
          type: "approval",
          title: l(locale, "Reroute POs & Emergency Aluminum Restock", "Redirecionar OCs e Reabastecimento Emergencial de Alumínio"),
          description: l(locale, "Reroute PO-28523 to Vertex Electronics and PO-28541 to NanoCircuit Ltd. Issue emergency purchase order to Alcoa Direct for 18 metric tons of raw aluminum with expedited freight to Dallas DC. Total estimated cost: $286,200.", "Redirecionar OC-28523 para Vertex Electronics e OC-28541 para NanoCircuit Ltd. Emitir ordem de compra emergencial para Alcoa Direct de 18 toneladas métricas de alumínio bruto com frete expresso para o CD de Dallas. Custo total estimado: $286.200."),
        },
      },
      {
        role: "user",
        content: l(locale, "Approved. Now tell me about the Q2 demand spike — what's driving it?", "Aprovado. Agora me fale sobre o aumento de demanda do Q2 — o que está causando?"),
      },
      {
        role: "assistant",
        content: l(locale, "The Q2 demand forecast surge is driven by three converging factors:\n\n1. **OEM Contract Ramp-Up** — Rivian increased their EV motor assembly commitment by 30%, effective April 1. This alone accounts for 14% of the spike.\n2. **Seasonal Pattern** — Historical data shows Q2 manufacturing orders consistently rise 12-18% across automotive components.\n3. **New Product Launch** — The Gen-3 motor controller board enters mass production in May, pulling forward component procurement.\n\n**Impact on current inventory:**\n• Copper wiring: Need to increase safety stock by 40% — current levels cover only 60% of projected Q2 demand\n• PCB assemblies: Adequate if alternate suppliers maintain delivery schedules\n• Rare earth magnets: Single-source risk — recommend qualifying a second supplier within 6 weeks\n\nI've drafted a pre-procurement plan that staggers orders across March to avoid warehouse capacity issues. Want me to share the detailed breakdown?", "O aumento de demanda previsto para o Q2 é impulsionado por três fatores convergentes:\n\n1. **Ramp-Up de Contrato OEM** — A Rivian aumentou seu compromisso de montagem de motores EV em 30%, a partir de 1º de abril. Isso sozinho responde por 14% do aumento.\n2. **Padrão Sazonal** — Dados históricos mostram que pedidos de manufatura no Q2 sobem consistentemente 12-18% em componentes automotivos.\n3. **Lançamento de Novo Produto** — A placa controladora Gen-3 entra em produção em massa em maio, antecipando a compra de componentes.\n\n**Impacto no estoque atual:**\n• Fiação de cobre: Necessário aumentar estoque de segurança em 40% — níveis atuais cobrem apenas 60% da demanda projetada do Q2\n• Montagens de PCB: Adequado se fornecedores alternativos mantiverem cronogramas de entrega\n• Ímãs de terras raras: Risco de fonte única — recomendo qualificar um segundo fornecedor em 6 semanas\n\nPreparei um plano de pré-compras que escalona pedidos ao longo de março para evitar problemas de capacidade de armazém. Deseja ver o detalhamento?"),
      },
      {
        role: "user",
        content: l(locale, "Yes, share the plan and flag any items that need my approval before ordering.", "Sim, compartilhe o plano e sinalize itens que precisam da minha aprovação antes de pedir."),
      },
      {
        role: "assistant",
        content: l(locale, "Here's the Q2 pre-procurement plan:\n\n**Wave 1 (March 1-7) — Auto-approved:**\n• Copper wiring: 45 tons from SteelWire Inc. — $312K (within budget authority)\n• Fastener kits: 200K units from BoltMax — $28K (standard restock)\n• Thermal compounds: 500L from ChemFlow — $18K\n\n**Wave 2 (March 10-14) — Requires approval:**\n• PCB assemblies: 25K units split across Vertex + NanoCircuit — $485K (exceeds single-PO threshold)\n• Rare earth magnets: 8 tons from SinoMag — $620K (single-source, geopolitical risk flag)\n\n**Wave 3 (March 20-28) — Requires approval:**\n• Custom motor housings: 12K units from PrecisionCast — $890K (new tooling investment required)\n• Quality inspection equipment upgrade — $145K (CapEx)\n\nTotal pre-procurement budget: $2.49M. Waves 2 and 3 will come to you for sign-off before execution. I've also set up automated reorder triggers for Wave 1 items that will fire on March 1.", "Aqui está o plano de pré-compras do Q2:\n\n**Onda 1 (1-7 de março) — Aprovação automática:**\n• Fiação de cobre: 45 toneladas da SteelWire Inc. — $312K (dentro da alçada orçamentária)\n• Kits de fixadores: 200K unidades da BoltMax — $28K (reposição padrão)\n• Compostos térmicos: 500L da ChemFlow — $18K\n\n**Onda 2 (10-14 de março) — Requer aprovação:**\n• Montagens de PCB: 25K unidades divididas entre Vertex + NanoCircuit — $485K (excede limite de OC única)\n• Ímãs de terras raras: 8 toneladas da SinoMag — $620K (fonte única, sinalização de risco geopolítico)\n\n**Onda 3 (20-28 de março) — Requer aprovação:**\n• Carcaças de motor sob medida: 12K unidades da PrecisionCast — $890K (investimento em ferramental necessário)\n• Upgrade de equipamento de inspeção de qualidade — $145K (CapEx)\n\nOrçamento total de pré-compras: $2,49M. As Ondas 2 e 3 virão para sua aprovação antes da execução. Também configurei gatilhos de reposição automática para itens da Onda 1 que dispararão em 1º de março."),
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: l(locale, "Good morning. Here's your ChainSync supply chain briefing for February 20th.", "Bom dia. Aqui está seu briefing de cadeia de suprimentos do ChainSync para 20 de fevereiro."), durationMs: 3200 },
      { speaker: "agent", text: l(locale, "Inventory health is at 87% across three distribution centers. Critical alert: raw aluminum at Dallas is down to 4 days of supply — well below the 7-day threshold. An emergency restock from Alcoa Direct is recommended with 3-day expedited delivery. Supplier Pacific Components missed their delivery window by 36 hours on a $142K purchase order. Their on-time rate has dropped to 78% this quarter.", "A saúde do estoque está em 87% nos três centros de distribuição. Alerta crítico: alumínio bruto em Dallas caiu para 4 dias de suprimento — bem abaixo do limite de 7 dias. Um reabastecimento emergencial da Alcoa Direct é recomendado com entrega expressa em 3 dias. O fornecedor Pacific Components perdeu a janela de entrega em 36 horas em uma ordem de compra de $142K. A taxa de pontualidade caiu para 78% neste trimestre."), durationMs: 12800 },
      { speaker: "agent", text: l(locale, "Demand forecast models updated overnight. Q2 orders for the EV motor assembly line are projected to spike 22%, driven by the Rivian contract ramp-up, seasonal patterns, and the Gen-3 controller board launch. A pre-procurement plan totaling $2.49M has been staged in three waves across March.", "Modelos de previsão de demanda atualizados durante a noite. Pedidos do Q2 para a linha de montagem de motores EV devem subir 22%, impulsionados pelo ramp-up do contrato Rivian, padrões sazonais e o lançamento da placa controladora Gen-3. Um plano de pré-compras totalizando $2,49M foi organizado em três ondas ao longo de março."), durationMs: 10200 },
      { speaker: "agent", text: l(locale, "Warehouse operations update: Dallas DC is at 82% capacity, Chicago at 71%, and Reno at 64%. Two inbound shipments arriving today — one from Alcoa and one from BoltMax. Quality inspection queue has 14 items pending, with 3 flagged for dimensional tolerance review. Overall order accuracy is holding at 99.2% month-to-date.", "Atualização de operações de armazém: CD Dallas está em 82% de capacidade, Chicago em 71% e Reno em 64%. Duas remessas chegando hoje — uma da Alcoa e uma da BoltMax. A fila de inspeção de qualidade tem 14 itens pendentes, com 3 sinalizados para revisão de tolerância dimensional. A precisão geral dos pedidos se mantém em 99,2% no mês."), durationMs: 11400 },
    ],
    summary: l(locale, "Supply chain briefing covered inventory health at 87%, critical aluminum shortage at Dallas DC, Pacific Components supplier performance decline, Q2 demand spike of 22% for EV assembly, $2.49M pre-procurement plan, and warehouse capacity across three DCs.", "Briefing de cadeia de suprimentos cobriu saúde do estoque em 87%, escassez crítica de alumínio no CD Dallas, queda de desempenho do fornecedor Pacific Components, aumento de demanda de 22% no Q2 para montagem EV, plano de pré-compras de $2,49M e capacidade de armazém nos três CDs."),
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "SAP S/4HANA", icon: "database", category: "ERP", description: l(locale, "Enterprise resource planning with materials management and production planning", "Planejamento de recursos empresariais com gestão de materiais e planejamento de produção") },
      { name: "Oracle NetSuite", icon: "layers", category: "ERP", description: l(locale, "Cloud ERP for procurement, inventory, and financial management", "ERP na nuvem para compras, estoque e gestão financeira") },
      { name: "EDI Gateway", icon: "arrow-left-right", category: l(locale, "Data Exchange", "Troca de Dados"), description: l(locale, "Electronic data interchange for purchase orders, invoices, and ASNs", "Intercâmbio eletrônico de dados para ordens de compra, faturas e ASNs") },
      { name: "RFID/IoT Sensors", icon: "radio", category: l(locale, "Warehouse", "Armazém"), description: l(locale, "Real-time asset tracking, temperature monitoring, and inventory scanning", "Rastreamento de ativos em tempo real, monitoramento de temperatura e escaneamento de estoque") },
      { name: "Kinaxis RapidResponse", icon: "trending-up", category: l(locale, "Planning", "Planejamento"), description: l(locale, "Demand sensing, supply planning, and scenario analysis", "Sensoriamento de demanda, planejamento de suprimentos e análise de cenários") },
      { name: "Coupa Procurement", icon: "shopping-cart", category: l(locale, "Procurement", "Compras"), description: l(locale, "Spend management, sourcing, and supplier collaboration portal", "Gestão de gastos, sourcing e portal de colaboração com fornecedores") },
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
      { title: l(locale, "Design procurement and purchase order data models with approval workflows", "Projetar modelos de dados de compras e ordens de compra com fluxos de aprovação"), stage: "plan", status: "complete" },
      { title: l(locale, "Map SAP and NetSuite API endpoints for inventory and PO sync", "Mapear endpoints de API do SAP e NetSuite para sincronização de estoque e OC"), stage: "plan", status: "complete" },
      { title: l(locale, "Build real-time inventory dashboard with multi-warehouse visibility", "Construir dashboard de estoque em tempo real com visibilidade multi-armazém"), stage: "build", status: "complete" },
      { title: l(locale, "Implement supplier scoring engine with delivery and quality metrics", "Implementar motor de avaliação de fornecedores com métricas de entrega e qualidade"), stage: "build", status: "complete" },
      { title: l(locale, "Create demand forecasting module with ML-driven predictions", "Criar módulo de previsão de demanda com predições baseadas em ML"), stage: "build", status: "active" },
      { title: l(locale, "Build automated purchase order generation with approval routing", "Construir geração automatizada de ordens de compra com roteamento de aprovação"), stage: "build", status: "pending" },
      { title: l(locale, "Integrate EDI gateway for supplier electronic data interchange", "Integrar gateway EDI para intercâmbio eletrônico de dados com fornecedores"), stage: "launch", status: "pending" },
      { title: l(locale, "Deploy with RFID/IoT sensor connectivity and warehouse monitoring", "Deploy com conectividade de sensores RFID/IoT e monitoramento de armazém"), stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "dashboard", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "procurement", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[poId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
              { name: "inventory", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[warehouseId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
              { name: "suppliers", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[supplierId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
              { name: "forecasting", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "quality", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "procurement", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "inventory", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "suppliers", type: "folder", children: [
                { name: "route.ts", type: "file" },
                { name: "score", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
              { name: "forecasting", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "quality", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "webhooks", type: "folder", children: [
                { name: "sap", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "edi", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "sap-client.ts", type: "file" },
          { name: "demand-forecaster.ts", type: "file" },
          { name: "supplier-scorer.ts", type: "file" },
          { name: "inventory-optimizer.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: l(locale, "Procurement Policies", "Políticas de Compras"), icon: "file-text", count: 32 },
      { name: l(locale, "Supplier SLAs", "SLAs de Fornecedores"), icon: "handshake", count: 45 },
      { name: l(locale, "Quality Standards", "Padrões de Qualidade"), icon: "shield-check", count: 28 },
      { name: l(locale, "Logistics Guides", "Guias de Logística"), icon: "truck", count: 19 },
      { name: l(locale, "Compliance & Regulatory", "Compliance e Regulamentação"), icon: "scale", count: 24 },
    ],
    documents: [
      { title: l(locale, "Master Procurement Policy Handbook", "Manual Mestre de Políticas de Compras"), category: l(locale, "Procurement Policies", "Políticas de Compras"), tier: "index", lines: 140, crossRefs: [l(locale, "PO Approval Threshold Matrix", "Matriz de Limites de Aprovação de OC"), l(locale, "Supplier Onboarding Checklist", "Checklist de Onboarding de Fornecedores")] },
      { title: l(locale, "PO Approval Threshold Matrix", "Matriz de Limites de Aprovação de OC"), category: l(locale, "Procurement Policies", "Políticas de Compras"), tier: "detail", lines: 85 },
      { title: l(locale, "Supplier Onboarding Checklist", "Checklist de Onboarding de Fornecedores"), category: l(locale, "Supplier SLAs", "SLAs de Fornecedores"), tier: "summary", lines: 120, crossRefs: [l(locale, "Supplier Performance Scorecard Methodology", "Metodologia de Scorecard de Desempenho de Fornecedores")] },
      { title: l(locale, "Supplier Performance Scorecard Methodology", "Metodologia de Scorecard de Desempenho de Fornecedores"), category: l(locale, "Supplier SLAs", "SLAs de Fornecedores"), tier: "detail", lines: 310 },
      { title: l(locale, "ISO 9001 Quality Management Procedures", "Procedimentos de Gestão da Qualidade ISO 9001"), category: l(locale, "Quality Standards", "Padrões de Qualidade"), tier: "detail", lines: 480, crossRefs: [l(locale, "Incoming Inspection Protocol", "Protocolo de Inspeção de Recebimento")] },
      { title: l(locale, "Incoming Inspection Protocol", "Protocolo de Inspeção de Recebimento"), category: l(locale, "Quality Standards", "Padrões de Qualidade"), tier: "summary", lines: 165 },
      { title: l(locale, "Warehouse Receiving & Putaway Guide", "Guia de Recebimento e Armazenagem"), category: l(locale, "Logistics Guides", "Guias de Logística"), tier: "detail", lines: 240, crossRefs: [l(locale, "RFID Tag Scanning Procedures", "Procedimentos de Leitura de Tags RFID")] },
      { title: l(locale, "RFID Tag Scanning Procedures", "Procedimentos de Leitura de Tags RFID"), category: l(locale, "Logistics Guides", "Guias de Logística"), tier: "detail", lines: 175 },
      { title: l(locale, "Hazardous Materials Handling & Compliance", "Manuseio de Materiais Perigosos e Compliance"), category: l(locale, "Compliance & Regulatory", "Compliance e Regulamentação"), tier: "summary", lines: 290, crossRefs: [l(locale, "ISO 9001 Quality Management Procedures", "Procedimentos de Gestão da Qualidade ISO 9001")] },
      { title: l(locale, "Customs & Import Documentation Guide", "Guia de Documentação Aduaneira e de Importação"), category: l(locale, "Compliance & Regulatory", "Compliance e Regulamentação"), tier: "detail", lines: 360 },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: l(locale, "Inventory Turnover (times/month)", "Giro de Estoque (vezes/mês)"),
        type: "bar",
        data: [
          { name: l(locale, "Sep", "Set"), value: 4.2 },
          { name: l(locale, "Oct", "Out"), value: 4.5 },
          { name: "Nov", value: 4.8 },
          { name: l(locale, "Dec", "Dez"), value: 3.9 },
          { name: "Jan", value: 5.1 },
          { name: l(locale, "Feb", "Fev"), value: 5.4 },
        ],
      },
      {
        label: l(locale, "Order Fulfillment Rate (%)", "Taxa de Atendimento de Pedidos (%)"),
        type: "line",
        data: [
          { name: l(locale, "Sep", "Set"), value: 96.8 },
          { name: l(locale, "Oct", "Out"), value: 97.2 },
          { name: "Nov", value: 97.9 },
          { name: l(locale, "Dec", "Dez"), value: 96.1 },
          { name: "Jan", value: 98.4 },
          { name: l(locale, "Feb", "Fev"), value: 99.2 },
        ],
      },
    ],
  },

  // ─── Orchestration ──────────────────────────────────────────────────
  orchestration: {
    agents: [
      { name: l(locale, "Supply Chain Director", "Diretor de Cadeia de Suprimentos"), role: l(locale, "Orchestrates end-to-end supply chain operations and strategic planning", "Orquestra operações de cadeia de suprimentos ponta a ponta e planejamento estratégico"), avatar: "🔗", color: "blue", tasks: [l(locale, "Supply chain oversight", "Supervisão da cadeia de suprimentos"), l(locale, "Risk mitigation", "Mitigação de riscos"), l(locale, "Cross-functional coordination", "Coordenação multifuncional")] },
      { name: l(locale, "Procurement Agent", "Agente de Compras"), role: l(locale, "Manages purchase orders, vendor selection, and spend optimization", "Gerencia ordens de compra, seleção de fornecedores e otimização de gastos"), avatar: "📋", color: "emerald", tasks: [l(locale, "PO generation", "Geração de OC"), l(locale, "Vendor evaluation", "Avaliação de fornecedores"), l(locale, "Contract negotiation", "Negociação de contratos")], reportsTo: l(locale, "Supply Chain Director", "Diretor de Cadeia de Suprimentos") },
      { name: l(locale, "Inventory Manager", "Gerente de Estoque"), role: l(locale, "Monitors stock levels, reorder points, and warehouse utilization", "Monitora níveis de estoque, pontos de reposição e utilização de armazém"), avatar: "📦", color: "violet", tasks: [l(locale, "Stock monitoring", "Monitoramento de estoque"), l(locale, "Reorder triggers", "Gatilhos de reposição"), l(locale, "Safety stock optimization", "Otimização de estoque de segurança")], reportsTo: l(locale, "Supply Chain Director", "Diretor de Cadeia de Suprimentos") },
      { name: l(locale, "Demand Planner", "Planejador de Demanda"), role: l(locale, "Forecasts demand using ML models and market signals", "Prevê demanda usando modelos de ML e sinais de mercado"), avatar: "📈", color: "amber", tasks: [l(locale, "Demand forecasting", "Previsão de demanda"), l(locale, "Seasonality analysis", "Análise de sazonalidade"), l(locale, "Promotional impact modeling", "Modelagem de impacto promocional")], reportsTo: l(locale, "Supply Chain Director", "Diretor de Cadeia de Suprimentos") },
      { name: l(locale, "Quality Inspector", "Inspetor de Qualidade"), role: l(locale, "Enforces quality standards and manages inspection workflows", "Aplica padrões de qualidade e gerencia fluxos de inspeção"), avatar: "🔍", color: "rose", tasks: [l(locale, "Incoming inspections", "Inspeções de recebimento"), l(locale, "Defect tracking", "Rastreamento de defeitos"), l(locale, "Supplier quality audits", "Auditorias de qualidade de fornecedores")], reportsTo: l(locale, "Supply Chain Director", "Diretor de Cadeia de Suprimentos") },
      { name: l(locale, "Logistics Coordinator", "Coordenador de Logística"), role: l(locale, "Optimizes shipping routes, carrier selection, and delivery tracking", "Otimiza rotas de embarque, seleção de transportadoras e rastreamento de entregas"), avatar: "🚚", color: "cyan", tasks: [l(locale, "Route optimization", "Otimização de rotas"), l(locale, "Carrier management", "Gestão de transportadoras"), l(locale, "Shipment tracking", "Rastreamento de embarques")], reportsTo: l(locale, "Inventory Manager", "Gerente de Estoque") },
      { name: l(locale, "Supplier Relations", "Relacionamento com Fornecedores"), role: l(locale, "Maintains supplier scorecards, SLAs, and relationship management", "Mantém scorecards de fornecedores, SLAs e gestão de relacionamento"), avatar: "🤝", color: "green", tasks: [l(locale, "Scorecard updates", "Atualização de scorecards"), l(locale, "SLA monitoring", "Monitoramento de SLAs"), l(locale, "Performance reviews", "Revisões de desempenho")], reportsTo: l(locale, "Procurement Agent", "Agente de Compras") },
    ],
    humanReviewPoints: [
      { agent: l(locale, "Procurement Agent", "Agente de Compras"), task: l(locale, "Purchase orders exceeding $500K", "Ordens de compra acima de $500K"), reason: l(locale, "High-value procurement requires VP of Operations sign-off and finance team budget verification", "Compras de alto valor requerem aprovação do VP de Operações e verificação de orçamento pela equipe financeira") },
      { agent: l(locale, "Quality Inspector", "Inspetor de Qualidade"), task: l(locale, "Batch rejection above 5% threshold", "Rejeição de lote acima do limite de 5%"), reason: l(locale, "Rejecting a supplier batch triggers contractual SLA penalties and requires supply chain director review", "Rejeitar um lote de fornecedor aciona penalidades contratuais de SLA e requer revisão do diretor de cadeia de suprimentos") },
      { agent: l(locale, "Demand Planner", "Planejador de Demanda"), task: l(locale, "Forecast override exceeding 25% variance", "Ajuste de previsão excedendo 25% de variância"), reason: l(locale, "Large forecast adjustments impact procurement commitments and warehouse capacity planning across the network", "Grandes ajustes de previsão impactam compromissos de compras e planejamento de capacidade de armazém em toda a rede") },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: channels.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? l(locale, "Full supply chain dashboard — inventory, procurement, suppliers, and demand forecasts", "Dashboard completo da cadeia de suprimentos — estoque, compras, fornecedores e previsões de demanda") :
        ch.name === "WhatsApp" ? l(locale, "\"Alert: Raw aluminum at Dallas DC dropped below safety stock. Emergency PO recommended.\"", "\"Alerta: Alumínio bruto no CD Dallas caiu abaixo do estoque de segurança. OC emergencial recomendada.\"") :
        ch.name === "Telegram" ? l(locale, "Real-time shipment tracking, inventory alerts, and supplier delivery updates", "Rastreamento de embarques em tempo real, alertas de estoque e atualizações de entrega de fornecedores") :
        ch.name === "Discord" ? l(locale, "Supply chain ops room — coordinate procurement, logistics, and quality escalations", "Sala de operações da cadeia de suprimentos — coordene compras, logística e escalonamentos de qualidade") :
        ch.name === "Slack" ? l(locale, "Use /inventory, /suppliers, or /orders for instant supply chain data", "Use /inventory, /suppliers ou /orders para dados instantâneos da cadeia de suprimentos") :
        ch.name === "Email" ? l(locale, "Daily inventory digest, supplier scorecards, and weekly demand forecast reports", "Resumo diário de estoque, scorecards de fornecedores e relatórios semanais de previsão de demanda") :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("chainsync", "https://chainsync.vercel.app"),
    projectUrl: "https://chainsync.vercel.app",
    stats: [
      { label: l(locale, "SKUs Managed", "SKUs Gerenciados"), value: "45,000+" },
      { label: l(locale, "Order Accuracy", "Precisão de Pedidos"), value: "99.2%" },
      { label: l(locale, "Lead Time Reduction", "Redução de Lead Time"), value: "35%" },
      { label: l(locale, "Cost Savings", "Economia de Custos"), value: "18%" },
    ],
  },
  };
}
