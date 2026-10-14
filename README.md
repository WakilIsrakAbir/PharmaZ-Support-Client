# Tulip Tech Support Tool — client

The web app for the support tool (Next.js 16, React 19, Tailwind 4). It talks only to
the Express API in `../server`; every `/api/*` request is forwarded there (see
`next.config.mjs`), so the login cookie stays on this site.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000, API expected on http://localhost:5000
```

Set `API_URL` when the API runs somewhere else (`API_URL=https://api.example.com npm run build`).

## Who sees what

| Role | Lands on | Can use |
| --- | --- | --- |
| Super admin | All products (`/admin/products`) | Create products and choose their admins, all accounts, and every page of whichever product is open (switch in the sidebar header). |
| Product admin | Dashboard | Their product: Log a Call, Logs, Users (add and remove support agents), Settings (problem areas and issues, statuses and priorities, form fields, name and colour). |
| Support agent | Dashboard | Log a Call and Logs for their product. |

There's no sign-up. An admin creates each account and is shown a temporary password
once; the person has to choose their own at their first sign-in.

## Where things are

```
src/
  app/(auth)/     login, forgot and reset password
  app/(app)/      the signed-in app: admin/, overview/, calls/, management/, settings/, profile/
  components/     one folder per area (admin, dashboard, call-logs, log-call, settings, users, sidebar, ui...)
  config/         navigation, roles, routes, theme, colour and icon lists
  hooks/          shared state: current user, product setup, forms, paged lists
  lib/            API client, auth helpers, formatting
  proxy.js        sends logged-out visitors to /login
```

The product's problem areas, statuses, priorities and extra fields come from the API
(`hooks/useProductSetup.js`); nothing product-specific is hard-coded here.
