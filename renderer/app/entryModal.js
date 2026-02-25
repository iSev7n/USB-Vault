// renderer/app/entryModal.js
import { openModal, closeModal } from "./modals.js";
import { resetIdleTimer } from "./idle.js";
import { showToast, toastFromError } from "./toast.js";
import { copyText } from "./clipboard.js";
import { getEntryById, renderEntries } from "./entries.js";
import { saveCurrentVault } from "./vault.js";
import { confirmDialog } from "./modals.js";

const MASK = "••••••••••••••••";

export function setEntryEditing(dom, state, on) {
  state.editing = on;

  dom.entryModalCategory.disabled = !on;
  dom.entryModalUser.readOnly = !on;
  dom.entryModalNotes.readOnly = !on;
  dom.entryModalPass.readOnly = !on;

  dom.editEntryBtn.classList.toggle("hidden", on);
  dom.saveEntryBtn.classList.toggle("hidden", !on);
  dom.cancelEditBtn.classList.toggle("hidden", !on);
}

export function showEntryModal(dom, state, entryId) {
  if (!state.unlockedVault) return;

  const e = getEntryById(state, entryId);
  if (!e) return;

  state.activeEntryId = entryId;
  state.passShown = false;

  state.snapshot = { ...e };
  setEntryEditing(dom, state, false);

  dom.entryModalTitle.textContent = e.site || "(no site)";
  dom.entryModalSub.textContent = e.username || "";
  dom.entryModalCategory.value = e.category || "Other";
  dom.entryModalUser.value = e.username || "";
  dom.entryModalPass.type = "text";
  dom.entryModalPass.value = e.password ? MASK : "";
  dom.entryModalNotes.value = e.notes || "";
  dom.toggleEntryPass.textContent = "Show";

  openModal(dom, state, dom.entryModal);
}

export function bindEntryModal(dom, state) {
  dom.entryModalClose.addEventListener("click", () => closeModal(dom, dom.entryModal));

  dom.toggleEntryPass.addEventListener("click", () => {
    const e = getEntryById(state, state.activeEntryId);
    if (!e) return;

    state.passShown = !state.passShown;

    dom.entryModalPass.type = "text";
    if (state.editing) {
      // editing: the field contains the real password
      dom.entryModalPass.value = state.passShown ? dom.entryModalPass.value : MASK;
    } else {
      dom.entryModalPass.value = state.passShown ? e.password || "" : e.password ? MASK : "";
    }

    dom.toggleEntryPass.textContent = state.passShown ? "Hide" : "Show";
    resetIdleTimer(state);
  });

  dom.copyEntryUser.addEventListener("click", async () => {
    const e = getEntryById(state, state.activeEntryId);
    if (!e) return;
    await copyText(dom, state, e.username || "");
  });

  dom.copyEntryPass.addEventListener("click", async () => {
    const e = getEntryById(state, state.activeEntryId);
    if (!e) return;
    await copyText(dom, state, e.password || "");
  });

  dom.copyEntryNotes.addEventListener("click", async () => {
    const e = getEntryById(state, state.activeEntryId);
    if (!e) return;
    await copyText(dom, state, e.notes || "");
  });

  dom.editEntryBtn.addEventListener("click", () => {
    const e = getEntryById(state, state.activeEntryId);
    if (!e) return;

    setEntryEditing(dom, state, true);

    dom.entryModalPass.type = "text";
    dom.entryModalPass.value = e.password || "";
    state.passShown = true;
    dom.toggleEntryPass.textContent = "Hide";

    showToast(dom, "Edit mode", "You can update username, password, notes, and category.", "info");
    resetIdleTimer(state);
  });

  dom.cancelEditBtn.addEventListener("click", () => {
    const e = getEntryById(state, state.activeEntryId);
    if (!e || !state.snapshot) return;

    e.category = state.snapshot.category;
    e.username = state.snapshot.username;
    e.password = state.snapshot.password;
    e.notes = state.snapshot.notes;

    showEntryModal(dom, state, state.activeEntryId);
    showToast(dom, "Canceled", "Changes were discarded.", "warn");
    resetIdleTimer(state);
  });

  dom.saveEntryBtn.addEventListener("click", async () => {
    const e = getEntryById(state, state.activeEntryId);
    if (!e) return;

    const nextCategory = dom.entryModalCategory.value || "Other";
    const nextUser = dom.entryModalUser.value.trim();
    const nextPass = dom.entryModalPass.value;
    const nextNotes = dom.entryModalNotes.value.trim();

    if (!e.site) {
      showToast(dom, "Cannot edit", "This entry has no site. Delete it and recreate it.", "bad");
      return;
    }

    if (!nextPass || nextPass.trim().length < 4) {
      showToast(dom, "Password required", "Password must be at least 4 characters.", "warn");
      return;
    }

    e.category = nextCategory;
    e.username = nextUser;
    e.password = nextPass;
    e.notes = nextNotes;

    try {
      await saveCurrentVault(state);
      setEntryEditing(dom, state, false);
      renderEntries(dom, state);

      state.passShown = false;
      dom.entryModalPass.value = MASK;
      dom.toggleEntryPass.textContent = "Show";

      showToast(dom, "Saved", "Entry updated.", "good");
      resetIdleTimer(state);
    } catch (err) {
      showToast(dom, "Save failed", toastFromError(err), "bad");
    }
  });

  dom.deleteEntryBtn.addEventListener("click", async () => {
    if (!state.unlockedVault || !state.activeEntryId) return;

    const e = getEntryById(state, state.activeEntryId);
    const label = e?.site ? e.site : "this entry";

    const ok1 = await confirmDialog(dom, state, {
      title: "Delete entry",
      text: `Delete "${label}"? This cannot be undone.`,
    });
    if (!ok1) {
      showToast(dom, "Canceled", "Delete canceled.", "info");
      return;
    }

    const ok2 = await confirmDialog(dom, state, {
      title: "Final confirmation",
      text: `Are you sure you want to permanently delete "${label}"?`,
    });
    if (!ok2) {
      showToast(dom, "Canceled", "Delete canceled.", "info");
      return;
    }

    state.unlockedVault.entries = state.unlockedVault.entries.filter((x) => x.id !== state.activeEntryId);

    try {
      await saveCurrentVault(state);
      closeModal(dom, dom.entryModal);
      renderEntries(dom, state);
      showToast(dom, "Deleted", `"${label}" removed.`, "good");
      resetIdleTimer(state);
    } catch (err) {
      showToast(dom, "Delete failed", toastFromError(err), "bad");
    }
  });
}
