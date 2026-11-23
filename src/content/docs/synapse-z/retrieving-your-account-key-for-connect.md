---
title: Retrieving Your Account Key for /connect
description: Locates the stored account key file needed for the Synapse Z /connect command.
category: key-system
appliesTo: All versions
verifiedOn: 2026-11-19
---

### Symptom
You need to find your Synapse Z account key to use the `/connect` command but do not know where it is stored.

### Cause
The account key is stored locally in an authentication file and must be retrieved manually.

### Fix
1. Press `Win + R`, type `%localappdata%`, and hit Enter.  
   **Verification:** The Local AppData folder opens in File Explorer.
2. Locate the file named `auth_v2.syn`.  
   **Verification:** The `auth_v2.syn` file is visible in the directory.
3. Right-click `auth_v2.syn`, select **Open with** -> **Notepad** (or any text editor).  
   **Verification:** The file opens and displays your account key string.
4. Copy the key string and use it with the `/connect` command as needed.  
   **Verification:** The `/connect` command accepts your key and links your session.

### Still not working?
If the `auth_v2.syn` file does not exist, launch Synapse Z and authenticate at least once to generate it. If the file exists but is empty or contains garbled data, delete it and re-authenticate.
