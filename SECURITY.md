# Security Policy

Thank you for helping keep USB Vault secure.

USB Vault is a local-first encrypted password manager. Security is the foundation of this project. If you discover a vulnerability, please report it responsibly.

---

## 🔐 Supported Versions

The following versions are currently supported with security updates:

| Version | Supported |
|----------|------------|
| 1.2.x    | ✅ Yes     |
| < 1.1.0  | ❌ No      |

Only the latest minor release is guaranteed to receive fixes.

---

## 📣 Reporting a Vulnerability

If you discover a security issue, **do not open a public GitHub issue.**

Instead:

- Email: **tomatarmy@outlook.com**
- Subject line: `USB Vault Security Report`

Please include:

- A clear description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested mitigation (if known)

You will receive a response within 72 hours.

---

## 🛡 Disclosure Policy

- Vulnerabilities will be acknowledged within 72 hours.
- Fixes will be developed privately.
- A patched release will be published as soon as possible.
- Public disclosure will occur only after a fix is available.

Responsible disclosure helps protect users.

---

## 🔎 Security Scope

USB Vault is designed to protect against:

- Lost or stolen computers
- Lost or stolen USB drives
- Offline disk inspection
- Unauthorized vault access without PIN + USB key

USB Vault does **not** protect against:

- Malware running on your system
- Keyloggers capturing your PIN
- A compromised operating system
- Physical coercion

For maximum protection, use USB Vault on a trusted system.

---

## 🔐 Cryptography Overview

USB Vault uses:

- AES-256-GCM for encryption
- scrypt for key derivation
- Random salt per vault
- Authenticated encryption (tamper detection)
- USB-based identity key
- Memory-only decrypted vault while unlocked

No cloud services. No telemetry. No remote storage.

All encryption happens locally.

---

## 🧪 Security Best Practices for Users

- Back up your `identity.key`
- Use a strong PIN
- Keep your system updated
- Avoid running unknown software
- Lock your system when unattended

If the USB keyfile is lost, the vault is permanently unrecoverable.

---

## 🧾 License

MIT License — Thomas Davis