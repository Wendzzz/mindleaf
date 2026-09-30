# Making Mindleaf live: accounts and settings

The app runs in **demo mode** (accounts saved in the browser only) until two settings are added.
Follow these steps once. Nothing here costs money.

You'll need about 30 minutes. Keep this page open next to the Supabase and Google dashboards.

---

## 1. Create the Supabase project (accounts + database)

1. Go to <https://supabase.com> → **Start your project** → sign in with GitHub.
2. **New project**. Name: `mindleaf`. Region: **West EU (London)** or **Central EU (Frankfurt)**, the closest to Nigeria. Save the database password somewhere safe.
3. When it's ready, open **SQL Editor** → **New query**, paste everything from
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql), and press **Run**.
   You should see "Success. No rows returned".
4. Open **Project Settings → API** (or **Data API**). Copy:
   - **Project URL**, like `https://abcdxyz.supabase.co`
   - **anon / publishable key**, a long string starting with `eyJ` or `sb_publishable_`

   These two are safe to share and to put in the browser. **Never share the `service_role` / secret key.**

## 2. Turn on 6-digit email codes

1. **Authentication → Sign In / Providers → Email**: make sure **Email** is enabled.
   Set **Email OTP Length** to **6** and **Email OTP Expiration** to **3600** seconds (1 hour).
2. **Authentication → Emails → Templates**. Edit both **Confirm signup** and **Magic Link** so the email shows the code.
   Replace the body with:

   ```html
   <h2>Your Mindleaf code</h2>
   <p>Enter this code in the app to sign in:</p>
   <p style="font-size:32px;font-weight:800;letter-spacing:6px">{{ .Token }}</p>
   <p>It works for one hour. If you didn't ask for it, you can ignore this email.</p>
   ```

   Subject for both: `Your Mindleaf code: {{ .Token }}`
3. **Authentication → URL Configuration**:
   - **Site URL**: `https://mindleaf1.netlify.app/app/`
   - **Redirect URLs**: add `https://mindleaf1.netlify.app/app/` and `http://localhost:5173/app/`

> **Important limit:** Supabase's built-in email sender only delivers to the people on your Supabase team, and only a few emails an hour.
> That's enough for you to test with your own email. **Before inviting other people**, connect your own email sender
> (step 5). That needs a domain, like `mindleaf.app`.

## 3. Turn on "Continue with Google"

1. Go to <https://console.cloud.google.com> → create a project called `Mindleaf`.
2. **APIs & Services → OAuth consent screen** → **External** → App name `Mindleaf`, your support email, and developer email → Save.
   Under **Audience**, press **Publish app** so anyone (not just test users) can sign in.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**
   - Authorized JavaScript origins: `https://mindleaf1.netlify.app` and `http://localhost:5173`
   - Authorized redirect URIs: `https://YOUR-PROJECT.supabase.co/auth/v1/callback` (use your Project URL from step 1)
4. Copy the **Client ID** and **Client secret** into Supabase → **Authentication → Sign In / Providers → Google** → enable → Save.

## 4. Connect the app to Supabase

**On Netlify (the live site):**

1. Netlify → **mindleaf1** → **Site configuration → Environment variables → Add a variable**:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon / publishable key
2. **Deploys → Trigger deploy → Clear cache and deploy site**.
   Open `https://mindleaf1.netlify.app/app/`. The "Demo mode" note is gone, and sign-in sends a real email.

**On your Mac (optional, for local testing):** copy `.env.example` to `.env.local` and fill in the same two values.

## 5. Before real users: your own email sender (needs a domain)

1. Buy a domain (for example `mindleaf.app`).
2. Create a free account at <https://resend.com> → **Domains → Add domain** → add the DNS records it shows at your domain registrar.
3. In Resend, create an **API key**.
4. Supabase → **Authentication → Emails → SMTP Settings** → enable custom SMTP:
   host `smtp.resend.com`, port `465`, user `resend`, password = the API key, sender `hello@mindleaf.app`, name `Mindleaf`.
5. **Authentication → Rate Limits**: set emails per hour to fit your launch (for example, 100).

---

## What works after setup

- Sign up or sign in with a 6-digit email code, or with Google.
- Onboarding choices, plan progress, streaks with grace days, action points, reflections and saved ideas are saved to your account and show on every device.
- Install to the home screen (Android: Install prompt; iPhone: Share → Add to Home Screen). It opens offline too.
- Desktop: a full web app with a sidebar.

## Not built yet (next phases)

- **Reminders.** The chosen time is saved, but reminders aren't sent yet. Next: web push, with email as a backup.
- **Book clubs and Plus.** These are waitlists for now; people can join the list.
- **Payments.** Paystack for the ₦5,000/month plan.
- **Apple sign-in.** Needs an Apple Developer account ($99/year).
- **More readings.** Atomic Habits days 1–5 are written. Days 6–14 and other books show "still being written".
