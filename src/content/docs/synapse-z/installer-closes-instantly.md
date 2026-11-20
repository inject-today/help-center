---
title: Installer Closes Instantly
description: Resolves a virtualization-based security conflict that prevents the Synapse Z installer from running.
category: crashes
appliesTo: All versions
verifiedOn: 2026-11-20
---

## Symptom

The Synapse Z installer opens briefly and immediately closes without installing anything or displaying an error.

## Cause

Windows virtualization-based security features (Core Isolation, Hyper-V, Device Guard) are preventing Synapse Z's kernel-level component from loading. These security features must be disabled for the installer to function.

## Fix

1. **Step 1 — Disable Core Isolation:**                                                                              Open **Windows Security** → **Device security** → **Core isolation details**.
2. Toggle **Memory integrity** to **Off**.
**Verification:** The Memory integrity toggle shows "Off."

**Step 2 — Modify the Registry:**

1. Press `Win + R`, type `regedit`, and hit Enter.
2. Navigate to: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\DeviceGuard`
3. Find the value `EnableVirtualizationBasedSecurity` and set its data to `0`. If it does not exist, right-click → **New** → **DWORD (32-bit) Value**, name it `EnableVirtualizationBasedSecurity`, and set it to `0`.
**Verification:** The registry value reads `0`.

**Step 3 — Disable Device Guard via Group Policy:**

1. Press `Win + R`, type `gpedit.msc`, and hit Enter.
2. Navigate to: **Computer Configuration** → **Administrative Templates** → **System** → **Device Guard**.
3. Open **Turn On Virtualization Based Security** and set it to **Disabled**.
**Verification:** The policy shows "Disabled" in the Group Policy Editor.

**NOTE**

`gpedit.msc` is not available on Windows Home editions. If you are on Windows Home, skip this step — the registry edit from Step 2 covers the same setting.

**Step 4 — Disable Hypervisor Launch:**

1. Open **Command Prompt as administrator**.
2. Run the following command:`bcdedit /set hypervisorlaunchtype off          `**Verification:** The terminal displays "The operation completed successfully."

**Step 5 — Restart your PC**, then run the Synapse Z installer again.
**Verification:** The installer runs to completion and Synapse Z is installed.

## Still not working?

**Disable Control Flow Guard (CFG):**

1. Open the Start menu and search for **Exploit Protection**. Open the **Exploit Protection** system setting.
**Verification:** The Exploit Protection settings panel opens.
2. Under the **System settings** tab, find **Control flow guard (CFG)**.
3. Change the dropdown from **"Use default (On)"** to **"Off by default"**.
**Verification:** The dropdown reads "Off by default."
4. Approve the UAC prompt if one appears. Restart your PC.
**Verification:** After reboot, the Synapse Z installer runs successfully.

Ensure no other kernel-level anti-cheat or security software is running (e.g., Riot Vanguard, FACEIT). These can conflict with the same system components Synapse Z requires. Disable or uninstall them and try again.
