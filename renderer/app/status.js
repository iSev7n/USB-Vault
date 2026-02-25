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
    state.currentPin ? "State: unlocked" : "State: locked",
    state.currentPin ? "good" : "warn"
  );

  dom.btnCreateUSB.disabled = !usbPresent || keyPresent || vaultExists || Boolean(state.currentPin);
  dom.btnCreate.disabled = !keyPresent || vaultExists || Boolean(state.currentPin);
  dom.btnUnlock.disabled = !keyPresent || !vaultExists;
  dom.btnLock.disabled = !state.currentPin;

  dom.btnAddEntry.disabled = !keyPresent || !state.currentPin;
  dom.btnShowAll.disabled = !keyPresent || !state.currentPin;
  dom.btnGenOpen.disabled = false;

  // If USB key removed while unlocked, notify via event
  if (state.lastUsbPresent && !keyPresent && state.currentPin) {
    window.dispatchEvent(new CustomEvent("usbvault:key-removed"));
  }
  state.lastUsbPresent = keyPresent;
}
