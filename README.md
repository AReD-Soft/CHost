# CHost

CHost is an Magisk or Kernel SU module utility project focused on host file management, networking, and system-level tooling.  
It is designed for developers and advanced users operating in rooted Android and Linux-based environments.

The project enables controlled modification and management of system host entries while maintaining compatibility with modern root solutions.

---

## Overview

CHost provides tooling to edit and manage the system `hosts` file within a **Magisk-mounted environment**, avoiding direct modification of the read-only system partition.

In addition, CHost supports managing host values through a **KernelSU (KSU) WebUI interface**, allowing structured and user-friendly interaction with host configurations.

The project is intended for advanced use cases such as:
- Host-based filtering
- Network testing
- Development and experimentation
- Custom system-level workflows
  
---

## Dashboard Preview

<p align="center">
![CHost main page](https://github.com/user-attachments/assets/908badc4-829b-46ab-b0c9-0f2b4a984146)
</p>

---

## Key Capabilities

- Edit the system `hosts` file via **Magisk mount overlay**
- Preserve system integrity by avoiding direct writes to `/system`
- Manage host entries dynamically through **KernelSU WebUI**
- Automatic backup of host configurations
- Execution logging for traceability and debugging
- Modular and flexible design suitable for advanced workflows

---

## Backup and Logging

CHost automatically maintains backups and execution logs to ensure recoverability and transparency.

### Backup Location
All backups and execution logs are stored under: `/storage/emulated/0/chost`

(or equivalently accessible as `internal_storage/chost` depending on file manager and Android version)

### Backup Behavior
- The original `hosts` file is backed up before any modification
- Multiple backup snapshots may be retained depending on configuration
- Backups can be manually restored in case of misconfiguration or system issues

### Execution Logs
- Each execution records operational details and status
- Logs are intended for:
  - Debugging
  - Issue reporting
  - Emergency recovery analysis

In emergency scenarios, these backups allow you to **restore a known-good state** without reflashing or reinstalling modules.

---

## Requirements

Before using CHost, ensure the following components are installed:

### Root Framework
- **Magisk**  
  https://github.com/topjohnwu/Magisk

or

- **KernelSU**  
  https://github.com/tiann/KernelSU

### Web Interface (Required for WebUI-based host management)
- **KSU WebUI**  
  https://github.com/tiann/KernelSU-WebUI

> CHost assumes a properly configured root environment.  
> Some features may not function without the required modules installed.

---

## License

This project is licensed under the **Apache License, Version 2.0**.

You are free to:
- Use
- Modify
- Distribute
- Integrate this project into commercial or non-commercial products

As long as you comply with the terms of the license.

See the `LICENSE` file for full details.

---

## Attribution

Copyright © 2026  
**ARe D Soft**

---

## Disclaimer

This project is provided **"as is"**, without warranty of any kind.  
The author is not responsible for system instability, data loss, or network issues resulting from improper usage.

Use with caution when modifying system-level configurations such as the `hosts` file.

---

## Contributions

Contributions and improvements are welcome.

Please ensure that all contributions:
- Are clearly described
- Do not introduce unsafe system behavior
- Remain consistent with the project scope and license

---

## Contact

For bug reports, feature requests, or discussion, please use the GitHub Issues section of this repository.
