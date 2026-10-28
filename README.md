# firhan.id

Personal site of Firhan Mahdi Ramadhani, a product engineer based in Yogyakarta, Indonesia.

## Stack

- [Vue 3](https://vuejs.org) + TypeScript, built with [Vite](https://vite.dev)
- [vue-router](https://router.vuejs.org) for routing
- [vite-ssg](https://github.com/antfu-collective/vite-ssg) to pre-render every route to static HTML
- [@unhead/vue](https://unhead.unjs.io) for per-page titles and meta tags
- Plain CSS with custom properties, with no UI framework

## Getting started

Requires Node 22 (see `.nvmrc`) and [Bun](https://bun.sh).

```sh
bun install
bun run dev        # start the dev server
bun run typecheck  # type-check with vue-tsc
bun run build      # pre-render the site to dist/
bun run preview    # serve the built site locally
```

## Project structure

```
src/
├── assets/        portrait image
├── components/    header, footer, icons, work entries
├── composables/   theme toggle, page meta
├── content/       site info, experience, projects (edit these to change copy)
├── directives/    scroll-reveal directive
├── pages/         Home, About, Work, Writing, NotFound
├── router/        route table
└── style.css      design tokens, themes, global styles
public/            CV, favicon, logos, robots.txt, sitemap.xml
```

## Content

Most text lives in `src/content/`:

- `site.ts`: name, role, location, email and links
- `experience.ts`: work history, shown on Work and in the About timeline
- `projects.ts`: selected projects

## Design notes

- **Type:** Plus Jakarta Sans for body and UI. Instrument Serif is only for the top headline of a page. IBM Plex Mono is only for small uppercase labels and dates.
- **Color:** a stark neutral light theme with a blue accent, and a teal-black dark theme with an emerald accent. Everything is driven by CSS custom properties in `src/style.css`.
- **Theme:** follows the system setting, with a manual toggle in the header. The choice is stored in `localStorage` and applied by an inline script in `index.html` to avoid a flash of the wrong theme.

## Deployment

`bun run build` outputs a fully static site to `dist/`, so it can be hosted anywhere that serves static files. Update `sitemap.xml` and `site.url` in `src/content/site.ts` if the domain changes.
