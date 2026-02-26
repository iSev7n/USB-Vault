// renderer/app/events.js
import { showToast, toastFromError } from "./toast.js";
import { closeAllModals } from "./modals.js";
import { resetIdleTimer, stopIdleTimer } from "./idle.js";
import { refreshStatus } from "./status.js";
import { renderEntries } from "./entries.js";
import { bindEntryModal, showEntryModal } from "./entryModal.js";
import { bindAddModal } from "./addModal.js";
import { bindReauth } from "./reauthModal.js";
import { bindAboutSettings } from "./aboutSettings.js";
import { bindGenerator } from "./generatorModal.js";

export function bindEvents(dom, state) {
  // Sub-modules
  bindEntryModal(dom, state);
  bindAddModal(dom, state);
  bindGenerator(dom, state);
  bindReauth(dom, state);
  bindAboutSettings(dom, state);

  // Backdrop click closes
  dom.backdrop?.addEventListener("click", () => closeAllModals(dom));

  // Lock buttons
  dom.btnLockTop?.addEventListener("click", () => void lockNow(dom, state, "Locked."));
  dom.btnLock?.addEventListener("click", () => void lockNow(dom, state, "Locked by user."));

  // List “Show Info”
  dom.entriesList?.addEventListener("click", (ev) => {
    const t = ev.target;
    if (!(t instanceof HTMLElement)) return;
    const showId = t.getAttribute("data-show");
    if (showId) showEntryModal(dom, state, showId);
  });

  dom.searchEl?.addEventListener("input", () => renderEntries(dom, state));
  dom.categoryFilter?.addEventListener("change", () => renderEntries(dom, state));

  // Create USB Key
  dom.btnCreateUSB?.addEventListener("click", async () => {
    try {
      await window.vaultAPI.createUSBKey();
      await refreshStatus(dom, state);
      showToast(dom, "USB Key Created", "identity.key written to USB.", "good");
    } catch (err) {
      showToast(dom, "USB Key Error", toastFromError(err), "bad");
    }
  });

  // Create Vault
  dom.btnCreate?.addEventListener("click", async () => {
    try {
      const usb = await window.vaultAPI.usbStatus();
      if (!usb.keyPresent) {
        showToast(dom, "USB missing", "Insert your USB key first.", "warn");
        return;
      }

      const vault = await window.vaultAPI.vaultExists();
      if (vault.exists) {
        showToast(dom, "Vault already exists", "Unlock it instead.", "warn");
        return;
      }

      const pin = dom.pinInput.value;
      if (!pin || !pin.trim()) {
        showToast(dom, "PIN required", "Enter a PIN to create the vault.", "warn");
        return;
      }

      await window.vaultAPI.createVault(pin);
      showToast(dom, "Vault created", "Now unlock it to begin.", "good");
      await refreshStatus(dom, state);
    } catch (err) {
      showToast(dom, "Create failed", toastFromError(err), "bad");
    }
  });

  // Unlock Vault
  dom.btnUnlock?.addEventListener("click", async () => {
    try {
      const pin = dom.pinInput.value;
      if (!pin || !pin.trim()) {
        showToast(dom, "PIN required", "Enter your PIN to unlock.", "warn");
        return;
      }

      const res = await window.vaultAPI.unlockVault(pin);
      state.unlockedVault = res.data;

      state.unlockedVault.entries ||= [];
      state.unlockedVault.entries = state.unlockedVault.entries.map((en) => ({
        category: en.category || "Other",
        ...en,
      }));

      state.isUnlocked = true;

      dom.authView.classList.add("hidden");
      dom.mainView.classList.remove("hidden");
      dom.btnLockTop.classList.remove("hidden");
      dom.btnSettings?.classList.remove("hidden");

      renderEntries(dom, state);
      await refreshStatus(dom, state);
      resetIdleTimer(state);

      showToast(dom, "Unlocked", "Vault opened successfully.", "good");
    } catch (err) {
      await lockNow(dom, state);
      showToast(dom, "Unlock failed", toastFromError(err, "Wrong PIN or vault error."), "bad");
    }
  });

  // Generator modal wiring stays in its own file if you want next
}

async function lockNow(dom, state, reason = "") {
  stopIdleTimer(state);

  // Clear sensitive stuff (best effort)
  try {
    await window.vaultAPI.copyToClipboard("");
  } catch {}
  try {
    await window.vaultAPI.lockSession(); // only works after you add session:lock IPC + preload
  } catch {}

  state.unlockedVault = null;
  state.isUnlocked = false;
  dom.entriesList.innerHTML = "";

  closeAllModals(dom);

  dom.authView.classList.remove("hidden");
  dom.mainView.classList.add("hidden");
  dom.btnLockTop?.classList.add("hidden");
  dom.btnSettings?.classList.add("hidden");

  if (reason) showToast(dom, "Locked", reason, "warn");
}
