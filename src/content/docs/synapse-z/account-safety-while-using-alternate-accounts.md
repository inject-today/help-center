---
title: Account Safety While Using Alternate Accounts
description: Best practices for protecting your primary Roblox account when using alternate accounts for script execution.
category: getting-started
appliesTo: All versions
verifiedOn: 2026-11-19
---

### Symptom
You want to use Synapse Z without risking your primary Roblox account.

### Cause
Roblox's anti-cheat systems can link accounts through shared cookies, IP addresses, hardware IDs, and email verification. Proper separation is required to minimize risk to your main account.

### Fix
1. **Use Roblox Account Manager** to manage your alternate accounts. Configure it to **auto-delete cookies on each launch** so that session data does not persist across accounts.  
   **Verification:** Roblox Account Manager is installed, and the auto-delete cookies option is enabled.
2. **Do not use the built-in Roblox account switcher.** The native switcher retains session cookies and metadata that can link your accounts. Always use Roblox Account Manager instead.  
   **Verification:** You are logging in exclusively through Roblox Account Manager, never through Roblox's own account switcher.
3. **Be aware of IP-based alt detection.** Using the same IP address across multiple accounts may trigger Roblox's alt detection systems. Consider using a VPN or different network for alternate accounts if possible.  
   **Verification:** You understand the IP linking risk and have taken appropriate measures.
4. **Add your main account's User ID to Synapse Z's blacklist** to prevent accidental injection on your primary account.  
   - Open the Synapse Z internal UI.
   - Navigate to the blacklist settings.
   - Enter your main account's Roblox User ID.  
   **Verification:** Synapse Z refuses to launch or inject when your main account is logged in.
5. **Always close all executor processes before logging into your main account.** Check Task Manager to ensure no Synapse Z processes are running.  
   **Verification:** No Synapse Z processes appear in Task Manager before you launch Roblox on your main account.
6. **Never verify your email on accounts you use for script execution.** Email verification creates a stronger link to your identity and makes ban appeals impossible.  
   **Verification:** Your alternate accounts do not have verified email addresses.

### Still not working?
If your main account receives a ban despite taking precautions, it may have been linked through hardware ID, IP address, or behavioral analysis. Review all six steps above and ensure full compliance. Consider using a completely separate device for executor activities if maximum security is required.
