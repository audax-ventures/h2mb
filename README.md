# H2MB website

Next.js App Router website for H2MB, owned by Audax Ventures. Source is saved in `audax-ventures/h2mb` and deployed through Vercel at https://h2mb.vercel.app.

## Verification and deployment

Requires Node.js 20.9 or newer.

```sh
npm ci
npm run typecheck
```

Push changes to GitHub to trigger Vercel's production build. Use the deployed website for browser review; do not start a local website server as part of the default workflow.

## Pages

Home, About, Our Project, Our Process, Applications, Insights, two introductory articles, Contact, Privacy, and a custom 404. Responsive navigation, SEO metadata, sitemap, robots file, and a favicon are included.

Article content lives in `lib/content.ts`; navigation links in `lib/navigation.ts`; shared header and footer in `components/header.tsx` and `components/site.tsx`; design styles in `app/globals.css`.

The illustrated process walkthrough lives in `components/process/`. It uses SVG illustrations and scroll-driven CSS properties, with no animation framework or continuous rendering loop. Chapter links, a manual animation toggle, and the operating system's reduced-motion preference are supported. On small screens, each explanation precedes its illustration.

## Contact behavior

The form validates required fields and prepares a mailto draft. It does not send email, write to a database, or claim a submission succeeded. Visitors send from their own email client. Direct email and phone links are also available. A server-side email service can replace this flow later.

## Vercel

The `h2mb` Vercel project is connected to `audax-ventures/h2mb`. It uses the repository root, standard `npm run build`, and automatic Next.js output settings. This version needs no environment variables. Canonical site configuration uses https://www.h2mb.ca; review before connecting a production domain. Deployment protection remains managed in Vercel.

## Editorial review before launch

- Confirm current project stage, supply plans, capacity, location, and timelines. The draft intentionally avoids unverified numeric claims and operating-facility assertions.
- Confirm contact details and priority applications.
- Supply approved leadership biographies, partner logos, and milestones if desired.
- Review introductory articles, environmental language, and the privacy notice.
- Confirm reuse rights for the imagery retained from H2MB's current website. See `CONTENT-SOURCES.md`.
- Historical media links are labelled as historical; they do not verify current project status.

No analytics, advertising trackers, database, or automated email service is included.
