# Maintaining Inject.Today

Notes for admins. Moderators have their own [moderator handbook](https://inject.today/contributing/moderating/) on the site (`src/content/docs/contributing/moderating.md`).

## How a change goes live

1. Someone opens a pull request: through **Edit page**, the guide editor at `/admin/`, or by hand.
2. The `Mod queue` workflow labels it (`product/<slug>`, `status/needs-review`, and `links/external` if it adds outside links) and posts to `#mod-queue` on Discord. When a contributor pushes to a pull request labeled `status/changes-requested`, it swaps back to `status/needs-review` and posts again.
3. The `Checks` workflow builds the site and runs `scripts/content-guard.mjs`.
4. A moderator reviews it, then either approves it and does a **Squash and merge**, asks for changes (`status/changes-requested`), or closes it with the `declined` label and a reason.
5. Merging to `main` deploys the site through Cloudflare Workers Builds, and the merge is posted to `#site-updates`.

Before approving, open every link listed under **External links added** in the content check's summary and make sure it's an official source.

## Roles

| Role | GitHub | Can do |
| --- | --- | --- |
| Contributor | none needed | Open pull requests from a fork |
| Moderator | `@inject-today/moderators` (Write) | Review, edit, approve and merge guides (`src/content/docs/<product>/`) |
| Admin | `@inject-today/admins` (Admin) | Everything: products, site code, workflows, settings, and the site pages (home, Terms, Privacy, contributing) |

## Adding or changing a product

Edit `src/data/products.json`, run `npm run assets` (fetches the logo and a screenshot from WEAO into `src/assets/products/<slug>/`) and `npm run sync`, then open a pull request. If WEAO has no logo, or a worse one than the product's own site, run `npm run logo -- <slug> <image file>` instead (SVG works too; otherwise a square image of 256×256 or larger looks best). Products with no logo at all get a letter tile.

Both scripts make logos look alike on the site: a mark on a plain black square is lifted off the black, empty margins are cut away so every mark sits at the same size on its tile, and a logo that fills its square is cropped to the middle square.

The fields:

- `name`, `slug` (the URL, lowercase with dashes), `kind` (`executor` or `external`), `platforms` (`Windows`, `Mac`, `Android`, `iOS`)
- `formerly`: the old name of a renamed product. The product page shows it, and the home page's finder matches it. When a product is renamed, change `name` and `slug`, rename its folder in `src/assets/products/`, and put the old name here.
- `links.website`, `links.discord`: official links only.
- `featured`: a number puts the product in the home page's **Popular** grid at that position; leave it out to not feature it.
- `weaoIds`: the product's tracker IDs on WEAO (`trackerId` in `https://weao.gg/api/status/exploits`), one per platform listing. Logos, screenshots and the live status come from these. A product WEAO doesn't list simply shows no status.
- `logoFit` and `color` are set by `npm run assets` and `npm run logo`: whether the logo fills its tile, and the brand color its glow uses. Edit `color` by hand if the picked one looks off.
- `customLogo`: set by `npm run logo`. `npm run assets` never replaces these logos, not even with `--force`.

## Product status

Status comes from WEAO's tracker, worked out in `src/lib/weao.js`: **Updated**, **Not updated** (not updated for the current Roblox version), **Has issues**, or **Partly updated** (updated on some platforms only). Product pages also show WEAO's detection warning, if there is one.

The home page's **Right now** panel (`src/components/StatusBoard.astro`) sums it up: how many products are updated, the ones that aren't (most urgent first, four at most), and when Roblox last updated on each platform, from WEAO's `https://weao.gg/api/versions/current`.

- At build time, every page gets the status WEAO had then (`src/lib/status.ts`). If WEAO is down, the build still works; the badges and the Right now panel are just missing.
- In the browser, `src/scripts/live-status.ts` asks `/api/status` for the current status and updates the page.
- `/api/status` is served by the site's Worker (`workers/site/index.js`), which asks WEAO at most once a minute per Cloudflare location and keeps the last good answer if WEAO stops responding. Only `/api/*` requests run the Worker; pages and files are served straight from the build.

## Analytics

Cloudflare Web Analytics, which uses no cookies. The numbers are in the Cloudflare dashboard under **Analytics & Logs** → **Web Analytics**. The site's token is `analyticsToken` in `src/data/site.json`; it isn't secret, since it ends up in every page. Empty it to turn analytics off. The Privacy Policy describes it.

## The guide editor

The editor is [Sveltia CMS](https://sveltiacms.app), loaded from unpkg in `public/admin/index.html` at a fixed version with an integrity hash. Dependabot can't see it, so check its [security advisories](https://github.com/sveltia/sveltia-cms/security/advisories) now and then. To update, change the version in the URL and replace the hash with the output of:

```sh
curl -sL https://unpkg.com/@sveltia/cms@<version>/dist/sveltia-cms.js | openssl dgst -sha384 -binary | openssl base64 -A
```

The editor's settings are generated by `src/pages/admin/config.yml.ts`, including the template new guides start from and the help links in its toolbar.

## To do

- [ ] **Discord invite:** `discord.gg/injecttoday` (in `src/data/site.json`) doesn't resolve yet. Set it up as the server's vanity URL, or replace it with a permanent invite.
- [ ] **Sponsor slots:** none exist yet by design. Add them as a component override later, and update the Privacy Policy if they track anything.
- [ ] **Translate button:** detect the browser language and offer a translated view.
- [ ] **DMCA agent:** register a designated agent at https://www.copyright.gov/dmca-directory/ ($6) for full safe-harbor protection.

## Settings that live outside the repo

- **GitHub:** branch ruleset on `main`, squash merging only, "Require approval for first-time contributors", teams, labels.
- **GitHub secrets/variables:** `DISCORD_QUEUE_WEBHOOK`, `DISCORD_PUBLIC_WEBHOOK` (secrets), `DISCORD_MOD_ROLE_ID` (variable).
- **Cloudflare:** the `inject-today` Worker (site and `/api/status`, built by Workers Builds on every push to `main`) and `inject-today-cms-auth` (editor sign-in, deployed by hand with `npx wrangler deploy -c workers/cms-auth/wrangler.jsonc`, secrets `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`).
- **GitHub OAuth App** "Inject.Today guide editor", whose callback URL points at the sign-in Worker's `/callback`.

If the workers.dev subdomain or the sign-in URL changes, update `ALLOWED_DOMAINS` in `workers/cms-auth/wrangler.jsonc` and `AUTH_URL` in `src/pages/admin/config.yml.ts`.
