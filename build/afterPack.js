// build/afterPack.js
const fs = require("fs");
const path = require("path");

module.exports = async function afterPack(context) {
  // Only run on Linux builds
  if (context.electronPlatformName !== "linux") return;

  const appOutDir = context.appOutDir;
  const exeName = context.packager.appInfo.productFilename;

  const appRunPath = path.join(appOutDir, "AppRun");

  // AppRun does NOT exist during linux-unpacked stage.
  // It only exists for AppImage builds.
  if (!fs.existsSync(appRunPath)) {
    console.log("[afterPack] No AppRun found (expected for linux-unpacked). Skipping patch.");
    return;
  }

  let content = fs.readFileSync(appRunPath, "utf8");

  // Prevent double patching
  if (content.includes("--no-sandbox")) {
    console.log("[afterPack] AppRun already patched.");
    return;
  }

  const needle = `exec "$HERE/${exeName}" "$@"`;
  const replacement = `exec "$HERE/${exeName}" --no-sandbox --disable-setuid-sandbox "$@"`;

  if (content.includes(needle)) {
    content = content.replace(needle, replacement);
  } else {
    // Fallback regex patch
    content = content.replace(
      /exec "\$HERE\/([^"]+)" "\$@"/,
      `exec "$HERE/$1" --no-sandbox --disable-setuid-sandbox "$@"`
    );
  }

  fs.writeFileSync(appRunPath, content, "utf8");
  console.log("[afterPack] AppRun patched with --no-sandbox flags.");
};