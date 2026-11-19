---
title: Failed to Register and Start Service for the Driver
description: Resolves a kernel driver conflict caused by other software occupying the same driver namespace.
category: errors
appliesTo: All versions
verifiedOn: 2026-11-19
---

## Symptom

Potassium displays "Failed to register and start service for the driver" when attempting to initialize its kernel-level component.

## Cause

Another application with a kernel-level driver is actively running and conflicting with Potassium's driver registration. Common culprits include Riot Vanguard, FACEIT Anti-Cheat, Kaspersky antivirus, and Delta Force's anti-cheat system.

## Fix

1. Check whether any of the following are installed on your system: **Riot Vanguard**, **FACEIT Anti-Cheat**, **Kaspersky**, or **Delta Force**.
**Verification:** You have identified which conflicting software is present.
2. For **Riot Vanguard**: Right-click the Vanguard icon in your system tray and select **Exit Vanguard**. Restart your PC.
For **FACEIT Anti-Cheat**: Open the FACEIT client, navigate to settings, and disable the anti-cheat. Restart your PC.
For **Kaspersky**: Temporarily disable Kaspersky protection or uninstall it.
For **Delta Force**: Uninstall the game or its anti-cheat component, then restart your PC.
**Verification:** The conflicting software's driver is no longer loaded (verify by checking the system tray and Task Manager for related processes).
3. Relaunch Potassium after the restart.
**Verification:** Potassium initializes its driver and launches without the service registration error.

**IMPORTANT**

After using Potassium, you must restart your PC before launching any game that uses kernel-level anti-cheat (e.g., VALORANT, CS2 via FACEIT). Potassium's driver and these anti-cheat drivers cannot coexist simultaneously.

## Still not working?

If no known conflicting software is installed, another kernel driver may be conflicting. Open Command Prompt as administrator and run `sc query type=driver` to review active drivers that might be interfering with Potassium.
