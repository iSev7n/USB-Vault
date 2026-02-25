// renderer/app/generator.js
export function genPassword(len) {
  const length = Math.max(8, Math.min(64, Number(len) || 20));
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*_-+=";
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);

  let out = "";
  for (let i = 0; i < length; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}
