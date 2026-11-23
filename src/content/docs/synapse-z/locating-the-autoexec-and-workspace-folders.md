---
title: Locating the Autoexec and Workspace Folders
description: Provides the file system path for Synapse Z's autoexec and workspace directories.
category: getting-started
appliesTo: All versions
verifiedOn: 2026-11-19
---

### Symptom
You cannot find the autoexec or workspace folder for Synapse Z to place scripts or access saved files.

### Cause
Synapse Z stores its user data (autoexec scripts and workspace files) in the Local AppData directory rather than alongside the main executable.

### Fix
1. Press `Win + R`, type the following path, and hit Enter:
   `%localappdata%\Synapse Z`  
   **Verification:** A folder opens containing Synapse Z's user data.
2. Inside this folder, you will find the **autoexec** and **workspace** subdirectories. Place scripts you want to run automatically on injection into the `autoexec` folder. The `workspace` folder contains files accessible from within the executor.  
   **Verification:** Your scripts appear in the appropriate folders and are recognized by Synapse Z.

### Still not working?
If the `Synapse Z` folder does not exist in `%localappdata%`, launch and authenticate Synapse Z at least once to generate the directory structure.
