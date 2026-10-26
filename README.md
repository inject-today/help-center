# Inject.Today

Community-driven help center for all things Roblox: fixes and guides for executors and other tools, written and checked by the community.

**Site:** https://inject.today

## Contributing

Anyone with a GitHub account can help. Every change is reviewed by a moderator before it goes live.

- **Fix a guide:** click **Edit page** at the bottom of it.
- **Write a guide:** use the [guide editor](https://inject.today/admin/), or add a Markdown file under `src/content/docs/<product>/`.
- **Report a fix:** [open a fix report](https://github.com/inject-today/help-center/issues/new?template=fix-report.yml) and a moderator will write it up.

Read the [contributing guide](https://inject.today/contributing/) first. It covers the guide layout and the rules every guide has to follow.

## How the site is put together

| Path | What it is |
| --- | --- |
| `src/data/products.json` | Every product. Product pages, sidebars, editor sections and the fix-report form are generated from it. |
| `src/data/categories.json` | The problem types guides are grouped by. |
| `src/assets/products/<product>/` | Each product's logo and screenshot, fetched from WEAO with `npm run assets`. |
| `src/content/docs/<product>/*.md` | Guides. Images go in `src/content/docs/<product>/images/`. |
| `src/content/docs/*.md` | Contributing, Terms and Privacy pages. |
| `src/components/` | Home page, product pages and Starlight overrides. |
| `src/routeData.ts` | Builds each product's sidebar. |
| `scripts/` | Product list checks and the content check run on every pull request. |
| `workers/cms-auth/` | GitHub sign-in for the guide editor. |

Built with [Astro Starlight](https://starlight.astro.build) and hosted on Cloudflare.

## Running it locally

Needs Node 24 or newer.

```sh
npm ci
npm run dev
```

## Adding a product

1. Add an entry to `src/data/products.json`, including its `weaoIds` if WEAO lists it.
2. Run `npm run assets` to fetch its logo and screenshot, and `npm run sync` to update the fix-report form.
3. Open a pull request.

## License

Guides in `src/content/docs/` are licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). `workers/cms-auth/` is MIT-licensed code from [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth). The rest of the site's code is © Inject.Today.
