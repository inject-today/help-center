---
title: HWID Seed Generator Warning (Roblox Account Manager)
description: Suppresses a false-positive HWID warning triggered when using Roblox Account Manager alongside Synapse Z.
category: errors
appliesTo: All versions
verifiedOn: 2026-11-20
---

## Symptom

A "HWID seed generator" warning appears when launching Roblox Account Manager while Synapse Z is installed.

## Cause

Roblox Account Manager detects Synapse Z's driver or system modifications and flags them as a potential HWID manipulation risk. This is a false positive that can be suppressed with a configuration file.

## Fix

- Navigate to your **Roblox Account Manager** installation folder in File Explorer.
**Verification:** You can see the Roblox Account Manager executable and supporting files.
- Create a new empty text file inside this folder and name it exactly: `no773fix.txt`
**Verification:** The file `no773fix.txt` exists in the Roblox Account Manager directory.
- Restart Roblox Account Manager.
**Verification:** The HWID seed generator warning no longer appears.

## Still not working?

Ensure the filename is exactly `no773fix.txt` with no extra extensions (e.g., not `no773fix.txt.txt`). Enable "File name extensions" in File Explorer's **View** tab to verify.
