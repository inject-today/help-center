---
title: Stuck on "Initializing..."
description: Resolves a startup hang where Wave remains on the initialization screen and does not proceed.
category: wont-open
appliesTo: All versions
verifiedOn: 2026-11-19
---

### Symptom
Wave displays "Initializing..." indefinitely and never progresses to the main executor interface.

### Cause
Windows Defender or a third-party antivirus is blocking Wave's startup process, or the application lacks the necessary permissions to initialize its components. In some cases, this is a purely visual bug — the executor may actually be functional despite the display.

### Fix
1. **Before troubleshooting, test if it is a visual glitch.** Try executing a simple script (e.g., `print("test")`) to see if the executor is actually functional despite showing "Initializing..."  
   **Verification:** If the script executes, the display is a cosmetic bug — no further action is needed.
2. If scripts do not execute, open **Windows Security** -> **Virus & threat protection** -> **Manage settings** and disable **Real-time protection**. Also disable any third-party antivirus software.  
   **Verification:** All active antivirus protections are temporarily disabled.
3. Close Wave completely, then right-click `Wave.exe` and select **Run as administrator**.  
   **Verification:** Wave launches past the "Initializing..." screen and reaches the main interface.
4. After confirming the fix, re-enable your antivirus and add the Wave installation folder as an exclusion.  
   **Verification:** Wave initializes normally with antivirus re-enabled.

### Still not working?
Ensure all required dependencies are installed (.NET 8.0/6.0 runtimes and Visual C++ redistributables). Missing runtimes can also cause initialization hangs.
