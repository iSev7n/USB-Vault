// renderer/app/addModal.js
import { openModal, closeModal } from "./modals.js";
import { resetIdleTimer } from "./idle.js";
import { showToast, toastFromError } from "./toast.js";
import { saveCurrentVault } from "./vault.js";
import { renderEntries } from "./entries.js";

export function bindAddModal(dom, state) {
  dom.btnAddEntry.addEventListener("click", () => {
    if (!state.unlockedVault) {
      showToast(dom, "Locked", "Unlock the vault first.", "warn");
      return;
    }

    dom.clearFormBtn.click();
    openModal(dom, state, dom.addModal);
  });

  dom.addModalClose.addEventListener("click", () => closeModal(dom, dom.addModal));

  dom.clearFormBtn.addEventListener("click", () => {
    dom.categoryEl.value = "Websites";
    dom.siteEl.value = "";
    dom.userEl.value = "";
    dom.passEl.value = "";
    dom.notesEl.value = "";
  });

  dom.addEntryBtn.addEventListener("click", async () => {
    if (!state.unlockedVault) {
      showToast(dom, "Locked", "Unlock the vault first.", "warn");
      return;
    }

    const entry = {
      id: crypto.randomUUID(),
      category: dom.categoryEl.value || "Other",
      site: dom.siteEl.value.trim(),
      username: dom.userEl.value.trim(),
      password: dom.passEl.value,
      notes: dom.notesEl.value.trim(),
      createdAt: new Date().toISOString(),
    };

    if (!entry.site) {
      showToast(dom, "Site required", "Add the site (example: gmail.com).", "warn");
      return;
    }
    if (!entry.password || entry.password.trim().length < 4) {
      showToast(dom, "Password required", "Password must be at least 4 characters.", "warn");
      return;
    }

    state.unlockedVault.entries.push(entry);

    try {
      await saveCurrentVault(state);
      renderEntries(dom, state);
      closeModal(dom, dom.addModal);
      showToast(dom, "Saved", "Entry encrypted and stored.", "good");
      resetIdleTimer(state);
    } catch (err) {
      showToast(dom, "Save failed", toastFromError(err), "bad");
    }
  });
}
