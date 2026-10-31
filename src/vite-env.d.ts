/// <reference types="vite/client" />

declare const __CV_VERSION__: string

declare module '*.md' {
  export const html: string
  export const toc: { id: string; text: string; level: number }[]
}
