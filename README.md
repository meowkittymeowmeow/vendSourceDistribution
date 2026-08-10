<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/20e13f20-e0e5-4304-9258-f09eb5b91530

## Editing site content (no code needed)

All wording, images, prices, reviews and FAQs live in JSON files under
[content/](content/), edited through [Pages CMS](https://pagescms.org) — a free
editing panel that commits straight to this repo. Every save triggers a redeploy.

One-time setup for a new editor:

1. A repo admin adds them as a **collaborator** on this GitHub repo
   (Settings → Collaborators) — they need a free GitHub account.
2. They sign in at <https://app.pagescms.org> with that GitHub account and
   pick this repository.
3. The sidebar shows **Homepage, Products, Reviews, FAQ, Site settings**
   (defined in [.pages.yml](.pages.yml)) plus a **Media** tab for uploading
   images into `public/`.

Notes for editors: product **IDs must not be changed** (checkout references
them), and product prices here are the real checkout prices.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
