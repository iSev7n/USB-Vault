// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("vaultAPI", {
  usbStatus: () => ipcRenderer.invoke("usb:status"),
  vaultExists: () => ipcRenderer.invoke("vault:exists"),
  createUSBKey: () => ipcRenderer.invoke("usb:createKey"),
  createVault: (pin) => ipcRenderer.invoke("vault:create", { pin }),
  unlockVault: (pin) => ipcRenderer.invoke("vault:unlock", { pin }),
  saveVault: (pin, data) => ipcRenderer.invoke("vault:save", { pin, data }),
  copyToClipboard: (text) => ipcRenderer.invoke("clipboard:copy", { text }),
});