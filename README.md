# Sakshi Gupta — Portfolio

Portfolio site for an Agentic AI developer: selected projects, case studies, live GitHub activity, an
"Ask my agent" chat and a contact form.

## Features

- Home page with project showcase, tech stack, experience and contact sections
- A hero portrait you can grab, stretch and wobble, drawn with WebGL2 (`src/face/`)
- Projects as a 3D board book you can open and turn (`src/components/quarto/`), with a grid view
- A footer with a looping bean bag film (`public/naplabs/`) and a leave-your-email box
- Case study pages with animated architecture diagrams (`/work/<slug>`)
- "Ask my agent" chat, answered by Gemini from the site's own content, with built-in answers when no model is configured
- Contact form delivered by email through Resend, with a mail-app fallback if sending fails
- Command palette (`Ctrl`/`⌘` + `K`), light and dark mode, and four accent colours
- GitHub repositories, activity and contribution calendar, fetched in the browser
- Per-page meta tags, canonical URLs and a sitemap generated at build time

## Tech stack

React 18, Vite 6, Tailwind CSS, Framer Motion, Lenis, Lucide icons and Vercel Analytics.
Two serverless functions on Vercel handle the chat and the contact form.

## Getting started

Needs Node 18, 20 or 22+ (the image scripts need 22+).

```bash
npm install
npm run dev      # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server, including `/api/chat` and `/api/contact` |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need. On Vercel, add them under
Project → Settings → Environment Variables. Never commit keys.

| Variable | Needed for | Notes |
| --- | --- | --- |
| `GEMINI_API_KEY` | Chat model | Without it the chat uses its built-in answers |
| `GEMINI_MODEL` | Optional | Defaults to `gemini-flash-latest` |
| `RESEND_API_KEY` | Contact form | Without it the form offers to open the visitor's mail app |
| `CONTACT_TO_EMAIL` | Optional | Where messages are delivered |
| `CONTACT_FROM_EMAIL` | Optional | Without a verified domain, Resend only delivers to the account's own address |
| `VITE_SITE_URL` | Optional | Used for canonical and social preview URLs; defaults to the Vercel production domain |

## Project structure

```
api/          Vercel functions (thin wrappers around server/)
server/       Chat and contact handlers, shared request helpers
scripts/      Image tools and the build-time SEO step
public/       Images, résumé, favicon, robots.txt
src/
  components/ UI sections and widgets
  data/       Projects, case studies and chat knowledge
  lib/        Router, GitHub data, SEO tags, analytics
  pages/      Case study page
  theme/      Light/dark mode and accent colours
```

## Editing content

- **Projects:** `src/data/projects.js`. Set `githubLink: null` if there is no public repository.
- **Case studies:** `src/data/caseStudies.js`. For a new one, add its slug to the project and to
  `CASE_STUDY_ORDER`, and add a matching rewrite in `vercel.json`.
- **Chat answers:** `src/data/knowledge.js`
- **Hero portrait:** `src/face/config.js` sets the photo, its landmarks and optional expression pictures
- **Page title and description:** change both `index.html` and `HOME_META` in `src/lib/seo.js`
- **Experience, stack and stats:** `Timeline.jsx`, `TechStack.jsx` and `ProfileCard.jsx` in `src/components/`

## Images

These need Chrome or Edge installed (set `CHROME_PATH` if it is somewhere unusual).

```bash
node scripts/capture-project-shots.mjs nexus   # screenshot a live demo
node scripts/optimize-images.mjs nexus         # convert it to WebP
node scripts/generate-og.mjs                   # rebuild the social share image
```

Leave out the name to process every image. Check screenshots before committing them.

## Deployment

The site deploys to Vercel as a Vite project. `vercel.json` sets the function limits, case study
rewrites, caching and security headers.

## Contact

- Email: sg6227174@gmail.com
- LinkedIn: [sakshi-gupta-ba858a292](https://www.linkedin.com/in/sakshi-gupta-ba858a292/)
- GitHub: [sakshigupta372](https://github.com/sakshigupta372)
- X: [@gupt27951](https://x.com/gupt27951)
