// main.js
const { app, BrowserWindow, ipcMain, clipboard, Menu } = require("electron");
const path = require("path");

const { findKeyfilePath, findUsbMountPath, createIdentityKey } = require("./src/usb");
const { createVault, unlockVault, saveVaultWithSessionKey, vaultExists } = require("./src/vault");

process.on("uncaughtException", (err) => console.error("Uncaught exception:", err));

// Must be set BEFORE app.whenReady()
app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-gpu-compositing");
app.commandLine.appendSwitch("disable-accelerated-video-decode");
app.commandLine.appendSwitch("disable-features", "VaapiVideoDecoder");
app.commandLine.appendSwitch("use-gl", "swiftshader");

// Linux production stability flags
if (process.platform === "linux") {
  app.commandLine.appendSwitch("no-sandbox");
  app.commandLine.appendSwitch("disable-setuid-sandbox");
  app.commandLine.appendSwitch("disable-dev-shm-usage");
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 980,
    minHeight: 680,
    backgroundColor: "#0b1020",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Remove the default Electron menu bar (File/Edit/View/Window/Help)
  Menu.setApplicationMenu(null);

  win.loadFile(path.join(__dirname, "renderer", "index.html"));
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  clearSessionKey();
  if (process.platform !== "darwin") app.quit();
});

let sessionKey = null; // Buffer, in-memory only

function clearSessionKey() {
  if (sessionKey && Buffer.isBuffer(sessionKey)) sessionKey.fill(0);
  sessionKey = null;
}

// --- IPC API ---
ipcMain.handle("usb:status", async () => {
  const usbMountPath = await findUsbMountPath();
  const keyfilePath = await findKeyfilePath();
  return {
    usbPresent: Boolean(usbMountPath),
    usbMountPath: usbMountPath || null,
    keyPresent: Boolean(keyfilePath),
    keyfilePath: keyfilePath || null,
  };
});

ipcMain.handle("session:lock", async () => {
  clearSessionKey();
  return { ok: true };
});

ipcMain.handle("usb:createKey", async () => {
  // Hard safety rules:
  // - Must have a USB present
  // - Must NOT overwrite an existing identity.key
  // - If a vault already exists, do NOT allow making a new key (it would not match)
  if (vaultExists()) {
    throw new Error("Vault already exists. Creating a new USB key would break access to this vault.");
  }

  const usbMountPath = await findUsbMountPath();
  if (!usbMountPath) throw new Error("No USB detected. Insert a USB drive first.");

  // createIdentityKey() itself refuses to overwrite identity.key
  const outPath = await createIdentityKey(usbMountPath);

  return { ok: true, path: outPath };
});

ipcMain.handle("vault:exists", async () => {
  return { exists: vaultExists() };
});

ipcMain.handle("vault:create", async (_evt, { pin }) => {
  const keyfilePath = await findKeyfilePath();
  if (!keyfilePath) throw new Error("USB keyfile not found. Insert your USB with identity.key.");
  await createVault({ pin, keyfilePath });
  return { ok: true };
});

ipcMain.handle("vault:unlock", async (_evt, { pin }) => {
  const keyfilePath = await findKeyfilePath();
  if (!keyfilePath) throw new Error("USB keyfile not found. Insert your USB with identity.key.");

  const res = await unlockVault({ pin, keyfilePath }); // { data, sessionKey }
  sessionKey = res.sessionKey; // Buffer
  return { ok: true, data: res.data };
});

ipcMain.handle("vault:save", async (_evt, { data }) => {
  const keyfilePath = await findKeyfilePath();
  if (!keyfilePath) throw new Error("USB keyfile not found.");
  if (!sessionKey) throw new Error("Vault is locked. Unlock required.");

  await saveVaultWithSessionKey({ keyfilePath, data, sessionKey });
  return { ok: true };
});

ipcMain.handle("clipboard:copy", async (_evt, { text }) => {
  clipboard.writeText(String(text ?? ""));
  return { ok: true };
});