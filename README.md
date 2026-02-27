# USB Vault
<p align="center">
  <img 
    src="https://i.postimg.cc/R0myzrpC/USB-Vault.png" 
    width="410"
    style="border-radius:20px; margin-top:6px;"
  />
</p>

![Version](https://img.shields.io/badge/version-1.2.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

Local-first encrypted password vault secured by a physical USB identity key.

USB Vault stores all secrets locally and encrypts them using:

- AES-256-GCM
- scrypt key derivation
- A user PIN/password
- A physical USB keyfile (`identity.key`)

No cloud. No accounts. No tracking.  
Your USB stick is your identity.

---

# 🚀 Features

- 🔐 USB-based identity authentication
- 🔑 PIN + hardware key encryption
- 💾 Fully local encrypted vault file
- 🎲 Built-in password generator
- 📋 Clipboard auto-clear
- ⏱ Idle auto-lock
- 🔌 Auto-lock on USB removal
- 🎨 Multiple UI themes  
  Dark • Light • Blue • Green • Purple
- 🐧 Linux installer (.deb)
- 📦 Portable AppImage build

---

# 🧠 How It Works

1. You create a USB keyfile (`identity.key`)
2. USB Vault derives an encryption key from:
   - Your PIN
   - The USB keyfile
3. Vault data is encrypted locally and stored on disk
4. The vault can only be opened with BOTH:
   - The USB keyfile
   - The correct PIN

### Practical Meaning

- Steal the computer → vault remains encrypted  
- Steal the USB → vault remains encrypted  
- Both required → plus PIN  

---

# 🛠 First-Time Setup

## Step 1 — Create a USB Keyfile

Insert a USB drive, open USB Vault, and click:

**Create USB Key**

This writes `identity.key` to the root of the USB drive.

Advanced/manual option:

```bash
head -c 64 /dev/urandom > /media/YOURNAME/YOURUSB/identity.key
```

⚠ Do NOT lose this file.  
It is permanently required to unlock the vault.

---

## Step 2 — Install USB Vault

### 🐧 Ubuntu / Linux Mint / Debian

Download the `.deb` from Releases:

```bash
sudo apt install ./usb-vault_VERSION_amd64.deb
```

Launch from the application menu or:

```bash
usb-vault
```

---

### 📦 Portable Version (AppImage)

```bash
chmod +x USB\ Vault.AppImage
./USB\ Vault.AppImage
```

If you see:

> Cannot mount AppImage, please check your FUSE setup

Install:

```bash
sudo apt install libfuse2
```

---

# 🔐 Creating Your Vault

1. Insert USB containing `identity.key`
2. Open USB Vault
3. Enter a PIN
4. Click **Create Vault**
5. Unlock using PIN + USB

Vault file location:

```
~/.config/usb-vault/vault.enc
```

---

# 🔒 Security Model

USB Vault uses:

- AES-256-GCM authenticated encryption
- scrypt key derivation
- Unique random salt per vault
- Tamper detection via GCM authentication tag
- Memory-only decrypted vault while unlocked
- Auto-lock on USB removal
- Clipboard auto-clear

All encryption is performed locally.

No data leaves your machine.

---

# ⚠ Threat Model

USB Vault protects against:

- Stolen laptop
- Lost USB device
- Offline disk inspection
- Cold storage data extraction

USB Vault does NOT protect against:

- Malware running on your system
- Keyloggers capturing your PIN
- A compromised operating system
- Physical coercion

For maximum security, use USB Vault on a trusted, clean system.

---

# 🧰 Building From Source

## Requirements

- Node.js 20 LTS
- npm
- Electron

## Development

```bash
nvm use
npm ci
npm start
```

## Build Installers

```bash
npm run dist
```

Artifacts:

```
dist/
  usb-vault_x.x.x_amd64.deb
  USB Vault-x.x.x.AppImage
```

---

# 🐧 Linux Packaging Notes

The Linux installer automatically configures:

- System launcher
- Application icon
- Runtime wrapper (ensures Electron launches correctly on systems with sandbox/dev-shm restrictions)

No manual configuration required after install.

---

# 📁 Project Structure

```
main.js           Electron main process
preload.js        Secure IPC bridge
renderer/         UI modules
src/usb.js        USB detection + key creation
src/vault.js      Encryption logic
build/            Packaging scripts
```

---

# 💾 Backup Requirements

You MUST back up:

1. Your USB keyfile (`identity.key`)
2. Your PIN
3. Your vault file (`vault.enc`)

If you lose the USB keyfile:
the vault is permanently unrecoverable.

There is no backdoor.

---

# 📸 Screenshots

| | | |
|---|---|---|
| <img src="https://i.postimg.cc/KzJ5VwwJ/screenshot1.png" width="100%"> | <img src="https://i.postimg.cc/Y9bxVZZs/screenshot2.png" width="100%"> | <img src="https://i.postimg.cc/DZBcDHHN/screenshot3.png" width="100%"> |
| <img src="https://i.postimg.cc/nz015gg5/screenshot4.png" width="100%"> | <img src='https://i.postimg.cc/R0myzrpC/USB-Vault.png' border='0' alt='USB-Vault'></a> | <img src="https://i.postimg.cc/SsDG533B/screenshot6.png" width="100%"> |
| <img src="https://i.postimg.cc/pTqB743N/screenshot7.png" width="100%"> | <img src="https://i.postimg.cc/28KCm5h9/screenshot8.png" alt="screenshot8"> | <img src="https://i.postimg.cc/xCtP7hhh/screenshot5.png" width="100%"> |

---

# 🏁 Roadmap

- Windows installer
- macOS notarized build
- Optional encrypted export / backup
- Multi-vault profiles
- Hardware token support (YubiKey / FIDO2)
- Optional secondary USB factor

---

# 🔐 Reproducible Builds

USB Vault uses a pinned Node version via `.nvmrc`.

### Clean Build

```bash
nvm install
nvm use

npm ci
npm run lint
npm run format
npm run dist
npm run checksums
```

Checksums are written to:

```
dist/SHA256SUMS.txt
```

`.nvmrc`:

```
20
```

Reproducible here means:
- Locked dependencies (`package-lock.json`)
- Same Node major version
- Same build steps

---

# 🤝 Contributing

Pull requests welcome.  
Security issues should be reported responsibly.

See: [SECURITY.md](SECURITY.md)

---

# 📜 License

MIT License  
© Thomas Davis
