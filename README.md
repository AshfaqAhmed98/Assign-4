# বাজার দর (BazarDor)

**বাজার দর** is a responsive Bengali market-price application for checking daily prices and price changes of essential goods. Browse products by category, compare current prices, and manage your account.

## Technologies

- Next.js App Router 16 and React 19
- TypeScript
- Tailwind CSS 4 and DaisyUI
- Better Auth for email/password and Google/GitHub OAuth
- Bazar Dor market-data API

## Key features

1. Daily product prices, price-change indicators, and market details.
2. Category pages with numeric price sorting and loading skeletons.
3. Responsive product cards, market ticker, and mobile-friendly navigation.
4. Email/password registration and sign-in, plus Google and GitHub OAuth.
5. Protected profile pages with user-name updates and friendly not-found pages.

## Getting started

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment and authentication

Set a private `BETTER_AUTH_SECRET` of at least 32 characters and `BETTER_AUTH_URL=http://localhost:3000` in `.env.local`. For OAuth, configure provider credentials in Google Cloud Console and GitHub Developer Settings, then set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, and `GITHUB_CLIENT_SECRET`.

Use these local OAuth callback URLs:

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

For deployment, set the deployed origin as `BETTER_AUTH_URL` and update each OAuth provider's callback URL to use that domain. Never commit `.env.local` or provider secrets.

Authentication currently uses Better Auth's in-memory adapter. Accounts and sessions are cleared when the server restarts; configure a persistent database adapter before production use or when running multiple server instances.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
