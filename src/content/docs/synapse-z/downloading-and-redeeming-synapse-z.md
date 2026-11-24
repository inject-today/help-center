---
title: Downloading and Redeeming Synapse Z
description: Step-by-step beginner guide to downloading the client, configuring antivirus exclusions, and activating your license key.
category: getting-started
appliesTo: All versions
verifiedOn: 2026-11-23
---

### Symptom
You have purchased a Synapse Z license key or need to set up the client on a fresh machine for the first time.

### Cause
Initial setup requires downloading the installer package from the official portal, configuring Windows Defender to prevent installation components from being quarantined, and linking your license key to register your installation.

### Fix
1. **Configure Antivirus Exclusions First**  
   Windows Defender and third-party antivirus software flag executor binaries as false positives. You must create an exclusion folder before downloading.  
   - Create a dedicated folder where you want to keep Synapse Z (for example: `C:\SynapseZ`).  
   - Open **Windows Security** then **Virus & threat protection** then **Manage settings** (under Virus & threat protection settings).  
   - Scroll down to **Exclusions** and click **Add or remove exclusions**.  
   - Click **Add an exclusion** then select **Folder** then choose the folder you just created (`C:\SynapseZ`).  
   - *(Optional)* Temporarily toggle **Real-time protection** to **Off** while downloading to prevent browser download blocks.  
   **Verification:** The `C:\SynapseZ` folder appears in your Windows Defender exclusion list.

2. **Download the Official Installer**  
   - Go to the official download portal: [https://z.synapse.do/](https://z.synapse.do/)  
   - Click the download link to save the installer zip archive to your PC.  
   **Verification:** The downloaded `.zip` file is saved in your downloads folder or directly inside your excluded directory.

3. **Extract the Archive**  
   - Right-click the downloaded `.zip` file and select **Extract All...**  
   - Set the destination path to your excluded folder (e.g., `C:\SynapseZ`).  
   - Complete the extraction.  
   **Verification:** All extracted files (executables and dependencies) are sitting inside your excluded folder, not inside a compressed `.zip` preview.

4. **Launch and Redeem Your Key**  
   - Navigate into your excluded folder in File Explorer.  
   - Right-click the Synapse Z executable/installer and select **Run as administrator**.  
   - When the client opens, locate the key entry prompt/box.  
   - Paste your purchased license key into the field and click **Redeem** (or **Activate** / **Submit**).  
   **Verification:** The client validates your key, completes any initial dependency setups, and loads the main interface.

5. **Re-enable Real-Time Protection**  
   - Return to **Windows Security** then **Virus & threat protection** and toggle **Real-time protection** back to **On**.  
   **Verification:** Real-time protection is active, but your excluded folder remains untouched by scans.

### Still not working?
- **Installer closes immediately:** Windows virtualization security (Core Isolation / Hyper-V) is blocking the driver. Check the **Installer Closes Instantly** guide to disable Memory Integrity and Hyper-V.
- **Key says invalid or already used:** Ensure there are no extra leading or trailing spaces in the text box. If the key was already registered on another machine, your HWID may need to be reset via their support bot or portal.
- **Files disappear right after extraction:** Your antivirus real-time protection deleted the files because the extraction target was not properly excluded. Re-check your Windows Defender exclusions list and extract again.
