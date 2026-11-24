---
title: Invalid Key
description: Resolves key validation failures caused by DNS, time synchronization, or cached data issues.
category: key-system
appliesTo: All versions
verifiedOn: 2026-11-19
---

### Symptom
Wave displays an "Invalid Key" error and refuses to authenticate your license.

### Cause
DNS resolution issues, system clock desynchronization, or corrupted local cache files are preventing Wave from properly validating your license key with its servers.

### Fix
1. Install and enable a VPN from the recommended list: [ProtonVPN](https://protonvpn.com/), [Mullvad VPN](https://mullvad.net/), or [Windscribe](https://windscribe.com/).  
   **Verification:** The VPN application shows a connected status.
2. Open **Command Prompt as administrator**. Type the following command and press Enter:
   ```cmd
   ipconfig /flushdns
   ```
   **Verification:** The terminal displays "Successfully flushed the DNS Resolver Cache."
3. Open **Windows Settings** -> **Time & language** -> **Date & time** -> click **Sync now**.  
   **Verification:** The "Last successful time synchronization" timestamp updates to the current time.
4. Press `Win + R`, type `%localappdata%`, and hit Enter. Locate and delete both the **Wave** folder and the **Wave.Webview2** folder.  
   **Verification:** Neither folder exists in your `%localappdata%` directory.
5. Relaunch Wave.  
   **Verification:** Wave authenticates your key successfully and loads the main interface.

### Still not working?
Try a completely different network connection (e.g., mobile hotspot) to rule out ISP-level interference. If the issue persists across multiple networks, your license key itself may need to be reissued via the official Wave Discord support.
