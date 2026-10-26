---
title: Contributing
description: How to fix a guide, write a new one, or report a fix, and what moderators look for before it goes live.
---

Every guide on Inject.Today is written by someone who ran into the problem and fixed it. If you know a fix that isn't here, or a guide that's wrong or out of date, you can change it.

Nothing goes live on its own. Every change is checked by a moderator first, and once it's approved, it's on the site within a few minutes.

## Three ways to help

You need a free [GitHub account](https://github.com/signup) for all three.

| What you want to do | How |
| --- | --- |
| Fix a typo or a wrong step | Click **Edit page** at the bottom of the guide. GitHub opens an editor, and saving sends your change for review. |
| Write a new guide or add screenshots | Open the [guide editor](/admin/) and sign in with GitHub. Write the guide, then click **Send for review**. |
| Tell us about a fix without writing it up | [Report a fix](https://github.com/inject-today/help-center/issues/new?template=fix-report.yml). A moderator will turn it into a guide. |

## How to write a good guide

Keep each guide to **one problem**. Someone searching for an error message should land on a page about exactly that error.

Use this layout:

```md
---
title: "Error: The specified module could not be found"
description: One sentence saying what this fixes.
category: errors
appliesTo: v2.1 and newer
verifiedOn: 2026-10-26
---

## Symptom

What you see: the exact error text, what happens and when.

## Cause

Why it happens, if you know.

## Fix

1. First step.
2. Second step.

## Still not working?

What to try next, or where to ask.
```

- **title**: the problem as people would search for it. Put error messages in quotes, word for word.
- **category**: one of `getting-started`, `wont-open`, `errors`, `crashes`, `key-system`, `antivirus` or `other`.
- **appliesTo**: the product versions the fix works on, if it matters.
- **verifiedOn**: the last date you confirmed the fix works. Update it whenever you check it again.

## Rules every guide has to follow

- **Official downloads only.** Link to the product's official website or Discord, never to mirrors, re-uploads, cracked or "fixed" builds.
- **No files.** Guides are text and screenshots. Never attach or link programs, archives or scripts that you host yourself.
- **Antivirus.** Don't tell people to turn their antivirus off. If a product needs an exclusion, link the developer's own instructions and limit it to that product's folder.
- **No private information.** Crop or blur usernames, keys, license codes, emails and anything else personal in screenshots.
- **Screenshots** must be WebP or PNG, under 500 KB, and cropped to what matters.
- **Credit your sources.** If you bring in a guide someone else wrote, say who wrote it and link the original.

## What happens after you send it

1. A moderator gets a notification and reviews your change.
2. They might edit it, ask you to change something, or decline it with a reason.
3. Once it's approved, it's live on the site within a few minutes.

## License

By contributing, you agree that your contribution is published under the [Creative Commons Attribution-ShareAlike 4.0 license](https://creativecommons.org/licenses/by-sa/4.0/) (CC BY-SA 4.0), like every other guide here. See the [Terms of Service](/terms/) for details.
