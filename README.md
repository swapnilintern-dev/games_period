# Games Period website

Static site for gamesperiod.live. No framework and no dependencies, only Node to build.

## Commands

```bash
npm run build
```

Writes the finished site to `dist/`.

```bash
npm run preview
```

Builds, then serves it at http://localhost:4173.

## Where things live

| What | File |
| --- | --- |
| Phone, WhatsApp, email, LinkedIn, Instagram, hours | `src/config.mjs` (one place, every page updates) |
| Page content | `src/pages/*.html` |
| Header, footer, logo, SEO tags | `src/layout.mjs` |
| Design | `public/assets/css/site.css` |
| Report card, dashboard, form logic | `public/assets/js/` |

The WhatsApp number and email also appear at the top of `public/assets/js/contact.js`, which builds the form messages. Update both if they change.

## Deploy

1. Push this folder to a GitHub repository.
2. In Render, choose New > Blueprint and select the repository. `render.yaml` sets the build command and the `dist` folder.
3. Check the `onrender.com` address, then add `gamesperiod.live` under Custom Domains in Render.
4. In GoDaddy DNS, replace the parked records with the values Render shows.
