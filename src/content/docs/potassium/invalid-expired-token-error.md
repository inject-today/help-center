---
title: Invalid/Expired Token Error
description: Resolves authentication failure and token corruption issues preventing Potassium from attaching.
category: wont-open
appliesTo: Latest Potassium / All versions
verifiedOn: 2026-11-18
---

## Symptom

An authentication or token error pops up when trying to attach Potassium, preventing it from validating your account or session while injecting.

## Cause

The local authentication token file (`user.bin`) has become corrupted, expired, or invalid.

### Fix

1. Close your executor completely.
2. Press the **Windows Key + R** on your keyboard at the same time to open the Run command box.
3. Type `%appdata%\com.pot.potassium-tauri` into the box and press **Enter** so it automatically opens the correct Roaming folder for whichever user profile is currently active on the PC.
    - _Verification:_ File Explorer opens directly to the Potassium application directory.
4. Locate the file named `user.bin`.
5. Right-click `user.bin` and delete it entirely.
    - _Verification:_ The file is completely removed from the folder.
6. Reopen Potassium and log in or re-authenticate your session.
    - _Verification:_ Potassium opens cleanly and prompts you to authenticate without throwing token errors.

## Still not working?

Check the official Potassium Discord status channel to verify if the authentication servers or API are currently experiencing downtime.
