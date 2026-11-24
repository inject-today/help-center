---
title: Internal Error (Smart App Control)
description: Resolves an internal error caused by Windows Smart App Control blocking Wave's execution.
category: errors
appliesTo: All versions
verifiedOn: 2026-11-19
---

### Symptom
Wave displays an "Internal Error" message during launch or injection.

### Cause
Windows Smart App Control is actively blocking Wave from executing or loading its components because it identifies the application as untrusted.

### Fix
1. Open **Windows Security** from the Start menu.  
   **Verification:** The Windows Security dashboard is open.
2. In the side panel, click **App & browser control**.  
   **Verification:** You are on the App & browser control settings page.
3. Under the "Smart App Control" section, click **Smart App Control settings**.  
   **Verification:** The Smart App Control configuration panel is open.
4. Set Smart App Control to **Off**.  
   **Verification:** The toggle or selector shows Smart App Control as disabled.
5. Force close Wave (check Task Manager for any lingering processes) and relaunch it.  
   **Verification:** Wave launches without the internal error.

### Still not working?
If the error persists after disabling Smart App Control, check whether **Controlled Folder Access** is enabled in Windows Security -> Virus & threat protection -> Ransomware protection, and add Wave's folder as an allowed app if so.
