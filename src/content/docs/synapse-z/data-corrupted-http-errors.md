---
title: Data Corrupted / HTTP Errors
description: Resolves download and data integrity failures caused by slow or unstable internet connections.
category: errors
appliesTo: All versions
verifiedOn: 2026-11-19
---

### Symptom
One of the following error messages appears during Synapse Z's initialization, update, or injection process:
- "Data corrupted (zstd)"
- "Data corrupted (crc)"
- "Response too small"
- "HTTP error code 0"

### Cause
Your internet connection is too slow or unstable to complete the data transfer before it times out. Partial downloads result in corrupted or incomplete data that fails integrity checks.

### Fix
1. Download and install [Cloudflare WARP (1.1.1.1)](https://one.one.one.one/) to improve your connection routing.  
   **Verification:** Cloudflare WARP is installed and shows a connected status.
2. Enable WARP and retry the operation that produced the error.  
   **Verification:** The download or initialization completes without data corruption errors.

**Alternative VPNs** (if WARP does not resolve the issue):
- [ProtonVPN](https://protonvpn.com/)
- [Mullvad VPN](https://mullvad.net/)
- [Windscribe](https://windscribe.com/)

### Still not working?
Switch to a wired Ethernet connection if you are on Wi-Fi. If your internet speed is consistently below 5 Mbps, the downloads may repeatedly fail — try using a faster network. You can also flush your DNS by running `ipconfig /flushdns` in an administrator Command Prompt.
