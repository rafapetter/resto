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
      { id: "residential-sales", name: l(locale, "Residential Sales", "Vendas Residenciais"), emoji: "🏠" },
      { id: "commercial-real-estate", name: l(locale, "Commercial Real Estate", "Imóveis Comerciais"), emoji: "🏢" },
      { id: "property-management", name: l(locale, "Property Management", "Administração de Imóveis"), emoji: "🔑" },
      { id: "real-estate-development", name: l(locale, "Real Estate Development", "Incorporação Imobiliária"), emoji: "🏗️" },
      { id: "luxury-real-estate", name: l(locale, "Luxury Real Estate", "Imóveis de Luxo"), emoji: "🏰" },
      { id: "reits", name: "REITs", emoji: "📊" },
    ],
    verticals: [
      { id: "listing-management", name: l(locale, "Listing Management", "Gestão de Anúncios") },
      { id: "client-relations", name: l(locale, "Client Relations", "Relação com Clientes") },
      { id: "transaction-management", name: l(locale, "Transaction Management", "Gestão de Transações") },
      { id: "market-analysis", name: l(locale, "Market Analysis", "Análise de Mercado") },
    ],
    features: [
      { id: "mls-integration", name: l(locale, "MLS Integration", "Integração MLS") },
      { id: "virtual-tours", name: l(locale, "Virtual Tours", "Tours Virtuais") },
      { id: "lead-scoring", name: l(locale, "Lead Scoring", "Pontuação de Leads") },
      { id: "transaction-pipeline", name: l(locale, "Transaction Pipeline", "Pipeline de Transações") },
      { id: "commission-tracking", name: l(locale, "Commission Tracking", "Rastreamento de Comissões") },
      { id: "market-reports", name: l(locale, "Market Reports", "Relatórios de Mercado") },
    ],
    autoSelections: {
      industry: "residential-sales",
      vertical: "listing-management",
      features: ["mls-integration", "lead-scoring", "transaction-pipeline", "market-reports"],
      autonomy: {
        "mls-integration": "full",
        "virtual-tours": "full",
        "lead-scoring": "full",
        "transaction-pipeline": "supervised",
        "commission-tracking": "full",
        "market-reports": "full",
      },
    },
    projectName: "PropelEstate",
    projectDescription: l(locale,
      "AI-powered real estate platform with MLS integration, automated lead scoring, virtual tour management, and transaction pipeline tracking for high-performing brokerages.",
      "Plataforma imobiliária com IA, integração MLS, pontuação automatizada de leads, gestão de tours virtuais e acompanhamento de pipeline de transações para imobiliárias de alto desempenho."
    ),
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "PropelEstate",
    projectBadge: l(locale, "Real Estate", "Imobiliário"),
    projectDescription: l(locale,
      "Close more deals and delight clients — intelligent listing management, automated showing coordination, market-driven pricing, and end-to-end transaction tracking from first contact to closing day.",
      "Feche mais negócios e encante clientes — gestão inteligente de anúncios, coordenação automatizada de visitas, precificação orientada pelo mercado e acompanhamento de transações do primeiro contato ao fechamento."
    ),
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: l(locale,
          "Good morning. Here's your PropelEstate briefing: 12 new leads came in overnight — 4 scored above 80 and are ready for immediate outreach. You have 5 showings scheduled today, starting with the Maple Ridge property at 10 AM. The Thompson offer on 42 Elm Street ($485K) received a counter from the seller at $498K — response deadline is 5 PM today. Also, the Willow Park listing just hit 30 days on market — I've prepared a price adjustment analysis.",
          "Bom dia. Aqui está seu briefing PropelEstate: 12 novos leads chegaram durante a noite — 4 pontuaram acima de 80 e estão prontos para contato imediato. Você tem 5 visitas agendadas hoje, começando com o imóvel em Maple Ridge às 10h. A oferta Thompson no 42 Elm Street (R$ 2,4M) recebeu uma contraproposta do vendedor em R$ 2,49M — prazo de resposta é 17h de hoje. Além disso, o anúncio de Willow Park completou 30 dias no mercado — preparei uma análise de ajuste de preço."
        ),
      },
      {
        role: "user",
        content: l(locale,
          "Show me the details on the Thompson offer and the new leads.",
          "Mostre os detalhes da oferta Thompson e os novos leads."
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "**Thompson Offer — 42 Elm Street:**\n• **Buyer:** Mark & Lisa Thompson (pre-approved, $520K limit)\n• **Original offer:** $485,000 with 20% down, 30-day close\n• **Seller counter:** $498,000, seller covers $5K in closing costs\n• **Comparable analysis:** Neighborhood median is $492K. Two similar homes closed at $489K and $501K last month.\n• **Recommendation:** Counter at $493K — meets in the middle and aligns with comps. Thompsons have room in their budget.\n\n**Top New Leads (Score 80+):**\n1. **Sarah Kim** (Score: 94) — Searching $600-750K, 4BR in Westfield. Pre-approved. Relocated from Chicago, urgent timeline.\n2. **David Ortega** (Score: 88) — First-time buyer, $350-400K range, interested in the Oakdale subdivision.\n3. **Rachel & Tom Hughes** (Score: 85) — Downsizing from 5BR, looking for luxury condos $500-650K.\n4. **James Park** (Score: 82) — Investor, looking for multi-family properties under $800K, cash buyer.\n\nShall I draft the counter-offer for the Thompsons and assign agents to the new leads?",
          "**Oferta Thompson — 42 Elm Street:**\n• **Comprador:** Mark & Lisa Thompson (pré-aprovados, limite de R$ 2,6M)\n• **Oferta original:** R$ 2,4M com 20% de entrada, fechamento em 30 dias\n• **Contraproposta do vendedor:** R$ 2,49M, vendedor cobre R$ 25K em custos de fechamento\n• **Análise comparativa:** Mediana do bairro é R$ 2,46M. Dois imóveis similares fecharam a R$ 2,45M e R$ 2,5M no mês passado.\n• **Recomendação:** Contrapropor R$ 2,47M — encontra o meio-termo e alinha com os comparativos. Os Thompsons têm margem no orçamento.\n\n**Principais Novos Leads (Pontuação 80+):**\n1. **Sarah Kim** (Pontuação: 94) — Procurando R$ 3M-3,75M, 4 quartos em Westfield. Pré-aprovada. Mudou de Chicago, prazo urgente.\n2. **David Ortega** (Pontuação: 88) — Primeiro imóvel, faixa de R$ 1,75M-2M, interessado no condomínio Oakdale.\n3. **Rachel & Tom Hughes** (Pontuação: 85) — Reduzindo de 5 quartos, procurando apartamentos de luxo R$ 2,5M-3,25M.\n4. **James Park** (Pontuação: 82) — Investidor, procurando imóveis multifamiliares abaixo de R$ 4M, comprador à vista.\n\nDevo redigir a contraproposta para os Thompsons e atribuir corretores aos novos leads?"
        ),
        action: {
          type: "approval",
          title: l(locale, "Submit Counter-Offer & Route Leads", "Enviar Contraproposta & Direcionar Leads"),
          description: l(locale,
            "Submit counter-offer of $493,000 for 42 Elm Street via DocuSign to the seller's agent (keeping $5K closing cost credit). Route Sarah Kim to luxury specialist, David Ortega to buyer's agent, Hughes to condo team, and James Park to investment division.",
            "Enviar contraproposta de R$ 2,47M para 42 Elm Street via DocuSign para o corretor do vendedor (mantendo crédito de R$ 25K em custos de fechamento). Direcionar Sarah Kim para especialista em luxo, David Ortega para corretor de compradores, Hughes para equipe de apartamentos e James Park para divisão de investimentos."
          ),
        },
      },
      {
        role: "user",
        content: l(locale,
          "Approve the counter and lead routing. What about the Willow Park listing that's been sitting?",
          "Aprove a contraproposta e direcionamento de leads. E o anúncio de Willow Park que está parado?"
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "Counter-offer submitted and leads routed. Now for Willow Park:\n\n**128 Willow Park Drive — 30-Day Market Analysis:**\n• **Listed at:** $625,000 (4BR/3BA, 2,400 sqft)\n• **Showings:** 18 total, 6 in the first week, only 2 in the last 10 days\n• **Feedback themes:** \"Price feels high for the area,\" \"Kitchen needs updating\"\n• **Comp movement:** Two comparable listings in the area reduced by 3-4% this month\n\n**Recommended strategy:**\n1. **Price adjustment:** Reduce to $599,000 (-4.2%) to align with recent comps and hit the $600K search bracket\n2. **Marketing refresh:** New professional photos highlighting the renovated master suite and backyard. Schedule a twilight photo shoot.\n3. **Virtual tour update:** Add drone footage of the nearby park and school zone\n4. **Open house:** Schedule for this Saturday to capture weekend traffic after the price drop\n\nThis approach has historically recovered stale listings within 14 days in this zip code.",
          "Contraproposta enviada e leads direcionados. Agora sobre Willow Park:\n\n**128 Willow Park Drive — Análise de 30 Dias no Mercado:**\n• **Anunciado por:** R$ 3,12M (4 quartos/3 banheiros, 223m²)\n• **Visitas:** 18 no total, 6 na primeira semana, apenas 2 nos últimos 10 dias\n• **Temas dos feedbacks:** \"Preço parece alto para a região,\" \"Cozinha precisa de reforma\"\n• **Movimento comparativo:** Dois anúncios comparáveis na região reduziram 3-4% este mês\n\n**Estratégia recomendada:**\n1. **Ajuste de preço:** Reduzir para R$ 2,99M (-4,2%) para alinhar com comparativos recentes e atingir a faixa de busca de R$ 3M\n2. **Renovação de marketing:** Novas fotos profissionais destacando a suíte master renovada e o quintal. Agendar sessão de fotos ao entardecer.\n3. **Atualização do tour virtual:** Adicionar filmagem de drone do parque próximo e zona escolar\n4. **Open house:** Agendar para este sábado para captar tráfego de fim de semana após a redução de preço\n\nEssa abordagem historicamente recuperou anúncios estagnados em 14 dias nessa região."
        ),
      },
      {
        role: "user",
        content: l(locale,
          "Go with the price reduction and schedule the open house. How's the team performing this month?",
          "Vá com a redução de preço e agende o open house. Como está o desempenho da equipe este mês?"
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "Price adjustment submitted to MLS — goes live within the hour. Open house scheduled for Saturday 1-4 PM with automated social media promotion.\n\n**February Team Performance:**\n• **Active listings:** 34 (up from 28 last month)\n• **Closings MTD:** 11 transactions, $5.2M total volume\n• **Pending:** 8 transactions, $3.8M in pipeline\n• **Avg days on market:** 24 days (market average: 32)\n• **Lead conversion rate:** 34% (team target: 30%)\n\n**Top performers:**\n• **Maria Santos** — 4 closings, $1.9M volume, 98% client satisfaction\n• **Kevin Wright** — 3 closings + 2 pending, strongest in luxury segment\n• **Alisha Patel** — Highest lead conversion at 41%, first-time buyer specialist\n\nCommission pool stands at $156K for the month with 8 more pending closings to process.",
          "Ajuste de preço enviado ao MLS — fica ativo dentro de uma hora. Open house agendado para sábado 13-16h com promoção automática nas redes sociais.\n\n**Desempenho da Equipe em Fevereiro:**\n• **Anúncios ativos:** 34 (aumento de 28 no mês passado)\n• **Fechamentos no mês:** 11 transações, R$ 26M de volume total\n• **Pendentes:** 8 transações, R$ 19M no pipeline\n• **Média de dias no mercado:** 24 dias (média do mercado: 32)\n• **Taxa de conversão de leads:** 34% (meta da equipe: 30%)\n\n**Destaques:**\n• **Maria Santos** — 4 fechamentos, R$ 9,5M de volume, 98% de satisfação do cliente\n• **Kevin Wright** — 3 fechamentos + 2 pendentes, mais forte no segmento de luxo\n• **Alisha Patel** — Maior conversão de leads em 41%, especialista em primeiro imóvel\n\nPool de comissões está em R$ 780K no mês com mais 8 fechamentos pendentes para processar."
        ),
      },
      {
        role: "user",
        content: l(locale,
          "Send Maria a congratulations message and pull up the full commission report.",
          "Envie uma mensagem de parabéns para Maria e puxe o relatório completo de comissões."
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "Congratulations message sent to Maria via Slack and email. Here's the commission overview:\n\n**February Commission Report:**\n| Agent | Closings | Volume | Commission | Status |\n|-------|----------|--------|------------|--------|\n| Maria Santos | 4 | $1.9M | $47,500 | Paid: 2, Pending: 2 |\n| Kevin Wright | 3 | $1.4M | $35,000 | Paid: 1, Pending: 2 |\n| Alisha Patel | 2 | $780K | $19,500 | Paid: 2 |\n| Derek Thompson | 2 | $1.1M | $27,500 | Pending: 2 |\n\n**Totals:** $156,500 in commissions, $5.2M closed volume. Brokerage split (after agent payouts): $62,600. Eight pending transactions worth approximately $95K in additional commissions expected to close by month-end.",
          "Mensagem de parabéns enviada para Maria via Slack e e-mail. Aqui está o resumo de comissões:\n\n**Relatório de Comissões de Fevereiro:**\n| Corretor | Fechamentos | Volume | Comissão | Status |\n|----------|------------|--------|----------|--------|\n| Maria Santos | 4 | R$ 9,5M | R$ 237K | Pagos: 2, Pendentes: 2 |\n| Kevin Wright | 3 | R$ 7M | R$ 175K | Pago: 1, Pendentes: 2 |\n| Alisha Patel | 2 | R$ 3,9M | R$ 97K | Pagos: 2 |\n| Derek Thompson | 2 | R$ 5,5M | R$ 137K | Pendentes: 2 |\n\n**Totais:** R$ 780K em comissões, R$ 26M de volume fechado. Comissão da imobiliária (após repasses): R$ 313K. Oito transações pendentes com aproximadamente R$ 475K em comissões adicionais com expectativa de fechamento até o final do mês."
        ),
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: l(locale, "Good morning. Here's your PropelEstate briefing for Thursday, February 20th.", "Bom dia. Aqui está seu briefing PropelEstate para quinta-feira, 20 de fevereiro."), durationMs: 3200 },
      { speaker: "agent", text: l(locale, "Twelve new leads came in overnight — four scored above 80 and are flagged for immediate outreach. Top lead is Sarah Kim, pre-approved and relocating from Chicago with an urgent timeline in the $600 to $750K range. You have five showings today starting at 10 AM at Maple Ridge.", "Doze novos leads chegaram durante a noite — quatro pontuaram acima de 80 e estão sinalizados para contato imediato. O lead principal é Sarah Kim, pré-aprovada e se mudando de Chicago com prazo urgente na faixa de R$ 3M a R$ 3,75M. Você tem cinco visitas hoje começando às 10h em Maple Ridge."), durationMs: 10200 },
      { speaker: "agent", text: l(locale, "The Thompson offer on 42 Elm Street received a seller counter at $498K. Based on comparable sales, I recommend countering at $493K — deadline is 5 PM today. The Willow Park listing hit 30 days on market and I've prepared a price reduction strategy to $599K with a Saturday open house.", "A oferta Thompson no 42 Elm Street recebeu uma contraproposta do vendedor em R$ 2,49M. Com base em vendas comparáveis, recomendo contrapropor em R$ 2,47M — prazo é 17h de hoje. O anúncio de Willow Park completou 30 dias no mercado e preparei uma estratégia de redução de preço para R$ 2,99M com open house no sábado."), durationMs: 11400 },
      { speaker: "agent", text: l(locale, "Team update: 11 closings so far this month for $5.2M in volume with 8 more pending. Lead conversion is at 34%, above the 30% target. Maria Santos leads with 4 closings and $1.9M in volume. Commission pool is tracking at $156K with more expected before month-end.", "Atualização da equipe: 11 fechamentos até agora neste mês com R$ 26M de volume e mais 8 pendentes. Conversão de leads está em 34%, acima da meta de 30%. Maria Santos lidera com 4 fechamentos e R$ 9,5M de volume. Pool de comissões está em R$ 780K com mais esperado antes do final do mês."), durationMs: 10800 },
    ],
    summary: l(locale,
      "Morning briefing covered 12 new leads with 4 high-priority, Thompson counter-offer strategy, Willow Park price adjustment plan, 5 scheduled showings, and team performance at $5.2M closed volume with 34% lead conversion.",
      "Briefing matinal cobriu 12 novos leads com 4 de alta prioridade, estratégia de contraproposta Thompson, plano de ajuste de preço de Willow Park, 5 visitas agendadas e desempenho da equipe com R$ 26M de volume fechado e 34% de conversão de leads."
    ),
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "MLS/IDX Feed", icon: "database", category: l(locale, "Listings", "Anúncios"), description: l(locale, "Real-time MLS listing sync, IDX search, and property data aggregation", "Sincronização de anúncios MLS em tempo real, busca IDX e agregação de dados de imóveis") },
      { name: "Zillow API", icon: "home", category: l(locale, "Market Data", "Dados de Mercado"), description: l(locale, "Zestimate values, market trends, and listing syndication", "Valores Zestimate, tendências de mercado e distribuição de anúncios") },
      { name: "DocuSign", icon: "pen-tool", category: l(locale, "Contracts", "Contratos"), description: l(locale, "Electronic signatures for purchase agreements, disclosures, and amendments", "Assinaturas eletrônicas para contratos de compra, divulgações e aditivos") },
      { name: "ShowingTime", icon: "clock", category: l(locale, "Scheduling", "Agendamento"), description: l(locale, "Automated showing coordination with buyer agents and lockbox access", "Coordenação automatizada de visitas com corretores de compradores e acesso ao lockbox") },
      { name: "Title Company Portal", icon: "shield", category: l(locale, "Closing", "Fechamento"), description: l(locale, "Title search status, escrow tracking, and closing document management", "Status de pesquisa de título, rastreamento de escrow e gestão de documentos de fechamento") },
      { name: "Matterport", icon: "box", category: l(locale, "Virtual Tours", "Tours Virtuais"), description: l(locale, "3D property tours, floor plans, and virtual staging integration", "Tours 3D de imóveis, plantas baixas e integração de staging virtual") },
      CI.hubspot,
      CI.googleEmail,
      CI.calendar,
      CI.slack,
      CI.stripe,
      CI.imageGen,
      CI.github,
      CI.vercel,
    ],
  },

  // ─── Build ─────────────────────────────────────────────────────────
  build: {
    checklist: [
      { title: l(locale, "Design listing and property schema with MLS data mapping", "Projetar schema de anúncios e imóveis com mapeamento de dados MLS"), stage: "plan", status: "complete" },
      { title: l(locale, "Define lead scoring model with buyer intent and financial signals", "Definir modelo de pontuação de leads com sinais de intenção de compra e financeiros"), stage: "plan", status: "complete" },
      { title: l(locale, "Build listing management dashboard with MLS sync and media gallery", "Construir dashboard de gestão de anúncios com sincronização MLS e galeria de mídia"), stage: "build", status: "complete" },
      { title: l(locale, "Implement client portal with saved searches and showing requests", "Implementar portal do cliente com buscas salvas e solicitações de visitas"), stage: "build", status: "complete" },
      { title: l(locale, "Create transaction pipeline with milestone tracking and document management", "Criar pipeline de transações com acompanhamento de marcos e gestão de documentos"), stage: "build", status: "active" },
      { title: l(locale, "Build market analysis engine with comparable sales and pricing recommendations", "Construir motor de análise de mercado com vendas comparáveis e recomendações de preço"), stage: "build", status: "pending" },
      { title: l(locale, "Integrate showing scheduler with calendar sync and automated feedback collection", "Integrar agendador de visitas com sincronização de calendário e coleta automatizada de feedback"), stage: "launch", status: "pending" },
      { title: l(locale, "Deploy with IDX compliance verification and agent onboarding", "Deploy com verificação de conformidade IDX e onboarding de corretores"), stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "listings", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "[mlsId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "new", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "clients", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "[clientId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "leads", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "transactions", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "[transactionId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "pipeline", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "showings", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "schedule", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "market", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "comps", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "reports", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "listings", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "clients", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "transactions", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "showings", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "market", type: "folder", children: [
                { name: "route.ts", type: "file" },
                { name: "comps", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
              { name: "webhooks", type: "folder", children: [
                { name: "mls", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "docusign", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "mls-client.ts", type: "file" },
          { name: "lead-scorer.ts", type: "file" },
          { name: "market-analyzer.ts", type: "file" },
          { name: "commission-calculator.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: l(locale, "Real Estate Contracts", "Contratos Imobiliários"), icon: "file-text", count: 42 },
      { name: l(locale, "Market Data & Trends", "Dados & Tendências de Mercado"), icon: "trending-up", count: 38 },
      { name: l(locale, "Zoning & Regulations", "Zoneamento & Regulamentações"), icon: "landmark", count: 24 },
      { name: l(locale, "Mortgage Guidelines", "Diretrizes de Financiamento"), icon: "banknote", count: 19 },
      { name: l(locale, "Disclosure Requirements", "Requisitos de Divulgação"), icon: "shield", count: 31 },
    ],
    documents: [
      { title: l(locale, "Purchase Agreement Template Library", "Biblioteca de Modelos de Contrato de Compra"), category: l(locale, "Real Estate Contracts", "Contratos Imobiliários"), tier: "index", lines: 120, crossRefs: [l(locale, "Seller Disclosure Checklist", "Checklist de Divulgação do Vendedor"), l(locale, "Contingency Clause Reference", "Referência de Cláusulas Condicionais")] },
      { title: l(locale, "Seller Disclosure Checklist", "Checklist de Divulgação do Vendedor"), category: l(locale, "Disclosure Requirements", "Requisitos de Divulgação"), tier: "detail", lines: 310 },
      { title: l(locale, "Contingency Clause Reference", "Referência de Cláusulas Condicionais"), category: l(locale, "Real Estate Contracts", "Contratos Imobiliários"), tier: "detail", lines: 275 },
      { title: l(locale, "Comparable Market Analysis Framework", "Framework de Análise Comparativa de Mercado"), category: l(locale, "Market Data & Trends", "Dados & Tendências de Mercado"), tier: "summary", lines: 195, crossRefs: [l(locale, "Neighborhood Price Trend Reports", "Relatórios de Tendência de Preços por Bairro")] },
      { title: l(locale, "Neighborhood Price Trend Reports", "Relatórios de Tendência de Preços por Bairro"), category: l(locale, "Market Data & Trends", "Dados & Tendências de Mercado"), tier: "detail", lines: 480 },
      { title: l(locale, "Residential Zoning Classification Guide", "Guia de Classificação de Zoneamento Residencial"), category: l(locale, "Zoning & Regulations", "Zoneamento & Regulamentações"), tier: "summary", lines: 165, crossRefs: [l(locale, "Seller Disclosure Checklist", "Checklist de Divulgação do Vendedor")] },
      { title: l(locale, "FHA/VA/Conventional Loan Requirements", "Requisitos de Financiamento FHA/VA/Convencional"), category: l(locale, "Mortgage Guidelines", "Diretrizes de Financiamento"), tier: "detail", lines: 350 },
      { title: l(locale, "Lead Paint & Environmental Disclosures", "Divulgações Ambientais & de Pintura com Chumbo"), category: l(locale, "Disclosure Requirements", "Requisitos de Divulgação"), tier: "detail", lines: 220, crossRefs: [l(locale, "Seller Disclosure Checklist", "Checklist de Divulgação do Vendedor")] },
      { title: l(locale, "Commission Structure & Split Agreements", "Estrutura de Comissões & Acordos de Divisão"), category: l(locale, "Real Estate Contracts", "Contratos Imobiliários"), tier: "summary", lines: 140 },
      { title: l(locale, "Title Insurance & Escrow Process Guide", "Guia de Seguro de Título & Processo de Escrow"), category: l(locale, "Real Estate Contracts", "Contratos Imobiliários"), tier: "detail", lines: 290, crossRefs: [l(locale, "Purchase Agreement Template Library", "Biblioteca de Modelos de Contrato de Compra")] },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: l(locale, "Listings Sold (Monthly)", "Imóveis Vendidos (Mensal)"),
        type: "bar",
        data: [
          { name: l(locale, "Sep", "Set"), value: 18 },
          { name: l(locale, "Oct", "Out"), value: 22 },
          { name: "Nov", value: 19 },
          { name: l(locale, "Dec", "Dez"), value: 14 },
          { name: "Jan", value: 21 },
          { name: l(locale, "Feb", "Fev"), value: 24 },
        ],
      },
      {
        label: l(locale, "Avg Days on Market", "Média de Dias no Mercado"),
        type: "line",
        data: [
          { name: l(locale, "Sep", "Set"), value: 35 },
          { name: l(locale, "Oct", "Out"), value: 31 },
          { name: "Nov", value: 33 },
          { name: l(locale, "Dec", "Dez"), value: 38 },
          { name: "Jan", value: 29 },
          { name: l(locale, "Feb", "Fev"), value: 24 },
        ],
      },
    ],
  },

  // ─── Orchestration ──────────────────────────────────────────────────
  orchestration: {
    agents: [
      { name: l(locale, "Broker AI", "IA Corretor Chefe"), role: l(locale, "Orchestrates all brokerage operations, agent coordination, and strategic decisions", "Orquestra todas as operações da imobiliária, coordenação de corretores e decisões estratégicas"), avatar: "🏛️", color: "blue", tasks: [l(locale, "Brokerage oversight", "Supervisão da imobiliária"), l(locale, "Agent performance tracking", "Rastreamento de desempenho de corretores"), l(locale, "Strategic planning", "Planejamento estratégico")] },
      { name: l(locale, "Listing Agent", "Agente de Anúncios"), role: l(locale, "Manages property listings, pricing strategy, and marketing campaigns", "Gerencia anúncios de imóveis, estratégia de preço e campanhas de marketing"), avatar: "🏠", color: "emerald", tasks: [l(locale, "Listing creation", "Criação de anúncios"), l(locale, "Price optimization", "Otimização de preço"), l(locale, "Marketing coordination", "Coordenação de marketing")], reportsTo: l(locale, "Broker AI", "IA Corretor Chefe") },
      { name: l(locale, "Buyer Agent", "Agente de Compradores"), role: l(locale, "Matches buyers to properties and manages showing schedules", "Combina compradores com imóveis e gerencia agendas de visitas"), avatar: "🔍", color: "violet", tasks: [l(locale, "Property matching", "Combinação de imóveis"), l(locale, "Showing scheduling", "Agendamento de visitas"), l(locale, "Offer preparation", "Preparação de ofertas")], reportsTo: l(locale, "Broker AI", "IA Corretor Chefe") },
      { name: l(locale, "Transaction Coordinator", "Coordenador de Transações"), role: l(locale, "Tracks deals from accepted offer through closing", "Acompanha negócios da oferta aceita até o fechamento"), avatar: "📋", color: "amber", tasks: [l(locale, "Document tracking", "Rastreamento de documentos"), l(locale, "Deadline management", "Gestão de prazos"), l(locale, "Closing coordination", "Coordenação de fechamento")], reportsTo: l(locale, "Broker AI", "IA Corretor Chefe") },
      { name: l(locale, "Market Analyst", "Analista de Mercado"), role: l(locale, "Generates CMA reports and monitors market trends", "Gera relatórios CMA e monitora tendências de mercado"), avatar: "📊", color: "rose", tasks: [l(locale, "Comparable analysis", "Análise comparativa"), l(locale, "Trend monitoring", "Monitoramento de tendências"), l(locale, "Price forecasting", "Previsão de preços")], reportsTo: l(locale, "Broker AI", "IA Corretor Chefe") },
      { name: l(locale, "Lead Qualifier", "Qualificador de Leads"), role: l(locale, "Scores and qualifies incoming leads based on intent and financial readiness", "Pontua e qualifica leads recebidos com base em intenção e prontidão financeira"), avatar: "🎯", color: "cyan", tasks: [l(locale, "Lead scoring", "Pontuação de leads"), l(locale, "Pre-qualification", "Pré-qualificação"), l(locale, "Nurture sequences", "Sequências de nutrição")], reportsTo: l(locale, "Broker AI", "IA Corretor Chefe") },
      { name: l(locale, "Marketing Agent", "Agente de Marketing"), role: l(locale, "Creates listing materials, social media content, and open house promotions", "Cria materiais de anúncios, conteúdo para redes sociais e promoções de open house"), avatar: "📣", color: "green", tasks: [l(locale, "Photo scheduling", "Agendamento de fotos"), l(locale, "Social media posts", "Posts em redes sociais"), l(locale, "Open house promotion", "Promoção de open house")], reportsTo: l(locale, "Listing Agent", "Agente de Anúncios") },
    ],
    humanReviewPoints: [
      { agent: l(locale, "Listing Agent", "Agente de Anúncios"), task: l(locale, "Price reduction exceeding 5%", "Redução de preço acima de 5%"), reason: l(locale, "Significant price adjustments require broker review to ensure alignment with seller expectations and market positioning", "Ajustes significativos de preço exigem revisão do corretor chefe para garantir alinhamento com expectativas do vendedor e posicionamento de mercado") },
      { agent: l(locale, "Transaction Coordinator", "Coordenador de Transações"), task: l(locale, "Contingency deadline extension", "Extensão de prazo de contingência"), reason: l(locale, "Extending inspection or financing contingencies affects closing timeline and requires agent and client approval", "Extensão de contingências de inspeção ou financiamento afeta o cronograma de fechamento e requer aprovação do corretor e cliente") },
      { agent: l(locale, "Buyer Agent", "Agente de Compradores"), task: l(locale, "Offer submission above client budget", "Envio de oferta acima do orçamento do cliente"), reason: l(locale, "Offers exceeding the buyer's stated budget or pre-approval amount require explicit client authorization before submission", "Ofertas que excedem o orçamento declarado do comprador ou valor de pré-aprovação exigem autorização explícita do cliente antes do envio") },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: channels.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? l(locale, "Full brokerage dashboard — listings, transactions, showings, and market analytics", "Dashboard completo da imobiliária — anúncios, transações, visitas e analytics de mercado") :
        ch.name === "WhatsApp" ? l(locale, "\"New showing request for 42 Elm Street — buyer pre-approved at $520K. Confirm for 2 PM?\"", "\"Nova solicitação de visita para 42 Elm Street — comprador pré-aprovado em R$ 2,6M. Confirmar para 14h?\"") :
        ch.name === "Telegram" ? l(locale, "Real-time lead alerts, showing confirmations, and offer status updates", "Alertas de leads em tempo real, confirmações de visitas e atualizações de status de ofertas") :
        ch.name === "Discord" ? l(locale, "Agent team room — coordinate showings, share market intel, and discuss deal strategy", "Sala da equipe de corretores — coordene visitas, compartilhe inteligência de mercado e discuta estratégias de negociação") :
        ch.name === "Slack" ? l(locale, "Use /listings, /showings, or /pipeline for instant property and transaction data", "Use /anuncios, /visitas ou /pipeline para dados instantâneos de imóveis e transações") :
        ch.name === "Email" ? l(locale, "Daily lead digest, showing schedules, transaction milestones, and market reports", "Resumo diário de leads, agendas de visitas, marcos de transações e relatórios de mercado") :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("propelestate", "https://propelestate.vercel.app"),
    projectUrl: "https://propelestate.vercel.app",
    stats: [
      { label: l(locale, "Properties Listed", "Imóveis Anunciados"), value: "3,500+" },
      { label: l(locale, "Lead Conversion", "Conversão de Leads"), value: "34%" },
      { label: l(locale, "Avg Days to Close", "Média de Dias para Fechar"), value: "28" },
      { label: l(locale, "Client Satisfaction", "Satisfação do Cliente"), value: "4.9/5" },
    ],
  },
  };
}
