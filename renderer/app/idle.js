// renderer/app/idle.js
export function resetIdleTimer(state) {
  if (!state.currentPin) return;
  if (state.idleTimer) clearTimeout(state.idleTimer);

  state.idleTimer = setTimeout(() => {
    window.dispatchEvent(new CustomEvent("usbvault:idle-timeout"));
  }, state.IDLE_TIMEOUT_MS);
}

export function stopIdleTimer(state) {
  if (state.idleTimer) {
    clearTimeout(state.idleTimer);
    state.idleTimer = null;
  }
}

export function registerIdleListeners(state) {
  const events = ["click", "keydown", "scroll", "touchstart", "mousemove"];
  events.forEach((ev) => window.addEventListener(ev, () => resetIdleTimer(state), { passive: true }));
}
