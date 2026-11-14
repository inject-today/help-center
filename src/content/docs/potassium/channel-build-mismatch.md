---
title: Channel Build Mismatch
description: Resolves Roblox version differences preventing client launch or executor attachment.
category: errors
appliesTo: Latest Roblox / Latest Potassium
verifiedOn: 2026-11-14
---

## Symptom

"Channel build mismatch" error message appears when trying to attach Potassium.

## Cause

The installed Roblox client version does not match the build version required by Potassium.

## Fix

- Head over to the[RDD Platform](https://rdd.weao.gg/), find the row of exploit buttons, and click **Potassium**. Once the other options disappear and the version prompt appears, click the **Download version-xxxxxx** button.
    - _Verification:_ The download will start or prompt you to save the `.zip` file to your computer.
- Press your **Windows Key + R** shortcut, type `%localappdata%\Roblox\Versions` into the run box, and hit enter. Look for your old, mismatched version folder starting with `version-` and delete it entirely so the folder is clean.
    - _Verification:_ The old folder is completely gone from your file explorer window.
- Find the file you just downloaded. It will have a long name starting with `WEAO-LIVE-WindowsPlayer-`. Right-click it, hit rename, and delete everything in front of the word `version` so the name starts strictly with `version-` followed by the hash code.
    - _Verification:_ The name begins precisely with `version-` and has no extra wrapper text attached to the front.
- If your download is zipped, right-click and extract it into a normal folder. Take that clean, renamed `version-xxxxxx` folder and drag it right into your `%localappdata%\Roblox\Versions` directory.
    - _Verification:_ Start up Roblox and attach Potassium; the channel build mismatch error will be gone, and the tool will run normally.
- **Still not working?:** Check the official Potassium Discord status channel. If the status indicator is red, it means the executor itself is currently down, so swapping the Roblox files won't work until the developers push an update.
- **Video Guide:** [Downgrading/Installing latest version guide on YouTube](https://www.youtube.com/watch?v=fqQgB24vlDw).

## Still not working?

What to try next, or where to ask.
