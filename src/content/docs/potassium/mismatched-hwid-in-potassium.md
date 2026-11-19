---
title: Mismatched HWID (In Potassium)
description: Resets your hardware ID registration within the Potassium licensing system.
category: errors
appliesTo: All versions
verifiedOn: 2026-11-19
---

## Symptom

A "Mismatched HWID" error appears within the Potassium application itself (not inside Roblox) when attempting to authenticate or inject.

## Cause

Your machine's hardware ID has changed since you last authenticated (e.g., due to hardware upgrades, OS reinstallation, or BIOS changes), and it no longer matches the HWID stored in the Potassium licensing system.

## Fix

1. Open the Potassium Discord bot and send the `/reset_hwid` command.
**Verification:** The bot confirms that your HWID has been successfully reset.
2. Relaunch Potassium and re-authenticate.
**Verification:** Potassium opens and authenticates without the HWID mismatch error.

**CAUTION**

HWID resets have a cooldown period. The Potassium support team will not bypass or accelerate this cooldown under any circumstances. Plan your hardware changes accordingly.

## Still not working?

If the bot reports that your reset is on cooldown, you must wait for the cooldown period to expire before attempting again. There are no exceptions to this policy.
