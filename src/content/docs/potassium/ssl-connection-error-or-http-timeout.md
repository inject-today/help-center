---
title: SSL Connection Error or HTTP Timeout
description: Resolves network connectivity issues preventing Potassium from reaching its authentication or update servers.
category: wont-open
appliesTo: All versions
verifiedOn: 2026-11-19
---

## Symptom

Potassium displays an "SSL connection error" or "HTTP timeout" message during launch, authentication, or injection.

## Cause

Your internet connection or ISP is interfering with Potassium's ability to establish a secure connection to its servers. This is commonly caused by ISP-level filtering, DNS issues, or regional network restrictions.

## Fix

1. **Fix**
2. Download and install [Cloudflare WARP (1.1.1.1)](https://one.one.one.one/), a free VPN/DNS service.
**Verification:** The Cloudflare WARP application is installed and shows a connected status.
3. Enable WARP and relaunch Potassium.
**Verification:** Potassium connects to its servers without SSL or timeout errors.

**Alternative VPNs** (if Cloudflare WARP does not resolve the issue):

- [ProtonVPN](https://protonvpn.com/) (free tier available)
- [Mullvad VPN](https://mullvad.net/)
- [Windscribe](https://windscribe.com/) (free tier available)

## Still not working?

Try flushing your DNS cache by opening Command Prompt as administrator and running `ipconfig /flushdns`. Additionally, try switching to a different DNS provider (e.g., `8.8.8.8` or `1.1.1.1`) in your network adapter settings.
