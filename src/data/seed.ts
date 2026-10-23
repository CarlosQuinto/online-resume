import type { Coverable, PortfolioData } from './schema'

/** Color de marca por tarjeta para cuando no hay imagen. Sustituye por coverUrl desde /admin. */
const brand: Record<string, Partial<Coverable>> = {
  'exp-ntt': { color: '#0B5FFF' },
  'exp-sfdc': { color: '#00A1E0' },
  'exp-csi': { color: '#6D28D9' },
  'exp-tcs': { color: '#1E3A8A' },
  'exp-intugo': { color: '#0F766E' },
  'exp-freelance': { color: '#B45309' },
  'exp-pemex': { color: '#166534' },
  'proj-rondo-app': { color: '#0F766E' },
  'proj-rondo-web': { color: '#1D4ED8' },
  'proj-jbfc': { color: '#15803D' },
  'proj-portfolio': { color: '#6D28D9' },
}
const withBrand = <T extends Coverable & { id: string }>(list: T[]): T[] =>
  list.map((e) => ({ coverUrl: '', cover: { x: 50, y: 50, scale: 1 }, ...brand[e.id], ...e }))

/**
 * Datos semilla, generados a partir del perfil de LinkedIn
 * (https://www.linkedin.com/in/carloscarballod/) el 2026-10-22.
 * Todo es editable desde /admin.
 */
export const seed: PortfolioData = {
  version: 2,
  updatedAt: '2026-10-22',
  profile: {
    name: 'Carlos Carballo',
    headline: 'SDET · QA Automation Engineer',
    tagline:
      'Diseño frameworks de automatización, los integro en CI/CD y ayudo a los equipos a lanzar con confianza. Java, C#, Playwright y Selenium, con IA como copiloto.',
    location: 'Sonora, México · Remoto',
    summary:
      'Ingeniero de automatización de pruebas enfocado en construir automatización confiable y mantenible con Java y Azure DevOps. ' +
      'Diseño frameworks, integro pruebas en pipelines de CI/CD y ayudo a los equipos a lanzar con confianza. ' +
      'Curso una Maestría en Inteligencia Artificial en Universidad Tecmilenio y aplico lo que aprendo para llevar enfoques de IA al testing y al desarrollo. ' +
      'Fuera del trabajo construyo mis propios productos, como Rondo, una app web y móvil para organizar ligas de fútbol amateur.',
    avatarUrl: '',
    availability: 'Abierto a roles de QA Automation / SDET',
    phone: '+52 622 152 63 70',
    links: [
      { label: 'GitHub', url: 'https://github.com/CarlosQuinto' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/carloscarballod/' },
      { label: 'Email', url: 'mailto:carloscarballod@gmail.com' },
    ],
  },
  experience: withBrand([
    {
      id: 'exp-ntt',
      company: 'NTT DATA Services',
      role: 'QA Automation Engineer',
      start: '2023-06',
      end: null,
      location: 'México · Remoto',
      summary: 'Proyecto UPS. Automatización UI/API sobre sistemas empresariales, seguridad y rendimiento, con CI/CD en Azure DevOps.',
      highlights: [
        'Diseñé más de 300 escenarios de prueba y automaticé ~100 flujos UI/API con Java, TestNG y Cucumber.',
        'Automaticé la prueba de más de 100 endpoints con Postman y ejecuté evaluaciones de vulnerabilidades UI/API con OWASP ZAP.',
        'Colaboré en la migración del framework de Selenium a Playwright (TypeScript/JavaScript) y apoyé pruebas de rendimiento con JMeter.',
        'Gestioné repositorios y pipelines de CI/CD en Azure DevOps y participé activamente en las ceremonias Scrum.',
      ],
      stack: ['Java', 'TestNG', 'Cucumber', 'Playwright', 'TypeScript', 'Postman', 'JMeter', 'OWASP ZAP', 'Azure DevOps'],
    },
    {
      id: 'exp-sfdc',
      company: 'Salesforce',
      role: 'QA Automation Engineer',
      start: '2025-06',
      end: '2026-08',
      location: 'México · Remoto',
      summary: 'Automatización para una aplicación core del ecosistema Salesforce, con pipelines en GitHub y Jenkins.',
      highlights: [
        'Mejoré un framework de automatización en Java: migré 80 casos legados, soporte para 3 ambientes y reportes diarios automatizados.',
        'Reduje el tiempo de regresión automatizando más de 110 escenarios API/UI.',
        'Integré la automatización en pipelines de GitHub/Jenkins y reforcé la calidad del código con revisiones asistidas por IA.',
      ],
      stack: ['Java', 'Salesforce', 'GitHub', 'Jenkins', 'Cursor AI'],
    },
    {
      id: 'exp-csi',
      company: 'Creative Software International',
      role: 'QA Automation Engineer',
      start: '2022-05',
      end: '2023-06',
      location: 'México · Remoto',
      summary: 'Estandaricé los procesos de QA del departamento y construí el framework base de automatización de la empresa.',
      highlights: [
        'Mentoría al equipo para estructurar planes, suites y casos de prueba desde cero.',
        'Diseñé un framework de automatización reutilizable adoptado como arquitectura estándar para los nuevos proyectos internos.',
        'Automaticé más de 100 casos en 3 proyectos del cliente TurboTec, con suites de regresión previas al despliegue.',
      ],
      stack: ['Automatización', 'Pipelines', 'Test Planning', 'Mentoría'],
    },
    {
      id: 'exp-tcs',
      company: 'Tata Consultancy Services',
      role: 'QA Automation Engineer',
      start: '2021-06',
      end: '2022-06',
      location: 'México · Remoto',
      summary: 'Automatización con C# y Selenium dentro de un framework empresarial para PwC y un proyecto interno.',
      highlights: [
        'Automaticé más de 100 escenarios en 2 proyectos con C# y Selenium.',
        'Vinculé las ejecuciones automatizadas de Jenkins con los escenarios en Azure DevOps para trazabilidad de CI/CD.',
        'Mentoría al equipo de QA en el uso del framework y apoyo en estrategia de pruebas y ceremonias ágiles.',
      ],
      stack: ['C#', 'Selenium', 'Jenkins', 'Azure DevOps'],
    },
    {
      id: 'exp-intugo',
      company: 'Intugo',
      role: 'QA Engineer',
      start: '2020-03',
      end: '2021-06',
      location: 'Hermosillo, Sonora · Remoto',
      summary:
        'Estrategias de automatización para API, escritorio, móvil y web con Robot Framework y Selenium para Internet Brands (plataforma Demandforce), con validación cruzada en Salesforce.',
      highlights: [
        'Certificación de releases, seguimiento de incidencias y revisiones de código en entornos ágiles.',
      ],
      stack: ['Robot Framework', 'Selenium', 'Salesforce', 'Web', 'Mobile', 'API'],
    },
    {
      id: 'exp-freelance',
      company: 'Freelance',
      role: 'Software Engineer',
      start: '2019-06',
      end: '2019-12',
      location: 'Remoto',
      summary: 'Software a medida para una pesquera (Inversiones Bacochibampo) y un consultorio de psicología.',
      highlights: [
        'Depuración de datos duplicados y coincidencias de ubicación en dispositivos de navegación marítima (XML, Java).',
        'Sistema distribuido para agenda de sesiones, estado de pacientes y reportes (Java, MariaDB, REST en PHP).',
        'Lectura por puerto serial de un GPS marino antiguo y conversión a formato moderno (Java y C#).',
      ],
      stack: ['Java', 'C#', 'PHP', 'MariaDB'],
    },
    {
      id: 'exp-pemex',
      company: 'Pemex',
      role: 'Software Engineer · Prácticas',
      start: '2018-09',
      end: '2019-05',
      location: 'Presencial',
      summary: 'Sistemas de gestión de investigaciones y demandas laborales con roles de usuario, historial de cambios y reportes.',
      highlights: ['Metodología RUP y arquitectura en N capas dentro de un equipo de desarrollo.'],
      stack: ['C#', 'Visual Basic', 'RUP'],
    },
  ]),
  education: [
    {
      id: 'edu-tecmilenio',
      institution: 'Universidad Tecmilenio',
      degree: 'Maestría',
      field: 'Inteligencia Artificial',
      start: '2025-01',
      end: '2027-12',
      note: 'En curso. Aplico lo aprendido para llevar enfoques de IA al testing y al desarrollo.',
      description:
        'Aplico frameworks de machine learning e integraciones con LLM directamente en flujos de pruebas automatizadas, scripts de Playwright que se reparan solos y suites de regresión inteligentes.',
      meta: 'Especialización',
      emoji: '🧠',
    },
    {
      id: 'edu-itson',
      institution: 'Instituto Tecnológico de Sonora',
      degree: 'Ingeniería',
      field: 'Ingeniería de Software',
      start: '2015-08',
      end: '2019-06',
      note: '',
      description:
        'Base sólida en ciencias de la computación, arquitectura de software, patrones de diseño orientado a objetos, gestión de bases de datos y verificación sistemática de la calidad.',
      meta: 'Sonora, México',
      emoji: '🎓',
    },
  ],
  certifications: [
    { id: 'cert-istqb-genai', name: 'ISTQB® CT-GenAI: Core Principles for Generative AI in Software Testing', issuer: 'Skillsoft', date: 'sep 2026', url: '' },
    { id: 'cert-copilot', name: 'GitHub Copilot', issuer: 'Microsoft', date: 'mar 2026', url: '' },
    { id: 'cert-ai-tecmilenio', name: 'Fundamentals and Applications of Artificial Intelligence', issuer: 'Universidad Tecmilenio', date: 'jun 2025', url: '' },
    { id: 'cert-genai-ntt', name: 'GenAI Academy: Yellow Belt Level 2 for Engineers', issuer: 'NTT DATA Services', date: 'jun 2025', url: '' },
    { id: 'cert-pentest', name: 'CompTIA PenTest+: Reconnaissance, Scoping & Engagement, Professionalism', issuer: 'Skillsoft', date: 'jun 2025', url: '' },
    { id: 'cert-prompt', name: 'Case Studies in Prompt Engineering', issuer: 'Skillsoft', date: 'jun 2025', url: '' },
  ],
  stats: [
    { id: 'stat-migration', icon: 'bolt', value: '50 %', label: 'Reducción en el tiempo de migración de pruebas' },
    { id: 'stat-cicd', icon: 'infinity', value: 'CI/CD', label: 'Pruebas integradas en el flujo de entrega' },
    { id: 'stat-fullstack', icon: 'shield', value: 'Full stack de testing', label: 'UI, API, móvil y seguridad' },
  ],
  pillars: [
    {
      id: 'pil-auto',
      icon: 'gear',
      title: 'Automatización',
      emoji: '🧪',
      description: 'Diseño frameworks de pruebas que otros equipos adoptan como estándar y mantengo suites que no se rompen.',
      lists: [
        { label: 'Lo que automatizo', items: ['UI web', 'API', 'Móvil', 'Seguridad', 'Rendimiento'] },
        { label: 'Herramientas', items: ['Playwright', 'Selenium', 'Cucumber', 'TestNG', 'Postman', 'JMeter', 'OWASP ZAP'] },
      ],
    },
    {
      id: 'pil-ci',
      icon: 'code',
      title: 'CI/CD & Calidad',
      emoji: '🚀',
      description: 'Integro las pruebas en el pipeline para que cada release salga con evidencia, no con fe.',
      lists: [
        { label: 'Lenguajes', items: ['Java', 'C#', 'TypeScript', 'Python', 'SQL'] },
        { label: 'Plataformas', items: ['Azure DevOps', 'Jenkins', 'GitHub Actions', 'Docker'] },
      ],
    },
    {
      id: 'pil-ai',
      icon: 'brain',
      title: 'IA aplicada',
      emoji: '🤖',
      description: 'Uso IA para migrar pruebas más rápido, generar escenarios y revisar código, y lo estudio en una maestría.',
      lists: [
        { label: 'En la práctica', items: ['Migración de tests 50 % más rápida', 'Revisiones asistidas por IA', 'Generación de escenarios'] },
        { label: 'Formación', items: ['Maestría en IA · Tecmilenio', 'ISTQB CT-GenAI', 'GitHub Copilot'] },
      ],
    },
  ],
  skillGroups: [
    { id: 'sg-auto', icon: 'gear', name: 'Automatización', skills: ['Playwright', 'Selenium', 'Cucumber / BDD', 'TestNG', 'Robot Framework', 'Postman', 'JMeter', 'OWASP ZAP'] },
    { id: 'sg-lang', icon: 'code', name: 'Lenguajes', skills: ['Java', 'C#', 'TypeScript', 'JavaScript', 'Python', 'SQL'] },
    { id: 'sg-ci', icon: 'cloud', name: 'CI/CD & Infra', skills: ['Azure DevOps', 'Jenkins', 'GitHub Actions', 'Docker', 'PostgreSQL', 'Firebase', 'Kong API Gateway'] },
    { id: 'sg-ai', icon: 'brain', name: 'IA aplicada', skills: ['AI-Assisted Automation', 'Prompt Engineering', 'GitHub Copilot', 'Cursor', 'LLMs'] },
    { id: 'sg-process', icon: 'layers', name: 'Proceso y producto', skills: ['Scrum', 'Test Strategy', 'Test Planning', 'Salesforce Ecosystem', 'Capacitor (mobile)'] },
  ],
  projects: withBrand([
    {
      id: 'proj-rondo-app',
      title: 'Rondo · App nativa (iOS y Android)',
      description:
        'App móvil de Rondo, SaaS para organizar ligas y clubes de fútbol amateur. Construida con Capacitor 8 sobre el frontend React existente: un solo código para web, iOS y Android. Multi-tenant, deep links, notificaciones push (FCM y APNs), share nativo y caché offline. Cumple las reglas de App Store y Google Play, con CI/CD en GitHub Actions para builds Android e iOS y subidas automáticas a TestFlight. Enviada a revisión de App Store en octubre de 2026.',
      stack: ['Capacitor 8', 'React', 'TypeScript', 'FCM / APNs', 'GitHub Actions', 'TestFlight'],
      repoUrl: '',
      liveUrl: 'https://rondo.com.mx',
      featured: true,
    },
    {
      id: 'proj-rondo-web',
      title: 'Rondo.com.mx',
      description:
        'Plataforma web para administrar y operar ligas de fútbol amateur desde un solo lugar: clubes, jugadores, temporadas, torneos, calendarios, tablas, partidos en vivo con goles y tarjetas, sedes, finanzas, galerías, invitaciones por correo y experiencia PWA. Arquitectura self-hosted con capas separadas, diseñada para salir por completo de Firebase hacia PostgreSQL, storage y servicios en contenedores.',
      stack: ['React', 'TypeScript', 'Vite', 'PostgreSQL', 'PostgREST', 'Kong', 'Docker', 'PWA'],
      repoUrl: '',
      liveUrl: 'https://rondo.com.mx',
      featured: true,
    },
    {
      id: 'proj-jbfc',
      title: 'Joga Bonito FC · Gestión de club',
      description:
        'Aplicación full-stack para la gestión integral de un club deportivo amateur: partidos, entrenamientos, estadísticas, alineaciones tácticas interactivas, inventario y finanzas, con sincronización en tiempo real vía Firestore, permisos por rol (administradores, managers y jugadores) y configuración PWA instalable.',
      stack: ['React', 'TypeScript', 'Vite', 'Firebase Firestore', 'Firebase Auth', 'PWA'],
      repoUrl: '',
      liveUrl: '',
      featured: false,
    },
    {
      id: 'proj-portfolio',
      title: 'Este portafolio · mini-CMS',
      description:
        'React + Firestore con panel /admin protegido por PIN para editar el contenido en vivo. Tokens de diseño con escala áurea y contraste AAA.',
      stack: ['React', 'Vite', 'Tailwind', 'Framer Motion', 'Firebase'],
      repoUrl: 'https://github.com/CarlosQuinto/online-resume',
      liveUrl: 'https://carlos-carballo-awesome-resume.web.app',
      featured: false,
    },
  ]),
  recommendations: [
    {
      id: 'rec-pritesh',
      name: 'Priteshkumar Mahajan',
      role: 'Senior Test Automation Engineer · Salesforce QA Leader · lo dirigió directamente',
      url: 'https://www.linkedin.com/in/priteshkumarmahajan90',
      text:
        "One of the most reliable and growth-minded engineers I've collaborated with. Carlos was a key contributor to our test automation efforts, from the Backlog Automation initiative to migrating our legacy test automation to a BDD framework. He was part of a team effort that took our test coverage from ~95% to 100% in one year, leveraging AI to migrate tests 50% faster and cut automation execution time by 75%.",
    },
    {
      id: 'rec-daniel',
      name: 'Daniel Luján',
      role: 'Senior SDET / QA Automation Lead · trabajó en el mismo equipo',
      url: 'https://mx.linkedin.com/in/danielujan',
      text:
        'I highly recommend him as a QA Automation Engineer. Carlos has a strong technical background in test automation and software quality, consistently delivering reliable, well-designed solutions while maintaining a high standard of quality. He takes ownership of his work, collaborates effectively with cross-functional teams, and is always willing to share knowledge and support others.',
    },
    {
      id: 'rec-zohreh',
      name: 'Zohreh Malek',
      role: 'Sr Technical Program Manager · lo dirigió en Internet Brands (Demandforce)',
      url: '',
      text:
        'I had the pleasure of working with Carlos for two years at Internet Brands on the Demandforce team. He is an exceptionally talented and knowledgeable QA engineer, as well as a collaborative and dependable team player. Carlos played a key role in our Agile environment by developing robust testing strategies for APIs, microservices, web, and mobile applications.',
    },
    {
      id: 'rec-marcelino',
      name: 'Marcelino Martínez',
      role: 'QA Engineer · colega',
      url: '',
      text:
        'Carlos es un profesional excepcional en el campo de QA Automation. Su sólido conocimiento técnico, su atención meticulosa a los detalles y su pasión por la calidad hacen de él un recurso valioso en cualquier proyecto. Ha demostrado habilidades sobresalientes en el diseño y ejecución de casos de prueba, la identificación de problemas y la resolución de errores.',
    },
  ],
  hobbies: [
    {
      id: 'hob-chess',
      title: 'Árbitro de ajedrez',
      emoji: '♞',
      description: 'Árbitro activo en FENAMAC',
      kicker: 'Disciplina táctica',
      tags: ['Torneos estatales', 'Enseñanza a niños', 'Pensamiento sistemático'],
      color: '#134E4A',
      detail:
        'Organizo y arbitro torneos estatales y locales. Fui organizador voluntario de la Liga Municipal de Ajedrez de Guaymas (2023–2024), promoviendo el ajedrez en escuelas y espacios públicos, y antes instructor de un grupo de 30 niños en la Biblioteca Pública Municipal. El ajedrez entrena la misma paciencia y pensamiento sistemático que uso al diseñar pruebas.',
      accent: 'accent',
    },
    {
      id: 'hob-futbol',
      title: 'Fútbol',
      emoji: '⚽',
      description: 'Liga semanal',
      kicker: 'Juego colectivo',
      tags: ['Lectura del juego', 'Decisiones bajo presión', 'Resistencia'],
      color: '#166534',
      detail:
        'Trabajo en equipo, lectura del juego y resistencia. De esa pasión nació Rondo, la plataforma que uso para organizar ligas amateur.',
      accent: 'green',
    },
    {
      id: 'hob-camping',
      title: 'Camping y pesca',
      emoji: '🎣',
      description: 'Costa de Sonora',
      kicker: 'Naturaleza y descanso',
      tags: ['Mar de Cortés', 'Desconexión', 'Claridad mental'],
      color: '#B45309',
      detail:
        'Desconectar en la costa sonorense: carpa, fogata y caña. Bahía de Kino y San Carlos son mis lugares favoritos.',
      accent: 'amber',
    },
    {
      id: 'hob-gaming',
      title: 'Gaming',
      emoji: '🎮',
      description: 'Estrategia y competitivos.',
      kicker: 'Estrategia competitiva',
      tags: ['Estrategia en tiempo real', 'Análisis de sistemas', 'Precisión'],
      color: '#5B21B6',
      detail: 'De los juegos aprendí a leer sistemas y a romperlos, que es básicamente lo que hace un QA.',
      accent: 'violet',
    },
  ],
}
