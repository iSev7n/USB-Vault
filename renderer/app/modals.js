// renderer/app/modals.js
import { resetIdleTimer } from "./idle.js";

export function openModal(dom, state, modalEl) {
  resetIdleTimer(state);
  dom.backdrop?.classList.remove("hidden");
  modalEl?.classList.remove("hidden");
}

export function closeModal(dom, modalEl) {
  modalEl?.classList.add("hidden");

  const anyOpen = [
    dom.entryModal,
    dom.addModal,
    dom.reauthModal,
    dom.allModal,
    dom.genModal,
    dom.confirmModal,
    dom.settingsModal,
    dom.aboutModal,
  ].some((m) => m && !m.classList.contains("hidden"));

  if (!anyOpen) dom.backdrop?.classList.add("hidden");
}

export function closeAllModals(dom) {
  [
    dom.entryModal,
    dom.addModal,
    dom.reauthModal,
    dom.allModal,
    dom.genModal,
    dom.confirmModal,
    dom.settingsModal,
    dom.aboutModal,
  ].forEach((m) => m?.classList.add("hidden"));

  dom.backdrop?.classList.add("hidden");
}

export function confirmDialog(dom, state, { title = "Confirm", text = "Are you sure?" }) {
  return new Promise((resolve) => {
    dom.confirmTitle.textContent = title;
    dom.confirmText.textContent = text;

    const cleanup = () => {
      dom.confirmOk.onclick = null;
      dom.confirmCancel.onclick = null;
      dom.confirmClose.onclick = null;
      closeModal(dom, dom.confirmModal);
    };

    dom.confirmOk.onclick = () => {
      cleanup();
      resolve(true);
    };

    dom.confirmCancel.onclick = () => {
      cleanup();
      resolve(false);
    };

    dom.confirmClose.onclick = () => {
      cleanup();
      resolve(false);
    };

    openModal(dom, state, dom.confirmModal);
  });
}
