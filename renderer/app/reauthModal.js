// renderer/app/reauthModal.js
import { openModal, closeModal } from "./modals.js";
import { resetIdleTimer } from "./idle.js";
import { showToast } from "./toast.js";

export function bindReauth(dom, state) {
  dom.btnShowAll.addEventListener("click", () => {
    if (!state.unlockedVault) {
      showToast(dom, "Locked", "Unlock the vault first.", "warn");
      return;
    }

    dom.reauthPin.value = "";
    openModal(dom, state, dom.reauthModal);
    dom.reauthPin.focus();
  });

  dom.reauthClose.addEventListener("click", () => closeModal(dom, dom.reauthModal));

  dom.reauthConfirm.addEventListener("click", async () => {
    const pin = dom.reauthPin.value;

    if (!pin || !pin.trim()) {
      showToast(dom, "PIN required", "Enter your PIN to show all logins.", "warn");
      return;
    }

    try {
      const res = await window.vaultAPI.unlockVault(pin);
      dom.allOut.textContent = JSON.stringify(res.data.entries || [], null, 2);
      closeModal(dom, dom.reauthModal);
      openModal(dom, state, dom.allModal);
      showToast(dom, "Verified", "Showing full list.", "good");
      resetIdleTimer(state);
    } catch {
      showToast(dom, "Wrong PIN", "Try again.", "bad");
    }
  });

  dom.allClose.addEventListener("click", () => closeModal(dom, dom.allModal));
}
