---
title: Roblox Crashes While Using Wave
description: Prevents Roblox from crashing upon Wave injection by resolving antivirus and permission conflicts.
category: crashes
appliesTo: All versions
verifiedOn: 2026-11-19
---

### Symptom
Roblox closes or crashes immediately after Wave injects, or during script execution.

### Cause
Antivirus software is interfering with Wave's injection process, or Wave lacks sufficient permissions to properly attach to the Roblox process.

### Fix
1. Disable **Windows Defender Real-time protection** and any third-party antivirus programs.  
   **Verification:** All active antivirus protections are temporarily disabled.
2. Close both Roblox and Wave entirely.
3. Right-click `Wave.exe` and select **Run as administrator**. Launch Roblox afterward.  
   **Verification:** Wave injects without causing Roblox to crash, and scripts execute normally.
4. After confirming stability, re-enable your antivirus and add the Wave folder to your exclusion list.  
   **Verification:** Roblox remains stable during Wave injection with antivirus re-enabled.

### Still not working?
Install [Fishstrap](https://github.com/fishstrap/fishstrap/releases) as your Roblox launcher, as it provides better compatibility with Wave's injection method. Also ensure your Roblox client is on the correct version.
