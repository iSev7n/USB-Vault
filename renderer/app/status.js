// renderer/app/status.js
export function setPill(el, text, kind) {
  if (!el) return;
  el.textContent = text;
  el.classList.remove("good", "warn", "bad");
  el.classList.add(kind);
}

export async function refreshStatus(dom, state) {
  const usb = await window.vaultAPI.usbStatus();
  const usbPresent = Boolean(usb.usbPresent);
  const keyPresent = Boolean(usb.keyPresent);

  const vault = await window.vaultAPI.vaultExists();
  const vaultExists = Boolean(vault.exists);

  // Pills
  if (!usbPresent) {
    setPill(dom.usbStatus, "USB: not detected", "bad");
  } else if (keyPresent) {
    setPill(dom.usbStatus, "USB key: detected", "good");
  } else {
    setPill(dom.usbStatus, "USB: detected (no key)", "warn");
  }

  setPill(dom.vaultStatus, vaultExists ? "Vault: exists" : "Vault: not found", vaultExists ? "good" : "warn");

  setPill(
    dom.lockStatus,
    state.isUnlocked ? "State: unlocked" : "State: locked",
    state.isUnlocked ? "good" : "warn"
  );

  // Button rules
  dom.btnCreateUSB.disabled = !usbPresent || keyPresent || vaultExists || state.isUnlocked;
  dom.btnCreate.disabled = !keyPresent || vaultExists || state.isUnlocked;
  dom.btnUnlock.disabled = !keyPresent || !vaultExists || state.isUnlocked;
  dom.btnLock.disabled = !state.isUnlocked;

  // Actions require unlock + key present
  dom.btnAddEntry.disabled = !keyPresent || !state.isUnlocked;
  dom.btnShowAll.disabled = !keyPresent || !state.isUnlocked;
  dom.btnGenOpen.disabled = false;

  // If USB key removed while unlocked, notify via event
  if (state.lastUsbPresent && !keyPresent && state.isUnlocked) {
    window.dispatchEvent(new CustomEvent("usbvault:key-removed"));
  }

  state.lastUsbPresent = keyPresent;
}