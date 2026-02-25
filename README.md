# USB Vault

![Version](https://img.shields.io/badge/version-1.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Local-first encrypted password vault secured by a USB identity key.

USB Vault stores all secrets locally and encrypts them using:
- your PIN/password
- a physical USB keyfile (`identity.key`)
- AES-256-GCM encryption
- scrypt key derivation

No cloud. No account. No tracking.  
Your USB stick is your identity.

---

## 🚀 Features

- 🔐 USB-based identity authentication
- 🔑 PIN + hardware key encryption
- 💾 Fully local encrypted vault file
- 🎲 Password generator
- 📋 Copy-to-clipboard auto-clear
- ⏱ Idle auto-lock
- 🎨 Multiple UI themes  
  Dark • Light • Blue • Green • Purple
- 🐧 Linux installer (.deb) with auto-configured launcher
- 📦 Portable AppImage build

---

## 🧠 How It Works

1. You create a USB keyfile (`identity.key`)
2. USB Vault derives an encryption key from:
   - your PIN
   - the USB keyfile
3. Vault data is encrypted locally and stored on disk
4. Without BOTH the USB and PIN, the vault cannot be opened

### This means:

- Steal the computer → vault still locked  
- Steal the USB → vault still locked  
- Need both → plus PIN  

---

## 🛠 First-Time Setup (Users)

### Step 1 — Create a USB keyfile

Insert a USB drive, open USB Vault, and click **Create USB Key**.

USB Vault will write `identity.key` to the root of the USB drive.

> Advanced / manual option:
>
> ```bash
> head -c 64 /dev/urandom > /media/YOURNAME/YOURUSB/identity.key
> ```

**Do NOT lose this file.**  
It is required to unlock the vault forever.

---

### Step 2 — Install USB Vault

#### 🐧 Ubuntu / Linux Mint / Debian

Download the `.deb` file from Releases and install:

```bash
sudo apt install ./usb-vault_VERSION_amd64.deb
```

Launch from the Start Menu or run:

```bash
usb-vault
```

---

#### 📦 Portable Version (AppImage)

```bash
chmod +x USB\ Vault.AppImage
./USB\ Vault.AppImage
```

---

## 🔐 Creating Your Vault

1. Insert USB with `identity.key`
2. Open USB Vault
3. Enter a PIN
4. Click **Create Vault**
5. Unlock using PIN + USB

Your vault file is stored locally in:

```
~/.config/usb-vault/

or

~/.config/usb-vault/vault.enc
```

If you see:

> Cannot mount AppImage, please check your FUSE setup

Install FUSE2:

sudo apt install libfuse2

---

## 🔒 Security Model

USB Vault uses:

- AES-256-GCM encryption
- scrypt key derivation
- random salt per vault
- authenticated encryption (tamper detection)
- memory-only decrypted vault while unlocked
- auto-lock on USB removal
- clipboard auto-clear

Your data never leaves your machine.

---

## ⚠️ Threat Model

USB Vault protects against:

- Stolen laptop
- Lost USB
- Offline disk inspection

USB Vault does NOT protect against:

- Malware running on your system
- Keyloggers capturing your PIN
- A compromised operating system

For maximum security, use USB Vault on a trusted, clean system.

---

## 🧰 Building From Source

### Requirements

- Node.js 20 LTS (recommended)
- npm
- Electron

### Run in development

```bash
nvm use
npm ci
```

---

### Build installers

```bash
npm run dist
```

Outputs:

```
dist/
  usb-vault_x.x.x_amd64.deb
  USB Vault-x.x.x.AppImage
```

---

## 🐧 Packaging Notes (Linux)

USB Vault automatically installs:

- system launcher
- icon
- wrapper to ensure Electron works on all distros

The installer ensures the app launches correctly even on systems with sandbox/dev-shm issues.

No manual fixes required after install.

---

## 📁 Project Structure

main.js         – Electron main process  
preload.js      – Secure IPC bridge  
renderer/       – UI modules  
src/usb.js      – USB detection + key creation  
src/vault.js    – Encryption logic

---

## 💾 Backup Advice

You MUST back up:

1. Your USB keyfile
2. Your PIN (remember it)
3. Your vault file

If you lose the USB keyfile:
**the vault is permanently unrecoverable.**

---

## 📸 Screenshots

_Add screenshots here_

Example:

```
![Login Screen](docs/screens/login.png)
![Vault View](docs/screens/vault.png)
![Add Entry](docs/screens/add.png)
```

---

## 🏁 Roadmap Ideas

- Windows installer support
- macOS notarized build
- Multiple vault profiles
- USB auto-detect UI indicator
- Optional encrypted export backup
- Hardware token support (YubiKey / FIDO)

---

## 🤝 Contributing

Pull requests welcome.  
If you find a bug or security issue, open an Issue.

---

## 🔐 Security

For vulnerability reporting and security policy, see [SECURITY.md](SECURITY.md).

---

## Reproducible builds

USB Vault uses a pinned Node version via `.nvmrc`.

### Build (clean, repeatable)

```bash
# from repo root
nvm install
nvm use

npm ci
npm run lint
npm run format
npm run dist
npm run checksums
```
Artifacts will be in dist/ and checksums in dist/SHA256SUMS.txt.


That’s it. “Reproducible” here means: same Node major + locked deps (`package-lock.json`) + same steps.

### Also add `.nvmrc`
Create `.nvmrc` with:

```txt
20
```

---

## 📜 License

MIT License | Thomas Davis
