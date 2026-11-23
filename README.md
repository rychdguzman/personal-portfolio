# Personal Portfolio

Generated with the [React Bits Pro](https://pro.reactbits.dev) Landing Builder.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's inside

| File | Block |
| --- | --- |
| `components/blocks/hero-34.tsx` | Hero34 |
| `components/blocks/bento-grid.tsx` | BentoGrid |
| `components/blocks/features-17.tsx` | Features17 |
| `components/blocks/showcase-10.tsx` | Showcase10 |
| `components/blocks/cta-8.tsx` | Cta8 |
| `components/blocks/careers-3.tsx` | Careers3 |
| `components/blocks/contact-3.tsx` | Contact3 |
| `components/blocks/footer-2.tsx` | Footer2 |

Each block is a standalone, self-contained component. It takes no props: edit
the file directly to change copy, styling or layout.

## Section heights

`app/page.tsx` sets `--rb-section-min-h: 0px` on the page wrapper. Blocks that
would otherwise fill the viewport (`min-h-[var(--rb-section-min-h,100vh)]`)
collapse to their natural height when composed into a page. Use a block on its
own (outside that wrapper) and it reverts to full-screen, which is what a
standalone hero or 404 page wants.

## Dependencies

- `lucide-react`
- `motion`
- `next`
- `react`
- `react-dom`
- `three`

## Tailwind

This project uses Tailwind CSS v4 with the PostCSS plugin. There is no
`tailwind.config`: configuration lives in `app/globals.css`.
