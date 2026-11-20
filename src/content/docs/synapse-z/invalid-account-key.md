---
title: Invalid Account Key
description: Clears a corrupted local authentication file to restore Synapse Z login functionality.
category: key-system
appliesTo: All versions
verifiedOn: 2026-11-20
---

## Symptom

Synapse Z displays an "Invalid account key" error on startup and cannot authenticate.

## Cause

The local authentication file (`auth_v2.syn`) has become corrupted, expired, or desynchronized from the server.

## Fix

- Press `Win + R`, type `%localappdata%`, and hit Enter.
**Verification:** The Local AppData folder opens in File Explorer.
- Locate the file named `auth_v2.syn` and delete it.
**Verification:** The `auth_v2.syn` file no longer exists in the directory.
- Relaunch Synapse Z. It will prompt you to re-authenticate.
**Verification:** Synapse Z authenticates successfully and loads the main interface.

## Still not working?

Ensure your Synapse Z account is in good standing. If the error persists after deleting the auth file, your account may have been suspended or your HWID may need a reset. Contact Synapse Z support for assistance.
