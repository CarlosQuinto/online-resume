import type { PortfolioData } from './schema'

/**
 * Datos semilla. Los campos marcados con [EDITAR] son placeholders
 * para completar desde /admin con tu información real de LinkedIn.
 */
export const seed: PortfolioData = {
  version: 1,
  updatedAt: '2026-10-22',
  profile: {
    name: 'Carlos Carballo',
    headline: 'QA Automation Engineer · SDET',
    tagline: 'Construyo pipelines de calidad que dejan dormir tranquilo a los equipos de producto.',
    location: 'Sonora, México',
    summary:
      'Ingeniero de automatización de pruebas enfocado en frameworks mantenibles, CI/CD y calidad medible. ' +
      'Actualmente curso una Maestría en Inteligencia Artificial en Tecmilenio, explorando cómo los LLMs ' +
      'pueden acelerar el diseño y mantenimiento de suites de pruebas. [EDITAR: ajusta con tu resumen de LinkedIn]',
    avatarUrl: '',
    availability: 'Abierto a proyectos remotos',
    links: [
      { label: 'GitHub', url: 'https://github.com/CarlosQuinto' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/carloscarballod/' },
      { label: 'Email', url: 'mailto:carloscarballod@gmail.com' },
    ],
  },
  experience: [
    {
      id: 'exp-1',
      company: 'NTT DATA Services',
      role: 'QA Automation Engineer',
      start: '2024-01',
      end: null,
      location: 'Remoto · México',
      summary:
        'Parte del equipo de Quality Engineering: automatización de backlog, migración del framework legado a BDD y mejoras continuas al pipeline de CI/CD. [EDITAR: fecha de inicio y detalles desde LinkedIn]',
      highlights: [
        'Migración completa de la automatización legada a un framework BDD: nuevos step definitions, escenarios y pipeline.',
        'Contribución al esfuerzo de equipo que llevó la cobertura de pruebas de ~95 % a 100 % en un año.',
        'Uso de IA para acelerar la migración de pruebas y la generación de escenarios.',
      ],
      stack: ['BDD / Gherkin', 'Automatización E2E', 'CI/CD', 'IA aplicada a QA'],
    },
    {
      id: 'exp-2',
      company: '[EDITAR: Empresa anterior]',
      role: 'QA Engineer',
      start: '2020-06',
      end: '2022-12',
      location: 'Hermosillo, Sonora',
      summary: 'Pruebas manuales y automatizadas para aplicaciones web y móviles.',
      highlights: [
        'Creación de planes de prueba y casos basados en riesgo.',
        'Primeras suites automatizadas con Selenium y Java.',
      ],
      stack: ['Selenium', 'Java', 'JIRA', 'SQL'],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Universidad Tecmilenio',
      degree: 'Maestría',
      field: 'Inteligencia Artificial',
      start: '2025-01',
      end: null,
      note: 'En curso. Enfoque en ML aplicado y agentes LLM para ingeniería de calidad.',
    },
    {
      id: 'edu-2',
      institution: '[EDITAR: Universidad]',
      degree: 'Ingeniería',
      field: '[EDITAR: Sistemas / Software]',
      start: '2014-08',
      end: '2019-06',
      note: '',
    },
  ],
  certifications: [
    { id: 'cert-1', name: 'ISTQB Foundation Level', issuer: 'ISTQB', date: '2021', url: '' },
    { id: 'cert-2', name: '[EDITAR: Certificación]', issuer: '[EDITAR]', date: '2024', url: '' },
  ],
  skillGroups: [
    { id: 'sg-1', name: 'Automatización', skills: ['Playwright', 'Cypress', 'Selenium', 'Appium', 'REST Assured'] },
    { id: 'sg-2', name: 'Lenguajes', skills: ['TypeScript', 'JavaScript', 'Python', 'Java', 'SQL'] },
    { id: 'sg-3', name: 'CI/CD & Infra', skills: ['GitHub Actions', 'Jenkins', 'Docker', 'Firebase', 'AWS'] },
    { id: 'sg-4', name: 'IA aplicada', skills: ['LLMs', 'Prompt Engineering', 'LangChain', 'scikit-learn'] },
    { id: 'sg-5', name: 'Proceso', skills: ['Scrum', 'Test Strategy', 'Risk-based Testing', 'BDD / Gherkin'] },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Rondo · App nativa (iOS y Android)',
      description:
        'App móvil de Rondo, SaaS para organizar ligas y clubes de fútbol amateur. Construida con Capacitor 8 sobre el frontend React existente: un solo código para web, iOS y Android. Multi-tenant, deep links (Universal / App Links), notificaciones push (FCM y APNs), share nativo, splash y caché offline de la última organización.',
      stack: ['Capacitor 8', 'React', 'TypeScript', 'FCM / APNs', 'Deep links'],
      repoUrl: '',
      liveUrl: 'https://rondo.com.mx',
      featured: true,
    },
    {
      id: 'proj-2',
      title: 'Rondo.com.mx',
      description:
        'Plataforma web para administrar y operar ligas de fútbol amateur desde un solo lugar: clubes, jugadores, temporadas, categorías, torneos, calendarios, tablas de posiciones, partidos en vivo con goles y tarjetas, sedes y gestión de clubes.',
      stack: ['React', 'TypeScript', 'Firebase', 'Tailwind'],
      repoUrl: '',
      liveUrl: 'https://rondo.com.mx',
      featured: true,
    },
    {
      id: 'proj-3',
      title: 'Joga Bonito FC · Gestión de club',
      description:
        'Aplicación full-stack para la gestión integral de un club deportivo amateur: coordinación en tiempo real de partidos, rutinas de entrenamiento, estadísticas de jugadores, alineaciones, inventario y finanzas, con control de acceso por roles sobre Firebase Firestore.',
      stack: ['React', 'Firebase Firestore', 'RBAC', 'Tiempo real'],
      repoUrl: '',
      liveUrl: '',
      featured: false,
    },
    {
      id: 'proj-4',
      title: 'Este portafolio · mini-CMS',
      description: 'React + Firestore con panel /admin protegido por PIN para editar el contenido en vivo. Tokens de diseño con escala áurea y contraste AAA.',
      stack: ['React', 'Vite', 'Tailwind', 'Framer Motion', 'Firebase'],
      repoUrl: 'https://github.com/CarlosQuinto/online-resume',
      liveUrl: '',
      featured: false,
    },
  ],
  recommendations: [
    {
      id: 'rec-1',
      name: 'Daniel Luján',
      role: 'Colega · LinkedIn',
      url: 'https://mx.linkedin.com/in/danielujan',
      text:
        'I highly recommend him as a QA Automation Engineer. Carlos has a strong technical background in test automation and software quality, consistently delivering reliable, well-designed solutions while maintaining a high standard of quality. He takes ownership of his work, collaborates effectively with cross-functional teams, and approaches challenges with a proactive and solution-oriented mindset.',
    },
    {
      id: 'rec-2',
      name: 'Priteshkumar Mahajan',
      role: 'Quality Engineering team · LinkedIn',
      url: 'https://www.linkedin.com/in/priteshkumarmahajan90',
      text:
        "One of the most reliable and growth-minded engineers I've collaborated with. Carlos was a key contributor to our test automation efforts — from the Backlog Automation initiative to migrating our legacy test automation to a BDD framework, adding new step definitions, test scenarios, and CI/CD pipeline improvements. He was part of a team effort that took our test coverage from ~95% to 100% in one year.",
    },
  ],
  hobbies: [
    {
      id: 'hob-1',
      title: 'Árbitro de ajedrez',
      emoji: '♞',
      description: 'Árbitro activo en FENAMAC.',
      detail:
        'Dirijo torneos y aplico el reglamento FIDE. El ajedrez entrena la misma paciencia y pensamiento sistemático que uso al diseñar pruebas.',
      accent: 'accent',
    },
    {
      id: 'hob-2',
      title: 'Fútbol',
      emoji: '⚽',
      description: 'Juego cada semana.',
      detail: 'Trabajo en equipo, lectura del juego y resistencia. Mediocampo, normalmente.',
      accent: 'green',
    },
    {
      id: 'hob-3',
      title: 'Camping y pesca',
      emoji: '🎣',
      description: 'Playas de Sonora.',
      detail:
        'Desconectar en la costa sonorense: carpa, fogata y caña. Bahía de Kino y San Carlos son mis lugares favoritos.',
      accent: 'amber',
    },
    {
      id: 'hob-4',
      title: 'Gaming',
      emoji: '🎮',
      description: 'Estrategia y competitivos.',
      detail: 'De los juegos aprendí a leer sistemas y a romperlos, que es básicamente lo que hace un QA.',
      accent: 'violet',
    },
  ],
  pets: [
    { id: 'pet-1', name: 'Burbuja', breed: 'Pug', emoji: '🐶', bio: 'Jefa de la casa. Ronca más fuerte que el aire acondicionado.' },
    { id: 'pet-2', name: 'Calceta', breed: 'Mestiza', emoji: '🐕', bio: 'Velocista oficial. Nunca pierde una pelota.' },
    { id: 'pet-3', name: 'Nieve', breed: 'Mestiza', emoji: '🦮', bio: 'La más tranquila. Supervisa el home office desde el sillón.' },
  ],
}
