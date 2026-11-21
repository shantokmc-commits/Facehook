# Facehook — Full-stack social network starter

A mobile-first, bilingual (Bangla + English) social media web app built with React, Vite, Tailwind CSS and Supabase.

## Included in this starter

- Email/password signup and login
- User profiles, bio and avatar upload
- Feed with text, image and video posts
- Likes and comments
- Friend requests, accept flow and friends list
- One-to-one text messaging
- Bangla / English interface toggle
- Responsive mobile navigation
- Supabase Row Level Security (RLS) policies and media storage setup

## 1. Requirements

- Node.js 20 or newer
- A Supabase account and project
- A terminal / command prompt

## 2. Create the database

1. Open your Supabase project.
2. Open **SQL Editor**.
3. Open `supabase/schema.sql` from this project.
4. Paste the full SQL into the editor and click **Run**.

This creates the tables, signup profile trigger, security policies and two storage buckets (`post-media`, `avatars`).

## 3. Configure Supabase Auth

In Supabase Dashboard → Authentication → URL Configuration:
- Set your local Site URL to `http://localhost:5173`.
- Add your eventual production website URL to Redirect URLs.
- For a public launch, configure email SMTP and review your email confirmation settings.

## 4. Add environment variables

Copy `.env.example` to `.env` and fill in:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Find these values in Supabase Dashboard → Project Settings → API.

**Never put a Supabase service-role key in frontend code.** The anon/publishable key is intended for browser use when RLS is correctly enabled.

## 5. Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (normally `http://localhost:5173`).

To test a production build:

```bash
npm run build
npm run preview
```

## 6. Deploy

You can deploy the Vite app to Vercel, Netlify or Cloudflare Pages:
- Build command: `npm run build`
- Output directory: `dist`
- Add the same two environment variables in the hosting dashboard.
- Add the production URL to Supabase Auth Redirect URLs.

## Important before public launch

This is a working MVP foundation, not a fully audited production social network. Before inviting the public:
- Add rate limiting, abuse/spam prevention, account recovery and email verification.
- Add user blocking, post/report review tools and admin-only moderation screens.
- Add pagination, image/video processing, upload quotas and malware/content checks.
- Add message realtime subscriptions, read receipts and notification delivery.
- Configure backups, monitoring, privacy policy, terms and a support contact.
- Review and test all RLS policies with separate test accounts.

The admin role field is reserved in the database; do not let users self-assign admin. Promote trusted administrators manually through the Supabase SQL editor.
