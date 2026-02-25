// src/vault.js
const { app } = require("electron");
const path = require("path");
const fs = require("fs");
const fsp = require("fs").promises;
const crypto = require("crypto");

const VAULT_FILE = "vault.enc";
const MAGIC = "USBVAULT";
const VERSION = 1;

// Strong default (personal use, higher resistance)
const SCRYPT = {
  name: "scrypt",
  N: 131072, // change to 65536 if unlock feels too slow
  r: 8,
  p: 1,
  maxmem: 512 * 1024 * 1024
};

const MIN_PIN_LEN = 10;

function vaultPath() {
  return path.join(app.getPath("userData"), VAULT_FILE);
}

function vaultExists() {
  return fs.existsSync(vaultPath());
}

function requirePin(pin) {
  const p = String(pin ?? "");
  if (p.length < MIN_PIN_LEN) {
    throw new Error(`Use a PIN/password of at least ${MIN_PIN_LEN} characters.`);
  }
  return p;
}

async function readKeyfileBytes(keyfilePath) {
  const b = await fsp.readFile(keyfilePath);
  if (b.length < 32) throw new Error("identity.key is too small. Use at least 32 random bytes.");
  return b;
}

function deriveKeySync({ pin, keyfileBytes, salt }) {
  const pinBytes = Buffer.from(String(pin), "utf8");

  // Domain-separate PIN from keyfile to avoid ambiguity
  const input = Buffer.concat([pinBytes, Buffer.from([0]), keyfileBytes]);

  return crypto.scryptSync(input, salt, 32, {
    N: SCRYPT.N,
    r: SCRYPT.r,
    p: SCRYPT.p,
    maxmem: SCRYPT.maxmem
  });
}

function encryptJson({ key, plaintextObj }) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const pt = Buffer.from(JSON.stringify(plaintextObj), "utf8");
  const ct = Buffer.concat([cipher.update(pt), cipher.final()]);
  const tag = cipher.getAuthTag();

  return { iv, ct, tag };
}

function decryptJson({ key, iv, ct, tag }) {
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  return JSON.parse(pt.toString("utf8"));
}

async function writeVaultFile(envelope) {
  await fsp.writeFile(vaultPath(), JSON.stringify(envelope, null, 2), { mode: 0o600 });
}

async function readVaultFile() {
  const raw = await fsp.readFile(vaultPath(), "utf8");
  const env = JSON.parse(raw);

  if (env.magic !== MAGIC) throw new Error("Not a valid vault file (bad magic).");
  if (env.version !== VERSION) throw new Error("Unsupported vault version.");

  // Enforce that this vault uses the expected KDF
  if (!env.kdf || typeof env.kdf !== "object" || env.kdf.name !== "scrypt") {
    throw new Error("Invalid vault KDF metadata.");
  }
  if (
    Number(env.kdf.N) !== SCRYPT.N ||
    Number(env.kdf.r) !== SCRYPT.r ||
    Number(env.kdf.p) !== SCRYPT.p
  ) {
    throw new Error(
      "Vault KDF parameters do not match this build. (This build is configured for a single KDF profile.)"
    );
  }

  return env;
}

async function createVault({ pin, keyfilePath }) {
  const cleanPin = requirePin(pin);

  const keyfileBytes = await readKeyfileBytes(keyfilePath);
  const salt = crypto.randomBytes(16);
  const key = deriveKeySync({ pin: cleanPin, keyfileBytes, salt });

  const initialVault = {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    entries: []
  };

  const { iv, ct, tag } = encryptJson({ key, plaintextObj: initialVault });

  const envelope = {
    magic: MAGIC,
    version: VERSION,
    kdf: { name: "scrypt", N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p },
    salt_b64: salt.toString("base64"),
    iv_b64: iv.toString("base64"),
    tag_b64: tag.toString("base64"),
    ct_b64: ct.toString("base64")
  };

  await writeVaultFile(envelope);
}

async function unlockVault({ pin, keyfilePath }) {
  if (!vaultExists()) throw new Error("No vault found. Create one first.");
  const cleanPin = requirePin(pin);

  const keyfileBytes = await readKeyfileBytes(keyfilePath);
  const env = await readVaultFile();

  const salt = Buffer.from(env.salt_b64, "base64");
  const iv = Buffer.from(env.iv_b64, "base64");
  const tag = Buffer.from(env.tag_b64, "base64");
  const ct = Buffer.from(env.ct_b64, "base64");

  const key = deriveKeySync({ pin: cleanPin, keyfileBytes, salt });

  try {
    const data = decryptJson({ key, iv, ct, tag });
    data.entries ||= [];
    data.updatedAt ||= data.createdAt || new Date().toISOString();
    return data;
  } catch {
    throw new Error("Unlock failed. Wrong PIN or wrong USB key.");
  }
}

async function saveVault({ pin, keyfilePath, data }) {
  const cleanPin = requirePin(pin);
  if (!data || typeof data !== "object") throw new Error("Invalid vault data.");

  const keyfileBytes = await readKeyfileBytes(keyfilePath);
  const env = await readVaultFile();

  const salt = Buffer.from(env.salt_b64, "base64");
  const key = deriveKeySync({ pin: cleanPin, keyfileBytes, salt });

  const next = { ...data, updatedAt: new Date().toISOString() };
  const { iv, ct, tag } = encryptJson({ key, plaintextObj: next });

  const newEnvelope = {
    ...env,
    iv_b64: iv.toString("base64"),
    tag_b64: tag.toString("base64"),
    ct_b64: ct.toString("base64")
  };

  await writeVaultFile(newEnvelope);
}

module.exports = {
  vaultExists,
  createVault,
  unlockVault,
  saveVault
};