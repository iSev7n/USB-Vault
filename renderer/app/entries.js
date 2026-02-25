// renderer/app/entries.js
function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(s) {
  return String(s || "").toLowerCase();
}

export function getEntryById(state, id) {
  return state.unlockedVault?.entries?.find((x) => x.id === id) || null;
}

export function renderEntries(dom, state) {
  dom.entriesList.innerHTML = "";
  if (!state.unlockedVault) return;

  const q = normalize(dom.searchEl.value);
  const cat = dom.categoryFilter?.value || "all";

  const filtered = state.unlockedVault.entries.filter((e) => {
    const blob = normalize(e.site) + " " + normalize(e.username) + " " + normalize(e.notes);
    const catOk = cat === "all" || (e.category || "Other") === cat;
    return catOk && blob.includes(q);
  });

  if (filtered.length === 0) {
    dom.entriesList.innerHTML = `<div class="hint">No entries found.</div>`;
    return;
  }

  for (const e of filtered) {
    const card = document.createElement("div");
    card.className = "entry";

    card.innerHTML = `
      <div class="entry-top">
        <div>
          <strong>${escapeHtml(e.site || "(no site)")}</strong>
          <div class="meta">${escapeHtml(e.username || "")}</div>
          <div class="meta">${escapeHtml(e.category || "Other")}</div>
        </div>
        <button class="ghost" data-show="${e.id}">Show Info</button>
      </div>
      <div class="meta" style="margin-top:8px;">
        ${escapeHtml((e.notes || "").slice(0, 80))}${e.notes && e.notes.length > 80 ? "…" : ""}
      </div>
    `;

    dom.entriesList.appendChild(card);
  }
}
