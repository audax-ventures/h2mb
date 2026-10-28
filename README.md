# H2MB website

Next.js App Router website for H2MB, owned by Audax Ventures. Prepared for Vercel; no Vercel deployment has been performed.

## Development

Requires Node.js 20.9 or newer.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. Run `npm run build` for a production build and `npm run typecheck` for TypeScript checks.

## Pages

Home, About, Our Project, Applications, Insights, two introductory articles, Contact, Privacy, and a custom 404. Responsive navigation, SEO metadata, sitemap, robots file, and a favicon are included.

Article content lives in `lib/content.ts`; shared navigation and footer in `components/site.tsx`; design styles in `app/globals.css`.

## Contact behavior

The form validates required fields and prepares a mailto draft. It does not send email, write to a database, or claim a submission succeeded. Visitors send from their own email client. Direct email and phone links are also available. A server-side email service can replace this flow later.

## Vercel

Import `audax-ventures/h2mb` as a Next.js project. Use the repository root, standard `npm run build`, and automatic Next.js output settings. This version needs no environment variables. Canonical site configuration uses https://www.h2mb.ca; review before connecting a production domain. Preview deployments should use Vercel's indexing protections.

## Editorial review before launch

- Confirm current project stage, supply plans, capacity, location, and timelines. The draft intentionally avoids unverified numeric claims and operating-facility assertions.
- Confirm contact details and priority applications.
- Supply approved leadership biographies, partner logos, and milestones if desired.
- Review introductory articles, environmental language, and the privacy notice.
- Confirm reuse rights for the imagery retained from H2MB's current website. See `CONTENT-SOURCES.md`.
- Historical media links are labelled as historical; they do not verify current project status.

No analytics, advertising trackers, database, or automated email service is included.
