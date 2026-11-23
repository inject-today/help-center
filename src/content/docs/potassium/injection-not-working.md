---
title: Injection Not Working
description: Comprehensive troubleshooting for general injection failures not covered by a specific error code.
category: wont-open
appliesTo: All versions
verifiedOn: 2026-11-19
---

## Symptom

Potassium fails to inject into Roblox. The injection either silently fails, the status bar hangs, or the client crashes immediately upon injection. No specific error code is displayed.

## Cause

Multiple factors can prevent injection, including antivirus interference, corrupted Roblox installations, leftover temporary files, or stale cached data.

## Fix

- **Disable Windows Defender and add the Potassium folder to exclusions.**
Open **Windows Security** → **Virus & threat protection** → **Manage settings** → scroll to **Exclusions** → **Add or remove exclusions** → **Add an exclusion** → **Folder** → select your Potassium installation directory.
**Verification:** Your Potassium folder appears in the exclusions list.
- **Reinstall Roblox.**
Uninstall Roblox completely via **Settings** → **Apps** → **Installed apps**, then download and install a fresh copy from [roblox.com](https://www.roblox.com/).
**Verification:** Roblox launches cleanly with no remnants of the old installation.
- **Clear your temporary files.**
Press `Win + R`, type `%temp%`, and hit Enter. Select all files in the folder (`Ctrl + A`) and delete them. Skip any files that are currently in use.
**Verification:** The `%temp%` directory is empty or contains only locked files.
- **Clear your Roblox cache.**
Press `Win + R`, type `%localappdata%\Roblox`, and hit Enter. Delete the `Logs` and any `cache` folders inside.
**Verification:** The cache directories have been removed.
- Relaunch Roblox, then relaunch Potassium and attempt injection.
**Verification:** Potassium injects successfully and scripts execute within the game.

## Still not working?

Ensure you are not running any conflicting overlays (Discord, NVIDIA GeForce Experience, RivaTuner). Also verify that your Roblox client version matches the version Potassium currently supports by checking the Discord status channel.
