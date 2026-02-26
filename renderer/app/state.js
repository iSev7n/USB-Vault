// renderer/app/state.js
export function createState() {
  return {
    unlockedVault: null,
    isUnlocked: false,
    lastUsbPresent: false,
    clipboardTimer: null,

    // Idle
    idleTimer: null,
    IDLE_TIMEOUT_MS: 10 * 60 * 1000,

    // Entry modal state
    activeEntryId: null,
    passShown: false,

    // Edit state
    editing: false,
    snapshot: null,
  };
}
