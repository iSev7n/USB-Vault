// renderer/app/theme.js
const THEME_KEY = "usbVaultTheme";
const THEMES = ["dark", "light", "green", "blue", "purple"];

export function getSavedTheme() {
  const t = (localStorage.getItem(THEME_KEY) || "dark").toLowerCase();
  return THEMES.includes(t) ? t : "dark";
}

export function labelTheme(t) {
  switch ((t || "").toLowerCase()) {
    case "light":
      return "Light";
    case "green":
      return "Green";
    case "blue":
      return "Blue";
    case "purple":
      return "Purple";
    default:
      return "Dark";
  }
}

export function applyTheme(theme) {
  const t = (theme || "dark").toLowerCase();
  const safe = THEMES.includes(t) ? t : "dark";
  document.documentElement.setAttribute("data-theme", safe);
  localStorage.setItem(THEME_KEY, safe);
}
