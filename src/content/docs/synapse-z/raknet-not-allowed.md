---
title: Raknet Not Allowed
description: Enables the Raknet networking option in Synapse Z's internal settings to resolve a permissions error.
category: errors
appliesTo: All versions
verifiedOn: 2026-11-19
---

### Symptom
An error message stating "Raknet not allowed" appears when attempting to use Raknet-dependent functionality in Synapse Z.

### Cause
The Raknet networking option is disabled by default in Synapse Z's internal settings and must be manually enabled.

### Fix
1. Launch Roblox and inject Synapse Z.  
   **Verification:** Synapse Z is attached to the Roblox process.
2. Open the **Synapse Z internal UI** by pressing the designated hotkey (default: `F1`, or try `Delete` / `Insert` if `F1` does not respond).  
   **Verification:** The internal UI overlay appears on screen.
3. Navigate to the **Options** tab within the internal UI.  
   **Verification:** The Options panel is displayed.
4. Locate the **Raknet** checkbox and enable it.  
   **Verification:** The Raknet checkbox is checked and the "Raknet not allowed" error no longer appears.

### Still not working?
If the Raknet option is grayed out or unavailable, try relaunching Roblox through the Synapse Z installer's "Launch Roblox" button rather than launching Roblox independently.
