// renderer/app/generatorModal.js
import { openModal, closeModal } from "./modals.js";
import { resetIdleTimer } from "./idle.js";
import { genPassword } from "./generator.js";
import { showToast } from "./toast.js";
import { copyText } from "./clipboard.js";

export function bindGenerator(dom, state) {
  dom.btnGenOpen.addEventListener("click", () => {
    if (!dom.genOut.value) dom.genOut.value = genPassword(dom.genLen.value);
    openModal(dom, state, dom.genModal);
  });

  dom.genClose.addEventListener("click", () => closeModal(dom, dom.genModal));

  dom.btnGen.addEventListener("click", () => {
    dom.genOut.value = genPassword(dom.genLen.value);
    showToast(dom, "Generated", "New password generated.", "good");
    resetIdleTimer(state);
  });

  dom.btnCopyGen.addEventListener("click", async () => {
    if (!dom.genOut.value) dom.genOut.value = genPassword(dom.genLen.value);
    await copyText(dom, state, dom.genOut.value);
  });
}
