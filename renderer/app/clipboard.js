// renderer/app/clipboard.js
import { showToast } from "./toast.js";
import { resetIdleTimer } from "./idle.js";

export function startClipboardClear(state, seconds = 20) {
  if (state.clipboardTimer) clearTimeout(state.clipboardTimer);
  state.clipboardTimer = setTimeout(async () => {
    try {
      await window.vaultAPI.copyToClipboard("");
    } catch {}
  }, seconds * 1000);
}

export async function copyText(dom, state, text) {
  resetIdleTimer(state);
  await window.vaultAPI.copyToClipboard(String(text ?? ""));
  startClipboardClear(state, 15);
  showToast(dom, "Copied", "Clipboard auto-clears in 15 seconds.", "good");
}
