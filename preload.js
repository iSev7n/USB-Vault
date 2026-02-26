// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("vaultAPI", {
  usbStatus: () => ipcRenderer.invoke("usb:status"),
  vaultExists: () => ipcRenderer.invoke("vault:exists"),
  createUSBKey: () => ipcRenderer.invoke("usb:createKey"),
  createVault: (pin) => ipcRenderer.invoke("vault:create", { pin }),
  unlockVault: (pin) => ipcRenderer.invoke("vault:unlock", { pin }),
  saveVault: (data) => ipcRenderer.invoke("vault:save", { data }),
  lockSession: () => ipcRenderer.invoke("session:lock"),
  copyToClipboard: (text) => ipcRenderer.invoke("clipboard:copy", { text }),
});