import type { GalleryImage } from './types'

export interface ProjectEntry {
  slug: string
  title: string
  period: string
  description: string
  role: string
  tags: string[]
  link?: string
  linkLabel?: string
  logo?: string
  screenshot?: string
  gallery?: GalleryImage[]
  featured: boolean
}

export const projects: ProjectEntry[] = [
  {
    slug: 'baca-kakatua',
    title: 'Baca Kakatua',
    period: 'March 2025 — May 2025',
    description:
      'A cross-platform React Native marketplace app for e-readers, built to make digital reading content more accessible on both iOS and Android.',
    role: 'Delivered the app end to end, working directly with the client to gather requirements and coordinate with the team.',
    tags: ['React Native', 'Mobile', 'Marketplace'],
    featured: true,
  },
  {
    slug: 'ediklat-rsa-ugm',
    title: 'eDiklat Learning Platform — RSA UGM',
    period: 'September 2025 — March 2026',
    description:
      'A training management platform for a hospital, with dashboards built after research directly with department heads and staff.',
    role: 'Led a cross-functional team (UI design, fullstack, backend) through the full SDLC and built the frontend in CodeIgniter MVC.',
    tags: ['CodeIgniter', 'UX Research', 'Dashboards'],
    featured: false,
  },
  {
    slug: 'diplomat-passion-hunt',
    title: 'Diplomat Passion Hunt',
    period: 'June 2025 — July 2025',
    description:
      "A submission platform used by 200+ artists for Diplomat's Passion Hunt event, built to match the event's branding and audience.",
    role: 'Worked with event organizers and designers to keep the platform aligned with the brand and user experience goals.',
    tags: ['Web App', 'Events'],
    featured: false,
  },
  {
    slug: 'asean-km-platform',
    title: 'ASEAN Knowledge Management Platform',
    period: 'April 2023 — July 2023',
    description:
      'A landing page and dashboard giving centralized access to health-sector data for ASEAN Summit 2023, plus an LMS for courses and a CMS for publications.',
    role: 'Built the LMS and CMS, and implemented role-based access control across all ASEAN member country pages.',
    tags: ['LMS', 'CMS', 'RBAC'],
    featured: false,
  },
  {
    slug: 'verify-by-nutrishe',
    title: 'Verify by NUTRISHE',
    period: 'June 2022 — July 2022',
    description:
      'A product verification system built around QR codes — a dashboard for entering products into a database, generating codes for over a million products.',
    role: 'Built the dashboard and the scan-to-verify flow.',
    tags: ['QR', 'Dashboard'],
    featured: false,
  },
  {
    slug: 'ina-skinpath',
    title: 'INA-SkinPath',
    period: 'May 2022 — July 2022',
    description:
      'A React Native app for the Faculty of Medicine at Gadjah Mada University, built to help people learn about skin diseases in depth.',
    role: 'Led the team through communicating with doctors and translating their needs into the product.',
    tags: ['React Native', 'Healthcare'],
    featured: false,
  },
]
