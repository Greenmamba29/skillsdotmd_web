# skillsdotmd

The unified Skills.md platform — aggregate, validate, test, and learn AI agent skills from every source.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Greenmamba29/skillsdotmd_web)

## Features

- **Skill Discovery** — Browse 65+ skills with search, category filters, and lint score ranking
- **Validation & Linting** — Built-in SKILL.md validator with 14 lint rules (SKL001-SKL014)
- **Interactive Quizzes** — Auto-generated quizzes from skill content with scoring
- **Demo Videos** — YouTube and MP4 video embedding per skill
- **Stripe Subscriptions** — Free, Pro ($19/mo), and Team ($49/mo) plans
- **Weavy Collaboration** — Real-time chat and comments per skill
- **Spline 3D Viewer** — Interactive 3D skill visualization
- **Auto-Sync** — Import skills from `.agents/skills/`, GitHub repos, Skills.sh
- **One-Click Deploy** — Netlify-ready with CI/CD via GitHub Actions

## Quick Start

```bash
cd app
npm install
npx prisma db push
npm run dev
```

Visit `http://localhost:3000/dashboard` and click **Sync Skills** to import all skills.

## Environment Variables

```
DATABASE_URL="file:./dev.db"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
WEAVY_URL="https://your-weavy-server.com"
WEAVY_API_KEY="weavy_..."
```

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (10 endpoints)
- **Database**: Prisma + Neon PostgreSQL (8 models)
- **Auth**: Neon Auth (@neondatabase/neon-js)
- **Payments**: Stripe (checkout + webhooks)
- **Collaboration**: Weavy (chat/comments)
- **3D**: Spline.design
- **CI/CD**: GitHub Actions + Netlify

## License

MIT
