#!/bin/sh
set -e

DESKTOP="/usr/share/applications/usb-vault.desktop"
WRAPPER="/usr/local/bin/usb-vault"

# (Re)create wrapper (idempotent) so upgrades can't leave a stale Exec target.
cat > "$WRAPPER" <<'EOF'
#!/usr/bin/env bash
export TMPDIR="${TMPDIR:-/tmp}"
exec "/opt/USB Vault/usb-vault" --no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage "$@"
EOF
chmod +x "$WRAPPER"

# Force the desktop launcher to use wrapper every install/upgrade
if [ -f "$DESKTOP" ]; then
  sed -i "s|^Exec=.*|Exec=$WRAPPER %U|" "$DESKTOP"
fi

update-desktop-database /usr/share/applications >/dev/null 2>&1 || true
exit 0