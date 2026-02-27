export type Locale = "en" | "pt";

export type TranslationKeys = {
  // Matrix entry
  "matrix.building": string;
  "matrix.howDeep": string;
  "matrix.toGo": string;
  "matrix.choosePath": string;
  "matrix.seeTheMagic": string;
  "matrix.businessOutcomes": string;
  "matrix.seeHowBuilt": string;
  "matrix.technicalDetails": string;
  "matrix.seeBothPaths": string;
  "matrix.magicTooltip": string;
  "matrix.techTooltip": string;
  "matrix.backToUseCases": string;
  "matrix.or": string;
  "matrix.poweredBy": string;

  // Header
  "header.useCases": string;
  "header.play": string;
  "header.pause": string;
  "header.signUp": string;

  // Phase labels
  "phase.setup": string;
  "phase.dashboard": string;
  "phase.integrations": string;
  "phase.chat": string;
  "phase.voice": string;
  "phase.build": string;
  "phase.knowledge": string;
  "phase.analytics": string;
  "phase.agents": string;
  "phase.deploy": string;
  "phase.day2": string;

  // Sidebar
  "sidebar.navigation": string;
  "sidebar.projects": string;
  "sidebar.analytics": string;
  "sidebar.billing": string;
  "sidebar.settings": string;
  "sidebar.chat": string;
  "sidebar.checklist": string;
  "sidebar.knowledgeBase": string;
  "sidebar.integrations": string;
  "sidebar.agents": string;

  // Narrative timeline
  "timeline.traditional": string;
  "timeline.resto": string;
  "timeline.saved": string;

  // Onboarding
  "onboarding.stepIndustry": string;
  "onboarding.stepVertical": string;
  "onboarding.stepFeatures": string;
  "onboarding.stepAutonomy": string;
  "onboarding.questionIndustry": string;
  "onboarding.questionVertical": string;
  "onboarding.questionFeatures": string;
  "onboarding.questionAutonomy": string;
  "onboarding.continue": string;
  "onboarding.launchProject": string;
  "onboarding.thinking": string;
  "onboarding.analyzingIndustry": string;
  "onboarding.buildingBlueprint": string;
  "onboarding.settingUp": string;
  "onboarding.autoKnowledge": string;
  "onboarding.autoCodeGen": string;
  "onboarding.autoDeployment": string;
  "onboarding.autoIntegrations": string;
  "onboarding.autoComms": string;
  "onboarding.autoFinancial": string;
  "onboarding.levelAuto": string;
  "onboarding.levelNotify": string;
  "onboarding.levelQuick": string;
  "onboarding.levelDetail": string;
  "onboarding.levelManual": string;

  // Dashboard
  "dashboard.chatWithResto": string;
  "dashboard.chatDescription": string;
  "dashboard.checklist": string;
  "dashboard.checklistDescription": string;
  "dashboard.knowledgeBase": string;
  "dashboard.knowledgeBaseDescription": string;
  "dashboard.integrations": string;
  "dashboard.integrationsDescription": string;
  "dashboard.agentTeam": string;
  "dashboard.agentTeamDescription": string;
  "dashboard.analytics": string;
  "dashboard.analyticsDescription": string;
  "dashboard.webApp": string;
  "dashboard.webAppDescription": string;
  "dashboard.mobileApp": string;
  "dashboard.mobileAppDescription": string;
  "dashboard.adminPanel": string;
  "dashboard.adminPanelDescription": string;
  "dashboard.live": string;
  "dashboard.building": string;
  "dashboard.active": string;
  "dashboard.appsAndProducts": string;
  "dashboard.projectTools": string;
  "dashboard.buyDomain": string;
  "dashboard.recommended": string;
  "dashboard.domainDescription": string;
  "dashboard.settingUpNext": string;

  // Integrations
  "integrations.connecting": string;
  "integrations.servicesConnected": string;

  // Build
  "build.progress": string;
  "build.checklist": string;
  "build.projectStructure": string;
  "build.explorer": string;
  "build.testResults": string;
  "build.theMagic": string;
  "build.underTheHood": string;
  "build.terminal": string;
  "build.livePreview": string;
  "build.stagePlan": string;
  "build.stageBuild": string;
  "build.stageLaunch": string;
  "build.stageGrow": string;
  "build.pass": string;

  // Analytics
  "analytics.title": string;
  "analytics.subtitle": string;
  "analytics.live": string;
  "analytics.unitEconomics": string;
  "analytics.cac": string;
  "analytics.costPerAcquisition": string;
  "analytics.ltv": string;
  "analytics.lifetimeValue": string;
  "analytics.ltvCac": string;
  "analytics.healthy": string;
  "analytics.needsWork": string;
  "analytics.grossMargin": string;
  "analytics.afterCogs": string;
  "analytics.avgOrderValue": string;
  "analytics.monthlyChurn": string;
  "analytics.arpu": string;
  "analytics.paybackPeriod": string;
  "analytics.conversionFunnel": string;
  "analytics.cohortRetention": string;
  "analytics.userRetention": string;
  "analytics.revenueRetention": string;
  "analytics.topPerformers": string;
  "analytics.visitors": string;
  "analytics.engaged": string;
  "analytics.cart": string;
  "analytics.checkout": string;
  "analytics.purchased": string;
  "analytics.cacPayback": string;
  "analytics.npsScore": string;
  "analytics.conversionRate": string;
  "analytics.monthlyRevenue": string;
  "analytics.week": string;

  // Orchestration
  "orchestration.live": string;
  "orchestration.agents": string;
  "orchestration.working": string;
  "orchestration.syncing": string;
  "orchestration.review": string;
  "orchestration.idle": string;
  "orchestration.currentTask": string;
  "orchestration.humanReview": string;

  // Knowledge
  "knowledge.title": string;
  "knowledge.subtitle": string;
  "knowledge.categories": string;
  "knowledge.allDocuments": string;
  "knowledge.documents": string;
  "knowledge.indexing": string;
  "knowledge.agentQuery": string;
  "knowledge.semanticSearch": string;
  "knowledge.contextAssembled": string;
  "knowledge.inContext": string;

  // Channels
  "channels.alwaysAccessible": string;
  "channels.description": string;
  "channels.ai": string;
  "channels.allConnected": string;
  "channels.allConnectedDescription": string;

  // Deploy
  "deploy.launchingIn": string;
  "deploy.liftoff": string;
  "deploy.terminalTitle": string;
  "deploy.deployingProduct": string;
  "deploy.settingUpAuto": string;
  "deploy.github": string;
  "deploy.build": string;
  "deploy.deploy": string;
  "deploy.appIsLive": string;
  "deploy.deployedSuccessfully": string;
  "deploy.productionDeployment": string;
  "deploy.live": string;
  "deploy.transitioningDay2": string;
  "deploy.infraDatabase": string;
  "deploy.infraDatabaseDesc": string;
  "deploy.infraEdge": string;
  "deploy.infraEdgeDesc": string;
  "deploy.infraSsl": string;
  "deploy.infraSslDesc": string;
  "deploy.infraSecurity": string;
  "deploy.infraSecurityDesc": string;
  "deploy.infraDns": string;
  "deploy.infraDnsDesc": string;
  "deploy.infraPerf": string;
  "deploy.infraPerfDesc": string;

  // Operations
  "operations.oldWayVsResto": string;
  "operations.oldWay": string;
  "operations.everythingIn12Min": string;
  "operations.timeToLaunch": string;
  "operations.devCost": string;
  "operations.teamRequired": string;
  "operations.availability": string;
  "operations.updatesMaintenance": string;
  "operations.gtmStrategy": string;
  "operations.trad6to12months": string;
  "operations.trad80kTo250k": string;
  "operations.trad5to15people": string;
  "operations.tradBusinessHours": string;
  "operations.tradManualExpensive": string;
  "operations.tradHireConsultants": string;
  "operations.resto12minutes": string;
  "operations.restoZeroUpfront": string;
  "operations.restoJustYou": string;
  "operations.resto247": string;
  "operations.restoContinuous": string;
  "operations.restoAiDriven": string;
  "operations.traditional": string;
  "operations.resto": string;
  "operations.readyToBuild": string;
  "operations.whatTakesTraditional": string;
  "operations.startBuilding": string;
  "operations.exploreMoreUseCases": string;
  "operations.noCreditCard": string;

  // Pixel agent bar
  "agents.standby": string;
  "agents.working": string;
  "agents.analyzing": string;
  "agents.resting": string;
  "agents.joining": string;
  "agents.active": string;

  // File tree
  "fileTree.creating": string;

  // Landing page - Nav
  "nav.features": string;
  "nav.useCases": string;
  "nav.pricing": string;
  "nav.courses": string;
  "nav.getStarted": string;
  "nav.home": string;
  "nav.signUp": string;
  "nav.backToAtr": string;

  // Landing page - Hero
  "hero.badge": string;
  "hero.title1": string;
  "hero.title2": string;
  "hero.subtitle": string;
  "hero.cta": string;
  "hero.seePricing": string;

  // Landing page - Features
  "features.title1": string;
  "features.title2": string;
  "features.subtitle": string;
  "features.multiModel": string;
  "features.multiModelDesc": string;
  "features.knowledgeBase": string;
  "features.knowledgeBaseDesc": string;
  "features.voiceFirst": string;
  "features.voiceFirstDesc": string;
  "features.integrations": string;
  "features.integrationsDesc": string;

  // Landing page - How it works
  "howItWorks.title": string;
  "howItWorks.subtitle": string;
  "howItWorks.step1Title": string;
  "howItWorks.step1Desc": string;
  "howItWorks.step2Title": string;
  "howItWorks.step2Desc": string;
  "howItWorks.step3Title": string;
  "howItWorks.step3Desc": string;

  // Landing page - Integrations
  "integrationsSection.title": string;

  // Landing page - Pricing
  "pricing.title": string;
  "pricing.subtitle": string;
  "pricing.footer": string;
  "pricing.mostPopular": string;
  "pricing.free": string;
  "pricing.perMonth": string;
  "pricing.project": string;
  "pricing.projects": string;
  "pricing.tokensMonth": string;
  "pricing.knowledgeBase": string;
  "pricing.agentActions": string;
  "pricing.prioritySupport": string;
  "pricing.getStartedFree": string;
  "pricing.startPlan": string;

  // Landing page - Final CTA
  "cta.title": string;
  "cta.subtitle": string;
  "cta.getStarted": string;
  "cta.exploreCourses": string;

  // Landing page - Footer
  "footer.copyright": string;
  "footer.atrHome": string;
  "footer.allRights": string;

  // Use cases page
  "useCases.badge": string;
  "useCases.title1": string;
  "useCases.title2": string;
  "useCases.subtitle": string;
  "useCases.tryDemo": string;
  "useCases.ctaTitle": string;
  "useCases.ctaSubtitle": string;
  "useCases.ctaButton": string;
  "useCases.backToHome": string;

  // Use case names & descriptions
  "useCase.doctorClinical.name": string;
  "useCase.doctorClinical.desc": string;
  "useCase.hospital.name": string;
  "useCase.hospital.desc": string;
  "useCase.crm.name": string;
  "useCase.crm.desc": string;
  "useCase.ecommerce.name": string;
  "useCase.ecommerce.desc": string;
  "useCase.voiceAssistant.name": string;
  "useCase.voiceAssistant.desc": string;
  "useCase.freightForwarder.name": string;
  "useCase.freightForwarder.desc": string;
  "useCase.supplyChain.name": string;
  "useCase.supplyChain.desc": string;
  "useCase.lawyerOffice.name": string;
  "useCase.lawyerOffice.desc": string;
  "useCase.insuranceTech.name": string;
  "useCase.insuranceTech.desc": string;
  "useCase.realEstate.name": string;
  "useCase.realEstate.desc": string;
};
