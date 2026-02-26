// renderer/app/vault.js
export async function saveCurrentVault(state) {
  if (!state.unlockedVault || !state.isUnlocked) throw new Error("Vault not unlocked.");
  state.unlockedVault.updatedAt = new Date().toISOString();
  await window.vaultAPI.saveVault(state.unlockedVault);
}

export async function unlockVault(pin) {
  return window.vaultAPI.unlockVault(pin);
}

export async function createVault(pin) {
  return window.vaultAPI.createVault(pin);
}

export async function vaultExists() {
  return window.vaultAPI.vaultExists();
}

export async function usbStatus() {
  return window.vaultAPI.usbStatus();
}