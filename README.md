# Bazar Dor

Next.js App Router project using TypeScript, Tailwind CSS, DaisyUI, and Better Auth.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm start` - serve the production build
- `npm run lint` - run ESLint

## Authentication

Authentication uses Better Auth's built-in in-memory adapter, so no separate database package or service is required for local evaluation. User accounts and sessions are temporary and are cleared when the server restarts; configure a persistent Better Auth database adapter before deploying or using multiple server instances.

Copy `.env.example` to `.env.local` and set a private `BETTER_AUTH_SECRET` of at least 32 characters. `BETTER_AUTH_URL` defaults to `http://localhost:3000` in development. Email/password sign-up and sign-in are available at `/signup` and `/signin`.

Google and GitHub sign-in are wired through Better Auth. To enable them for local development, create OAuth credentials in each provider's developer console:

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), configure the OAuth consent screen and create an OAuth client ID with application type **Web application**. Add this authorized redirect URI: `http://localhost:3000/api/auth/callback/google`.
2. In [GitHub Developer Settings](https://github.com/settings/developers), create an **OAuth App**. Set its homepage URL to `http://localhost:3000` and its authorization callback URL to `http://localhost:3000/api/auth/callback/github`.
3. Copy `.env.example` to `.env.local`, then enter the client ID and secret from each console in the matching variables. `.env.local` is git-ignored; never commit provider secrets.
4. Generate a private `BETTER_AUTH_SECRET` (for example, `openssl rand -base64 32`) and keep `BETTER_AUTH_URL=http://localhost:3000`. Restart `npm run dev`.

For deployment, create/update each provider's OAuth app with your production domain and set `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, and the provider credentials in the host's environment settings. A provider's ID and secret must either both be configured or both be left unset. OAuth buttons show a clear setup error while a provider is disabled.

Google and GitHub are trusted for implicit linking when the provider confirms a matching email address. Local email verification is disabled for this project, so this allows an existing password account to link to its verified OAuth identity without adding a verification-email flow. Emails must still match; linking accounts with different email addresses is not allowed.

The shared navbar loads market categories and product prices from the Bazar Dor API configured in `src/lib/api.ts`. Product detail pages are currently public.
