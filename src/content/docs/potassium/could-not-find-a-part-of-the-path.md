---
title: Could Not Find a Part of the Path
description: Fixes a path resolution error caused by running Potassium from a shortcut or the Start menu.
category: errors
appliesTo: All versions
verifiedOn: 2026-11-19
---

## Symptom

An error reading "Could not find a part of the path" appears when attempting to launch Potassium.

## Cause

Potassium was launched from a desktop shortcut, the Start menu, or a pinned taskbar shortcut rather than directly from its extracted folder. Shortcuts change the working directory, preventing Potassium from locating its required files.

## Fix

1. Locate the folder where you extracted the Potassium `.zip` archive.
**Verification:** You can see the full set of Potassium files (executable, DLLs, configuration files) in the directory.
2. Ensure the `.zip` has been fully extracted — do not run the executable from inside the compressed archive.
**Verification:** The folder is a normal directory on your filesystem, not a compressed archive view.
3. Open the folder in File Explorer and double-click the Potassium executable directly from within that folder.
**Verification:** Potassium launches without the path error.

**WARNING**

**Do not create shortcuts** to the Potassium executable. Always navigate to the installation folder and launch the `.exe` directly from File Explorer.

## Still not working?

Re-extract the Potassium `.zip` to a simple path (e.g., `Desktop`) with no special characters or deeply nested folders, and launch from there.
