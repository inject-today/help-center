---
title: Version Mismatch
description: Resolves Roblox client version conflicts by installing a compatible build through a custom bootstrapper.
category: errors
appliesTo: All versions
verifiedOn: 2026-11-19
---

### Symptom
Wave displays a "Mismatch Version" error and refuses to inject into Roblox.

### Cause
Your Roblox client has updated to a version that Wave does not yet support, or your client is on an incorrect update channel.

### Fix
1. Download and install [Fishstrap](https://github.com/fishstrap/fishstrap/releases) (the recommended custom Roblox launcher).  
   **Verification:** Fishstrap is installed and appears in your Start menu or application list.
2. Follow Fishstrap's on-screen setup instructions to configure it as your default Roblox launcher.  
   **Verification:** Roblox launches through Fishstrap instead of the default Roblox launcher.
3. Launch Roblox through Fishstrap, then attempt to inject with Wave.  
   **Verification:** The version mismatch error no longer appears and Wave injects successfully.

### Still not working?
If the error persists even with Fishstrap, Wave may not yet support the latest Roblox update. Check the official Wave Discord server for update announcements and estimated patch times.
