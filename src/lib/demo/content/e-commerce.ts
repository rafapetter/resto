import type { UseCaseDemoContent } from "../types";
import type { Locale } from "../i18n/types";
import { getCommonChannels, getCommonIntegrations, makeDeployTerminal, l } from "./_shared";
import type { TechOverlay, OperationsContent } from "../types";

export default function getContent(locale: Locale): UseCaseDemoContent {
  const CI = getCommonIntegrations(locale);
  const channels = getCommonChannels(locale);

  return {
  // ─── Onboarding ────────────────────────────────────────────────────
  onboarding: {
    industries: [
      { id: "fashion", name: l(locale, "Fashion & Apparel", "Moda & Vestuário"), emoji: "👗" },
      { id: "electronics", name: l(locale, "Electronics", "Eletrônicos"), emoji: "📱" },
      { id: "food-bev", name: l(locale, "Food & Beverage", "Alimentos & Bebidas"), emoji: "🍕" },
      { id: "beauty", name: l(locale, "Beauty & Wellness", "Beleza & Bem-estar"), emoji: "💄" },
      { id: "home-garden", name: l(locale, "Home & Garden", "Casa & Jardim"), emoji: "🏡" },
      { id: "sports", name: l(locale, "Sports & Outdoor", "Esportes & Outdoor"), emoji: "⚽" },
    ],
    verticals: [
      { id: "dtc", name: l(locale, "Direct-to-Consumer", "Direto ao Consumidor") },
      { id: "marketplace", name: l(locale, "Multi-Vendor Marketplace", "Marketplace Multi-Vendedor") },
      { id: "subscription", name: l(locale, "Subscription Commerce", "Comércio por Assinatura") },
      { id: "b2b-wholesale", name: l(locale, "B2B Wholesale", "Atacado B2B") },
    ],
    features: [
      { id: "product-catalog", name: l(locale, "Product Catalog Management", "Gestão de Catálogo de Produtos") },
      { id: "inventory-sync", name: l(locale, "Inventory Sync", "Sincronização de Estoque") },
      { id: "dynamic-pricing", name: l(locale, "Dynamic Pricing", "Precificação Dinâmica") },
      { id: "cart-recovery", name: l(locale, "Cart Abandonment Recovery", "Recuperação de Carrinho Abandonado") },
      { id: "reviews-ugc", name: l(locale, "Reviews & UGC", "Avaliações & UGC") },
      { id: "personalization", name: l(locale, "AI Personalization", "Personalização com IA") },
    ],
    autoSelections: {
      industry: "fashion",
      vertical: "dtc",
      features: ["product-catalog", "inventory-sync", "cart-recovery", "personalization"],
      autonomy: {
        "product-catalog": "full",
        "inventory-sync": "full",
        "dynamic-pricing": "supervised",
        "cart-recovery": "full",
        "reviews-ugc": "full",
        "personalization": "full",
      },
    },
    projectName: "ShopVelocity",
    projectDescription: l(locale,
      "AI-driven e-commerce platform with personalized shopping experiences, smart inventory management, and automated cart recovery for DTC brands.",
      "Plataforma de e-commerce com IA, experiências de compra personalizadas, gestão inteligente de estoque e recuperação automática de carrinhos para marcas DTC."
    ),
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "ShopVelocity",
    projectBadge: "E-Commerce",
    projectDescription: l(locale,
      "Maximize revenue per visitor with AI-powered product recommendations, real-time inventory optimization, and automated marketing workflows that convert browsers into buyers.",
      "Maximize a receita por visitante com recomendações de produtos por IA, otimização de estoque em tempo real e fluxos de marketing automatizados que convertem visitantes em compradores."
    ),
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: l(locale,
          "Morning update: Yesterday's revenue was $47,820 across 312 orders (AOV: $153.27). Conversion rate hit 3.8% — up from 3.2% last week. However, cart abandonment spiked to 71% in the evening session. I've identified the likely cause: the new shipping calculator was returning errors for international addresses.",
          "Atualização matinal: A receita de ontem foi R$47.820 em 312 pedidos (ticket médio: R$153,27). A taxa de conversão atingiu 3,8% — acima dos 3,2% da semana passada. Porém, o abandono de carrinho subiu para 71% na sessão noturna. Identifiquei a causa provável: a nova calculadora de frete estava retornando erros para endereços internacionais."
        ),
      },
      {
        role: "user",
        content: l(locale,
          "Fix the shipping calculator issue and show me what products are trending this week.",
          "Corrija o problema da calculadora de frete e me mostre quais produtos estão em alta esta semana."
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "I've identified the bug — the shipping API was timing out for addresses with diacritics in the street name. A normalization fix is ready to deploy.\n\nThis week's trending products:\n1. **Oversized Linen Blazer** — 284 units sold, +62% vs. last week\n2. **Recycled Canvas Tote** — 198 units, featured in an influencer unboxing\n3. **Merino Wool Sneakers** — 156 units, low stock alert (28 remaining)\n4. **Bamboo Sunglasses** — 142 units, new arrival generating organic buzz\n\nThe Merino Wool Sneakers are at risk of stockout by Saturday at current velocity. Want me to trigger an expedited reorder?",
          "Identifiquei o bug — a API de frete estava expirando para endereços com acentos no nome da rua. Uma correção de normalização está pronta para deploy.\n\nProdutos em alta esta semana:\n1. **Blazer Oversized de Linho** — 284 unidades vendidas, +62% vs. semana passada\n2. **Bolsa de Lona Reciclada** — 198 unidades, destaque em unboxing de influenciador\n3. **Tênis de Lã Merino** — 156 unidades, alerta de estoque baixo (28 restantes)\n4. **Óculos de Sol de Bambu** — 142 unidades, lançamento gerando buzz orgânico\n\nO Tênis de Lã Merino corre risco de ruptura até sábado no ritmo atual. Quer que eu acione um pedido de reposição urgente?"
        ),
        action: {
          type: "approval",
          title: l(locale, "Deploy Shipping Fix & Reorder Sneakers", "Fazer Deploy da Correção de Frete & Repor Tênis"),
          description: l(locale,
            "Deploy the address normalization fix to production (resolves international shipping calculator errors). Also trigger an expedited reorder of 500 units of Merino Wool Sneakers from supplier MeriFoot Co. (est. delivery: 5 business days).",
            "Fazer deploy da correção de normalização de endereços em produção (resolve erros da calculadora de frete internacional). Também acionar reposição urgente de 500 unidades de Tênis de Lã Merino do fornecedor MeriFoot Co. (entrega estimada: 5 dias úteis)."
          ),
        },
      },
      {
        role: "user",
        content: l(locale,
          "Approve both. What about the abandoned carts from last night?",
          "Aprove ambos. E os carrinhos abandonados de ontem à noite?"
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "Shipping fix deployed and sneaker reorder confirmed. Now for abandoned carts:\n\n**Last night's abandoned carts**: 187 sessions, $28,400 in potential revenue.\n\nI've segmented them into three recovery campaigns:\n• **High-value carts ($200+)**: 34 carts — sending personalized 10% discount email within 1 hour\n• **Repeat visitors**: 52 carts — sending \"still interested?\" reminder with saved cart link\n• **First-time visitors**: 101 carts — entering 3-touch nurture sequence (browse reminder → social proof → limited offer)\n\nBased on historical recovery rates, I estimate we'll recapture $6,800-$8,200 from this batch.",
          "Correção de frete implantada e reposição de tênis confirmada. Agora os carrinhos abandonados:\n\n**Carrinhos abandonados ontem à noite**: 187 sessões, R$28.400 em receita potencial.\n\nSegmentei em três campanhas de recuperação:\n• **Carrinhos de alto valor (R$200+)**: 34 carrinhos — enviando e-mail personalizado com 10% de desconto em 1 hora\n• **Visitantes recorrentes**: 52 carrinhos — enviando lembrete \"ainda interessado?\" com link do carrinho salvo\n• **Visitantes novos**: 101 carrinhos — entrando em sequência de 3 toques (lembrete de navegação → prova social → oferta limitada)\n\nCom base nas taxas históricas de recuperação, estimo recapturar R$6.800-R$8.200 deste lote."
        ),
      },
      {
        role: "user",
        content: l(locale,
          "Launch the campaigns. Also, how's our inventory health overall?",
          "Lance as campanhas. E como está a saúde do nosso estoque em geral?"
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "Campaigns launched — you'll see recovery metrics in tomorrow's digest. Inventory snapshot:\n\n• **Healthy (>30 days supply)**: 842 SKUs (78%)\n• **Watch (15-30 days)**: 145 SKUs (13%) — including 3 best-sellers\n• **Critical (<15 days)**: 52 SKUs (5%) — Merino Sneakers reorder in progress\n• **Overstock (>90 days)**: 43 SKUs (4%) — mostly last season's collection\n\nFor the overstock items, I recommend a flash sale. The 43 SKUs represent $34K in tied-up capital. A 30% markdown would move most within 2 weeks based on price elasticity modeling.",
          "Campanhas lançadas — você verá as métricas de recuperação no resumo de amanhã. Visão geral do estoque:\n\n• **Saudável (>30 dias de suprimento)**: 842 SKUs (78%)\n• **Atenção (15-30 dias)**: 145 SKUs (13%) — incluindo 3 mais vendidos\n• **Crítico (<15 dias)**: 52 SKUs (5%) — reposição do Tênis Merino em andamento\n• **Excesso (>90 dias)**: 43 SKUs (4%) — maioria da coleção da temporada anterior\n\nPara os itens em excesso, recomendo uma venda relâmpago. Os 43 SKUs representam R$34K em capital parado. Uma remarcação de 30% movimentaria a maioria em 2 semanas com base na modelagem de elasticidade de preço."
        ),
      },
      {
        role: "user",
        content: l(locale,
          "Set up the flash sale for next Tuesday. Use the seasonal clearance template.",
          "Configure a venda relâmpago para terça-feira que vem. Use o template de liquidação sazonal."
        ),
      },
      {
        role: "assistant",
        content: l(locale,
          "Flash sale scheduled for Tuesday, Feb 24 at 9 AM EST:\n• 43 overstock SKUs with 30% markdown\n• Using \"Seasonal Clearance\" email template — sending to the 12,400 subscribers who engaged in the last 30 days\n• Landing page auto-generated with countdown timer\n• Social ads will go live 24 hours before on Instagram and Facebook\n• Inventory holds released for discounted items\n\nEstimated revenue recovery: $22K-$26K. I'll have the creative assets ready for your review by Monday morning.",
          "Venda relâmpago agendada para terça, 24 de fev às 9h:\n• 43 SKUs em excesso com 30% de desconto\n• Usando template \"Liquidação Sazonal\" — enviando para os 12.400 assinantes que interagiram nos últimos 30 dias\n• Landing page gerada automaticamente com timer de contagem regressiva\n• Anúncios em redes sociais entram no ar 24 horas antes no Instagram e Facebook\n• Reservas de estoque liberadas para itens com desconto\n\nReceita estimada de recuperação: R$22K-R$26K. Terei os criativos prontos para sua revisão na segunda de manhã."
        ),
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: l(locale, "Good morning. Here's your ShopVelocity commerce briefing for February 20th.", "Bom dia. Aqui está seu briefing de comércio ShopVelocity para 20 de fevereiro."), durationMs: 3200 },
      { speaker: "agent", text: l(locale, "Yesterday's revenue was $47,820 across 312 orders, with an average order value of $153. Conversion rate is at 3.8%, trending upward. However, cart abandonment jumped to 71% due to a shipping calculator bug affecting international orders — a fix is ready to deploy.", "A receita de ontem foi R$47.820 em 312 pedidos, com ticket médio de R$153. A taxa de conversão está em 3,8%, com tendência de alta. Porém, o abandono de carrinho subiu para 71% devido a um bug na calculadora de frete afetando pedidos internacionais — uma correção está pronta para deploy."), durationMs: 10400 },
      { speaker: "agent", text: l(locale, "Top trending product is the Oversized Linen Blazer with 284 units sold this week. Merino Wool Sneakers are at risk of stockout — 28 units remaining at current velocity. I've prepared an expedited reorder for your approval.", "O produto mais em alta é o Blazer Oversized de Linho com 284 unidades vendidas esta semana. O Tênis de Lã Merino corre risco de ruptura — 28 unidades restantes no ritmo atual. Preparei um pedido de reposição urgente para sua aprovação."), durationMs: 8600 },
      { speaker: "agent", text: l(locale, "Marketing update: 187 abandoned carts from last night representing $28K in potential revenue. Recovery campaigns are segmented and ready to launch. The flash sale for 43 overstock SKUs is being prepped for Tuesday with estimated recovery of $22K to $26K.", "Atualização de marketing: 187 carrinhos abandonados ontem à noite representando R$28K em receita potencial. Campanhas de recuperação estão segmentadas e prontas para lançamento. A venda relâmpago para 43 SKUs em excesso está sendo preparada para terça com recuperação estimada de R$22K a R$26K."), durationMs: 9800 },
    ],
    summary: l(locale,
      "Commerce briefing covered $47.8K daily revenue, trending products, shipping bug fix, Merino Sneakers stockout risk, abandoned cart recovery campaigns, and upcoming flash sale for overstock clearance.",
      "Briefing de comércio cobriu R$47,8K de receita diária, produtos em alta, correção de bug de frete, risco de ruptura do Tênis Merino, campanhas de recuperação de carrinhos abandonados e venda relâmpago de liquidação de excesso."
    ),
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "Shopify", icon: "shopping-bag", category: l(locale, "Commerce", "Comércio"), description: l(locale, "Storefront management, product catalog, and checkout processing", "Gestão da loja, catálogo de produtos e processamento de checkout") },
      { name: "Klaviyo", icon: "mail", category: "Marketing", description: l(locale, "Email/SMS marketing automation with behavioral triggers", "Automação de marketing por e-mail/SMS com gatilhos comportamentais") },
      { name: "ShipStation", icon: "truck", category: l(locale, "Fulfillment", "Fulfillment"), description: l(locale, "Multi-carrier shipping, label printing, and delivery tracking", "Envio multi-transportadora, impressão de etiquetas e rastreamento de entregas") },
      { name: "Returnly", icon: "rotate-ccw", category: l(locale, "Returns", "Devoluções"), description: l(locale, "Automated returns processing with instant credit and exchanges", "Processamento automatizado de devoluções com crédito instantâneo e trocas") },
      { name: "Yotpo", icon: "star", category: l(locale, "Social Proof", "Prova Social"), description: l(locale, "Product reviews, UGC collection, and loyalty programs", "Avaliações de produtos, coleta de UGC e programas de fidelidade") },
      { name: "Algolia", icon: "search", category: l(locale, "Search", "Busca"), description: l(locale, "AI-powered product search with typo tolerance and faceting", "Busca de produtos com IA, tolerância a erros de digitação e filtros facetados") },
      CI.stripe,
      CI.analytics,
      CI.googleEmail,
      CI.slack,
      CI.imageGen,
      CI.posthog,
      CI.github,
      CI.vercel,
      CI.sentry,
    ],
  },

  // ─── Build ─────────────────────────────────────────────────────────
  build: {
    checklist: [
      { title: l(locale, "Design product catalog schema with variant and inventory models", "Projetar schema do catálogo de produtos com modelos de variantes e estoque"), stage: "plan", status: "complete" },
      { title: l(locale, "Map Shopify Storefront API endpoints and webhook events", "Mapear endpoints da API Shopify Storefront e eventos de webhook"), stage: "plan", status: "complete" },
      { title: l(locale, "Build product listing pages with AI-powered search and filters", "Construir páginas de listagem de produtos com busca e filtros por IA"), stage: "build", status: "complete" },
      { title: l(locale, "Implement cart system with real-time inventory validation", "Implementar sistema de carrinho com validação de estoque em tempo real"), stage: "build", status: "complete" },
      { title: l(locale, "Create abandoned cart recovery engine with multi-touch sequences", "Criar motor de recuperação de carrinhos abandonados com sequências multi-toque"), stage: "build", status: "active" },
      { title: l(locale, "Build personalization engine for product recommendations", "Construir motor de personalização para recomendações de produtos"), stage: "build", status: "pending" },
      { title: l(locale, "Integrate multi-carrier shipping with rate comparison", "Integrar envio multi-transportadora com comparação de tarifas"), stage: "launch", status: "pending" },
      { title: l(locale, "Deploy with CDN optimization and performance monitoring", "Deploy com otimização de CDN e monitoramento de performance"), stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "shop", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "[category]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "product", type: "folder", children: [
                { name: "[slug]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
            ],
          },
          { name: "cart", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
          { name: "checkout", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
          {
            name: "dashboard", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "orders", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "inventory", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "analytics", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "campaigns", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "products", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "cart", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "orders", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "inventory", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "recommendations", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "webhooks", type: "folder", children: [
                { name: "shopify", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "shipping", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "shopify-client.ts", type: "file" },
          { name: "recommendation-engine.ts", type: "file" },
          { name: "cart-recovery.ts", type: "file" },
          { name: "inventory-sync.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: l(locale, "Product Catalog", "Catálogo de Produtos"), icon: "shopping-bag", count: 48 },
      { name: l(locale, "Marketing Playbooks", "Playbooks de Marketing"), icon: "megaphone", count: 22 },
      { name: l(locale, "Fulfillment SOPs", "SOPs de Fulfillment"), icon: "truck", count: 16 },
      { name: l(locale, "Customer Service Scripts", "Scripts de Atendimento ao Cliente"), icon: "headphones", count: 34 },
      { name: l(locale, "Pricing Strategy", "Estratégia de Precificação"), icon: "tag", count: 11 },
    ],
    documents: [
      { title: l(locale, "Product Photography & Copy Guidelines", "Diretrizes de Fotografia e Descrição de Produtos"), category: l(locale, "Product Catalog", "Catálogo de Produtos"), tier: "index", lines: 95, crossRefs: [l(locale, "Brand Voice Guide", "Guia de Voz da Marca"), l(locale, "SEO Best Practices for Product Pages", "Melhores Práticas de SEO para Páginas de Produtos")] },
      { title: l(locale, "Brand Voice Guide", "Guia de Voz da Marca"), category: l(locale, "Marketing Playbooks", "Playbooks de Marketing"), tier: "detail", lines: 280 },
      { title: l(locale, "SEO Best Practices for Product Pages", "Melhores Práticas de SEO para Páginas de Produtos"), category: l(locale, "Marketing Playbooks", "Playbooks de Marketing"), tier: "detail", lines: 210 },
      { title: l(locale, "Cart Abandonment Recovery Playbook", "Playbook de Recuperação de Carrinho Abandonado"), category: l(locale, "Marketing Playbooks", "Playbooks de Marketing"), tier: "summary", lines: 175, crossRefs: [l(locale, "Email Sequence Templates", "Templates de Sequência de E-mail")] },
      { title: l(locale, "Email Sequence Templates", "Templates de Sequência de E-mail"), category: l(locale, "Marketing Playbooks", "Playbooks de Marketing"), tier: "detail", lines: 420 },
      { title: l(locale, "Returns & Exchanges Policy", "Política de Devoluções e Trocas"), category: l(locale, "Customer Service Scripts", "Scripts de Atendimento ao Cliente"), tier: "summary", lines: 130 },
      { title: l(locale, "Shipping Carrier Rate Comparison", "Comparação de Tarifas de Transportadoras"), category: l(locale, "Fulfillment SOPs", "SOPs de Fulfillment"), tier: "detail", lines: 340, crossRefs: [l(locale, "International Shipping Guidelines", "Diretrizes de Envio Internacional")] },
      { title: l(locale, "International Shipping Guidelines", "Diretrizes de Envio Internacional"), category: l(locale, "Fulfillment SOPs", "SOPs de Fulfillment"), tier: "detail", lines: 260 },
      { title: l(locale, "Dynamic Pricing Rules Engine", "Motor de Regras de Precificação Dinâmica"), category: l(locale, "Pricing Strategy", "Estratégia de Precificação"), tier: "summary", lines: 185, crossRefs: [l(locale, "Cart Abandonment Recovery Playbook", "Playbook de Recuperação de Carrinho Abandonado")] },
      { title: l(locale, "Flash Sale Operations Checklist", "Checklist de Operações de Venda Relâmpago"), category: l(locale, "Marketing Playbooks", "Playbooks de Marketing"), tier: "summary", lines: 110 },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: l(locale, "Daily Revenue ($K)", "Receita Diária (R$K)"),
        type: "bar",
        data: [
          { name: l(locale, "Mon", "Seg"), value: 38 },
          { name: l(locale, "Tue", "Ter"), value: 42 },
          { name: l(locale, "Wed", "Qua"), value: 45 },
          { name: l(locale, "Thu", "Qui"), value: 48 },
          { name: l(locale, "Fri", "Sex"), value: 56 },
          { name: l(locale, "Sat", "Sáb"), value: 62 },
          { name: l(locale, "Sun", "Dom"), value: 51 },
        ],
      },
      {
        label: l(locale, "Conversion Rate (%)", "Taxa de Conversão (%)"),
        type: "line",
        data: [
          { name: l(locale, "Sep", "Set"), value: 2.8 },
          { name: l(locale, "Oct", "Out"), value: 3.1 },
          { name: "Nov", value: 3.6 },
          { name: l(locale, "Dec", "Dez"), value: 4.2 },
          { name: l(locale, "Jan", "Jan"), value: 3.4 },
          { name: l(locale, "Feb", "Fev"), value: 3.8 },
        ],
      },
    ],
  },
  orchestration: {
    agents: [
      { name: l(locale, "Commerce Director", "Diretor de Comércio"), role: l(locale, "Orchestrates all e-commerce operations and revenue optimization", "Orquestra todas as operações de e-commerce e otimização de receita"), avatar: "🛍️", color: "blue", tasks: [l(locale, "Revenue monitoring", "Monitoramento de receita"), l(locale, "Strategy coordination", "Coordenação de estratégia"), l(locale, "Performance analysis", "Análise de performance")] },
      { name: l(locale, "Product Agent", "Agente de Produtos"), role: l(locale, "Manages catalog, pricing, and product content", "Gerencia catálogo, precificação e conteúdo de produtos"), avatar: "📦", color: "emerald", tasks: [l(locale, "Catalog updates", "Atualizações de catálogo"), l(locale, "Dynamic pricing", "Precificação dinâmica"), l(locale, "SEO optimization", "Otimização SEO")], reportsTo: l(locale, "Commerce Director", "Diretor de Comércio") },
      { name: l(locale, "Inventory Agent", "Agente de Estoque"), role: l(locale, "Tracks stock levels and manages reorders", "Rastreia níveis de estoque e gerencia reposições"), avatar: "📊", color: "violet", tasks: [l(locale, "Stock monitoring", "Monitoramento de estoque"), l(locale, "Reorder triggers", "Gatilhos de reposição"), l(locale, "Supplier coordination", "Coordenação de fornecedores")], reportsTo: l(locale, "Commerce Director", "Diretor de Comércio") },
      { name: l(locale, "Cart Recovery Agent", "Agente de Recuperação de Carrinho"), role: l(locale, "Recovers abandoned carts with targeted campaigns", "Recupera carrinhos abandonados com campanhas direcionadas"), avatar: "🛒", color: "amber", tasks: [l(locale, "Abandonment detection", "Detecção de abandono"), l(locale, "Recovery sequences", "Sequências de recuperação"), l(locale, "Discount optimization", "Otimização de descontos")], reportsTo: l(locale, "Commerce Director", "Diretor de Comércio") },
      { name: l(locale, "Personalization Engine", "Motor de Personalização"), role: l(locale, "Delivers AI-powered product recommendations", "Entrega recomendações de produtos por IA"), avatar: "✨", color: "rose", tasks: [l(locale, "Behavioral tracking", "Rastreamento comportamental"), l(locale, "Recommendation serving", "Serviço de recomendações"), l(locale, "A/B testing", "Testes A/B")], reportsTo: l(locale, "Commerce Director", "Diretor de Comércio") },
      { name: l(locale, "Marketing Agent", "Agente de Marketing"), role: l(locale, "Manages email campaigns, social ads, and promotions", "Gerencia campanhas de e-mail, anúncios sociais e promoções"), avatar: "📣", color: "cyan", tasks: [l(locale, "Campaign scheduling", "Agendamento de campanhas"), l(locale, "Audience segmentation", "Segmentação de público"), l(locale, "Creative generation", "Geração de criativos")], reportsTo: l(locale, "Commerce Director", "Diretor de Comércio") },
      { name: l(locale, "Fulfillment Agent", "Agente de Fulfillment"), role: l(locale, "Coordinates shipping, tracking, and delivery", "Coordena envio, rastreamento e entrega"), avatar: "🚚", color: "green", tasks: [l(locale, "Order routing", "Roteamento de pedidos"), l(locale, "Carrier selection", "Seleção de transportadora"), l(locale, "Delivery tracking", "Rastreamento de entrega")], reportsTo: l(locale, "Inventory Agent", "Agente de Estoque") },
      { name: l(locale, "Customer Support Agent", "Agente de Suporte ao Cliente"), role: l(locale, "Handles order inquiries and returns processing", "Gerencia consultas de pedidos e processamento de devoluções"), avatar: "💬", color: "slate", tasks: [l(locale, "Order status inquiries", "Consultas de status de pedido"), l(locale, "Return processing", "Processamento de devoluções"), l(locale, "Review solicitation", "Solicitação de avaliações")], reportsTo: l(locale, "Commerce Director", "Diretor de Comércio") },
      { name: l(locale, "Analytics Agent", "Agente de Analytics"), role: l(locale, "Tracks KPIs and generates actionable insights", "Rastreia KPIs e gera insights acionáveis"), avatar: "📈", color: "orange", tasks: [l(locale, "Funnel analysis", "Análise de funil"), l(locale, "Cohort tracking", "Rastreamento de coorte"), l(locale, "Revenue attribution", "Atribuição de receita")], reportsTo: l(locale, "Commerce Director", "Diretor de Comércio") },
    ],
    humanReviewPoints: [
      { agent: l(locale, "Product Agent", "Agente de Produtos"), task: l(locale, "Price reduction exceeding 40%", "Redução de preço excedendo 40%"), reason: l(locale, "Deep discounts may impact brand perception and require marketing approval", "Descontos profundos podem impactar a percepção da marca e requerem aprovação de marketing") },
      { agent: l(locale, "Cart Recovery Agent", "Agente de Recuperação de Carrinho"), task: l(locale, "High-value discount code generation", "Geração de código de desconto de alto valor"), reason: l(locale, "Discount codes above $50 require finance team authorization to prevent margin erosion", "Códigos de desconto acima de R$50 requerem autorização da equipe financeira para evitar erosão de margem") },
      { agent: l(locale, "Marketing Agent", "Agente de Marketing"), task: l(locale, "Campaign targeting VIP customers", "Campanha direcionada a clientes VIP"), reason: l(locale, "Communications to top-tier loyalty members require brand team review for tone and exclusivity", "Comunicações para membros de fidelidade top requerem revisão da equipe de marca para tom e exclusividade") },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: channels.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? l(locale, "Full commerce dashboard — orders, inventory, campaigns, and revenue analytics", "Painel completo de comércio — pedidos, estoque, campanhas e analytics de receita") :
        ch.name === "WhatsApp" ? l(locale, "\"Your Merino Sneakers are back in stock! Only 28 pairs left. Shop now.\"", "\"Seu Tênis Merino voltou ao estoque! Apenas 28 pares restantes. Compre agora.\"") :
        ch.name === "Telegram" ? l(locale, "Real-time order alerts, inventory warnings, and daily revenue summaries", "Alertas de pedidos em tempo real, avisos de estoque e resumos diários de receita") :
        ch.name === "Discord" ? l(locale, "Team storefront ops — coordinate launches, flash sales, and inventory moves", "Operações de loja da equipe — coordene lançamentos, vendas relâmpago e movimentações de estoque") :
        ch.name === "Slack" ? l(locale, "Use /orders, /inventory, or /revenue for instant commerce data", "Use /orders, /inventory ou /revenue para dados de comércio instantâneos") :
        ch.name === "Email" ? l(locale, "Daily revenue digest, campaign performance, and inventory alerts", "Resumo diário de receita, performance de campanhas e alertas de estoque") :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("shopvelocity", "https://shopvelocity.vercel.app"),
    projectUrl: "https://shopvelocity.vercel.app",
    stats: [
      { label: l(locale, "Monthly Revenue", "Receita Mensal"), value: "$342K" },
      { label: l(locale, "Conversion Rate", "Taxa de Conversão"), value: "3.8%" },
      { label: l(locale, "Cart Recovery", "Recuperação de Carrinho"), value: "24%" },
      { label: l(locale, "Avg. Order Value", "Ticket Médio"), value: "$153" },
    ],
  },

  // ─── Operations (Day 2+) ──────────────────────────────────────────
  operations: {
    events: [
      { day: 2, label: l(locale, "SEO optimization: meta tags, structured data, and sitemap generated for all 842 product pages", "Otimização SEO: meta tags, dados estruturados e sitemap gerados para todas as 842 páginas de produtos"), type: "gtm" },
      { day: 3, label: l(locale, "First customer onboarded — order #001 processed and shipped automatically", "Primeiro cliente integrado — pedido #001 processado e enviado automaticamente"), type: "growth" },
      { day: 5, label: l(locale, "Cart abandonment recovery sent 312 emails — 24% recovery rate, $6.8K recaptured", "Recuperação de carrinho abandonado enviou 312 e-mails — taxa de recuperação de 24%, R$6,8K recapturados"), type: "gtm" },
      { day: 7, label: l(locale, "Uptime monitor: 100% availability, avg response time 142ms, zero errors detected", "Monitor de uptime: 100% disponibilidade, tempo de resposta médio 142ms, zero erros detectados"), type: "monitor" },
      { day: 10, label: l(locale, "Inventory Agent triggered auto-reorder for 3 low-stock SKUs from supplier API", "Agente de Estoque acionou reposição automática de 3 SKUs com estoque baixo via API do fornecedor"), type: "iterate" },
      { day: 14, label: l(locale, "Instagram Shopping integration deployed — social feed synced with product catalog", "Integração com Instagram Shopping implantada — feed social sincronizado com catálogo de produtos"), type: "gtm" },
      { day: 21, label: l(locale, "Bug detected in checkout flow for Safari mobile — patch deployed in 4 minutes", "Bug detectado no fluxo de checkout no Safari mobile — patch implantado em 4 minutos"), type: "fix" },
      { day: 30, label: l(locale, "Monthly report: 1,247 orders, $191K revenue, 3.9% conversion, 99.98% uptime", "Relatório mensal: 1.247 pedidos, R$191K de receita, 3,9% de conversão, 99,98% de uptime"), type: "monitor" },
      { day: 45, label: l(locale, "A/B test completed: new product page layout → +12% conversion lift, deployed to 100%", "Teste A/B concluído: novo layout da página de produto → +12% de aumento na conversão, implantado para 100%"), type: "iterate" },
      { day: 60, label: l(locale, "Launched loyalty program — 2,400 members enrolled, repeat purchase rate up 18%", "Programa de fidelidade lançado — 2.400 membros inscritos, taxa de recompra aumentou 18%"), type: "growth" },
      { day: 90, label: l(locale, "Q1 review: $580K total revenue, 3,800 customers, NPS 72, zero downtime incidents", "Revisão Q1: R$580K de receita total, 3.800 clientes, NPS 72, zero incidentes de indisponibilidade"), type: "growth" },
    ],
    finalMetrics: [
      { label: l(locale, "Q1 Revenue", "Receita Q1"), value: "$580K" },
      { label: l(locale, "Customers", "Clientes"), value: "3,800" },
      { label: "Uptime", value: "99.98%" },
      { label: "Time to Market", value: "12 min" },
    ],
  } satisfies OperationsContent,

  // ─── Tech Overlay ─────────────────────────────────────────────────
  techOverlay: {
    build: {
      codeSnippets: [
        {
          filename: "app/shop/[category]/page.tsx",
          language: "tsx",
          code: `import { Suspense } from "react";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ProductGrid } from "@/components/product-grid";
import { Filters } from "@/components/filters";

type Props = { params: Promise<{ category: string }> };

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const items = await db
    .select()
    .from(products)
    .where(eq(products.category, category))
    .orderBy(desc(products.createdAt));

  return (
    <div className="grid grid-cols-[240px_1fr] gap-6">
      <Filters category={category} />
      <Suspense fallback={<ProductGrid.Skeleton />}>
        <ProductGrid products={items} />
      </Suspense>
    </div>
  );
}`,
        },
        {
          filename: "lib/cart-recovery.ts",
          language: "ts",
          code: `import { db } from "@/lib/db";
import { carts, recoveryEmails } from "@/lib/db/schema";
import { eq, lt, and, isNull } from "drizzle-orm";
import { sendEmail } from "@/lib/email";

export async function processAbandonedCarts() {
  const threshold = new Date(Date.now() - 60 * 60 * 1000);

  const abandoned = await db
    .select()
    .from(carts)
    .where(
      and(
        lt(carts.updatedAt, threshold),
        isNull(carts.completedAt),
        eq(carts.recoveryStatus, "none")
      )
    );

  for (const cart of abandoned) {
    const discount = cart.totalCents > 20000 ? 10 : 5;

    await sendEmail({
      to: cart.email,
      template: "cart-recovery",
      data: { items: cart.items, discount },
    });

    await db
      .update(carts)
      .set({ recoveryStatus: "email_sent" })
      .where(eq(carts.id, cart.id));
  }

  return { processed: abandoned.length };
}`,
        },
        {
          filename: "components/product-grid.tsx",
          language: "tsx",
          code: `"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/db/schema";

type Props = { products: Product[] };

export function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="group overflow-hidden">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {product.stock < 10 && (
              <Badge className="absolute right-2 top-2 bg-red-500">
                Only {product.stock} left
              </Badge>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-lg font-bold">
              {formatPrice(product.priceCents)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}`,
        },
      ],
      terminalCommands: [
        { command: "pnpm install", output: "Packages: +312\nProgress: resolved 487, reused 412, downloaded 75\ndone in 5.1s", delay: 2000 },
        { command: "pnpm drizzle-kit push", output: "Pushing schema...\n\u2713 products table created\n\u2713 carts table created\n\u2713 orders table created\n\u2713 recovery_emails table created\n\u2713 4 tables synced", delay: 3500 },
        { command: "pnpm test", output: "Running 18 test suites...\n\u2713 Cart recovery (4 tests)\n\u2713 Product API (5 tests)\n\u2713 Checkout flow (3 tests)\n\u2713 Inventory sync (3 tests)\n\u2713 Components (3 tests)\n\nAll 18 tests passed", delay: 5500 },
        { command: "pnpm build", output: "\u25b2 Next.js 16.0.0\n\u2713 Compiled in 4.8s\n\nRoute (app)              Size\n\u25cb /                      5.4 kB\n\u25cb /shop/[category]       3.8 kB\n\u25cb /product/[slug]        4.2 kB\n\u25cb /cart                  6.1 kB\n\u25cb /checkout              7.8 kB\u0192 /api/products          2.1 kB\n\u0192 /api/cart              1.8 kB\n\u0192 /api/webhooks/shopify  0.9 kB", delay: 8000 },
      ],
      testResults: [
        { name: "Cart: abandoned detection fires after 1hr", passed: true },
        { name: "Cart: recovery email includes discount code", passed: true },
        { name: "Cart: high-value carts get 10% discount", passed: true },
        { name: "Products: GET returns filtered by category", passed: true },
        { name: "Products: search with Algolia typo tolerance", passed: true },
        { name: "Checkout: validates inventory before charge", passed: true },
        { name: "Checkout: Stripe webhook updates order status", passed: true },
        { name: "Inventory: low-stock triggers reorder alert", passed: true },
        { name: "Component: ProductGrid renders correctly", passed: true },
        { name: "E2E: full purchase flow completes", passed: true },
      ],
    },
    deploy: {
      cicdSteps: [
        { name: "Install dependencies", duration: "5.1s" },
        { name: "Run tests", duration: "8.2s" },
        { name: "Build application", duration: "4.8s" },
        { name: "Deploy to Vercel", duration: "12s" },
        { name: "Run health checks", duration: "3s" },
      ],
      infraComponents: ["Vercel Edge", "Neon PostgreSQL", "Stripe", "Shopify API", "Algolia", "Sentry"],
    },
  } satisfies TechOverlay,
  };
}
