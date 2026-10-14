const assert = require('assert');

// Mock localStorage
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; },
  clear: () => { for (const k in storage) delete storage[k]; }
};

// Mock DOM elements
const elements = {};
function mockElement(id) {
  return {
    id,
    src: '',
    innerText: '',
    className: '',
    classList: {
      _classes: new Set(),
      add: function(...c) { c.forEach(x => this._classes.add(x)); },
      remove: function(...c) { c.forEach(x => this._classes.delete(x)); },
      contains: function(x) { return this._classes.has(x); },
      toggle: function(x) { if (this.contains(x)) this.remove(x); else this.add(x); }
    },
    title: '',
    innerHTML: '',
    value: ''
  };
}

global.document = {
  getElementById: (id) => {
    if (!elements[id]) elements[id] = mockElement(id);
    return elements[id];
  },
  querySelectorAll: () => []
};

global.window = {
  location: { reload: () => {} }
};

global.showToast = () => {};

// Define auth functions from app.js logic to test directly
function renderMogulAuthUI(user) {
  const avatarEl = document.getElementById("mogulUserAvatar");
  const avatarContainer = document.getElementById("mogulUserAvatarContainer");
  const avatarDot = document.getElementById("mogulUserAvatarStatusDot");
  const emailDisplay = document.getElementById("mogulUserEmailDisplay");
  const roleEl = document.getElementById("mogulUserRoleBadge");
  const dropEmail = document.getElementById("mogulDropdownEmail");
  const dropRole = document.getElementById("mogulDropdownRole");
  const wsType = document.getElementById("headerWorkspaceType");
  const logoutText = document.getElementById("mogulDropdownLogoutText");

  if (!user) {
    if (avatarEl) avatarEl.src = "data:image/svg+xml;lock";
    if (avatarContainer) avatarContainer.className = "locked-container";
    if (avatarDot) avatarDot.className = "pulse-amber";
    if (emailDisplay) emailDisplay.innerText = "Signed Out (Locked)";
    if (roleEl) roleEl.innerText = "🔒 SIGN IN";
    if (dropEmail) dropEmail.innerText = "Signed Out (Locked)";
    if (dropRole) dropRole.innerText = "None (Click Sign In)";
    if (wsType) wsType.innerText = "🔒 Workspace Locked";
    if (logoutText) logoutText.innerText = "Sign In to Workspace";
    return;
  }

  if (avatarEl) avatarEl.src = user.avatar || "default-avatar";
  if (emailDisplay) emailDisplay.innerText = user.isArtistLocked ? `${user.artistName} (Artist Portal)` : user.email;
  if (roleEl) roleEl.innerText = user.isArtistLocked ? "🎤 ARTIST (LOCKED)" : "👑 OWNER";
  if (dropEmail) dropEmail.innerText = user.email;
  if (dropRole) dropRole.innerText = user.role;
  if (wsType) wsType.innerText = user.isArtistLocked ? "Artist Portal (Isolated)" : "Entity Workspace";
  if (logoutText) logoutText.innerText = "Sign Out / Lock Workspace";
}

async function initMogulAuth() {
  if (localStorage.getItem("mogul_logged_out") === "true") {
    window.activeMogulSession = null;
    renderMogulAuthUI(null);
    return;
  }

  let session = null;
  const saved = localStorage.getItem("mogul_auth_session");
  if (saved) {
    try { session = JSON.parse(saved); } catch (e) {}
  }

  if (!session || !session.user) {
    window.activeMogulSession = null;
    renderMogulAuthUI(null);
    return;
  }

  window.activeMogulSession = session;
  renderMogulAuthUI(session.user);
}

async function logoutMogul() {
  localStorage.removeItem("mogul_auth_session");
  localStorage.setItem("mogul_logged_out", "true");
  window.activeMogulSession = null;
  renderMogulAuthUI(null);
}

async function loginAsArtist(name) {
  const session = {
    user: {
      name,
      artistName: name,
      email: `${name.toLowerCase()}@ljmusic.com`,
      role: 'Artist',
      isArtistLocked: true
    }
  };
  localStorage.removeItem("mogul_logged_out");
  localStorage.setItem("mogul_auth_session", JSON.stringify(session));
  window.activeMogulSession = session;
  renderMogulAuthUI(session.user);
}

async function run() {
  console.log("--- Testing Client Auth & Logout Flow ---");

  // Step 1: Login as Artist
  await loginAsArtist("Drey Star");
  assert.strictEqual(window.activeMogulSession.user.artistName, "Drey Star");
  assert.strictEqual(document.getElementById("mogulUserEmailDisplay").innerText, "Drey Star (Artist Portal)");
  assert.strictEqual(document.getElementById("mogulUserRoleBadge").innerText, "🎤 ARTIST (LOCKED)");
  assert.strictEqual(localStorage.getItem("mogul_logged_out"), null);
  console.log("✓ Step 1: Artist Login UI & State OK");

  // Step 2: Trigger Logout
  await logoutMogul();
  assert.strictEqual(window.activeMogulSession, null);
  assert.strictEqual(localStorage.getItem("mogul_auth_session"), null);
  assert.strictEqual(localStorage.getItem("mogul_logged_out"), "true");
  assert.strictEqual(document.getElementById("mogulUserEmailDisplay").innerText, "Signed Out (Locked)");
  assert.strictEqual(document.getElementById("mogulUserRoleBadge").innerText, "🔒 SIGN IN");
  assert.strictEqual(document.getElementById("mogulDropdownLogoutText").innerText, "Sign In to Workspace");
  console.log("✓ Step 2: Logout immediately resets UI to Signed Out (Locked) & 🔒 SIGN IN");

  // Step 3: Page Reload Simulation
  await initMogulAuth();
  assert.strictEqual(window.activeMogulSession, null);
  assert.strictEqual(document.getElementById("mogulUserEmailDisplay").innerText, "Signed Out (Locked)");
  assert.strictEqual(document.getElementById("mogulUserRoleBadge").innerText, "🔒 SIGN IN");
  console.log("✓ Step 3: Page refresh maintains logged-out locked state (NO silent auto-relogin!)");

  // Step 4: Login again
  await loginAsArtist("Kayla B");
  assert.strictEqual(window.activeMogulSession.user.artistName, "Kayla B");
  assert.strictEqual(document.getElementById("mogulUserEmailDisplay").innerText, "Kayla B (Artist Portal)");
  assert.strictEqual(localStorage.getItem("mogul_logged_out"), null);
  console.log("✓ Step 4: Re-login clears logged_out flag and restores session");

  console.log("\n All client auth unit tests PASSED!");
}

run();
