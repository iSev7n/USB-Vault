// renderer/renderer.js
import { cacheDom } from "./app/dom.js";
import { createState } from "./app/state.js";
import { applyTheme, getSavedTheme } from "./app/theme.js";
import { showToast } from "./app/toast.js";
import { closeAllModals } from "./app/modals.js";
import { refreshStatus } from "./app/status.js";
import { bindEvents } from "./app/events.js";
import { registerIdleListeners, stopIdleTimer } from "./app/idle.js";

document.addEventListener("DOMContentLoaded", () => {
  const dom = cacheDom();
  const state = createState();

  applyTheme(getSavedTheme());

  // Clear legacy inline message areas (you’re using toast now)
  dom.msg && (dom.msg.textContent = "");
  dom.addMsg && (dom.addMsg.textContent = "");
  dom.entryMsg && (dom.entryMsg.textContent = "");
  dom.reauthMsg && (dom.reauthMsg.textContent = "");
  dom.genMsg && (dom.genMsg.textContent = "");

  bindEvents(dom, state);

  registerIdleListeners(state);

  refreshStatus(dom, state);
  setInterval(() => refreshStatus(dom, state), 1000);

  // Global events emitted by modules
  window.addEventListener("usbvault:key-removed", () => {
    stopIdleTimer(state);
    state.unlockedVault = null;
    state.isUnlocked = false;
    dom.entriesList.innerHTML = "";
    closeAllModals(dom);
    showToast(dom, "Locked", "USB removed. Vault locked.", "warn");
    dom.authView.classList.remove("hidden");
    dom.mainView.classList.add("hidden");
    dom.btnLockTop?.classList.add("hidden");
    dom.btnSettings?.classList.add("hidden");
  });

  window.addEventListener("usbvault:idle-timeout", () => {
    stopIdleTimer(state);
    state.unlockedVault = null;
    state.isUnlocked = false;
    dom.entriesList.innerHTML = "";
    closeAllModals(dom);
    showToast(dom, "Locked", "Auto-locked after 10 minutes of inactivity.", "warn");
    dom.authView.classList.remove("hidden");
    dom.mainView.classList.add("hidden");
    dom.btnLockTop?.classList.add("hidden");
    dom.btnSettings?.classList.add("hidden");
  });
});