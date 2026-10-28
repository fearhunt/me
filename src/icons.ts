// Stroke-based, 24x24 viewBox paths (matches AppHeader's hand-drawn icons).
// To add an icon: add its path(s) here, then use <Icon name="..." /> anywhere.
export const ICONS = {
  'external-link': [
    'M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h6',
    'M15 3h6v6',
    'M10 14 21 3',
  ],
  link: [
    'M11 6.5 12.6 4.9a3.5 3.5 0 1 1 5 5L16 11.5',
    'M13 17.5 11.4 19.1a3.5 3.5 0 1 1-5-5L8 12.5',
    'M9 15 15 9',
  ],
  mail: ['M4 6h16v12H4z', 'M4 7l8 6 8-6'],
  code: ['M9 6 3 12l6 6', 'M15 6l6 6-6 6'],
  'arrow-right': ['M4 12h16', 'M14 6l6 6-6 6'],
} as const

export type IconName = keyof typeof ICONS
