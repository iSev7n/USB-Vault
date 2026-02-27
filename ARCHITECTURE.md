# USB Vault Architecture

USB Vault is a local-first encrypted password vault designed around hardware-assisted identity verification.

This document explains the cryptographic and structural design.

---

# High-Level Design

USB Vault requires two factors:

1. A user-defined PIN
2. A USB-based identity keyfile (`identity.key`)

Both are required to derive the encryption key.

---

# Vault Storage

Vault data is stored locally at:
```
~/.config/usb-vault/vault.enc
```
The file contains:

- Encrypted vault data
- Salt
- Metadata
- Authentication tag

No plaintext data is written to disk.

---
# Key Derivation

USB Vault derives its encryption key using:

- scrypt (memory-hard key derivation function)
- User PIN
- USB keyfile contents
- Random salt

The derived key is never stored.

---

# Encryption

USB Vault uses:

- AES-256-GCM
- Authenticated encryption
- Random IV per encryption
- Authentication tag verification

GCM provides:

- Confidentiality
- Integrity
- Tamper detection

If authentication fails, the vault will not decrypt.

---

# Runtime Security Model

- Decrypted vault exists only in memory.
- Auto-lock triggers on:
  - Idle timeout
  - USB removal
- Clipboard auto-clears after copy.
- No secrets are logged.

---

# USB Identity Model

The USB keyfile (`identity.key`):

- Is a random 64-byte file
- Stored on a physical USB device
- Required to derive encryption key
- Can be manually generated via /dev/urandom

Without this file, vault recovery is impossible.

---

# Threat Model

USB Vault is designed to protect encrypted secrets at rest.

It assumes the vault is locked and the USB identity key is not inserted.

---

## Protected Scenarios

USB Vault protects against:

- Theft of the computer while the vault is locked
- Theft of the USB device alone
- Offline disk inspection of the vault file
- Cold storage analysis of copied drives
- Unauthorized access without BOTH:
  - The correct PIN
  - The correct USB identity keyfile

If an attacker gains access to the vault file (`vault.enc`) without the USB key and PIN, the data remains encrypted and computationally infeasible to recover.

---

## Conditional Protection

If malware exists on the host system **while the vault is locked and the USB key is not inserted**, the vault file remains encrypted and unreadable.

However, once the vault is unlocked:

- The decrypted data exists in memory
- The user may copy secrets to the clipboard
- The user may type passwords into other applications

At this point, the security of the vault depends on the integrity of the operating system.

---

## Not Protected Against

USB Vault does NOT protect against:

- Malware actively running while the vault is unlocked
- Keyloggers capturing the PIN during entry
- Screen capture malware
- Memory scraping malware
- A compromised operating system
- Root-level system access
- Physical coercion
- Social engineering

USB Vault is not a substitute for operating system security.

---

## Security Boundary

The security boundary of USB Vault is:

> The moment the vault is unlocked on a trusted system.

Before unlock:
- Data is encrypted at rest.

After unlock:
- System integrity becomes the primary defense layer.

---

## Recommended Usage

For maximum security:

- Use USB Vault on a trusted, clean system
- Keep your OS updated
- Avoid installing untrusted software
- Do not unlock the vault on unknown machines
- Remove the USB key when not actively using the vault

USB Vault is designed to make offline data theft extremely difficult, while keeping usability practical.

---

# Linux Runtime Notes

Electron sandbox restrictions on some Linux environments require runtime flags.

The installer configures:

- no-sandbox
- disable-setuid-sandbox

This ensures reliable execution across distributions.

---

# Design Philosophy

- Local-first
- No accounts
- No cloud sync
- No telemetry
- Minimal dependencies
- Transparent cryptography choices

Security is prioritized over convenience.
