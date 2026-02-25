// renderer/app/dom.js
export const $ = (id) => document.getElementById(id);

export function cacheDom() {
  return {
    // Toast
    toast: $("toast"),
    toastTitle: $("toastTitle"),
    toastMsg: $("toastMsg"),

    // Views + topbar
    authView: $("loginView"),
    mainView: $("mainView"),
    btnLockTop: $("btnLockTop"),
    btnAbout: $("btnAbout"),
    btnSettings: $("btnSettings"),

    // Status
    usbStatus: $("usbStatus"),
    vaultStatus: $("vaultStatus"),
    lockStatus: $("lockStatus"),
    msg: $("msg"),

    // Unlock/Create
    pinInput: $("pin"),
    btnCreateUSB: $("btnCreateUSB"),
    btnCreate: $("btnCreate"),
    btnUnlock: $("btnUnlock"),
    btnLock: $("btnLock"),

    // Actions
    btnAddEntry: $("btnAddEntry"),
    btnShowAll: $("btnShowAll"),
    btnGenOpen: $("btnGenOpen"),

    // Search + list
    searchEl: $("search"),
    categoryFilter: $("categoryFilter"),
    entriesList: $("entriesList"),

    // Backdrop
    backdrop: $("modalBackdrop"),

    // Add modal
    addModal: $("addModal"),
    addModalClose: $("addModalClose"),
    categoryEl: $("category"),
    siteEl: $("site"),
    userEl: $("username"),
    passEl: $("password"),
    notesEl: $("notes"),
    addEntryBtn: $("addEntry"),
    clearFormBtn: $("clearForm"),
    addMsg: $("addMsg"),

    // Entry modal
    entryModal: $("entryModal"),
    entryModalTitle: $("entryModalTitle"),
    entryModalSub: $("entryModalSub"),
    entryModalCategory: $("entryModalCategory"),
    entryModalUser: $("entryModalUser"),
    entryModalPass: $("entryModalPass"),
    entryModalNotes: $("entryModalNotes"),
    entryModalClose: $("entryModalClose"),
    copyEntryUser: $("copyEntryUser"),
    copyEntryPass: $("copyEntryPass"),
    copyEntryNotes: $("copyEntryNotes"),
    toggleEntryPass: $("toggleEntryPass"),
    deleteEntryBtn: $("deleteEntry"),
    entryMsg: $("entryMsg"),
    editEntryBtn: $("editEntry"),
    saveEntryBtn: $("saveEntry"),
    cancelEditBtn: $("cancelEdit"),

    // Confirm
    confirmModal: $("confirmModal"),
    confirmTitle: $("confirmTitle"),
    confirmText: $("confirmText"),
    confirmClose: $("confirmClose"),
    confirmCancel: $("confirmCancel"),
    confirmOk: $("confirmOk"),

    // Reauth
    reauthModal: $("reauthModal"),
    reauthClose: $("reauthClose"),
    reauthPin: $("reauthPin"),
    reauthConfirm: $("reauthConfirm"),
    reauthMsg: $("reauthMsg"),

    // All modal
    allModal: $("allModal"),
    allClose: $("allClose"),
    allOut: $("allOut"),

    // Generator
    genModal: $("genModal"),
    genClose: $("genClose"),
    genLen: $("genLen"),
    btnGen: $("btnGen"),
    genOut: $("genOut"),
    btnCopyGen: $("btnCopyGen"),
    genMsg: $("genMsg"),

    // Settings
    settingsModal: $("settingsModal"),
    settingsClose: $("settingsClose"),
    themeSelect: $("themeSelect"),
    themeApply: $("themeApply"),

    // About
    aboutModal: $("aboutModal"),
    aboutClose: $("aboutClose"),
    copyAboutGithub: $("copyAboutGithub"),
    copyAboutEmail: $("copyAboutEmail"),
    aboutGithub: $("aboutGithub"),
    aboutEmail: $("aboutEmail"),
  };
}
