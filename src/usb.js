// src/usb.js
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");

/**
 * We treat "USB present" as:
 * - a mount exists in typical removable locations
 * - we can write to it
 *
 * This is intentionally simple + reliable for Ubuntu.
 */
function getCandidateUsbDirs() {
  const user = os.userInfo().username;

  // Most common on Ubuntu desktops
  const candidates = [
    `/media/${user}`,
    `/run/media/${user}`,
    `/media`,
  ];

  return candidates;
}

function listMountChildren(dir) {
  try {
    if (!fs.existsSync(dir)) return [];
    const items = fs.readdirSync(dir);
    return items
      .map((name) => path.join(dir, name))
      .filter((p) => {
        try {
          return fs.statSync(p).isDirectory();
        } catch {
          return false;
        }
      });
  } catch {
    return [];
  }
}

function isWritableDir(p) {
  try {
    fs.accessSync(p, fs.constants.W_OK | fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns a mount path if a USB-like mount is detected, else null.
 */
async function findUsbMountPath() {
  const roots = getCandidateUsbDirs();

  for (const root of roots) {
    const children = listMountChildren(root);
    // Prefer writable mounts (real USBs)
    const writable = children.find(isWritableDir);
    if (writable) return writable;
  }

  return null;
}

/**
 * Returns full path to identity.key if it exists on the detected USB mount.
 */
async function findKeyfilePath() {
  const usbMountPath = await findUsbMountPath();
  if (!usbMountPath) return null;

  const keyPath = path.join(usbMountPath, "identity.key");
  if (fs.existsSync(keyPath)) return keyPath;

  return null;
}

/**
 * Creates identity.key on the given usbMountPath.
 * NEVER overwrites existing identity.key.
 */
async function createIdentityKey(usbMountPath) {
  if (!usbMountPath) throw new Error("No USB mount path provided.");

  if (!fs.existsSync(usbMountPath)) {
    throw new Error("USB mount path not found.");
  }

  if (!isWritableDir(usbMountPath)) {
    throw new Error("USB is not writable. Check permissions or re-mount with write access.");
  }

  const keyPath = path.join(usbMountPath, "identity.key");

  // Hard safety: never overwrite
  if (fs.existsSync(keyPath)) {
    throw new Error("identity.key already exists on this USB.");
  }

  // 32 bytes (256-bit) secret. Save as hex string.
  const secretHex = crypto.randomBytes(32).toString("hex");
  fs.writeFileSync(keyPath, secretHex, { encoding: "utf8", mode: 0o600 });

  return keyPath;
}

module.exports = {
  findUsbMountPath,
  findKeyfilePath,
  createIdentityKey,
};