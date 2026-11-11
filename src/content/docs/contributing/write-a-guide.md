---
title: How to write a guide
description: From signing in to the guide editor to your guide going live, one step at a time.
---

This walks you through writing a guide with the guide editor, from signing in to your guide going live. It takes about ten minutes the first time. You don't need to know Git or code.

## Before you start

- **You need a [GitHub account](https://github.com/signup).** It's free. The editor uses it to save your guide and to credit you.
- **Check the guide doesn't exist yet.** Press <kbd>Ctrl</kbd> <kbd>K</kbd> on any page and search for the error or problem. If there's already a guide, improve it with **Edit page** at the bottom of it instead of writing a second one.
- **Write about something you've fixed.** The best guides come from someone who had the problem and knows the steps work.
- **One problem per guide.** "Error: VCRUNTIME140.dll was not found" is a guide. "Every error and how to fix it" is ten guides.

## 1. Sign in

1. Open the [guide editor](/admin/) and click **Sign in with GitHub**.
2. GitHub asks you to authorize **Inject.Today guide editor**. It can only see public repositories, so it can't touch anything private on your account. Click **Authorize**.
3. The first time, the editor asks to create a **fork**, which is your own copy of the site on your GitHub account. Your guide is saved there until a moderator publishes it. Agree to it.

:::note[Moderators]
If you're on the moderator team, you skip the fork and work on the site's repository directly. The [moderator handbook](/contributing/moderating/#writing-guides-yourself) covers the differences.
:::

## 2. Start a new guide

Every product has its own list in the editor. Pick the product your guide is about from the list on the left, then click **New**.

If the product isn't listed, [report the fix](https://github.com/inject-today/help-center/issues/new?template=fix-report.yml) instead and mention the product. An admin has to add it to the site first.

## 3. Fill in the details

| Field | What to put in it | Example |
| --- | --- | --- |
| **Title** | The problem, the way people would search for it. Put error messages in quotes, word for word. | `"VCRUNTIME140.dll was not found"` |
| **One-line summary** | One sentence saying what the guide fixes. It shows in the list of guides and in search. | `Install the Microsoft runtime the program needs.` |
| **Category** | The kind of problem. It decides where the guide shows up on the product's page. | Error messages |
| **Applies to version** | Only if the fix depends on the version. Leave it empty otherwise. | `v2.1 and newer` |
| **Last verified** | The last date you confirmed the fix works. | Today |

Titles to avoid: "Help", "Not working", "FIX!!!". Nobody searches for those, so nobody finds the guide.

## 4. Write the steps

The editor starts every guide with four sections. Fill them in and delete any that don't apply:

- **Symptom**: what people see. The exact error text, what happens and when.
- **Cause**: why it happens, if you know. Keep it short.
- **Fix**: numbered steps.
- **Still not working?**: what to try next, or where to ask.

A few things that make steps easy to follow:

- **One action per step.** "Open Settings" and "Click Apps" are two steps.
- **Write button and menu names in bold**, exactly as they appear on screen: Click **Apps**, then **Installed apps**.
- **Put error text and file names in code formatting**, so they're easy to spot and copy: `VCRUNTIME140.dll`.
- **Say what should happen** after a step, so people know it worked: "A window opens with a progress bar."
- **Link to official pages** for downloads, such as Microsoft's own download page, never to a mirror or a copy you host.

## 5. Add screenshots

Screenshots help most for steps where people need to find something on screen. Use the image button in the editor's toolbar to add one.

- Use **PNG or WebP**, under **500 KB**. Crop to the part that matters.
- **Blur or crop out** usernames, keys, license codes, emails and anything else personal.
- Give each image a short description, like "The Installed apps list with Microsoft Visual C++ highlighted". Screen readers read it out, and it shows if the image doesn't load.

## 6. Preview and send it

1. Check the preview next to the editor. It shows the guide roughly the way it will look on the site.
2. Click **Save**. The editor asks whether to send it for review now.
3. Click **Send for Review**. This opens a request on GitHub that moderators get notified about.

If you're not done yet, choose **Later**. Your guide stays saved in your fork as a draft, and you can send it whenever you're ready.

## 7. After you send it

- **A moderator reviews it,** usually within two days. They check it against the [rules](/contributing/#rules-every-guide-has-to-follow) and may fix small things themselves.
- **If they ask for changes,** you'll get an email from GitHub. Open the guide in the editor again, make the changes and click **Save**. Your changes go into the same request. A request that waits on changes for two weeks is closed, but you can always reopen it.
- **Once it's approved,** it's live on the site within a few minutes.

## Changing a guide later

To fix something in a guide that's already live, open it in the editor from the product's list, change it and send it for review the same way. For a quick fix, the **Edit page** link at the bottom of every guide works too.

Update **Last verified** whenever you've checked that a fix still works. It tells readers the guide isn't stale.

## A complete example

This is what a finished guide looks like underneath. The editor writes this for you, so you never have to type it, but it's handy to see all the parts together.

```md
---
title: '"VCRUNTIME140.dll was not found"'
description: Install the Microsoft runtime the program needs.
category: errors
verifiedOn: 2026-11-11
---

## Symptom

When you open the program, Windows shows "The code execution cannot proceed
because VCRUNTIME140.dll was not found" and nothing else happens.

## Cause

The program needs the Microsoft Visual C++ Redistributable, and it isn't
installed or is damaged.

## Fix

1. Close the program.
2. Download **Visual C++ Redistributable for Visual Studio 2015–2022 (x64)**
   from Microsoft's official download page.
3. Run the file you downloaded and click **Install**. If it offers **Repair**,
   click that instead.
4. Restart your PC, then open the program again.

## Still not working?

Install the x86 version from the same page as well, then restart again.
```

## Stuck?

Ask in the [Inject.Today Discord](https://discord.gg/injecttoday). Someone will help you get your first guide in.
