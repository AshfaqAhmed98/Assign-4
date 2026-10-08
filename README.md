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

Better Auth is installed; configure its database adapter and environment variables before adding authentication routes.

The shared navbar loads market categories and product prices from the Bazar Dor API configured in `src/lib/api.ts`. Authentication links are present in the navbar; sign-in routes and session handling still need to be configured with the chosen Better Auth database. Product detail pages are currently public; route protection will be added with authentication in a later step.
