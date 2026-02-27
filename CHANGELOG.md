# Changelog

All notable changes to USB Vault will be documented in this file.

The format follows semantic versioning.

---

## [1.2.0] - 2026-02-27

### Added
- Linux .deb installer
- Portable AppImage build
- Electron runtime wrapper for sandbox compatibility
- Improved packaging reliability
- Reproducible build process with .nvmrc

### Improved
- Renderer stability
- Linux launcher configuration
- Installer auto-configuration

### Security
- Hardened Linux runtime flags
- Ensured consistent AES-256-GCM usage
- Verified scrypt key derivation flow

---

## [1.1.0]

### Added
- Idle auto-lock
- Clipboard auto-clear
- Multiple UI themes
- Password generator

### Improved
- USB detection logic
- Vault encryption performance

---

## [1.0.0]

### Initial Release

- PIN + USB keyfile authentication
- AES-256-GCM encrypted vault
- scrypt key derivation
- Local vault storage
- Basic UI
