// renderer/app/aboutSettings.js
import { openModal, closeModal } from "./modals.js";
import { applyTheme, getSavedTheme, labelTheme } from "./theme.js";
import { showToast } from "./toast.js";

export function bindAboutSettings(dom, state) {
  dom.btnAbout?.addEventListener("click", () => openModal(dom, state, dom.aboutModal));
  dom.aboutClose?.addEventListener("click", () => closeModal(dom, dom.aboutModal));

  dom.copyAboutGithub?.addEventListener("click", async () => {
    await window.vaultAPI.copyToClipboard(dom.aboutGithub?.value || "");
    showToast(dom, "Copied", "GitHub link copied.", "info");
  });

  dom.copyAboutEmail?.addEventListener("click", async () => {
    await window.vaultAPI.copyToClipboard(dom.aboutEmail?.value || "");
    showToast(dom, "Copied", "Contact copied.", "info");
  });

  dom.btnSettings?.addEventListener("click", () => {
    if (!state.isUnlocked) return;
    const t = getSavedTheme();
    if (dom.themeSelect) dom.themeSelect.value = t;
    openModal(dom, state, dom.settingsModal);
  });

  dom.settingsClose?.addEventListener("click", () => closeModal(dom, dom.settingsModal));

  dom.themeApply?.addEventListener("click", () => {
    if (!dom.themeSelect) return;
    applyTheme(dom.themeSelect.value);
    showToast(dom, "Theme", `Applied: ${labelTheme(dom.themeSelect.value)}`, "info");
  });

  dom.themeSelect?.addEventListener("change", () => {
    if (!dom.themeSelect) return;
    applyTheme(dom.themeSelect.value);
  });
}