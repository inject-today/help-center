---
title: Missing Visual Studio Redistributables
description: Resolves runtime errors caused by absent Visual C++ runtime libraries required by Potassium.
category: crashes
appliesTo: All versions
verifiedOn: 2026-11-19
---

## Symptom

Potassium fails to launch or displays a runtime error referencing missing `.dll` files (e.g., `MSVCP140.dll`, `VCRUNTIME140.dll`) upon startup.

## Cause

The Visual C++ Redistributable runtime libraries that Potassium depends on are not installed on your system, or an outdated version is present.

## Fix

- Navigate to the official [Microsoft Visual C++ Redistributable downloads page](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist).
**Verification:** The Microsoft Learn page loads and displays download links for the latest supported redistributable packages.
- Download and install **both** the x86 and x64 versions of the latest Visual C++ Redistributable.
**Verification:** The installer completes without errors and reports a successful installation.
- Restart your PC and relaunch Potassium.
**Verification:** Potassium opens without any missing DLL errors.

## Still not working?

If the error persists after installing the latest redistributables, try installing the [Visual C++ Redistributable All-in-One package](https://www.techpowerup.com/download/visual-c-redistributable-runtime-package-all-in-one/) which bundles every version from 2008 through the latest release. Restart your PC after installation and try again.
