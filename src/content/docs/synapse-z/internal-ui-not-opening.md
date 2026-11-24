---
title: Internal UI Not Opening
description: Resolves the Synapse Z internal overlay failing to appear when pressing the designated hotkey.
category: wont-open
appliesTo: All versions
verifiedOn: 2026-11-19
---

### Symptom
Pressing `F1` (or any other expected hotkey) does not open the Synapse Z internal UI overlay after injection.

### Cause
The default hotkey may be conflicting with another application, the injection may not have completed successfully, or the Roblox process was not launched in a compatible manner.

### Fix
1. Try alternative hotkeys: press `Delete` or `Insert` instead of `F1`.  
   **Verification:** The internal UI overlay appears on screen.
2. If no hotkey works, close both Roblox and Synapse Z entirely.  
   **Verification:** Neither Roblox nor Synapse Z processes are running (check Task Manager).
3. Open the **Synapse Z installer** and use the **"Launch Roblox"** button to start Roblox instead of opening it normally.  
   **Verification:** Roblox launches through the Synapse Z installer.
4. Inject Synapse Z and press `F1` (or `Delete` / `Insert`) to open the internal UI.  
   **Verification:** The internal UI overlay appears and is fully functional.

### Still not working?
Ensure no other overlay applications (Discord overlay, Steam overlay, NVIDIA GeForce overlay) are intercepting the hotkey. Try disabling them temporarily. If the issue persists, reinstall Synapse Z and try again.
