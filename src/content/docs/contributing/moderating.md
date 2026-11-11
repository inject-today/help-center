---
title: Moderator handbook
description: How moderators review, fix, publish and decline guides, and what to check before anything goes live.
---

Moderators decide what goes on the site. This page covers where submissions come from, how to review one, and what to do in the less common cases. Contributors can read it too, so they know what you check.

## Your access

- You're in the **Moderators** team of the [inject-today](https://github.com/inject-today) organization on GitHub. The organization requires two-factor authentication, so turn it on in your GitHub settings before you accept the invite.
- You can review, edit and merge changes to **guides**. Changes to the site itself (its code, the product list, workflows, and the Terms, Privacy and Contributing pages) need an admin. GitHub enforces this, so you can't merge one by accident.
- In Discord, the **Moderators** role is pinged in `#mod-queue` whenever something new comes in.

## Where submissions come from

| Source | What you get | Where it shows up |
| --- | --- | --- |
| The [guide editor](/admin/) | A pull request from the contributor's fork | `#mod-queue`, and [open pull requests](https://github.com/inject-today/help-center/pulls) |
| **Edit page** on a guide | A pull request, usually a small fix | The same |
| [Report a fix](https://github.com/inject-today/help-center/issues/new?template=fix-report.yml) | An issue describing a fix, not a guide yet | `#mod-queue`, and [open issues](https://github.com/inject-today/help-center/issues) |

Each pull request is labeled automatically: `status/needs-review`, a `product/<name>` label for every product it touches, and `links/external` if it adds links to other sites.

A pull request that has waited more than 48 hours is listed in `#mod-queue` every morning at 07:00 UTC.

## Reviewing a pull request

### 1. Let the checks run

Open the pull request from `#mod-queue`. If GitHub says **workflows awaiting approval**, the contributor is new. Open the **Files changed** tab first and make sure it only touches files under `src/content/docs/`, then click **Approve and run workflows**.

Two checks have to pass before anything can be merged:

- **build** builds the whole site with the change in it. If it fails, the guide has a formatting problem, such as a missing title or a category that doesn't exist. The log says which.
- **content-guard** checks the files: no changes outside guides, no images over 500 KB, no scripts, embeds or forms hidden in a guide. Its summary lists every outside link the change adds.

### 2. Read the guide

In **Files changed**, click the document icon on a guide (**Display the rich diff**) to read it formatted instead of as raw text. Pull requests made from a branch of the site itself, like the ones you make in the editor, also get a preview link from Cloudflare in the checks list.

Go through this list:

- **One problem**, and a title people would actually search for.
- **The steps make sense** and are in order. If you can try them, do. If something looks wrong or risky, ask.
- **Every outside link is official.** Open each link in the content-guard summary. The product's own website or Discord, Microsoft, Roblox and similar official sources are fine. Download mirrors, file hosts, link shorteners, "fixed" builds and Discord invites to other servers are not.
- **No "turn off your antivirus".** An exclusion for the product's own folder, following the developer's instructions, is fine.
- **Screenshots** show nothing personal: no usernames, keys, license codes or emails.
- **Credit.** If it's someone else's guide, it names them and links the original.
- **No ads, referral codes or promotion.**
- **Category** fits, and **Last verified** is set.

### 3. Decide

**Approve it.** Click **Review changes**, choose **Approve**, and submit. Then click **Squash and merge**. The guide is live within a few minutes and announced in `#site-updates`.

**Fix small things yourself.** Typos, a wrong category, a link to the wrong page: you can edit the contributor's files directly from **Files changed** (the **⋯** menu on a file, then **Edit file**). That's quicker for everyone than asking. Then approve and merge.

**Ask for changes.** For anything bigger, click **Review changes**, choose **Request changes**, and say exactly what needs to change. Then swap the `status/needs-review` label for `status/changes-requested`. When the contributor saves new changes, the pull request goes back to `status/needs-review` on its own and `#mod-queue` hears about it. If they don't answer for two weeks, it's closed automatically.

**Decline it.** If it breaks the rules or isn't useful, add the `declined` label and close it with a short, polite reason. Spam can be closed without one.

You can't approve your own pull request. When you write a guide, another moderator reviews it.

## Fix reports

A fix report is an issue where someone describes a fix without writing a guide.

1. Check whether a guide for it already exists. If so, update that guide, or close the report and link the guide.
2. If the fix holds up, write the guide yourself in the editor. Mention the report in the guide's pull request (for example "Closes #12") so the issue closes when it's merged, and thank the reporter.
3. If it's not a real fix, or not enough to go on, ask for details or close it with a reason.

## Writing guides yourself

You use the same [guide editor](/admin/) as everyone else, with a few differences, because you work on the site's repository directly instead of a fork:

- **Saving opens a pull request right away**, marked as a draft. Moving the guide to **In Review** (with the status button, or on the **Editorial Workflow** board) marks it ready and pings `#mod-queue`.
- **Another moderator reviews it.** They can approve it on GitHub, or move it to **Ready** in the editor, which approves it for them.
- **Publishing** from the editor merges it once it's approved and the checks have passed. Merging on GitHub works too.
- **Add images from inside the guide**, with the image button in the editor's toolbar. Don't upload through the editor's **Assets** page: that puts images outside the guides folder, and only an admin can merge those.

Contributors' pull requests don't show up on your Editorial Workflow board. Review them on GitHub as described above.

## When something's off

- **Someone is abusive** in a pull request or issue: don't argue. Close it and tell an admin, who can block the account.
- **A copyright or takedown request** comes in: don't handle it yourself. Forward it to [info@inject.today](mailto:info@inject.today).
- **A guide that's already live turns out to be wrong or harmful:** open a pull request that fixes or removes it, and say why in the description. If it's urgent, ping an admin in Discord.
- **A product is missing, renamed or shut down:** tell an admin. Products are part of the site's code.
- **You're not sure:** ask the other moderators in Discord. A second opinion is never a waste of time.

## Labels

| Label | Meaning |
| --- | --- |
| `status/needs-review` | Waiting for a moderator. Added automatically. |
| `status/changes-requested` | Waiting for the contributor. Add it when you ask for changes. |
| `status/approved` | Approved, waiting for someone to merge. Optional: only needed if you approve but leave the merge to someone else. |
| `declined` | Closed with a reason. |
| `product/<name>` | Which product's guides it changes. Added automatically. |
| `links/external` | Adds links to other sites. Check each one. Added automatically. |
| `fix-report` | An issue from the Report a fix form. |
| `stale` | Waiting on changes for 10 days. Closed 4 days later unless it's updated. |
