# GFC Fit Check

Pre-Fit Check qualifier for Goodyear For Change. A man answers 4 questions, gets an AI-generated reflection via Claude, then books a Fit Check call via Calendly. Answers + reflection are emailed to Nik.

## Tech Stack

- Single HTML page with vanilla JS
- Vercel serverless function (`/api/reflect`)
- Anthropic Claude API (claude-sonnet-4-20250514) for reflections
- Resend API for email notifications

## Local Development

```bash
npm install
npx vercel dev
```

You'll need a `.env` file locally:

```
ANTHROPIC_API_KEY=sk-ant-...
RESEND_API_KEY=re_...
```

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add -A
git commit -m "Initial commit — GFC Fit Check qualifier"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/gfc-fit-check.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your `gfc-fit-check` repository
3. Framework Preset: **Other**
4. Click **Deploy**

### 3. Add Environment Variables

In the Vercel dashboard for your project:

1. Go to **Settings → Environment Variables**
2. Add these two variables:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (`sk-ant-...`) |
| `RESEND_API_KEY` | Your Resend API key (`re_...`) |

3. Click **Save**
4. **Redeploy** the project for the variables to take effect (Deployments → three-dot menu → Redeploy)

### 4. Resend Domain Setup

For the `from` address (`fitcheck@goodyearforchange.com`) to work, you need to verify the `goodyearforchange.com` domain in Resend:

1. Go to [resend.com/domains](https://resend.com/domains)
2. Add `goodyearforchange.com`
3. Add the DNS records Resend provides
4. Wait for verification

Until the domain is verified, you can use `onboarding@resend.dev` as the `from` address for testing.

## File Structure

```
├── api/
│   └── reflect.js        # Serverless function: Claude + Resend
├── public/
│   └── index.html         # Single-page app
├── package.json
├── vercel.json            # Routing config
└── README.md
```
