import type { GalleryImage } from './types'

export interface ExperienceEntry {
  slug: string
  org: string
  role: string
  location: string
  period: string
  current: boolean
  summary: string
  highlights: string[]
  tags: string[]
  link?: string
  linkLabel?: string
  logo?: string
  screenshot?: string
  gallery?: GalleryImage[]
}

export const experience: ExperienceEntry[] = [
  {
    slug: 'binar',
    org: 'BINAR',
    role: 'Frontend Engineer',
    location: 'Jakarta, Indonesia',
    period: 'April 2026 — Current',
    current: true,
    summary:
      "Placed at Elitery, working with a West Java provincial government client on a system used across the whole province.",
    highlights: [
      'Working on a system that needs to hold up under government-scale usage, across all of West Java.',
      'Focused on making it fast and accessible for a wide range of users, not just power users.',
    ],
    tags: ['Frontend', 'Government', 'Accessibility'],
  },
  {
    slug: 'accu3dx',
    org: 'Accu3DX',
    role: 'Frontend Engineer',
    location: 'Gyeonggi, South Korea',
    period: 'May 2025 — May 2026',
    current: false,
    summary:
      'Built a clinic management dashboard used by clients in four countries, combining 3D scanner data with patient records.',
    highlights: [
      'Developed the dashboard that ties 3D scanner output to patient data management, for clinics across four countries.',
      'Refactored a legacy codebase, cutting load through code optimization and lazy loading — about 40% faster.',
      'Made the responsive layer solid enough that desktop and tablet felt like the same product, not two.',
    ],
    tags: ['Vue', 'Dashboards', 'Performance'],
  },
  {
    slug: 'privyid',
    org: 'PrivyID',
    role: 'Intermediate Frontend Engineer',
    location: 'Yogyakarta, Indonesia',
    period: 'December 2022 — March 2025',
    current: false,
    summary:
      'Engineered the merchant dashboard on Nuxt 3, and spent a lot of time on verification performance and team workflow.',
    highlights: [
      'Built the merchant dashboard with Nuxt 3, integrating closely with the backend team and running weekly stakeholder syncs to keep requirements honest.',
      'Reworked the verification flow with better load balancing — SLA performance improved by up to 85%.',
      'Used Pinia for state and composables for shared logic, which made the codebase easier to reason about as it grew.',
      'Led a large-scale load testing effort to find bottlenecks before high-traffic periods found them for us.',
    ],
    tags: ['Nuxt 3', 'Pinia', 'Load testing'],
  },
  {
    slug: 'beprofesion',
    org: 'BeProfesion',
    role: 'Co-Founder',
    location: 'Yogyakarta, Indonesia',
    period: 'April 2021 — Current',
    current: true,
    summary:
      'Co-founded and led the IT side of an e-learning platform — course access, dashboards, and expert consultations for 3,000+ users.',
    highlights: [
      'Led the IT team building an e-learning site where people access course materials and talk to experts directly.',
      'Built full-stack features with Nuxt.js and Node.js, cutting page load times by about 50% along the way.',
      'Later revamped the platform to improve overall performance and day-to-day usability.',
    ],
    tags: ['Nuxt.js', 'Node.js', 'Full-stack'],
  },
]
