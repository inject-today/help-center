# Maintaining Inject.Today

Notes for admins and moderators.

## How a change goes live

1. Someone opens a pull request: through **Edit page**, the guide editor at `/admin/`, or by hand.
2. The `Mod queue` workflow labels it (`product/<slug>`, `status/needs-review`, and `links/external` if it adds outside links) and posts to `#mod-queue` on Discord.
3. The `Checks` workflow builds the site and runs `scripts/content-guard.mjs`.
4. A moderator reviews it, then either approves it and does a **Squash and merge**, asks for changes (`status/changes-requested`), or closes it with the `declined` label and a reason.
5. Merging to `main` deploys the site through Cloudflare Workers Builds, and the merge is posted to `#site-updates`.

Before approving, open every link listed under **External links added** in the content check's summary and make sure it's an official source.

## Roles

| Role | GitHub | Can do |
| --- | --- | --- |
| Contributor | none needed | Open pull requests from a fork |
| Moderator | `@inject-today/moderators` (Write) | Review, edit, approve and merge guides |
| Admin | `@inject-today/admins` (Admin) | Everything: products, site code, workflows, settings |

## Adding or changing a product

Edit `src/data/products.json`, run `npm run assets` (fetches the logo and a screenshot from WEAO into `src/assets/products/<slug>/`) and `npm run sync`, then open a pull request. Products without a WEAO logo get a letter tile. To use a different logo, replace `logo.webp` in its folder. Fields:

- `name`, `slug` (the URL, lowercase with dashes), `kind` (`executor` or `external`), `platforms` (`Windows`, `Mac`, `Android`, `iOS`)
- `links.website`, `links.discord`: official links only.
- `featured`: a number puts the product in the home page's **Popular** grid at that position; leave it out to not feature it.
- `status`: `active`, `updating` or `down`. See the to-do below.
- `weaoIds`: the product's tracker IDs on WEAO, used for logos now and status later.
- `logoFit` and `color` are set by `npm run assets`: whether the logo fills its tile, and the brand color its glow uses. Edit `color` by hand if the picked one looks off.

## To do

- [ ] **Status badges from WEAO.** Every product shows "Active" as a placeholder. Wire `status` to `GET https://weao.gg/api/status/exploits` (CORS open, 120 requests per window), matching on `weaoIds` against each entry's `trackerId`; `updateStatus: false` means not updated for the current Roblox version. Prefer a cached fetch (a small Worker, or a client fetch with a fallback) so the site still works when WEAO is down.
- [ ] **Search on product pages** should start filtered to that product. Pages are already tagged (`product` filter); this needs an override of Starlight's `Search` component.
- [ ] **Discord link** in the site header once there's a public invite (`social` in `astro.config.mjs`).
- [ ] **Analytics:** Cloudflare Web Analytics is free and cookieless. Update the Privacy Policy before turning it on.
- [ ] **Sponsor slots:** none exist yet by design. Add them as a component override later, and update the Privacy Policy if they track anything.
- [ ] **Translate button:** detect the browser language and offer a translated view.
- [ ] **DMCA agent:** register a designated agent at https://www.copyright.gov/dmca-directory/ ($6) for full safe-harbor protection.

## Settings that live outside the repo

- **GitHub:** branch ruleset on `main`, squash merging only, "Require approval for first-time contributors", teams, labels.
- **GitHub secrets/variables:** `DISCORD_QUEUE_WEBHOOK`, `DISCORD_PUBLIC_WEBHOOK` (secrets), `DISCORD_MOD_ROLE_ID` (variable).
- **Cloudflare:** the `inject-today` Worker (site, built by Workers Builds on every push to `main`) and `inject-today-cms-auth` (editor sign-in, deployed by hand with `npx wrangler deploy -c workers/cms-auth/wrangler.jsonc`, secrets `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`).
- **GitHub OAuth App** "Inject.Today guide editor", whose callback URL points at the sign-in Worker's `/callback`.

If the workers.dev subdomain or the sign-in URL changes, update `ALLOWED_DOMAINS` in `workers/cms-auth/wrangler.jsonc` and `AUTH_URL` in `src/pages/admin/config.yml.ts`.
