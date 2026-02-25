// renderer/app/toast.js
export function showToast(dom, title, message, type = "info") {
  const { toast, toastTitle, toastMsg } = dom;
  if (!toast || !toastTitle || !toastMsg) return;

  toast.classList.remove("good", "bad", "info", "warn", "hidden");
  toast.classList.add(type);

  toastTitle.textContent = title;
  toastMsg.textContent = message;

  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 3200);
}

export function toastFromError(err, fallback = "Something went wrong") {
  const raw = err?.message ? String(err.message) : String(err || fallback);
  return raw.replace(/^Error invoking remote method '[^']+':\s*/i, "").replace(/^Error:\s*/i, "") || fallback;
}
