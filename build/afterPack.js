// build/afterPack.js
const fs = require("fs");
const path = require("path");

module.exports = async function afterPack(context) {
  if (context.electronPlatformName !== "linux") return;

  const appOutDir = context.appOutDir;
  const exeName = context.packager.appInfo.productFilename;

  const appRunPath = path.join(appOutDir, "AppRun");
  if (!fs.existsSync(appRunPath)) {
    console.log("[afterPack] AppRun not found:", appRunPath);
    return;
  }

  let content = fs.readFileSync(appRunPath, "utf8");
  if (content.includes("--no-sandbox")) {
    console.log("[afterPack] AppRun already patched");
    return;
  }

  const needle = `exec "$HERE/${exeName}" "$@"`;
  const replacement = `exec "$HERE/${exeName}" --no-sandbox --disable-setuid-sandbox "$@"`;

  if (content.includes(needle)) {
    content = content.replace(needle, replacement);
  } else {
    // fallback patch
    content = content.replace(
      /exec "\$HERE\/([^"]+)" "\$@"/,
      `exec "$HERE/$1" --no-sandbox --disable-setuid-sandbox "$@"`
    );
  }

  fs.writeFileSync(appRunPath, content, "utf8");
  console.log("[afterPack] Patched AppRun with --no-sandbox");
};