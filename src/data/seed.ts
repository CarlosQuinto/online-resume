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
      company: '[EDITAR: Empresa actual]',
      role: 'QA Automation Engineer / SDET',
      start: '2023-01',
      end: null,
      location: 'Remoto',
      summary: 'Diseño y mantenimiento de frameworks de automatización end-to-end y de API.',
      highlights: [
        'Automatización E2E con Playwright y Cypress integrada en CI/CD.',
        'Pruebas de API con Postman/REST Assured y contratos.',
        'Reducción del tiempo de regresión mediante paralelización y selección inteligente de pruebas.',
      ],
      stack: ['Playwright', 'TypeScript', 'GitHub Actions', 'Postman', 'Docker'],
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
      title: 'Portafolio con mini-CMS',
      description: 'Este sitio: React + Firestore con panel /admin protegido por PIN para editar contenido en vivo.',
      stack: ['React', 'Vite', 'Tailwind', 'Framer Motion', 'Firebase'],
      repoUrl: 'https://github.com/CarlosQuinto/online-resume',
      liveUrl: '',
      featured: true,
    },
    {
      id: 'proj-2',
      title: '[EDITAR: Framework de automatización]',
      description: 'Framework E2E con reportes, reintentos inteligentes y ejecución paralela en CI.',
      stack: ['Playwright', 'TypeScript', 'Allure'],
      repoUrl: '',
      liveUrl: '',
      featured: true,
    },
    {
      id: 'proj-3',
      title: '[EDITAR: Proyecto de IA]',
      description: 'Generación asistida de casos de prueba a partir de historias de usuario con LLMs.',
      stack: ['Python', 'LangChain', 'Claude API'],
      repoUrl: '',
      liveUrl: '',
      featured: false,
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
