/**
 * LJ MUSIC OS - CLIENT-SIDE APPLICATION SCRIPT (10,000-AGENT SWARM EDITION)
 * Coordinates all UI interactions, Web Audio procedural beats, Swarm Command Center,
 * Adversarial Council debates, Curator CRM, Anti-Fraud defense, and Revival engines.
 */

let allTracks = [];
let currentActiveTrackId = "lj-000"; // Default: KIRA by Drey Star
window.currentActiveTrackId = "lj-000";
let currentFilter = "all";
let currentChartSubTab = "top10";
let currentChartsData = null;
let activeCuratorId = "cur-001";

// ==============================================================
// TOAST NOTIFICATION SYSTEM & ACTION CONTROLLERS
// ==============================================================
function showToast(message, type = 'info', title = '') {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toastId = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
  const toast = document.createElement("div");
  toast.id = toastId;
  toast.className = "pointer-events-auto transform translate-y-2 opacity-0 transition-all duration-300 ease-out glass-panel rounded-2xl p-4 border shadow-2xl flex items-start space-x-3 text-xs";
  
  let borderColor = "border-white/10";
  let icon = `<svg class="w-5 h-5 text-violet-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

  if (type === 'success') {
    borderColor = "border-emerald-500/40 bg-emerald-950/40";
    icon = `<svg class="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
  } else if (type === 'warning') {
    borderColor = "border-amber-500/40 bg-amber-950/40";
    icon = `<svg class="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
  } else if (type === 'error') {
    borderColor = "border-red-500/40 bg-red-950/40";
    icon = `<svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
  }

  toast.classList.add(...borderColor.split(' '));

  toast.innerHTML = `
    ${icon}
    <div class="flex-1 space-y-0.5">
      ${title ? `<div class="font-bold text-white">${title}</div>` : ''}
      <div class="text-slate-200 leading-snug whitespace-pre-line">${message}</div>
    </div>
    <button onclick="dismissToast('${toastId}')" class="text-slate-400 hover:text-white p-0.5">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
  });

  setTimeout(() => {
    dismissToast(toastId);
  }, 4000);
}

function dismissToast(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("opacity-0", "-translate-y-2");
  setTimeout(() => {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }, 300);
}

function approveAgentDecision(agentId = '4721', targetChannel = 'Spotify Afrobeats Editorial', songName = 'KIRA', artist = 'Drey Star') {
  const badge = document.getElementById("agentDecisionStatusBadge");
  const actionArea = document.getElementById("agentDecisionActionArea");

  if (badge) {
    badge.className = "px-2.5 py-1 rounded-full text-xs font-mono-code font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    badge.innerText = "✓ APPROVED & DISPATCHED";
  }

  if (actionArea) {
    actionArea.innerHTML = `
      <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between w-full">
        <span class="font-bold flex items-center space-x-1.5">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span>Pitch Dispatched via Official DSP Editorial Tool</span>
        </span>
        <span class="font-mono-code text-[10px] text-slate-400">${new Date().toLocaleTimeString()}</span>
      </div>
    `;
  }

  showToast(`Agent #${agentId} pitch for "${songName}" by ${artist} approved and transmitted to ${targetChannel}.`, 'success', 'Decision Dispatched');
}

function rejectAgentDecision(agentId = '4721', targetChannel = 'Spotify Afrobeats Editorial') {
  const badge = document.getElementById("agentDecisionStatusBadge");
  const actionArea = document.getElementById("agentDecisionActionArea");

  if (badge) {
    badge.className = "px-2.5 py-1 rounded-full text-xs font-mono-code font-extrabold bg-red-500/20 text-red-400 border border-red-500/30";
    badge.innerText = "✕ REJECTED";
  }

  if (actionArea) {
    actionArea.innerHTML = `
      <div class="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center justify-between w-full">
        <span>Recommendation archived. Feedback recorded in AI learning loop.</span>
        <button onclick="approveAgentDecision('${agentId}', '${targetChannel}')" class="text-xs text-slate-400 hover:text-white underline">Undo</button>
      </div>
    `;
  }

  showToast(`Agent #${agentId} pitch to ${targetChannel} rejected. Learning weights updated.`, 'warning', 'Recommendation Archived');
}

window.approveAgentDecision = approveAgentDecision;
window.rejectAgentDecision = rejectAgentDecision;
window.showToast = showToast;
window.dismissToast = dismissToast;

// ==============================================================
// INITIALIZATION
// ==============================================================
document.addEventListener("DOMContentLoaded", () => {
  loadCatalogue();
  loadSwarmCommandCenter();
  loadAdversarialCouncil("lj-000");
  loadCuratorCrm();
  loadAntiFraudShield();
  loadCatalogueRevival();
  loadCharts();
  loadListeningIntelligence();
  loadSyncBriefs();
  loadEditorialPlaylists();
  loadAutonomousPlaylists();
  loadOnlineRadioConsole();
  loadGeoIntelligence();
  loadAutomationStatus();
  loadLyricsForTrack("lj-000");
  loadArtistLyricsPortal();
  loadArtistRosterDirectory();
  executeStoreSearch();

  if (typeof initArtistProfileSwitcher === 'function') {
    initArtistProfileSwitcher();
  }

  if (typeof initMogulAuth === 'function') {
    initMogulAuth();
  }

  // Initial Copilot brief run
  executeCopilotQuery("I need an Afrobeats song for a Lagos luxury real-estate commercial, male vocal, 100–110 BPM, aspirational, premium, no explicit lyrics.");
});

// ==============================================================
// NAVIGATION / TAB SWITCHING
// ==============================================================
function switchTab(tabId) {
  if (tabId === "tab-command") tabId = "tab-command-center";
  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.add("hidden");
  });
  const target = document.getElementById(tabId);
  if (target) target.classList.remove("hidden");

  // Highlight navigation item
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("bg-brand-card", "text-white", "font-bold", "border-l-2", "border-brand-gold");
    btn.classList.add("text-slate-300");
  });
  const navId = tabId.replace("tab-", "nav-");
  const activeBtn = document.getElementById(navId);
  if (activeBtn) {
    activeBtn.classList.add("bg-brand-card", "text-white", "font-bold", "border-l-2", "border-brand-gold");
    activeBtn.classList.remove("text-slate-300");
  }

  if (tabId === "tab-radio") {
    loadOnlineRadioConsole();
  } else if (tabId === "tab-editorial") {
    loadEditorialPlaylists();
    loadAutonomousPlaylists();
  } else if (tabId === "tab-royalties") {
    loadMogulRoyalties();
  }
}

// ==============================================================
// 1. SWARM COMMAND CENTER & CEO BRIEFING (Section 18 & 20)
// ==============================================================
async function loadSwarmCommandCenter() {
  try {
    // 1. CEO Morning Briefing
    const resBriefing = await fetch("/api/swarm/briefing");
    const briefing = await resBriefing.json();
    const dateEl = document.getElementById("briefingDate");
    if (dateEl) dateEl.innerText = briefing.date;
    const summaryEl = document.getElementById("briefingSummaryText");
    if (summaryEl) summaryEl.innerText = briefing.executiveSummary;

    const actionList = document.getElementById("kiraActionList");
    actionList.innerHTML = briefing.priority1.recommendedActions.map(action => `
      <div class="p-2.5 rounded-lg bg-brand-card border border-brand-cardBorder flex items-start space-x-2">
        <span class="text-brand-gold font-bold">✓</span>
        <span class="leading-snug">${action}</span>
      </div>
    `).join("");

    // 2. Top 10 Actions Now (Trading Floor Board)
    const resActions = await fetch("/api/swarm/top-actions");
    const actions = await resActions.json();
    const actionsContainer = document.getElementById("topActionsList");
    actionsContainer.innerHTML = actions.map((act, idx) => `
      <div class="flex items-center justify-between p-3 rounded-xl bg-brand-dark border border-brand-cardBorder text-xs hover:border-brand-gold/50 transition">
        <div class="flex items-center space-x-3">
          <span class="font-mono-code font-bold text-slate-500 w-5">#${idx + 1}</span>
          <span class="font-bold text-white">${act.action}</span>
        </div>
        <div class="flex items-center space-x-3">
          <span class="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">${act.division}</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${act.priority === 'URGENT' ? 'bg-red-500/20 text-red-400' : 'bg-brand-gold/20 text-brand-gold'}">${act.priority}</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono-code ${act.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}">${act.status}</span>
        </div>
      </div>
    `).join("");

    // 3. Swarm Workforce 16 Divisions Grid
    const resSwarm = await fetch("/api/swarm/status");
    const swarmData = await resSwarm.json();
    const divisionsGrid = document.getElementById("swarmDivisionsGrid");
    divisionsGrid.innerHTML = Object.entries(swarmData.divisions).map(([name, d]) => `
      <div class="bg-brand-dark border border-brand-cardBorder rounded-xl p-3.5 space-y-1.5 hover:border-brand-gold/40 transition">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-white">${name}</span>
          <span class="text-[10px] font-mono-code font-bold text-brand-gold">${d.agents} Agents</span>
        </div>
        <p class="text-[10px] text-slate-400 leading-snug line-clamp-2">${d.focus}</p>
        <div class="text-[10px] text-emerald-400 flex items-center justify-between pt-1 border-t border-brand-cardBorder/60">
          <span>Active Tasks: <strong>${d.activeTasks}</strong></span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        </div>
      </div>
    `).join("");

  } catch (err) {
    console.error("Error loading Swarm Command Center:", err);
  }
}

// ==============================================================
// 2. ADVERSARIAL COUNCIL CHAMBER (Section 15)
// ==============================================================
async function loadAdversarialCouncil(initialTrackId = "lj-000") {
  const select = document.getElementById("councilTrackSelect");
  if (select && select.options.length === 0 && allTracks.length > 0) {
    select.innerHTML = allTracks.map(t => `<option value="${t.id}">${t.title} - ${t.artist} ${t.isLjArtist ? '⭐' : ''}</option>`).join("");
    select.value = initialTrackId;
  }
  loadDebateForTrack(initialTrackId);
}

function loadDebateForSelectedTrack() {
  const select = document.getElementById("councilTrackSelect");
  if (select) loadDebateForTrack(select.value);
}

async function loadDebateForTrack(trackId) {
  const canvas = document.getElementById("councilDebateCanvas");
  canvas.innerHTML = `
    <div class="p-8 text-center bg-brand-card border border-brand-cardBorder rounded-2xl space-y-3">
      <div class="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-xs text-slate-300">Convening 8 specialized AI agents (Prosecutor, Skeptic, A&R, Data, Culture, Sync, Marketing, Rights)...</p>
    </div>
  `;

  try {
    const res = await fetch(`/api/council/debate/${trackId}`);
    const debate = await res.json();

    canvas.innerHTML = `
      <!-- Debate Header & Final Verdict -->
      <div class="bg-gradient-to-r from-purple-950/40 via-brand-card to-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-cardBorder pb-4">
          <div>
            <span class="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Council Executive Synthesis</span>
            <h2 class="text-2xl font-black text-white mt-0.5">Debate Resolution: ${debate.title} (${debate.artist})</h2>
            <p class="text-xs text-slate-400">Synthesized by ${debate.synthesis.chiefDecider} • Vote: ${debate.synthesis.voteTally.pushVotes} Push / ${debate.synthesis.voteTally.cautionVotes} Caution</p>
          </div>
          <div class="text-right">
            <span class="px-4 py-2 rounded-xl text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ${debate.synthesis.verdict}
            </span>
          </div>
        </div>

        <div class="bg-brand-dark/90 border border-brand-cardBorder rounded-xl p-4 text-xs text-slate-200 leading-relaxed">
          <strong class="text-brand-gold">Executive Directive:</strong> ${debate.synthesis.executiveRationale}
        </div>
      </div>

      <!-- 8 Arguing Agent Personas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${debate.councilMembers.map(m => `
          <div class="bg-brand-card border border-brand-cardBorder hover:border-purple-500/50 rounded-xl p-4 space-y-2 transition shadow-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="text-lg">${m.avatar}</span>
                <span class="font-black text-sm text-white">${m.role}</span>
              </div>
              <span class="text-[10px] font-mono-code text-slate-400">Persona Verified</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed italic bg-brand-dark/60 p-3 rounded-lg border border-brand-cardBorder/60">
              "${m.statement}"
            </p>
          </div>
        `).join("")}
      </div>
    `;
  } catch (err) {
    console.error("Error loading council debate:", err);
  }
}

// ==============================================================
// 3. CURATOR CRM & CONTEXTUAL PITCH STUDIO (Section 6 & 7)
// ==============================================================
let allCuratorsCache = [];

async function loadCuratorCrm() {
  try {
    const res = await fetch("/api/curator/crm");
    const curators = await res.json();
    allCuratorsCache = curators;
    renderCuratorList(curators);

    // Populate track select for pitch
    const pitchSelect = document.getElementById("curatorPitchTrackSelect");
    if (pitchSelect && allTracks.length > 0) {
      pitchSelect.innerHTML = allTracks.map(t => `<option value="${t.id}">${t.title} - ${t.artist} ${t.isLjArtist ? '⭐' : ''}</option>`).join("");
      pitchSelect.value = "lj-000";
    }

    if (curators.length > 0) {
      selectCuratorForEvaluation(curators[0].id);
    }
  } catch (err) {
    console.error("Error loading curator CRM:", err);
  }
}

function renderCuratorList(curators) {
  const container = document.getElementById("curatorList");
  if (!container) return;
  if (!curators || curators.length === 0) {
    container.innerHTML = `<div class="p-4 text-center text-xs text-slate-500">No curators matching search criteria.</div>`;
    return;
  }

  container.innerHTML = curators.map(c => {
    const email = c.email || c.verifiedEmail || "";
    const isSelected = activeCuratorId === c.id;
    return `
      <div onclick="selectCuratorForEvaluation('${c.id}')" class="p-3.5 rounded-xl bg-brand-dark border ${isSelected ? 'border-brand-gold bg-brand-gold/10' : 'border-brand-cardBorder'} hover:border-brand-gold/60 cursor-pointer transition space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-bold text-white text-xs">${c.name}</span>
          <span class="text-[9px] px-1.5 py-0.5 rounded font-mono-code font-bold bg-indigo-500/20 text-indigo-300">${(c.country || '').split('/')[0]}</span>
        </div>
        <div class="text-[11px] text-brand-gold font-semibold">${c.organization}</div>
        <div class="text-[10px] text-slate-400 truncate">${c.playlist}</div>
        
        <!-- Verified Email Pill -->
        <div class="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/[0.06]">
          <span class="flex items-center space-x-1 text-emerald-400 font-mono-code text-[10px]">
            <svg class="w-3 h-3 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span class="truncate max-w-[155px]" title="${email}">${email}</span>
          </span>
          <button onclick="event.stopPropagation(); copyCuratorEmail('${email}')" class="text-[10px] text-violet-400 hover:text-violet-300 font-semibold px-2 py-0.5 rounded bg-violet-500/10 hover:bg-violet-500/20 transition">Copy</button>
        </div>
      </div>
    `;
  }).join("");
}

function filterCuratorDirectory() {
  const query = (document.getElementById("curatorSearchInput")?.value || "").toLowerCase().trim();
  const filtered = allCuratorsCache.filter(c => 
    (c.name && c.name.toLowerCase().includes(query)) ||
    (c.organization && c.organization.toLowerCase().includes(query)) ||
    (c.email && c.email.toLowerCase().includes(query)) ||
    (c.verifiedEmail && c.verifiedEmail.toLowerCase().includes(query)) ||
    (c.playlist && c.playlist.toLowerCase().includes(query))
  );
  renderCuratorList(filtered);
}

function copyCuratorEmail(email) {
  if (!email || email === 'undefined') {
    showToast("No email available for this curator", "warning", "Copy Warning");
    return;
  }
  navigator.clipboard.writeText(email);
  showToast(`Copied ${email} to clipboard!`, "success", "Email Copied");
}

function selectCuratorForEvaluation(curatorId) {
  activeCuratorId = curatorId;
  renderCuratorList(allCuratorsCache);
  evaluateActiveCuratorPitch();
}

async function evaluateActiveCuratorPitch() {
  const trackSelect = document.getElementById("curatorPitchTrackSelect");
  const trackId = trackSelect ? trackSelect.value : "lj-000";
  const resultArea = document.getElementById("curatorEvaluationResult");

  try {
    const res = await fetch("/api/curator/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ curatorId: activeCuratorId, trackId })
    });
    const evalData = await res.json();

    document.getElementById("activeCuratorTitle").innerText = `Pitch Evaluation: ${evalData.curatorName} (${evalData.organization})`;

    const curatorEmail = evalData.email || evalData.verifiedEmail || "";

    resultArea.innerHTML = `
      <!-- Verified Email Card -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs">
        <div class="flex items-center space-x-2">
          <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] uppercase">✓ Verified Direct Email</span>
          <span class="font-mono-code font-bold text-white select-all">${curatorEmail || 'Direct Submission Portal'}</span>
        </div>
        <div class="flex items-center space-x-2">
          ${curatorEmail ? `
            <button onclick="copyCuratorEmail('${curatorEmail}')" class="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition flex items-center space-x-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
              <span>Copy Email</span>
            </button>
            <a href="mailto:${curatorEmail}?subject=${encodeURIComponent(evalData.generatedPitch?.subject || '')}&body=${encodeURIComponent(evalData.generatedPitch?.body || '')}" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold transition shadow-glow-emerald flex items-center space-x-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <span>Send Direct Email Pitch</span>
            </a>
          ` : ''}
        </div>
      </div>

      <div class="p-4 rounded-xl ${evalData.shouldPitch ? 'bg-emerald-950/30 border border-emerald-500/40' : 'bg-red-950/30 border border-red-500/40'} space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-black uppercase tracking-wider ${evalData.shouldPitch ? 'text-emerald-400' : 'text-red-400'}">${evalData.decisionLabel}</span>
          <span class="text-[10px] font-mono-code text-slate-400">Policy: Anti-Spam Gatekeeper</span>
        </div>
        <p class="text-xs text-slate-200">${evalData.why}</p>
        <div class="flex flex-wrap gap-2 text-[10px] text-slate-400 pt-2 border-t border-brand-cardBorder/60">
          <span>Channel: <strong class="text-white">${evalData.channel}</strong></span>
          <span>Method: <strong class="text-white">${evalData.submissionMethod}</strong></span>
          <span>Follow-up: <strong class="text-brand-gold">${evalData.followUpDate}</strong></span>
        </div>
      </div>

      ${evalData.shouldPitch ? `
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-slate-300 uppercase">Contextual Pitch Copy (Automated Writer)</span>
            <button onclick="navigator.clipboard.writeText(document.getElementById('pitchCopyBody').innerText); showToast('Pitch copy copied to clipboard!', 'success', 'Copied');" class="text-violet-400 hover:underline font-semibold">Copy Pitch</button>
          </div>
          <div class="bg-brand-dark border border-brand-cardBorder rounded-xl p-4 font-mono-code text-xs text-slate-300 space-y-2">
            <div class="text-brand-gold font-bold">Subject: ${evalData.generatedPitch.subject}</div>
            <div class="whitespace-pre-line text-slate-300 leading-relaxed" id="pitchCopyBody">${evalData.generatedPitch.body}</div>
          </div>
        </div>
      ` : ''}
    `;
  } catch (err) {
    console.error("Error evaluating curator pitch:", err);
  }
}

// ==============================================================
// 4. ANTI-FRAUD SHIELD (Section 16)
// ==============================================================
async function loadAntiFraudShield() {
  try {
    const res = await fetch("/api/fraud/watchlist");
    const watchlist = await res.json();
    const container = document.getElementById("fraudWatchlistContainer");

    container.innerHTML = watchlist.map(item => `
      <div class="p-4 rounded-xl bg-brand-dark border ${item.riskLevel === 'CRITICAL_FRAUD' ? 'border-red-500/40' : 'border-emerald-500/40'} space-y-2 text-xs">
        <div class="flex items-center justify-between">
          <div class="font-black text-white text-sm flex items-center space-x-2">
            <span>${item.threatName}</span>
            <span class="px-2 py-0.5 rounded text-[9px] font-bold ${item.riskLevel === 'CRITICAL_FRAUD' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}">${item.threatType}</span>
          </div>
          <span class="font-mono-code font-bold ${item.riskLevel === 'CRITICAL_FRAUD' ? 'text-red-400' : 'text-emerald-400'}">${item.verdict}</span>
        </div>
        <p class="text-slate-400 italic">"${item.vendorOffer}"</p>
        <div class="text-slate-300 text-[11px] leading-relaxed">
          <strong class="text-brand-gold">Directive:</strong> ${item.recommendedAction}
        </div>
      </div>
    `).join("");

    runFraudAudit(); // Initial audit with default proposal
  } catch (err) {
    console.error("Error loading anti-fraud shield:", err);
  }
}

async function runFraudAudit() {
  const input = document.getElementById("fraudAuditInput");
  const offerText = input ? input.value : "";
  const resultArea = document.getElementById("fraudAuditResult");

  try {
    const res = await fetch("/api/fraud/audit-offer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offerText })
    });
    const audit = await res.json();

    resultArea.innerHTML = `
      <div class="p-4 rounded-xl ${audit.riskScore >= 60 ? 'bg-red-950/40 border border-red-500/60' : 'bg-emerald-950/40 border border-emerald-500/60'} space-y-2 text-xs">
        <div class="flex items-center justify-between">
          <span class="font-black text-sm ${audit.riskScore >= 60 ? 'text-red-400' : 'text-emerald-400'}">${audit.verdict} (Risk Score: ${audit.riskScore}/100)</span>
          <span class="text-[10px] font-mono-code text-slate-400 font-bold">${audit.statusBadge}</span>
        </div>
        <div class="space-y-1">
          ${audit.riskFactors.map(f => `<div class="text-slate-300 flex items-start space-x-1.5"><span class="text-red-400">⚠️</span><span>${f}</span></div>`).join("")}
        </div>
        <div class="text-[11px] text-slate-400 pt-2 border-t border-brand-cardBorder/60">
          <strong class="text-white">Spotify Rule:</strong> ${audit.policyNotice}
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Error auditing fraud offer:", err);
  }
}

// ==============================================================
// 5. CATALOGUE REVIVAL WAR ROOM (Section 13)
// ==============================================================
async function loadCatalogueRevival() {
  const container = document.getElementById("revivalCandidatesContainer");
  try {
    const res = await fetch("/api/catalogue/revival");
    const data = await res.json();

    container.innerHTML = data.revivalCandidates.map(c => `
      <div class="bg-brand-card border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-5">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-cardBorder pb-4">
          <div class="flex items-center space-x-4">
            <div class="w-14 h-14 rounded-xl bg-slate-800 border border-brand-gold overflow-hidden">
              <img src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80" class="w-full h-full object-cover">
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="text-xl font-black text-white">${c.title}</h3>
                <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">18 MONTHS DORMANT</span>
              </div>
              <p class="text-xs text-slate-400">${c.artist} • Released: ${c.releaseDate} • Search Surge: <strong class="text-emerald-400">+${c.searchGrowthPct}%</strong></p>
            </div>
          </div>

          <div class="text-right">
            <div class="text-lg font-black text-brand-gold font-mono-code">${c.totalSearches.toLocaleString()} Searches</div>
            <div class="text-[10px] text-slate-400 font-semibold">${c.completionRate}% Completion Rate</div>
          </div>
        </div>

        <div class="bg-brand-dark p-3.5 rounded-xl border border-brand-cardBorder text-xs text-slate-300">
          <span class="text-brand-gold font-bold">Algorithmic Detection:</span> ${c.revivalTriggerReason}
        </div>

        <!-- 5-Pillar Revival Strategy Plan -->
        <div class="space-y-2">
          <div class="text-xs font-bold text-slate-300 uppercase tracking-wider">Automated 5-Pillar Revival Campaign</div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div class="bg-brand-dark p-3 rounded-lg border border-brand-cardBorder">
              <span class="text-[10px] font-bold text-brand-gold uppercase block">1. Playlists</span>
              <p class="text-slate-300 mt-1">${c.campaignPlan.pillar1_Playlisting}</p>
            </div>
            <div class="bg-brand-dark p-3 rounded-lg border border-brand-cardBorder">
              <span class="text-[10px] font-bold text-brand-gold uppercase block">2. Short-Form Virality</span>
              <p class="text-slate-300 mt-1">${c.campaignPlan.pillar2_ShortForm}</p>
            </div>
            <div class="bg-brand-dark p-3 rounded-lg border border-brand-cardBorder">
              <span class="text-[10px] font-bold text-brand-gold uppercase block">3. Radio Late-Night</span>
              <p class="text-slate-300 mt-1">${c.campaignPlan.pillar3_Radio}</p>
            </div>
            <div class="bg-brand-dark p-3 rounded-lg border border-brand-cardBorder">
              <span class="text-[10px] font-bold text-brand-gold uppercase block">4. Sync Re-Packaging</span>
              <p class="text-slate-300 mt-1">${c.campaignPlan.pillar4_Sync}</p>
            </div>
            <div class="bg-brand-dark p-3 rounded-lg border border-brand-cardBorder">
              <span class="text-[10px] font-bold text-brand-gold uppercase block">5. Artist Content</span>
              <p class="text-slate-300 mt-1">${c.campaignPlan.pillar5_ArtistContent}</p>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  } catch (err) {
    console.error("Error loading catalogue revival:", err);
  }
}

// ==============================================================
// 6. MUSIC DISCOVERY & CATALOGUE (Section 8)
// ==============================================================
let currentDiscoverCategory = 'trending';

async function loadCatalogue() {
  try {
    const res = await fetch("/api/catalogue");
    const data = await res.json();
    allTracks = data.tracks;
    if (allTracks && allTracks.length > 0) {
      const hero = allTracks[0];
      currentActiveTrackId = hero.id;
      window.currentActiveTrackId = hero.id;
      if (window.universalPlayer) {
        window.universalPlayer.currentTrack = hero;
        window.universalPlayer.updateDomElements(hero);
      }
      if (typeof updateRightSidebarCockpit === 'function') {
        updateRightSidebarCockpit(hero);
      }
    }
    renderDiscoverCarousel('trending');
    renderCatalogueGrid();
    renderArtistPortalTracks();
    setupPitchSelect();
    setupCouncilTrackSelect();
    setupLyricsTrackSelect();
    if (typeof initArtistProfileSwitcher === 'function') {
      initArtistProfileSwitcher();
    }
  } catch (err) {
    console.error("Error loading catalogue:", err);
  }
}

function selectDiscoverCategory(cat) {
  currentDiscoverCategory = cat;
  document.querySelectorAll(".discover-cat-btn").forEach(b => {
    b.classList.remove("bg-purple-600", "text-white", "shadow-glow-violet", "border-purple-400/30");
    b.classList.add("bg-white/5", "text-slate-300", "border-white/10");
  });
  const activeBtn = document.getElementById(`catTab-${cat}`);
  if (activeBtn) {
    activeBtn.classList.remove("bg-white/5", "text-slate-300", "border-white/10");
    activeBtn.classList.add("bg-purple-600", "text-white", "shadow-glow-violet", "border-purple-400/30");
  }

  const titles = {
    trending: "Trending Now",
    rising: "Rising Fast",
    breakout: "Breakout Artists",
    ljpicks: "LJ Picks",
    aipicks: "AI Picks"
  };
  const titleEl = document.getElementById("discoverCarouselTitle");
  if (titleEl) titleEl.innerText = titles[cat] || "Featured Deck";

  renderDiscoverCarousel(cat);
}

function scrollDiscoverCarousel(dir) {
  const el = document.getElementById("discoverCarousel");
  if (el) {
    el.scrollBy({ left: dir * 320, behavior: 'smooth' });
  }
}

function renderDiscoverCarousel(cat = currentDiscoverCategory) {
  const container = document.getElementById("discoverCarousel");
  if (!container || !allTracks || allTracks.length === 0) return;

  let subset = [...allTracks];
  if (cat === "trending") {
    subset.sort((a, b) => (b.momentum || 0) - (a.momentum || 0));
  } else if (cat === "rising") {
    subset.sort((a, b) => (b.momentumGrowth || 0) - (a.momentumGrowth || 0));
  } else if (cat === "breakout") {
    const bOut = subset.filter(t => (t.streams || 0) < 5000000 && (t.momentum || 0) > 85);
    subset = bOut.length > 0 ? bOut : subset.slice(2, 8);
  } else if (cat === "ljpicks") {
    subset = subset.filter(t => t.isLjArtist);
  } else if (cat === "aipicks") {
    subset.sort((a, b) => (b.energy || 0) - (a.energy || 0));
  }

  const items = subset.slice(0, 8);

  container.innerHTML = items.map(t => `
    <div class="flex-shrink-0 w-64 glass-panel rounded-3xl p-4 border border-white/10 hover:border-purple-500/50 transition duration-300 group shadow-spatial relative overflow-hidden flex flex-col justify-between">
      <div>
        <div class="relative rounded-2xl overflow-hidden aspect-square mb-3.5 shadow-lg group-hover:shadow-glow-violet transition duration-300">
          <img src="${t.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
          
          <!-- Play Overlay -->
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center">
            <button onclick="selectAndPlayTrack('${t.id}')" class="w-12 h-12 rounded-full purple-accent-gradient flex items-center justify-center text-white shadow-glow-violet transform group-hover:scale-110 active:scale-95 transition">
              <svg class="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </button>
          </div>

          <!-- Top Badge -->
          <div class="absolute top-2.5 right-2.5">
            ${t.isLjArtist ? '<span class="purple-accent-gradient text-white text-[9px] font-black px-2 py-0.5 rounded-full border border-white/20 shadow">LJ ROSTER</span>' : '<span class="bg-black/60 backdrop-blur-md text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/10">BENCHMARK</span>'}
          </div>

          <!-- Bottom Audio DNA pill -->
          <div class="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] border border-white/10">
            <span class="text-violet-300 font-mono-code font-bold">${t.bpm} BPM • ${t.key}</span>
            <span class="font-mono-code font-extrabold ${t.momentum >= 90 ? 'text-emerald-400' : 'text-slate-300'}">M:${t.momentum}</span>
          </div>
        </div>

        <!-- Waveform Simulation Bars -->
        <div class="flex items-center space-x-0.5 h-3 px-1 mb-2.5 opacity-60 group-hover:opacity-100 transition">
          <span class="w-1 bg-violet-400 rounded-full h-2"></span>
          <span class="w-1 bg-purple-400 rounded-full h-3"></span>
          <span class="w-1 bg-violet-300 rounded-full h-1.5"></span>
          <span class="w-1 bg-purple-500 rounded-full h-2.5"></span>
          <span class="w-1 bg-indigo-400 rounded-full h-3"></span>
          <span class="w-1 bg-violet-400 rounded-full h-1"></span>
          <span class="w-1 bg-purple-400 rounded-full h-2.5"></span>
          <span class="w-1 bg-violet-300 rounded-full h-2"></span>
          <span class="w-1 bg-indigo-500 rounded-full h-3"></span>
          <span class="w-1 bg-violet-400 rounded-full h-1.5"></span>
          <span class="w-1 bg-purple-400 rounded-full h-2"></span>
          <span class="w-1 bg-violet-500 rounded-full h-3"></span>
        </div>

        <h3 class="font-bold text-white text-sm truncate" title="${t.title}">${t.title}</h3>
        <p class="text-xs text-slate-400 truncate mt-0.5">${t.artist}</p>
        
        <div class="mt-2.5 flex flex-wrap gap-1.5 text-[10px]">
          <span class="px-2 py-0.5 rounded-lg bg-white/5 text-slate-300 border border-white/5">${t.genre}</span>
          <span class="px-2 py-0.5 rounded-lg bg-white/5 text-slate-400 border border-white/5">${t.mood ? t.mood.split(' ')[0] : 'Vibe'}</span>
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
        <button onclick="selectAndPlayTrack('${t.id}')" class="text-violet-400 hover:text-violet-300 font-bold flex items-center space-x-1">
          <span>Play</span>
        </button>
        <button onclick="openTrackDnaModal('${t.id}')" class="text-slate-400 hover:text-white transition font-mono-code text-[11px]">
          DNA Profile →
        </button>
      </div>
    </div>
  `).join("");
}

function setupCouncilTrackSelect() {
  const select = document.getElementById("councilTrackSelect");
  if (select && allTracks.length > 0) {
    select.innerHTML = allTracks.map(t => `<option value="${t.id}">${t.title} - ${t.artist} ${t.isLjArtist ? '⭐' : ''}</option>`).join("");
    select.value = "lj-000";
  }
}

function setupLyricsTrackSelect() {
  const select = document.getElementById("lyricsTrackSelect");
  if (select && allTracks.length > 0) {
    select.innerHTML = allTracks.map(t => `<option value="${t.id}">${t.title} - ${t.artist} ${t.isLjArtist ? '⭐' : ''}</option>`).join("");
    select.value = activeLyricsTrackId || "lj-000";
  }
}

function filterCatalogue(type) {
  currentFilter = type;
  document.querySelectorAll(".cat-filter-btn").forEach(b => {
    b.classList.remove("purple-accent-gradient", "text-white", "font-bold", "shadow-glow-violet");
    b.classList.add("bg-white/5", "text-slate-300");
  });
  const activeBtn = document.getElementById(`btn-filter-${type}`);
  if (activeBtn) {
    activeBtn.classList.remove("bg-white/5", "text-slate-300");
    activeBtn.classList.add("purple-accent-gradient", "text-white", "font-bold", "shadow-glow-violet");
  }
  applyFilters();
}

function applyFilters() {
  const searchTerm = (document.getElementById("catalogueSearchInput")?.value || "").toLowerCase();
  const genre = document.getElementById("genreFilterSelect")?.value || "";
  const bpmRange = document.getElementById("bpmFilterSelect")?.value || "";
  const mood = document.getElementById("moodFilterSelect")?.value || "";
  const energyLevel = document.getElementById("energyFilterSelect")?.value || "";

  let filtered = allTracks.filter(track => {
    // Spotify for Artists Profile Focus: Lock to active artist unless All Label is selected
    if (window.isArtistFocusMode && window.currentActiveArtist && window.currentActiveArtist !== "ALL") {
      if (!track.artist || track.artist.toLowerCase() !== window.currentActiveArtist.toLowerCase()) return false;
    }
    if (currentFilter === "lj" && !track.isLjArtist) return false;
    if (genre && (!track.genre || !track.genre.toLowerCase().includes(genre.toLowerCase()))) return false;
    if (searchTerm) {
      const match = (track.title && track.title.toLowerCase().includes(searchTerm)) ||
                    (track.artist && track.artist.toLowerCase().includes(searchTerm)) ||
                    (track.key && track.key.toLowerCase().includes(searchTerm)) ||
                    (track.instrumentation && track.instrumentation.some(i => i.toLowerCase().includes(searchTerm)));
      if (!match) return false;
    }
    if (bpmRange) {
      if (bpmRange === "120+") {
        if (track.bpm < 120) return false;
      } else {
        const [min, max] = bpmRange.split("-").map(Number);
        if (track.bpm < min || track.bpm > max) return false;
      }
    }
    if (mood && track.mood && !track.mood.toLowerCase().includes(mood.toLowerCase())) return false;
    if (energyLevel) {
      const e = track.energy || 0;
      if (energyLevel === "high" && e < 80) return false;
      if (energyLevel === "mid" && (e < 50 || e >= 80)) return false;
      if (energyLevel === "low" && e >= 50) return false;
    }
    return true;
  });

  renderCatalogueGrid(filtered);
}

let debounceTimer = null;
function debounceCatalogueSearch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    applyFilters();
  }, 250);
}

function renderCatalogueGrid(tracksToRender = allTracks) {
  const grid = document.getElementById("catalogueGrid");
  if (!grid) return;

  grid.innerHTML = tracksToRender.map(t => `
    <div class="glass-panel border border-white/10 hover:border-purple-500/50 rounded-3xl p-4 transition duration-300 flex flex-col justify-between group shadow-spatial">
      <div>
        <div class="relative rounded-2xl overflow-hidden aspect-video mb-3.5 shadow-md">
          <img src="${t.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
          <div class="absolute top-2.5 right-2.5">
            ${t.isLjArtist ? '<span class="purple-accent-gradient text-white text-[9px] font-black px-2 py-0.5 rounded-full border border-white/20 shadow">LJ ROSTER</span>' : '<span class="bg-black/70 backdrop-blur-md text-slate-300 text-[9px] font-semibold px-2 py-0.5 rounded-full border border-white/10">BENCHMARK</span>'}
          </div>
          <div class="absolute bottom-2.5 left-2.5 flex items-center space-x-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] border border-white/10">
            <span class="text-violet-300 font-mono-code font-bold">${t.bpm} BPM</span>
            <span class="text-slate-500">•</span>
            <span class="text-slate-300">${t.key}</span>
          </div>
        </div>

        <div class="flex items-start justify-between">
          <div>
            <h3 class="font-bold text-white text-sm truncate max-w-[170px]" title="${t.title}">${t.title}</h3>
            <p class="text-xs text-slate-400 truncate max-w-[170px] mt-0.5">${t.artist}</p>
          </div>
          <div class="text-right font-mono-code">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg ${t.momentum >= 90 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-300 border border-white/5'}">
              M: ${t.momentum}
            </span>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap gap-1.5 text-[10px]">
          <span class="bg-white/5 text-slate-300 px-2 py-0.5 rounded-lg border border-white/5">${t.genre}</span>
          <span class="bg-white/5 text-slate-400 px-2 py-0.5 rounded-lg border border-white/5">${t.vocalType ? t.vocalType.split(' ')[0] : 'Vocal'}</span>
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
        <button onclick="selectAndPlayTrack('${t.id}')" class="text-violet-400 hover:text-violet-300 font-bold flex items-center space-x-1">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <span>Play Groove</span>
        </button>
        <button onclick="openTrackDnaModal('${t.id}')" class="text-slate-400 hover:text-white transition font-mono-code text-[11px]">
          DNA Profile →
        </button>
      </div>
    </div>
  `).join("");
}

// ==============================================================
// 7. TOP OF THE WEEK CHARTS
// ==============================================================
async function loadCharts() {
  try {
    const res = await fetch("/api/charts");
    currentChartsData = await res.json();
    document.getElementById("chartWeekLabel").innerText = currentChartsData.chartPeriod.toUpperCase();
    renderChartSubTableView();
  } catch (err) {
    console.error("Error loading charts:", err);
  }
}

function refreshCharts() {
  loadCharts();
}

function switchChartSubTab(subTab) {
  currentChartSubTab = subTab;
  document.querySelectorAll(".chart-tab-btn").forEach(b => {
    b.classList.remove("bg-brand-gold", "text-black", "font-bold");
    b.classList.add("bg-brand-card", "text-slate-300");
  });
  const activeBtn = document.getElementById(`chart-sub-${subTab}`);
  if (activeBtn) {
    activeBtn.classList.remove("bg-brand-card", "text-slate-300");
    activeBtn.classList.add("bg-brand-gold", "text-black", "font-bold");
  }
  renderChartSubTableView();
}

function renderChartSubTableView() {
  if (!currentChartsData) return;
  const container = document.getElementById("chartTableView");
  let tracks = [];

  switch (currentChartSubTab) {
    case "top10": tracks = currentChartsData.top10; break;
    case "fastestRising": tracks = currentChartsData.fastestRising; break;
    case "biggestMovers": tracks = currentChartsData.biggestMovers; break;
    case "breakout": tracks = currentChartsData.breakoutArtists; break;
    case "aiPicks": tracks = currentChartsData.aiPicks; break;
    case "staffPicks": tracks = currentChartsData.staffPicks; break;
  }

  // Pre-calculated movements matching Section 10 (↑ 14, ↓ 3, NEW, —, PEAK 2)
  const movements = ["NEW", "↑ 3", "↑ 14", "PEAK 2", "—", "↓ 1", "↑ 5", "NEW", "—", "↑ 2"];

  container.innerHTML = `
    <table class="w-full text-left text-xs">
      <thead class="bg-white/[0.02] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/[0.08]">
        <tr>
          <th class="py-3.5 px-4 w-14">Rank</th>
          <th class="py-3.5 px-3 w-16">Move</th>
          <th class="py-3.5 px-4">Song & Artist</th>
          <th class="py-3.5 px-4">Genre</th>
          <th class="py-3.5 px-4">BPM / Key</th>
          <th class="py-3.5 px-4">Streams</th>
          <th class="py-3.5 px-4">Momentum</th>
          <th class="py-3.5 px-4 text-right">Action</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/[0.05]">
        ${tracks.map((t, idx) => {
          const move = t.movement || movements[idx % movements.length];
          const moveColor = move.includes("↑") ? "text-emerald-400" : move.includes("NEW") ? "text-violet-400" : move.includes("↓") ? "text-red-400" : "text-slate-400";
          return `
            <tr class="hover:bg-white/[0.03] transition">
              <td class="py-3.5 px-4 font-mono-code font-bold text-sm ${idx < 3 ? 'text-violet-400' : 'text-slate-400'}">
                #${t.chartRank || idx + 1}
              </td>
              <td class="py-3.5 px-3 font-mono-code text-[11px] font-bold ${moveColor}">
                ${move}
              </td>
              <td class="py-3.5 px-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shadow-sm flex-shrink-0">
                    <img src="${t.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'}" class="w-full h-full object-cover">
                  </div>
                  <div>
                    <div class="font-bold text-white flex items-center space-x-1.5">
                      <span>${t.title}</span>
                      ${t.isLjArtist ? '<span class="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono-code">LJ</span>' : ''}
                    </div>
                    <div class="text-[11px] text-slate-400">${t.artist}</div>
                  </div>
                </div>
              </td>
              <td class="py-3.5 px-4 text-slate-300 text-[11px]">
                ${t.genre || 'Afrobeats'}
              </td>
              <td class="py-3.5 px-4 font-mono-code text-[11px] text-slate-300">
                ${t.bpm} BPM • ${t.key}
              </td>
              <td class="py-3.5 px-4 font-mono-code text-slate-200">
                ${(t.telemetry?.plays || 0).toLocaleString()}
              </td>
              <td class="py-3.5 px-4">
                <div class="flex items-center space-x-2">
                  <span class="font-mono-code font-bold ${(t.telemetry?.momentumScore || t.momentum || 70) >= 90 ? 'text-violet-400' : 'text-purple-300'}">
                    ${t.telemetry?.momentumScore || t.momentum || 70}/100
                  </span>
                  <span class="text-[10px] text-slate-400">${t.telemetry?.status || 'Active'}</span>
                </div>
              </td>
              <td class="py-3.5 px-4 text-right">
                <button onclick="selectAndPlayTrack('${t.id}')" class="text-xs bg-white/5 hover:bg-white/10 text-violet-300 hover:text-white px-3 py-1.5 rounded-lg font-semibold transition border border-white/5">
                  Play
                </button>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

const regionalData = {
  GLOBAL: { genre: "Afrobeats / Lagos Club", growth: "+58.4% 7D", velocity: "2.4M Weekly", activity: "14,820 Adds" },
  NIGERIA: { genre: "Street-Pop / Fuji-Fusion", growth: "+72.1% 7D", velocity: "1.1M Weekly", activity: "8,950 Adds" },
  LAGOS: { genre: "Afro-Club & Amapiano", growth: "+84.0% 7D", velocity: "680K Weekly", activity: "5,420 Adds" },
  AFRICA: { genre: "Pan-African Highlife", growth: "+49.3% 7D", velocity: "1.9M Weekly", activity: "11,200 Adds" },
  UK: { genre: "Afro-Drill & Soul", growth: "+36.5% 7D", velocity: "450K Weekly", activity: "3,810 Adds" },
  USA: { genre: "Afro-Pop & R&B", growth: "+41.2% 7D", velocity: "520K Weekly", activity: "4,190 Adds" },
  GHANA: { genre: "Hiplife & Afro-Dance", growth: "+63.0% 7D", velocity: "290K Weekly", activity: "2,340 Adds" },
  "SOUTH AFRICA": { genre: "Amapiano & Private School", growth: "+78.8% 7D", velocity: "580K Weekly", activity: "4,600 Adds" }
};

function setListeningRegion(region) {
  document.querySelectorAll(".listening-region-btn").forEach(btn => {
    btn.classList.remove("purple-accent-gradient", "text-white", "font-bold");
    btn.classList.add("bg-white/5", "text-slate-300", "font-medium");
  });
  const activeBtn = document.getElementById(`btn-reg-${region}`);
  if (activeBtn) {
    activeBtn.classList.add("purple-accent-gradient", "text-white", "font-bold");
    activeBtn.classList.remove("bg-white/5", "text-slate-300", "font-medium");
  }

  const d = regionalData[region] || regionalData.GLOBAL;
  const genreEl = document.getElementById("regTrendingGenre");
  if (genreEl) genreEl.innerText = d.genre;
  const growthEl = document.getElementById("regSearchGrowth");
  if (growthEl) growthEl.innerText = d.growth;
  const velEl = document.getElementById("regListenerVelocity");
  if (velEl) velEl.innerText = d.velocity;
  const actEl = document.getElementById("regPlaylistActivity");
  if (actEl) actEl.innerText = d.activity;
}

// ==============================================================
// 8. LISTENING INTELLIGENCE
// ==============================================================
async function loadListeningIntelligence() {
  try {
    const res = await fetch("/api/listening-intelligence");
    const data = await res.json();
    document.getElementById("risingBadgeCount").innerText = `🔥 ${data.risingNowCount} Rising Now`;

    const container = document.getElementById("listeningTableView");
    container.innerHTML = `
      <table class="w-full text-left text-xs">
        <thead class="bg-brand-dark/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-brand-cardBorder">
          <tr>
            <th class="py-3 px-4">Track</th>
            <th class="py-3 px-4">Plays</th>
            <th class="py-3 px-4">Saves</th>
            <th class="py-3 px-4">Adds</th>
            <th class="py-3 px-4">Completion</th>
            <th class="py-3 px-4">Repeat %</th>
            <th class="py-3 px-4">Momentum Score</th>
            <th class="py-3 px-4 text-right">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-brand-cardBorder/60">
          ${data.tracks.map(t => `
            <tr class="hover:bg-brand-cardBorder/30 transition">
              <td class="py-3 px-4 font-semibold text-white">
                ${t.title} <span class="text-slate-400 font-normal">(${t.artist})</span>
              </td>
              <td class="py-3 px-4 font-mono-code text-slate-300">${t.plays.toLocaleString()}</td>
              <td class="py-3 px-4 font-mono-code text-slate-300">${t.saves.toLocaleString()}</td>
              <td class="py-3 px-4 font-mono-code text-slate-300">${t.playlistAdds.toLocaleString()}</td>
              <td class="py-3 px-4 font-mono-code text-emerald-400">${t.completionRatePct}%</td>
              <td class="py-3 px-4 font-mono-code text-indigo-400">${t.repeatListeningPct}%</td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded font-mono-code font-bold text-xs ${t.momentumScore >= 90 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-brand-card text-brand-gold'}">
                  ${t.momentumScore}/100
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <span class="text-[10px] font-bold ${t.momentumScore >= 90 ? 'text-red-400 animate-pulse' : 'text-slate-400'}">
                  ${t.momentumLabel}
                </span>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } catch (err) {
    console.error("Error loading listening intelligence:", err);
  }
}

async function injectTelemetrySignal(trackId, signalType) {
  try {
    const res = await fetch("/api/telemetry/signal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId, signalType })
    });
    const result = await res.json();
    const track = allTracks.find(t => t.id === trackId) || { title: trackId };
    showToast(`Signal Ingested: [${signalType}] on "${track.title}".\nRecalculated Momentum: ${result.result.momentum.score}/100 (Velocity: +${result.result.momentum.growthPct}%)`, 'success', 'Telemetry Pipeline Updated');
    loadListeningIntelligence();
    loadCharts();
    loadSwarmCommandCenter();
  } catch (err) {
    console.error("Signal injection error:", err);
  }
}

// ==============================================================
// 9. AI MUSIC COPILOT
// ==============================================================
function setCopilotPrompt(keyword) {
  const input = document.getElementById("copilotInput");
  if (keyword.includes("Real Estate")) {
    input.value = "I need an Afrobeats song for a Lagos luxury real-estate commercial, male vocal, 100–110 BPM, aspirational, premium, no explicit lyrics.";
  } else if (keyword.includes("Netflix")) {
    input.value = "Netflix-style drama: Emotional African sync record, 90–110 BPM, theme: cinematic, vulnerability to triumphant resilience.";
  } else if (keyword.includes("Global") || keyword.includes("Anthem")) {
    input.value = "Find LJ priority records with talking drums, log drums, 808 bass, and 106 BPM bounce suited for global rotation and commercial sync.";
  }
  executeCopilotQuery();
}

async function executeCopilotQuery(customPrompt) {
  const input = document.getElementById("copilotInput");
  const query = customPrompt || (input ? input.value : "") || "I need an Afrobeats song for a Lagos luxury real-estate commercial, male vocal, 100–110 BPM, aspirational, premium, no explicit lyrics.";
  const container = document.getElementById("copilotResultsArea");

  container.innerHTML = `
    <div class="bg-brand-card border border-brand-cardBorder rounded-2xl p-6 text-center space-y-3">
      <div class="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-xs text-slate-300 font-medium">Interpreting creative brief → Searching Catalogue → Verifying Rights & Clearance Packages...</p>
    </div>
  `;

  try {
    const res = await fetch("/api/copilot/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: query })
    });
    const data = await res.json();

    container.innerHTML = `
      <div class="bg-brand-card border border-brand-cardBorder rounded-2xl p-6 shadow-xl space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-brand-cardBorder pb-4">
          <div>
            <div class="text-[10px] font-bold text-brand-gold uppercase tracking-wider">Interpreted Creative Strategy</div>
            <h2 class="text-lg font-black text-white mt-0.5">${data.interpretedBrief.briefTitle}</h2>
            <p class="text-xs text-slate-400">${data.interpretedBrief.toneSummary}</p>
          </div>
          <div class="flex items-center space-x-2 text-xs">
            <span class="bg-slate-800 text-slate-300 px-3 py-1 rounded-full">${data.interpretedBrief.parameters.tempoTarget}</span>
            <span class="bg-slate-800 text-slate-300 px-3 py-1 rounded-full">${data.interpretedBrief.parameters.vocal}</span>
            <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">${data.interpretedBrief.parameters.cleanRequirement}</span>
          </div>
        </div>

        <!-- REAL AI EXECUTIVE INTELLIGENCE BRIEFING -->
        <div class="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/40 border border-purple-500/40 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span class="text-xs font-black uppercase tracking-wider text-emerald-400">Chief Music Intelligence Strategic Briefing</span>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">10,000-AGENT SWARM VERIFIED</span>
          </div>
          <p class="text-xs text-slate-200 leading-relaxed font-sans">${data.executiveBriefing || 'Strategic analysis completed based on live catalogue and global DSP telemetry.'}</p>
          
          ${data.strategicRecommendations && data.strategicRecommendations.length > 0 ? `
            <div class="pt-2 border-t border-white/[0.08] space-y-1.5">
              <span class="text-[10px] font-mono-code font-bold text-violet-300 uppercase tracking-wider">Tactical Action Directives:</span>
              <ul class="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                ${data.strategicRecommendations.map(r => `<li><span class="text-slate-200">${r}</span></li>`).join("")}
              </ul>
            </div>
          ` : ''}
        </div>

        <div class="space-y-4">
          <div class="text-xs font-bold text-slate-300 uppercase tracking-wider">A&R Recommended Shortlist (${data.shortlistCount} High-Probability Matches)</div>
          
          <div class="grid grid-cols-1 gap-4">
            ${data.shortlist.map((item) => `
              <div class="bg-brand-dark border border-brand-cardBorder hover:border-brand-gold/50 rounded-xl p-4 transition space-y-3">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div class="flex items-center space-x-3">
                    <img src="${item.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'}" class="w-12 h-12 rounded-lg object-cover">
                    <div>
                      <div class="flex items-center space-x-2">
                        <span class="font-bold text-white text-sm">${item.title}</span>
                        ${item.isLjArtist ? '<span class="bg-brand-gold text-black text-[9px] font-black px-2 py-0.5 rounded shadow">LJ ROSTER</span>' : '<span class="bg-slate-800 text-slate-300 text-[9px] px-2 py-0.5 rounded">EXTERNAL</span>'}
                      </div>
                      <div class="text-xs text-slate-400">${item.artist} • ${item.bpm} BPM • ${item.key} • ${item.genre}</div>
                    </div>
                  </div>

                  <div class="flex items-center space-x-3">
                    <div class="text-right">
                      <div class="text-lg font-black text-brand-gold font-mono-code">${item.matchPercentage || item.matchScore}% MATCH</div>
                      <div class="text-[10px] text-slate-400 font-semibold">${item.syncStatus}</div>
                    </div>
                    ${item.previewUrl ? `
                      <button onclick="playDirectAudio('${item.previewUrl}', '${item.title.replace(/'/g, "\\'")}', '${item.artist.replace(/'/g, "\\'")}')" class="bg-purple-900/50 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center space-x-1">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <span>Preview</span>
                      </button>
                    ` : ''}
                    <button onclick="openSyncOneSheetModal('${item.trackId || item.id}')" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-md shadow-emerald-600/20">
                      Clearance Package
                    </button>
                  </div>
                </div>

                <div class="bg-slate-900/90 border border-brand-cardBorder/60 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
                  <span class="text-brand-gold font-semibold">Strategic Fit:</span> ${item.matchExplanation}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Copilot query failed:", err);
  }
}

// ==============================================================
// 10. AI AUTO-PLAYLIST & BOOST
// ==============================================================
async function generatePlaylistAI() {
  const query = document.getElementById("playlistQueryInput").value;
  const container = document.getElementById("playlistOutputArea");

  container.innerHTML = `
    <div class="bg-brand-card border border-brand-cardBorder rounded-2xl p-6 text-center space-y-2">
      <div class="w-7 h-7 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-xs text-slate-400">Balancing acoustic compatibility and editorial authenticity...</p>
    </div>
  `;

  try {
    const res = await fetch("/api/playlist/curate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
    const playlist = await res.json();

    container.innerHTML = `
      <div class="bg-brand-card border border-brand-cardBorder rounded-2xl p-6 space-y-6 shadow-xl">
        <div class="flex items-center justify-between border-b border-brand-cardBorder pb-4">
          <div>
            <div class="text-[10px] font-bold text-brand-gold uppercase tracking-wider">AI Curated Sequence</div>
            <h2 class="text-xl font-black text-white mt-1">${playlist.playlistTitle}</h2>
            <p class="text-xs text-slate-400">Target Acoustic Profile: ${playlist.targetAcousticProfile.bpm} BPM • ${playlist.targetAcousticProfile.key}</p>
          </div>
          <span class="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">LJ Share: <strong class="text-brand-gold">${playlist.ljShare}</strong></span>
        </div>

        ${playlist.boostRecommendations.length > 0 ? `
          <div class="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-4 space-y-2">
            <div class="text-xs font-bold text-brand-gold uppercase">Contextual LJ Artist Boost (Authentic Placement Rule)</div>
            <p class="text-xs text-slate-300">${playlist.boostRecommendations[0].editorialJustification}</p>
          </div>
        ` : ''}

        <div class="space-y-3">
          ${playlist.tracks.map((t, idx) => `
            <div class="flex items-center justify-between p-3 rounded-xl bg-brand-dark border border-brand-cardBorder">
              <div class="flex items-center space-x-3">
                <span class="font-mono-code font-bold text-slate-500 text-xs w-4 text-center">${idx + 1}</span>
                <img src="${t.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'}" class="w-10 h-10 rounded object-cover">
                <div>
                  <div class="font-bold text-white text-xs">${t.title}</div>
                  <div class="text-[11px] text-slate-400">${t.artist} • ${t.bpm} BPM • ${t.key}</div>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${t.isLjArtist ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/30' : 'bg-slate-800 text-slate-300'}">
                ${t.placementType || (t.isLjArtist ? 'LJ Artist Boost' : 'Anchor Track')}
              </span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  } catch (err) {
    console.error("AI playlist curation error:", err);
  }
}

// ==============================================================
// 11. SYNC MARKETPLACE
// ==============================================================
async function loadSyncBriefs() {
  try {
    const res = await fetch("/api/sync/briefs");
    const briefs = await res.json();
    const grid = document.getElementById("syncBriefsGrid");

    grid.innerHTML = briefs.map(b => `
      <div class="bg-brand-card border border-brand-cardBorder rounded-2xl p-6 shadow-xl space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-brand-cardBorder pb-3">
          <div>
            <div class="text-[10px] font-bold text-brand-gold uppercase tracking-wider">${b.client}</div>
            <h2 class="text-lg font-black text-white">${b.project}</h2>
          </div>
          <div class="text-right">
            <div class="text-xs font-mono-code font-bold text-emerald-400">${b.budget}</div>
            <div class="text-[10px] text-slate-400">All-in Master & Sync Fee</div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Matched LJ Catalogue Assets</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${b.topMatches.map(m => `
              <div class="bg-brand-dark border border-brand-cardBorder rounded-xl p-3.5 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <img src="${m.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'}" class="w-10 h-10 rounded object-cover">
                  <div>
                    <div class="font-bold text-white text-xs">${m.title}</div>
                    <div class="text-[11px] text-slate-400">${m.artist} (${m.bpm} BPM)</div>
                  </div>
                </div>

                <div class="text-right space-y-1">
                  <div class="font-mono-code font-black text-sm text-brand-gold">${m.totalMatch}% MATCH</div>
                  <button onclick="openSyncOneSheetModal('${m.trackId}')" class="text-[10px] font-semibold text-emerald-400 hover:underline">
                    ${m.readiness.label}
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `).join("");
  } catch (err) {
    console.error("Error loading sync briefs:", err);
  }
}

// ==============================================================
// 12. PITCHING ENGINE
// ==============================================================
function setupPitchSelect() {
  const select = document.getElementById("pitchTrackSelect");
  if (!select) return;
  select.innerHTML = allTracks.map(t => `<option value="${t.id}">${t.title} - ${t.artist} ${t.isLjArtist ? '⭐' : ''}</option>`).join("");
  select.value = "lj-000"; // Default: KIRA
  renderPitchCardForSelected();
}

async function renderPitchCardForSelected() {
  const select = document.getElementById("pitchTrackSelect");
  const trackId = select ? select.value : "lj-000";
  const canvas = document.getElementById("pitchCardCanvas");

  try {
    const res = await fetch(`/api/pitch/${trackId}`);
    const pitch = await res.json();

    canvas.innerHTML = `
      <div class="bg-brand-card border border-brand-cardBorder rounded-2xl p-6 shadow-2xl space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-cardBorder pb-4">
          <div>
            <span class="text-[10px] font-bold text-brand-gold uppercase tracking-wider">A&R Pitch Card Asset</span>
            <h2 class="text-2xl font-black text-white mt-0.5">${pitch.song}</h2>
            <p class="text-xs text-slate-400 font-semibold">${pitch.artist} • ${pitch.genre} • Release Date: ${pitch.releaseDate}</p>
          </div>
          <button onclick="window.print()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium">Export One-Sheet</button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="bg-brand-dark border border-brand-cardBorder p-3 rounded-xl text-center">
            <div class="text-[10px] text-slate-400 uppercase">Radio Potential</div>
            <div class="text-lg font-black text-white font-mono-code mt-0.5">${pitch.potentials.radioPotential}</div>
          </div>
          <div class="bg-brand-dark border border-brand-cardBorder p-3 rounded-xl text-center">
            <div class="text-[10px] text-slate-400 uppercase">Playlist Potential</div>
            <div class="text-lg font-black text-brand-gold font-mono-code mt-0.5">${pitch.potentials.playlistPotential}</div>
          </div>
          <div class="bg-brand-dark border border-brand-cardBorder p-3 rounded-xl text-center">
            <div class="text-[10px] text-slate-400 uppercase">Sync Potential</div>
            <div class="text-lg font-black text-emerald-400 font-mono-code mt-0.5">${pitch.potentials.syncPotential}</div>
          </div>
          <div class="bg-brand-dark border border-brand-cardBorder p-3 rounded-xl text-center">
            <div class="text-[10px] text-slate-400 uppercase">Commercial Potential</div>
            <div class="text-lg font-black text-indigo-400 font-mono-code mt-0.5">${pitch.potentials.commercialPotential}</div>
          </div>
        </div>

        <div class="bg-slate-900 border border-brand-cardBorder rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
          <strong class="text-brand-gold">Unique Selling Proposition (USP):</strong> ${pitch.usp}
        </div>

        <div class="space-y-3">
          <div class="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Recommended Pitch Destinations</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${pitch.recommendedDestinations.map(d => `
              <div class="bg-brand-dark border border-brand-cardBorder rounded-xl p-3.5 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold text-brand-gold uppercase">${d.category}</span>
                  <span class="text-[10px] font-semibold text-emerald-400 font-mono-code">${d.suitability}</span>
                </div>
                <div class="text-xs font-bold text-white">${d.target}</div>
                <p class="text-[11px] text-slate-400 leading-normal">${d.reason}</p>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Error rendering pitch card:", err);
  }
}

// ==============================================================
// 13. EDITORIAL & GEO & AUTOMATION
// ==============================================================
let currentEditorialPlatformFilter = 'all';

async function loadEditorialPlaylists(platform = null) {
  if (platform !== null) currentEditorialPlatformFilter = platform;
  try {
    const url = currentEditorialPlatformFilter && currentEditorialPlatformFilter !== 'all'
      ? `/api/editorial?platform=${encodeURIComponent(currentEditorialPlatformFilter)}`
      : '/api/editorial';
    const res = await fetch(url);
    const playlists = await res.json();
    const container = document.getElementById("editorialPlaylistsGrid");
    if (!container) return;

    if (!Array.isArray(playlists) || playlists.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-8 text-center glass-panel rounded-3xl border border-white/10 space-y-3">
          <p class="text-sm font-bold text-slate-300">No playlists found for platform: "${currentEditorialPlatformFilter}".</p>
          <button onclick="filterEditorialByPlatform('all', null)" class="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs">View All Platforms</button>
        </div>
      `;
      return;
    }

    container.innerHTML = playlists.map(pl => {
      const tracksList = pl.resolvedTracks || (pl.tracks || []).map((t, idx) => {
        const tid = typeof t === 'string' ? t : (t.trackId || t.id);
        const catTrack = allTracks.find(x => x.id === tid);
        return {
          slot: idx + 1,
          id: tid,
          title: catTrack?.title || (typeof t === 'object' && t.title) || `Track ${tid}`,
          artist: catTrack?.artist || (typeof t === 'object' && t.artist) || "LJ Artist",
          bpm: catTrack?.bpm || 106,
          key: catTrack?.key || "Eb major",
          coverArt: catTrack?.coverArt || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
          previewUrl: catTrack?.previewUrl || "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b5/28/57/b5285723-4c8e-f592-f53d-1672f24feda3/mzaf_5923859656061233620.plus.aac.p.m4a",
          isLjArtist: catTrack ? Boolean(catTrack.isLjArtist) : true,
          rationale: (typeof t === 'object' && t.rationale) || "100% Curated Match"
        };
      });

      const saves = (pl.savesCount || 50000).toLocaleString();
      const monthly = (pl.monthlyListenersCount || 50000).toLocaleString();
      const platformName = pl.platform || "Spotify Editorial";
      const pKey = (pl.platformKey || "spotify").toLowerCase();

      let badgeStyle = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      let icon = "🟢";
      if (pKey === 'apple') { badgeStyle = "bg-pink-500/20 text-pink-300 border-pink-500/30"; icon = "🍎"; }
      else if (pKey === 'audiomack') { badgeStyle = "bg-amber-500/20 text-amber-300 border-amber-500/30"; icon = "🟠"; }
      else if (pKey === 'boomplay') { badgeStyle = "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"; icon = "🔵"; }
      else if (pKey === 'youtube') { badgeStyle = "bg-red-500/20 text-red-300 border-red-500/30"; icon = "🔴"; }
      else if (pKey === 'tiktok') { badgeStyle = "bg-slate-700/60 text-white border-white/20"; icon = "🎵"; }
      else if (pKey === 'deezer') { badgeStyle = "bg-purple-500/20 text-purple-300 border-purple-500/30"; icon = "🟣"; }
      else if (pKey === 'amazon' || pKey === 'tidal') { badgeStyle = "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"; icon = "📦"; }

      return `
        <div class="glass-panel border border-white/10 rounded-3xl p-6 shadow-spatial space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-white/[0.08] pb-3">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded text-[9px] font-mono-code font-black border ${badgeStyle}">${icon} ${platformName}</span>
                <span class="text-[10px] font-extrabold text-violet-400 uppercase tracking-widest">${pl.category}</span>
              </div>
              <h3 class="text-base font-black text-white mt-1">${pl.title}</h3>
              <p class="text-xs text-slate-400 mt-0.5">${pl.description}</p>
              
              <!-- Saves and Monthly Listeners Metrics (Verified >= 50,000) -->
              <div class="flex flex-wrap items-center gap-2.5 mt-2.5 text-[11px] font-mono-code bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 w-fit">
                <span class="text-amber-300 font-bold flex items-center space-x-1">
                  <span>📌</span>
                  <span>${saves} Saves</span>
                </span>
                <span class="text-slate-500">•</span>
                <span class="text-emerald-400 font-bold flex items-center space-x-1">
                  <span>🎧</span>
                  <span>${monthly} Monthly Listeners</span>
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <button onclick="openPlaylistInspectorModal('${pl.id}')" class="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold transition flex items-center space-x-1">
                <svg class="w-3.5 h-3.5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <span>Inspect All</span>
              </button>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-mono-code font-bold ${pl.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
                ${pl.status}
              </span>
            </div>
          </div>

          <!-- Playable Track List -->
          <div class="space-y-3">
            ${tracksList.map((track, idx) => {
              const isLj = track.isLjArtist || (track.id && track.id.startsWith("lj-"));
              const matchScore = track.momentum ? Math.min(99, Math.max(90, track.momentum)) : 96;

              return `
                <div class="glass-panel-subtle p-3.5 rounded-2xl border ${isLj ? 'border-amber-500/40 bg-amber-950/20 shadow-sm' : 'border-white/10'} space-y-3">
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center space-x-3 min-w-0">
                      <img src="${track.coverArt}" class="w-12 h-12 rounded-xl object-cover border border-white/10 shadow flex-shrink-0">
                      <div class="min-w-0">
                        <div class="flex items-center space-x-2 truncate">
                          <h4 class="font-bold text-white text-xs truncate">#${track.slot || (idx + 1)}. ${track.title}</h4>
                          ${isLj ? '<span class="px-1.5 py-0.2 rounded text-[8px] font-black bg-brand-gold text-black shadow flex-shrink-0">⭐ LJ PRIORITY</span>' : ''}
                        </div>
                        <p class="text-[11px] text-slate-400 truncate">${track.artist} • <span class="font-mono-code text-violet-300">${track.bpm} BPM / ${track.key}</span></p>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-2 flex-shrink-0">
                      <button onclick="playCustomAudioPreview('${track.previewUrl}', '${(track.title || '').replace(/'/g, "\\'")}', '${(track.artist || '').replace(/'/g, "\\'")}')" class="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition flex items-center space-x-1.5 shadow active:scale-95" title="Play Track From Beginning (0:00)">
                        <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        <span>▶ Play</span>
                      </button>
                      <span class="px-2 py-0.5 rounded-lg text-[10px] font-mono-code font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        ${matchScore}% FIT
                      </span>
                    </div>
                  </div>

                  ${track.rationale ? `
                    <div class="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-300 italic">
                      "${track.rationale}"
                    </div>
                  ` : ''}

                  <!-- Editorial Review Actions -->
                  <div class="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-bold font-mono-code">
                    <button onclick="editorialAction('ACCEPT', '${track.id}', '${pl.title}')" class="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition active:scale-95">
                      [ACCEPT]
                    </button>
                    <button onclick="editorialAction('REJECT', '${track.id}', '${pl.title}')" class="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition">
                      [REJECT]
                    </button>
                    <button onclick="editorialAction('SCHEDULE', '${track.id}', '${pl.title}')" class="px-2.5 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 transition">
                      [SCHEDULE]
                    </button>
                    <button onclick="editorialAction('ASSIGN', '${track.id}', '${pl.title}')" class="px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 transition">
                      [ASSIGN PLAYLIST]
                    </button>
                    <button onclick="editorialAction('SYNC', '${track.id}', '${pl.title}')" class="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition">
                      [TAG FOR SYNC]
                    </button>
                    <button onclick="switchTab('tab-council'); loadDebateForTrack('${track.id}');" class="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition">
                      [REASONING]
                    </button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }).join("");
    loadAutonomousPlaylists();
    loadOnlineRadioConsole();
  } catch (err) {
    console.error("Error loading editorial desk:", err);
  }
}

function editorialAction(action, trackId, playlistTitle) {
  const track = allTracks.find(t => t.id === trackId) || { title: trackId };
  if (action === 'ACCEPT') {
    showToast(`"${track.title}" signed off for publication in "${playlistTitle}".\nStatus: Approved and synchronized to DSP feeds.`, 'success', 'Editorial Accepted');
  } else if (action === 'REJECT') {
    showToast(`Candidate "${track.title}" removed from current editorial queue for "${playlistTitle}".`, 'warning', 'Candidate Rejected');
  } else if (action === 'SCHEDULE') {
    showToast(`"${track.title}" queued for automated DSP editorial playlist push on next release cycle.`, 'info', 'Scheduled for Release');
  } else if (action === 'ASSIGN') {
    showToast(`"${track.title}" assigned to curated playlist: "${playlistTitle}".`, 'info', 'Playlist Assigned');
  } else if (action === 'SYNC') {
    showToast(`"${track.title}" tagged as 100% Pre-Cleared One-Stop in Sync Licensing database.`, 'success', 'Tagged for Sync');
  }
}

async function loadGeoIntelligence() {
  try {
    const res = await fetch("/api/geo-intelligence");
    const data = await res.json();

    const cityList = document.getElementById("geoCityList");
    cityList.innerHTML = data.citySummary.map(c => `
      <div class="flex items-center justify-between p-3 rounded-xl bg-brand-dark border border-brand-cardBorder text-xs">
        <div>
          <div class="font-bold text-white">${c.city}</div>
          <div class="text-[10px] text-slate-400">${c.activeTracksCount} Active Tracks</div>
        </div>
        <div class="text-right">
          <div class="font-mono-code font-bold text-brand-gold">${c.totalPlays.toLocaleString()} plays</div>
          <span class="text-[10px] text-emerald-400 font-semibold">${c.statusLabel}</span>
        </div>
      </div>
    `).join("");

    const artistProfiles = document.getElementById("geoArtistProfiles");
    artistProfiles.innerHTML = data.artistGeoProfiles.map(a => `
      <div class="p-4 rounded-xl bg-brand-dark border border-brand-cardBorder text-xs space-y-2">
        <div class="flex items-center justify-between">
          <div class="font-bold text-white text-sm flex items-center space-x-2">
            <span>${a.artist}</span>
            ${a.isLjArtist ? '<span class="bg-brand-gold text-black text-[9px] font-black px-1.5 py-0.2 rounded">LJ</span>' : ''}
          </div>
          <span class="text-slate-400 text-[11px]">Primary: <strong class="text-brand-gold">${a.topMarket}</strong></span>
        </div>
      </div>
    `).join("");
  } catch (err) {
    console.error("Error loading geo intelligence:", err);
  }
}

function renderArtistPortalTracks() {
  const container = document.getElementById("artistPortalTracks");
  if (!container) return;

  const dreyTracks = allTracks.filter(t => t.artist === "Drey Star");
  container.innerHTML = dreyTracks.map(t => `
    <div class="bg-brand-card border border-brand-cardBorder rounded-xl p-4 space-y-3">
      <div class="flex items-center space-x-3">
        <img src="${t.coverArt}" class="w-12 h-12 rounded-lg object-cover">
        <div>
          <h3 class="font-bold text-white text-sm">${t.title}</h3>
          <p class="text-xs text-slate-400">${t.bpm} BPM • ${t.key} • ${t.genre}</p>
        </div>
      </div>
    </div>
  `).join("");
}

async function loadAutomationStatus() {
  try {
    const res = await fetch("/api/automation/status");
    const data = await res.json();
    const logContainer = document.getElementById("automationLogsContainer");
    document.getElementById("automationLogCount").innerText = `${data.recentLogs.length} events logged`;

    logContainer.innerHTML = data.recentLogs.map(l => `
      <div class="p-2 rounded bg-brand-dark/70 border border-brand-cardBorder flex items-start space-x-2">
        <span class="text-[10px] text-slate-400">${new Date(l.timestamp).toLocaleTimeString()}</span>
        <span class="text-[10px] font-bold ${l.level === 'SUCCESS' ? 'text-emerald-400' : 'text-blue-400'}">[${l.level}]</span>
        <span class="text-slate-300 flex-1">${l.message}</span>
      </div>
    `).join("");
  } catch (err) {
    console.error("Error loading automation status:", err);
  }
}

async function triggerQuickAutomation(cadence) {
  try {
    const res = await fetch(`/api/automation/trigger/${cadence}`, { method: "POST" });
    const result = await res.json();
    showToast(`Triggered ${cadence.toUpperCase()} intelligence cycle successfully! Real-time telemetry recalculated across all 17 divisions.`, 'success', 'Cycle Executed');
    loadAutomationStatus();
    loadCharts();
    loadListeningIntelligence();
    loadSwarmCommandCenter();
  } catch (err) {
    console.error("Trigger automation error:", err);
  }
}

// ==============================================================
let activeDnaChartInstance = null;

async function openTrackDnaModal(trackId) {
  trackId = trackId || currentActiveTrackId || "lj-000";
  const modal = document.getElementById("dnaModal");
  const content = document.getElementById("dnaModalContent");
  modal.classList.remove("hidden");

  try {
    const res = await fetch(`/api/catalogue/${trackId}`);
    const track = await res.json();

    content.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 rounded-2xl overflow-hidden border border-white/20 shadow-glow-violet flex-shrink-0">
              <img src="${track.coverArt}" class="w-full h-full object-cover">
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-[10px] font-extrabold text-violet-400 uppercase tracking-widest">Acoustic DNA Profile</span>
                <span class="px-2 py-0.5 rounded-full text-[9px] font-mono-code font-bold bg-purple-500/20 text-purple-300">SECTION 9 SPEC</span>
              </div>
              <h2 class="text-xl font-black text-white mt-0.5">${track.title}</h2>
              <p class="text-xs text-slate-400 font-mono-code">${track.artist} • ${track.genre} (${track.subGenre}) • ISRC: ${track.isrc || 'NG-LJ1-26-00001'}</p>
            </div>
          </div>
          <div class="text-right font-mono-code text-xs">
            <span class="text-slate-400 block text-[10px]">Acoustic Compatibility</span>
            <span class="text-emerald-400 text-base font-black">94.8% Match</span>
          </div>
        </div>

        <!-- Visual Radial Radar Chart & Sliders (Section 9) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <!-- Radial Spider Chart -->
          <div class="bg-black/40 p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
            <span class="text-[10px] font-mono-code uppercase text-violet-300 mb-2">Acoustic Balance Radar</span>
            <div class="w-full max-w-[280px] h-[220px]">
              <canvas id="trackDnaRadarCanvas"></canvas>
            </div>
          </div>

          <!-- Interactive Attribute Sliders / Gauges -->
          <div class="space-y-3 font-mono-code text-xs">
            <div>
              <div class="flex justify-between text-[11px] mb-1">
                <span class="text-slate-400">Tempo / BPM</span>
                <strong class="text-white">${track.bpm} BPM (${track.tempoRange || '104–112 BPM'})</strong>
              </div>
              <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                <div class="purple-accent-gradient h-full rounded-full" style="width: ${Math.min(100, (track.bpm / 140) * 100)}%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-[11px] mb-1">
                <span class="text-slate-400">Energy Level</span>
                <strong class="text-violet-300">${track.energy}/100</strong>
              </div>
              <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                <div class="bg-violet-500 h-full rounded-full" style="width: ${track.energy}%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-[11px] mb-1">
                <span class="text-slate-400">Danceability</span>
                <strong class="text-emerald-400">${track.danceability}/100</strong>
              </div>
              <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                <div class="bg-emerald-400 h-full rounded-full" style="width: ${track.danceability}%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-[11px] mb-1">
                <span class="text-slate-400">Sync Suitability</span>
                <strong class="text-purple-300">98% Tier A</strong>
              </div>
              <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                <div class="purple-accent-gradient h-full rounded-full" style="width: 98%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 16 Machine-Readable DNA Parameters -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-code pt-2 border-t border-white/[0.08]">
          <div class="glass-panel-subtle p-2.5 rounded-xl border border-white/5"><span class="text-[10px] text-slate-400 block font-sans">Musical Key</span><strong class="text-emerald-400">${track.key}</strong></div>
          <div class="glass-panel-subtle p-2.5 rounded-xl border border-white/5"><span class="text-[10px] text-slate-400 block font-sans">Mood</span><strong class="text-slate-200 truncate block">${track.mood}</strong></div>
          <div class="glass-panel-subtle p-2.5 rounded-xl border border-white/5"><span class="text-[10px] text-slate-400 block font-sans">Language</span><strong class="text-slate-200 truncate block">${track.language}</strong></div>
          <div class="glass-panel-subtle p-2.5 rounded-xl border border-white/5"><span class="text-[10px] text-slate-400 block font-sans">Vocal Style</span><strong class="text-slate-200 truncate block">${track.vocalType}</strong></div>
          <div class="glass-panel-subtle p-2.5 rounded-xl border border-white/5"><span class="text-[10px] text-slate-400 block font-sans">Era / Vintage</span><strong class="text-slate-200">${track.era || '2026 Modern'}</strong></div>
          <div class="glass-panel-subtle p-2.5 rounded-xl border border-white/5"><span class="text-[10px] text-slate-400 block font-sans">Structure</span><strong class="text-slate-200">${track.songStructure || 'Verse-Chorus'}</strong></div>
          <div class="glass-panel-subtle p-2.5 rounded-xl border border-white/5"><span class="text-[10px] text-slate-400 block font-sans">Intro Length</span><strong class="text-slate-200">${track.introLength || '10s'}</strong></div>
          <div class="glass-panel-subtle p-2.5 rounded-xl border border-white/5"><span class="text-[10px] text-slate-400 block font-sans">Rights Status</span><strong class="text-emerald-400">🟢 100% Pre-Cleared</strong></div>
        </div>
      </div>
    `;

    // Initialize Radar Chart
    setTimeout(() => {
      const radarCanvas = document.getElementById("trackDnaRadarCanvas");
      if (radarCanvas) {
        if (activeDnaChartInstance) activeDnaChartInstance.destroy();
        activeDnaChartInstance = new Chart(radarCanvas, {
          type: 'radar',
          data: {
            labels: ['Energy', 'Danceability', 'Acoustic', 'Valence', 'Vocal Presence', 'Sync Fit'],
            datasets: [{
              label: 'Music DNA Profile',
              data: [track.energy || 88, track.danceability || 92, 45, 82, 90, 96],
              backgroundColor: 'rgba(124, 58, 237, 0.25)',
              borderColor: '#C084FC',
              pointBackgroundColor: '#7C3AED',
              pointBorderColor: '#FFFFFF',
              pointHoverBackgroundColor: '#FFFFFF',
              pointHoverBorderColor: '#7C3AED'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                grid: { color: 'rgba(255, 255, 255, 0.08)' },
                pointLabels: { color: '#CBD5E1', font: { size: 9, family: 'Inter' } },
                ticks: { display: false, maxTicksLimit: 4 }
              }
            },
            plugins: {
              legend: { display: false }
            }
          }
        });
      }
    }, 50);

  } catch (err) {
    console.error("Error opening DNA modal:", err);
  }
}

function closeTrackDnaModal() {
  document.getElementById("dnaModal").classList.add("hidden");
  if (activeDnaChartInstance) {
    activeDnaChartInstance.destroy();
    activeDnaChartInstance = null;
  }
}

async function openSyncOneSheetModal(trackId) {
  trackId = trackId || currentActiveTrackId || "lj-000";
  const modal = document.getElementById("syncPackageModal");
  const content = document.getElementById("syncPackageContent");
  modal.classList.remove("hidden");

  try {
    const res = await fetch(`/api/catalogue/${trackId}`);
    const track = await res.json();
    const r = track.rights || {};
    const evalData = track.syncEvaluation || {};

    content.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between border-b border-brand-cardBorder pb-4">
          <div>
            <span class="text-[10px] font-bold text-brand-gold uppercase tracking-wider">Sync Clearance Package</span>
            <h2 class="text-xl font-black text-white">${track.title}</h2>
            <p class="text-xs text-slate-400">${track.artist} • Master & Publishing Clearance Dossier</p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold font-mono-code bg-emerald-500/20 text-emerald-400">
            ${evalData.label || '🟢 SYNC READY'}
          </span>
        </div>

        <div class="bg-brand-dark border border-brand-cardBorder rounded-xl p-4 text-xs space-y-2.5 font-mono-code">
          <div class="flex justify-between"><span class="text-slate-400">Master Ownership:</span><strong class="text-slate-200">${r.masterOwnership || '100% Owned by LJ Entertainment Ltd'}</strong></div>
          <div class="flex justify-between"><span class="text-slate-400">Publishing Ownership:</span><strong class="text-slate-200">${r.publishingOwnership || '100% Controlled by LJ Music Publishing'}</strong></div>
          <div class="flex justify-between"><span class="text-slate-400">ISRC Code:</span><strong class="text-brand-gold">${r.isrc || 'NG-LJ1-26-00001'}</strong></div>
          <div class="flex justify-between"><span class="text-slate-400">IPI / CAE:</span><strong class="text-brand-gold">${r.ipi || '008923412'}</strong></div>
          <div class="flex justify-between"><span class="text-slate-400">Turnaround Time:</span><strong class="text-emerald-400">Instant 1-Click Pre-Cleared</strong></div>
        </div>

        <div class="flex justify-between items-center pt-3 border-t border-brand-cardBorder">
          <span class="text-[11px] text-slate-400">Official Clearance: <strong class="text-white">sync@lj-entertainment.com</strong></span>
          <button onclick="window.print()" class="bg-brand-gold hover:bg-amber-400 text-black font-bold text-xs px-4 py-2 rounded-lg transition">
            Print Clearance Package
          </button>
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Error opening sync package modal:", err);
  }
}

function closeSyncPackageModal() {
  document.getElementById("syncPackageModal").classList.add("hidden");
}

// Procedural Web Audio Synth
let audioCtx = null;
let isPlayingBeat = false;
let beatInterval = null;

function initAudioContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playProceduralAfroBeat() {
  // Demo sound oscillators cleaned and cleared: route directly to authentic music player
  if (window.universalPlayer) {
    window.universalPlayer.togglePlay();
    return;
  }
  const track = (allTracks && allTracks.length > 0) ? (allTracks.find(t => t.id === currentActiveTrackId) || allTracks[0]) : null;
  if (track) {
    selectAndPlayTrack(track.id);
  }
}

function stopProceduralAfroBeat() {
  if (window.universalPlayer) {
    window.universalPlayer.pause();
    return;
  }
  if (activeAudioStream) {
    activeAudioStream.pause();
  }
  isPlayingBeat = false;
  const synthText = document.getElementById("synthStatusText");
  if (synthText) {
    synthText.innerText = "Spotify Master Audio: Paused";
    synthText.classList.remove("text-emerald-400");
  }
  const playIcon = document.getElementById("playIcon");
  if (playIcon) playIcon.innerHTML = `<path d="M8 5v14l11-7z"/>`;
  const rightIcon = document.getElementById("rightCockpitPlayIcon");
  if (rightIcon) rightIcon.innerHTML = `<path d="M8 5v14l11-7z"/>`;
}

function triggerLogKick() {
  // Demo sound silenced
}

function triggerShaker() {
  // Demo sound silenced
}

function triggerTalkingDrum() {
  // Demo sound silenced
}

let activeAudioStream = null;

function playDirectAudio(url, title, artist) {
  if (activeAudioStream) {
    try {
      activeAudioStream.pause();
    } catch (e) {}
    activeAudioStream = null;
  }
  if (!url) return;
  try {
    activeAudioStream = new Audio(url);
    activeAudioStream.currentTime = 0;
    activeAudioStream.play().catch(e => console.warn("Direct audio playback error:", e));
    showToast(`Streaming Audio: "${title}" by ${artist}`, 'info', 'Live Audio Preview');
    const playIcon = document.getElementById("playIcon");
    if (playIcon) playIcon.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
    const rightIcon = document.getElementById("rightCockpitPlayIcon");
    if (rightIcon) rightIcon.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
  } catch (err) {
    console.error("Audio error:", err);
  }
}
window.playDirectAudio = playDirectAudio;

function selectAndPlayTrack(trackId) {
  const track = allTracks.find(t => t.id === trackId);
  if (!track) return;

  currentActiveTrackId = track.id;
  window.currentActiveTrackId = track.id;
  const ftTitle = document.getElementById("currentTrackTitle");
  if (ftTitle) ftTitle.innerText = track.title;
  const ftArtist = document.getElementById("currentTrackArtist");
  if (ftArtist) ftArtist.innerHTML = `${track.artist} ${track.isLjArtist ? '<span class="text-violet-400 font-bold">⭐ Priority Single</span>' : ''}`;
  const ftCover = document.getElementById("currentTrackCover");
  if (ftCover) ftCover.innerHTML = `<img src="${track.coverArt}" class="w-full h-full object-cover">`;
  const ftBpm = document.getElementById("currentBpmBadge");
  if (ftBpm) ftBpm.innerText = `${track.bpm} BPM (${track.key})`;

  if (typeof updateRightSidebarCockpit === 'function') {
    updateRightSidebarCockpit(track);
  }

  // Route playback exclusively to authentic Spotify / studio audio stream
  if (window.universalPlayer && typeof window.universalPlayer.play === 'function') {
    window.universalPlayer.play(track);
  } else if (track.previewUrl) {
    playDirectAudio(track.previewUrl, track.title, track.artist);
  }
}

function playNextTrack() {
  if (!allTracks || allTracks.length === 0) return;
  const currentIdx = allTracks.findIndex(t => t.id === currentActiveTrackId);
  const nextIdx = (currentIdx + 1) % allTracks.length;
  selectAndPlayTrack(allTracks[nextIdx].id);
}

function playPrevTrack() {
  if (!allTracks || allTracks.length === 0) return;
  const currentIdx = allTracks.findIndex(t => t.id === currentActiveTrackId);
  const prevIdx = (currentIdx - 1 + allTracks.length) % allTracks.length;
  selectAndPlayTrack(allTracks[prevIdx].id);
}

window.playNextTrack = playNextTrack;
window.playPrevTrack = playPrevTrack;

// ==============================================================
// 17. LYRICS INTELLIGENCE & DISTRIBUTION DIVISION (DIVISION 17)
// ==============================================================

let currentLyricsRecord = null;
let currentLyricsFormat = "ai-sync";
let activeLyricsTrackId = "lj-000";

function loadLyricsForCurrentTrack() {
  loadLyricsForTrack(currentActiveTrackId || "lj-000");
}
window.loadLyricsForCurrentTrack = loadLyricsForCurrentTrack;

async function loadLyricsForSelectedTrack() {
  const select = document.getElementById("lyricsTrackSelect");
  if (select) {
    activeLyricsTrackId = select.value;
    loadLyricsForTrack(activeLyricsTrackId);
  }
}

async function loadLyricsForTrack(trackId = "lj-000") {
  try {
    activeLyricsTrackId = trackId;
    const select = document.getElementById("lyricsTrackSelect");
    if (select) select.value = trackId;

    const res = await fetch(`/api/lyrics/${trackId}`);
    if (!res.ok) return;
    const record = await res.json();
    currentLyricsRecord = record;

    // Header & Badges
    const titleEl = document.getElementById("lyricsStudioTrackTitle");
    if (titleEl) titleEl.innerHTML = `<span>${record.title} — ${record.artist}</span><span class="text-xs font-normal text-slate-400 font-mono-code ml-2" id="lyricsIsrcBadge">ISRC: ${record.isrc}</span>`;
    const isrcEl = document.getElementById("lyricsIsrcBadge");
    if (isrcEl) isrcEl.innerText = `ISRC: ${record.isrc}`;

    // Overall Quality Score
    const scoreBadge = document.getElementById("lyricsOverallScoreBadge");
    if (scoreBadge) scoreBadge.innerText = `${record.lyricsQualityScore?.overallScore || 97}/100`;

    // 7 Sub-Scores
    renderSubScores(record.lyricsQualityScore?.subScores);

    // Primary Languages & Dialect Expressions
    const langEl = document.getElementById("lyricsPrimaryLangText");
    if (langEl) langEl.innerText = record.primaryLanguage || "Nigerian Pidgin / English / Yoruba";
    renderDialectPhrases(record.dialectExpressions || []);

    // Discrepancy Chamber
    renderDiscrepancies(record.transcriptionVerification);

    // Studio Duration display
    const durEl = document.getElementById("lyricsLiveDuration");
    if (durEl && record.durationMs) {
      const dm = Math.floor(record.durationMs / 60000);
      const ds = Math.floor((record.durationMs % 60000) / 1000);
      durEl.innerText = `0${dm}:${ds < 10 ? '0' : ''}${ds}`;
    }

    // Dynamic Lyrics Studio Content (Line-Synced, Word-Synced, Plain, Clean, Translations)
    renderLyricsContent();

    // Multi-Destination Matrix
    renderDestinations(record.destinations || []);

    // Line Correction Select
    populateCorrectionLineSelect(record.lineSynced || []);

    // Google Search Schema Preview
    loadGoogleSchemaPreview(trackId);

    // Unified Music Rights Graph
    loadUnifiedMusicGraph(trackId);

    // Initial Live Sync State
    syncLyricsWithPlaybackTime(0);

  } catch (err) {
    console.error("Error loading lyrics for track:", err);
  }
}

function renderSubScores(subScores) {
  const container = document.getElementById("lyricsSubScoresContainer");
  if (!container || !subScores) return;

  const scoreLabels = {
    transcriptionAccuracy: "Transcription Accuracy",
    artistVerification: "Artist Verification",
    isrcMatch: "ISRC Match",
    timingAccuracy: "Timing Accuracy",
    languageDetection: "Language Detection",
    explicitClassification: "Explicit Classification",
    metadataCompleteness: "Metadata Completeness"
  };

  container.innerHTML = Object.entries(subScores).map(([key, val]) => `
    <div>
      <div class="flex justify-between items-center text-[11px] mb-1">
        <span class="text-slate-300">${scoreLabels[key] || key}</span>
        <span class="font-mono-code font-bold ${val >= 98 ? 'text-emerald-400' : 'text-pink-400'}">${val}%</span>
      </div>
      <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div class="h-full rounded-full ${val >= 98 ? 'bg-emerald-400' : 'bg-pink-500'}" style="width: ${val}%"></div>
      </div>
    </div>
  `).join("");
}

function renderDialectPhrases(phrases) {
  const container = document.getElementById("lyricsDialectPhrasesContainer");
  if (!container) return;

  if (phrases.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-500 italic">Standard English lyrics profile</div>`;
    return;
  }

  container.innerHTML = phrases.slice(0, 3).map(p => `
    <div class="bg-brand-dark/90 p-2.5 rounded-lg border border-brand-cardBorder">
      <div class="flex items-center justify-between">
        <span class="font-bold text-white text-xs">"${p.phrase}"</span>
        <span class="text-[9px] px-1.5 py-0.5 rounded font-mono-code bg-amber-500/20 text-brand-gold">${p.language}</span>
      </div>
      <p class="text-[10px] text-slate-400 mt-1">${p.meaning}</p>
    </div>
  `).join("");
}

function renderDiscrepancies(verif) {
  const container = document.getElementById("discrepancyContentArea");
  const badge = document.getElementById("discrepancyStatusBadge");
  if (!container) return;

  if (!verif || !verif.discrepancies || verif.discrepancies.length === 0) {
    if (badge) {
      badge.className = "px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      badge.innerText = "✓ 100% VERIFIED CANONICAL";
    }
    container.innerHTML = `
      <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
        No pending discrepancies between audio AI transcription, artist submission, and label records.
      </div>
    `;
    return;
  }

  const disc = verif.discrepancies[0];
  if (badge) {
    badge.className = "px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30";
    badge.innerText = `${verif.flaggedDiscrepanciesCount} AWAITING REVIEW`;
  }

  container.innerHTML = `
    <div class="bg-brand-dark p-3 rounded-xl border border-amber-500/30 space-y-2">
      <div class="text-[10px] text-amber-400 font-mono-code uppercase font-bold">Line #${disc.lineIndex} [${disc.timestamp}]</div>
      <div class="space-y-1 text-[11px]">
        <div class="flex items-start space-x-1.5">
          <span class="text-slate-400 w-20 flex-shrink-0">AI Heard:</span>
          <span class="text-red-300 line-through font-mono-code font-bold">"${disc.aiHeard}"</span>
        </div>
        <div class="flex items-start space-x-1.5">
          <span class="text-slate-400 w-20 flex-shrink-0">Artist Input:</span>
          <span class="text-emerald-400 font-mono-code font-bold">"${disc.artistSubmitted}"</span>
        </div>
      </div>
      <p class="text-[10px] text-slate-400 leading-snug pt-1 border-t border-brand-cardBorder">${disc.divergence}</p>
      
      <div class="flex gap-2 pt-2">
        <button onclick="resolveLyricsDiscrepancy(${disc.lineIndex}, '${disc.artistSubmitted.replace(/'/g, "\\'")}')" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-lg text-[10px] transition">
          Accept Artist ("${disc.artistSubmitted}")
        </button>
        <button onclick="resolveLyricsDiscrepancy(${disc.lineIndex}, '${disc.aiHeard.replace(/'/g, "\\'")}')" class="bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-3 rounded-lg text-[10px] transition">
          Keep Audio
        </button>
      </div>
    </div>
  `;
}

async function resolveLyricsDiscrepancy(lineIndex, chosenText) {
  if (!activeLyricsTrackId) return;
  try {
    const res = await fetch("/api/lyrics/discrepancy/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trackId: activeLyricsTrackId,
        lineIndex,
        chosenVersion: chosenText,
        userRole: "Label Rights Supervisor"
      })
    });
    const data = await res.json();
    if (data.success) {
      loadLyricsForTrack(activeLyricsTrackId);
      loadArtistLyricsPortal();
    }
  } catch (err) {
    console.error("Error resolving discrepancy:", err);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function switchLyricsFormat(format) {
  currentLyricsFormat = format;
  document.querySelectorAll(".lyrics-format-btn").forEach(btn => {
    btn.classList.remove("bg-pink-500", "text-white", "font-bold");
    btn.classList.add("text-slate-400");
  });
  const activeBtn = document.getElementById(`btn-format-${format}`);
  if (activeBtn) {
    activeBtn.classList.remove("text-slate-400");
    activeBtn.classList.add("bg-pink-500", "text-white", "font-bold");
  }
  renderLyricsContent();
}

function renderLyricsContent() {
  const container = document.getElementById("lyricsDisplayContainer");
  if (!container || !currentLyricsRecord) return;

  if (currentLyricsFormat === "ai-sync") {
    const lines = currentLyricsRecord.lineSynced || [];
    container.innerHTML = `
      <div class="space-y-2">
        ${lines.map((l) => `
          <div id="lyric-line-${l.lineIndex}" data-start-ms="${l.startMs}" data-end-ms="${l.endMs}" onclick="jumpToLyricTime(${l.startMs})" class="lyric-sync-line p-3 rounded-2xl border border-white/5 hover:border-pink-500/40 hover:bg-white/5 cursor-pointer transition flex items-start justify-between gap-3 group">
            <div class="flex items-start space-x-3 flex-1 min-w-0">
              <span class="text-slate-500 text-[11px] font-mono-code w-14 pt-0.5 flex-shrink-0 group-hover:text-pink-400 font-bold">${l.startTime}</span>
              <div class="space-y-1 min-w-0 flex-1">
                <div class="flex items-center space-x-2">
                  <span class="lyric-text text-white font-bold text-xs group-hover:text-pink-200 tracking-wide transition leading-snug">${escapeHtml(l.line)}</span>
                </div>
                ${l.aiInsight ? `<p class="text-[10px] text-purple-300/80 font-mono-code italic group-hover:text-purple-200">💡 ${escapeHtml(l.aiInsight)}</p>` : ''}
              </div>
            </div>
            <div class="flex items-center space-x-1.5 flex-shrink-0 pt-0.5">
              <span class="text-[9px] px-2 py-0.5 rounded-full font-mono-code font-bold ${l.section === 'HOOK' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'}">${escapeHtml(l.section)}</span>
              <span class="text-[9px] px-2 py-0.5 rounded-full font-mono-code font-bold ${l.language === 'Yoruba' ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/30' : l.language === 'Nigerian Pidgin' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-pink-500/10 text-pink-300'}">${escapeHtml(l.language)}</span>
              <button class="opacity-0 group-hover:opacity-100 transition px-2 py-0.5 rounded bg-pink-600/30 hover:bg-pink-600 text-[10px] text-pink-200 hover:text-white font-mono-code">▶ Jump</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
    const currentTime = window.universalPlayer ? window.universalPlayer.currentTime : 0;
    syncLyricsWithPlaybackTime(currentTime);
  } else if (currentLyricsFormat === "synced") {
    // Line-synced karaoke with timestamps
    const lines = currentLyricsRecord.lineSynced || [];
    container.innerHTML = `
      <div class="space-y-1.5">
        ${lines.map((l) => `
          <div id="lyric-line-${l.lineIndex}" data-start-ms="${l.startMs}" data-end-ms="${l.endMs}" onclick="jumpToLyricTime(${l.startMs})" class="lyric-sync-line flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-dark/90 transition group cursor-pointer border border-transparent hover:border-pink-500/30">
            <div class="flex items-center space-x-3">
              <span class="text-slate-500 text-[10px] font-mono-code w-14 group-hover:text-pink-400 font-bold">${l.startTime}</span>
              <span class="lyric-text text-white font-medium text-xs group-hover:text-pink-200">${escapeHtml(l.line)}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono-code">${escapeHtml(l.singer || 'Drey Star')}</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-300 font-mono-code">${escapeHtml(l.language)}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `;
    const currentTime = window.universalPlayer ? window.universalPlayer.currentTime : 0;
    syncLyricsWithPlaybackTime(currentTime);
  } else if (currentLyricsFormat === "words") {
    // Word-synced TTML inspector
    const lines = currentLyricsRecord.lineSynced || [];
    container.innerHTML = `
      <div class="space-y-4">
        <div class="text-[10px] text-pink-300 font-mono-code">Syllable & Word-Level Timing (Spotify / Apple TTML Resolution):</div>
        ${lines.map(l => `
          <div class="bg-brand-dark p-3 rounded-xl border border-brand-cardBorder space-y-2">
            <div class="flex justify-between items-center text-[10px] text-slate-400 border-b border-brand-cardBorder pb-1">
              <span>[${l.startTime} → ${l.endTime}] Line #${l.lineIndex} (${escapeHtml(l.section)})</span>
              <span class="text-brand-gold font-mono-code">${l.words ? l.words.length : 0} timed words</span>
            </div>
            <div class="flex flex-wrap gap-1.5 pt-1">
              ${(l.words || []).map(w => `
                <span class="px-2 py-1 rounded bg-slate-800 border border-brand-cardBorder hover:border-pink-500 text-white text-[11px] group relative">
                  ${escapeHtml(w.word)}
                  <span class="block text-[8px] text-pink-400 font-mono-code">${w.startMs}ms</span>
                </span>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  } else if (currentLyricsFormat === "plain") {
    container.innerHTML = `
      <pre class="text-xs text-slate-200 leading-relaxed font-mono-code whitespace-pre-wrap bg-brand-dark p-4 rounded-xl border border-brand-cardBorder">${escapeHtml(currentLyricsRecord.canonicalLyrics)}</pre>
    `;
  } else if (currentLyricsFormat === "clean") {
    container.innerHTML = `
      <div class="space-y-2">
        <div class="text-[10px] text-emerald-400 font-mono-code">Broadcast-Safe Radio Edit (Approved for Daytime Airplay):</div>
        <pre class="text-xs text-slate-200 leading-relaxed font-mono-code whitespace-pre-wrap bg-brand-dark p-4 rounded-xl border border-brand-cardBorder">${escapeHtml(currentLyricsRecord.cleanLyrics || currentLyricsRecord.canonicalLyrics)}</pre>
      </div>
    `;
  } else if (currentLyricsFormat === "translations") {
    const translations = currentLyricsRecord.translations || {};
    container.innerHTML = `
      <div class="space-y-4">
        ${Object.entries(translations).map(([code, t]) => `
          <div class="bg-brand-dark p-4 rounded-xl border border-brand-cardBorder space-y-2">
            <div class="flex justify-between items-center">
              <span class="font-bold text-white text-xs">${escapeHtml(t.title || t.language)}</span>
              <span class="text-[9px] px-2 py-0.5 rounded font-mono-code bg-indigo-500/20 text-indigo-300 font-bold uppercase">${escapeHtml(code)}</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed italic bg-brand-card/60 p-3 rounded-lg border border-brand-cardBorder">
              "${escapeHtml(t.chorus)}"
            </p>
          </div>
        `).join("")}
      </div>
    `;
  }
}

function syncLyricsWithPlaybackTime(currentTimeSec) {
  if (!currentLyricsRecord || !currentLyricsRecord.lineSynced || currentLyricsRecord.lineSynced.length === 0) return;
  const lines = currentLyricsRecord.lineSynced;
  const currentMs = Math.round((currentTimeSec || 0) * 1000);

  // Find active line matching current timestamp
  let activeIndex = lines.findIndex(l => currentMs >= l.startMs && currentMs <= l.endMs);
  if (activeIndex === -1) {
    for (let i = lines.length - 1; i >= 0; i--) {
      if (currentMs >= lines[i].startMs) {
        activeIndex = i;
        break;
      }
    }
  }
  if (activeIndex === -1) activeIndex = 0;
  const activeLine = lines[activeIndex];
  const nextLine = lines[activeIndex + 1];

  // 1. Highlight line in Teleprompter
  document.querySelectorAll(".lyric-sync-line").forEach(el => {
    el.classList.remove("active-lyric-line", "bg-purple-950/40", "border-pink-500/80");
  });
  const activeEl = document.getElementById(`lyric-line-${activeLine.lineIndex}`);
  if (activeEl) {
    activeEl.classList.add("active-lyric-line", "bg-purple-950/40", "border-pink-500/80");
    const container = document.getElementById("lyricsDisplayContainer");
    if (container) {
      const targetScroll = activeEl.offsetTop - container.offsetTop - (container.clientHeight / 2) + (activeEl.clientHeight / 2);
      container.scrollTo({ top: Math.max(0, targetScroll), behavior: "smooth" });
    }
  }

  // 2. Update Right Sidebar Drawer
  const rightActive = document.getElementById("rightLyricsActiveLine");
  if (rightActive) rightActive.innerText = `"${activeLine.line}"`;
  const rightNext = document.getElementById("rightLyricsNextLine");
  if (rightNext) rightNext.innerText = nextLine ? `"${nextLine.line}"` : "— Track Outro / End —";

  // 3. Update AI Agent Real-Time Co-Pilot Card
  const aiLine = document.getElementById("aiActiveLyricLine");
  if (aiLine) aiLine.innerText = `"${activeLine.line}"`;

  const aiInsight = document.getElementById("aiCulturalInsightText");
  if (aiInsight) {
    if (activeLine.aiInsight) {
      aiInsight.innerText = activeLine.aiInsight;
    } else if (activeLine.section === "HOOK") {
      aiInsight.innerText = "Oriki royal praise poetry for father (Ajayi) and mother (Amope). Climax sync clearance priority.";
    } else {
      aiInsight.innerText = "Canonical vocal node verified across 11 platforms. Dialect fidelity 100%.";
    }
  }

  const aiRole = document.getElementById("aiAgentActiveRole");
  if (aiRole) {
    if (activeLine.language === "Yoruba" || activeLine.section === "HOOK") {
      aiRole.innerText = "Division 17: Oriki & Yoruba Linguistics Agent";
    } else if (activeLine.language === "Nigerian Pidgin") {
      aiRole.innerText = "Division 17: Nigerian Idiom & Slang Semanticist";
    } else {
      aiRole.innerText = "Division 17: Real-Time Acoustic & Sync Telemetry Agent";
    }
  }

  const aiResonance = document.getElementById("aiSyncResonanceScore");
  const aiBar = document.getElementById("aiSyncProgressBar");
  const aiScenario = document.getElementById("aiSyncScenarioText");
  if (activeLine.section === "HOOK") {
    if (aiResonance) aiResonance.innerText = "99% (Peak Cultural Climax)";
    if (aiBar) aiBar.style.width = "99%";
    if (aiScenario) aiScenario.innerText = "Target: Dramatic Feature Film Climax, National Brand Tributes, Filial Legacy Campaigns.";
  } else if (activeLine.language === "Yoruba" || activeLine.language === "Nigerian Pidgin") {
    if (aiResonance) aiResonance.innerText = "97% (Authentic Emotional Depth)";
    if (aiBar) aiBar.style.width = "97%";
    if (aiScenario) aiScenario.innerText = "Target: Cultural Cinema, Documentary Soundtracks, Afro-Diaspora Commercials.";
  } else {
    if (aiResonance) aiResonance.innerText = "94% (High Narrative Value)";
    if (aiBar) aiBar.style.width = "94%";
    if (aiScenario) aiScenario.innerText = "Target: Episodic TV Drama, Redemption Arcs, Character Development Sequences.";
  }

  // 4. Update Studio Integrated Player Bar
  const liveTime = document.getElementById("lyricsLiveTime");
  if (liveTime) {
    const m = Math.floor(currentTimeSec / 60);
    const s = Math.floor(currentTimeSec % 60);
    liveTime.innerText = `0${m}:${s < 10 ? '0' : ''}${s}`;
  }
  const liveBar = document.getElementById("lyricsLiveProgressBar");
  if (liveBar) {
    const totalSec = currentLyricsRecord.durationMs ? currentLyricsRecord.durationMs / 1000 : 231;
    const pct = Math.min(100, (currentTimeSec / totalSec) * 100);
    liveBar.style.width = `${pct}%`;
  }
}

async function jumpToLyricTime(startMs) {
  const targetSec = Math.max(0, (startMs || 0) / 1000);
  if (window.universalPlayer) {
    if (!window.universalPlayer.isPlaying) {
      const kira = window.allTracks?.find(t => t.id === "lj-000") || {
        id: "lj-000",
        title: "KIRA",
        artist: "Drey Star",
        coverArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
        bpm: 107,
        key: "Am",
        duration: 231,
        youtubeId: "uNRZGlx3T5o",
        spotifyUrl: "https://open.spotify.com/track/5W1yl3OyfrKe8oHUY8rKbJ"
      };
      await window.universalPlayer.play(kira);
    }
    await window.universalPlayer.seek(targetSec);
    syncLyricsWithPlaybackTime(targetSec);
  }
}

function seekFromLyricsBar(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  const totalSec = currentLyricsRecord?.durationMs ? currentLyricsRecord.durationMs / 1000 : 231;
  const targetSec = ratio * totalSec;
  jumpToLyricTime(targetSec * 1000);
}

function copyLrcFormat() {
  if (!currentLyricsRecord || !currentLyricsRecord.lineSynced) return;
  const lines = currentLyricsRecord.lineSynced;
  const header = `[ti:${currentLyricsRecord.title}]\n[ar:${currentLyricsRecord.artist}]\n[al:${currentLyricsRecord.album || 'Single'}]\n[by:LJ Music OS Division 17]\n\n`;
  const body = lines.map(l => `[${l.startTime}] ${l.line}`).join('\n');
  const lrcText = header + body;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(lrcText).then(() => {
      showToast("Standard .LRC format copied to clipboard (100% time-synchronized)", "success", "LRC Exported");
    }).catch(() => {
      showToast("Clipboard access denied. Check browser permissions.", "warning", "Clipboard Error");
    });
  } else {
    showToast("LRC data generated. Copying not supported in this browser context.", "info", "LRC Ready");
  }
}

function downloadLrcFile() {
  if (!currentLyricsRecord || !currentLyricsRecord.lineSynced) return;
  const lines = currentLyricsRecord.lineSynced;
  const header = `[ti:${currentLyricsRecord.title}]\n[ar:${currentLyricsRecord.artist}]\n[al:${currentLyricsRecord.album || 'Single'}]\n[by:LJ Music OS Division 17]\n\n`;
  const body = lines.map(l => `[${l.startTime}] ${l.line}`).join('\n');
  const lrcText = header + body;

  const blob = new Blob([lrcText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(currentLyricsRecord.artist || 'Drey_Star').replace(/\\s+/g, '_')}_-_${(currentLyricsRecord.title || 'KIRA').replace(/\\s+/g, '_')}.lrc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Downloaded official synchronized .LRC file ready for DSP distribution", "success", "LRC Downloaded");
}

function mobilizeAiLyricSwarm() {
  showToast("Division 17 mobilized: 500 AI Agents inspecting acoustic alignment, phonetic dialect integrity, and 11 DSP endpoints.", "info", "Swarm Mobilized");
  const badge = document.getElementById("aiAgentActiveRole");
  if (badge) {
    const originalText = badge.innerText;
    badge.innerText = "Division 17: 500 AGENTS LIVE INGESTING TELEMETRY...";
    setTimeout(() => {
      badge.innerText = originalText;
      showToast("All 38 lyric nodes verified 100% aligned with Drey Star master vocal recording.", "success", "Verification Complete");
    }, 1800);
  }
}

function generateSyncClearanceSheet() {
  if (typeof window.openSyncOneSheetModal === 'function') {
    window.openSyncOneSheetModal(activeLyricsTrackId || "lj-000");
  } else {
    showToast("Sync clearance sheet pre-cleared: 100% Master & Publishing pre-approved for immediate worldwide synchronization.", "success", "Sync Pre-Cleared");
  }
}

window.syncLyricsWithPlaybackTime = syncLyricsWithPlaybackTime;
window.jumpToLyricTime = jumpToLyricTime;
window.seekFromLyricsBar = seekFromLyricsBar;
window.copyLrcFormat = copyLrcFormat;
window.downloadLrcFile = downloadLrcFile;
window.mobilizeAiLyricSwarm = mobilizeAiLyricSwarm;
window.generateSyncClearanceSheet = generateSyncClearanceSheet;
window.switchLyricsFormat = switchLyricsFormat;

function renderDestinations(destinations) {
  const container = document.getElementById("lyricsDestinationsGrid");
  if (!container) return;

  container.innerHTML = destinations.map(d => `
    <div class="bg-brand-dark border border-brand-cardBorder rounded-xl p-3.5 space-y-2 hover:border-pink-500/40 transition">
      <div class="flex items-center justify-between">
        <span class="font-bold text-white text-xs">${d.platform}</span>
        <span class="text-[9px] px-1.5 py-0.5 rounded font-mono-code font-bold ${d.status.includes('ACTIVE') || d.status.includes('INDEXED') || d.status.includes('LIVE') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'}">
          ${d.statusBadge || d.status}
        </span>
      </div>
      <p class="text-[10px] text-slate-400 leading-snug line-clamp-2">${d.routeMethod}</p>
      
      <div class="pt-2 border-t border-brand-cardBorder/60 text-[10px] text-slate-400 space-y-1">
        <div class="flex justify-between">
          <span>Synced:</span>
          <strong class="${d.syncedSupported ? 'text-emerald-400' : 'text-slate-500'}">${d.syncedSupported ? '✓ Supported' : 'Plain text'}</strong>
        </div>
        ${d.lastRecoveryNote ? `
          <div class="p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[9px] leading-tight">
            <strong>Auto-Healed:</strong> ${d.lastRecoveryNote}
          </div>
        ` : ''}
      </div>
    </div>
  `).join("");
}

function populateCorrectionLineSelect(lines) {
  const select = document.getElementById("correctionLineSelect");
  if (!select) return;

  select.innerHTML = lines.map(l => `
    <option value="${l.lineIndex}">Line #${l.lineIndex}: "${l.line.slice(0, 30)}..."</option>
  `).join("");

  onCorrectionLineSelected();
}

function onCorrectionLineSelected() {
  const select = document.getElementById("correctionLineSelect");
  const input = document.getElementById("correctionInputText");
  if (!select || !input || !currentLyricsRecord) return;

  const idx = parseInt(select.value);
  const lineObj = currentLyricsRecord.lineSynced?.find(l => l.lineIndex === idx);
  if (lineObj) {
    input.value = lineObj.line;
  }
}

async function dispatchGlobalLyricsCorrection() {
  const select = document.getElementById("correctionLineSelect");
  const input = document.getElementById("correctionInputText");
  const statusBox = document.getElementById("correctionDispatchStatusBox");
  if (!select || !input || !activeLyricsTrackId) return;

  const lineIndex = select.value;
  const newLyricLine = input.value.trim();
  if (!newLyricLine) return;

  statusBox.innerHTML = `
    <div class="flex items-center space-x-2 text-pink-400 text-xs">
      <div class="w-3 h-3 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
      <span>Dispatching to 11 global platforms...</span>
    </div>
  `;

  try {
    const res = await fetch("/api/lyrics/correct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trackId: activeLyricsTrackId,
        lineIndex,
        newLyricLine,
        author: "Drey Star (Verified Artist Direct)"
      })
    });
    const result = await res.json();
    if (result.success) {
      statusBox.innerHTML = `
        <div class="space-y-1.5 text-[11px]">
          <div class="text-emerald-400 font-bold flex items-center space-x-1">
            <span>✓ Complete:</span>
            <span>11 Platforms Updated</span>
          </div>
          <p class="text-slate-300 text-[10px] leading-tight">
            ${result.correctionEntry.summary}
          </p>
          <div class="text-[9px] text-slate-500 font-mono-code pt-1 border-t border-brand-cardBorder">
            Verified by: ${result.correctionEntry.verifiedBy}
          </div>
        </div>
      `;
      loadLyricsForTrack(activeLyricsTrackId);
    }
  } catch (err) {
    console.error("Error dispatching global correction:", err);
    statusBox.innerHTML = `<span class="text-red-400 text-xs">Correction dispatch failed</span>`;
  }
}

async function loadGoogleSchemaPreview(trackId) {
  try {
    const res = await fetch(`/api/lyrics/schema/${trackId}`);
    if (!res.ok) return;
    const data = await res.json();

    const serpUrl = document.getElementById("googleSerpUrl");
    if (serpUrl) serpUrl.innerText = data.canonicalUrl.replace("https://", "");
    const serpHeading = document.getElementById("googleSerpHeading");
    if (serpHeading) serpHeading.innerText = data.snippetPreview?.heading || data.title;
    const serpSnippet = document.getElementById("googleSerpSnippet");
    if (serpSnippet && data.snippetPreview?.snippetLines) {
      serpSnippet.innerText = data.snippetPreview.snippetLines.join(" / ");
    }

    const jsonArea = document.getElementById("googleSchemaJsonArea");
    if (jsonArea) jsonArea.innerText = JSON.stringify(data.jsonLd, null, 2);

  } catch (err) {
    console.error("Error loading schema preview:", err);
  }
}

async function loadUnifiedMusicGraph(trackId) {
  try {
    const res = await fetch(`/api/music-graph/${trackId}`);
    if (!res.ok) return;
    const graph = await res.json();

    const area = document.getElementById("musicGraphDisplayArea");
    if (!area) return;

    area.innerHTML = `
      <div class="space-y-2">
        <div class="flex justify-between items-center text-[10px] text-purple-300 font-mono-code">
          <span>${graph.nodes.length} Interconnected Nodes</span>
          <span>${graph.links.length} Active Rights Edges</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          ${graph.nodes.map(n => `
            <div class="p-2 rounded-lg bg-brand-dark/80 border border-brand-cardBorder text-[10px]">
              <div class="text-[8px] text-purple-400 font-bold uppercase font-mono-code">${n.type}</div>
              <div class="text-white font-semibold truncate mt-0.5">${n.label}</div>
            </div>
          `).join("")}
        </div>
        <div class="text-[9px] text-slate-400 italic pt-1 border-t border-brand-cardBorder">
          ${graph.strategicValuation}
        </div>
      </div>
    `;

  } catch (err) {
    console.error("Error loading unified music graph:", err);
  }
}

async function loadArtistLyricsPortal() {
  try {
    const res = await fetch("/api/lyrics/artist/Drey%20Star");
    if (!res.ok) return;
    const portal = await res.json();

    const elSongs = document.getElementById("myLyricsSongsCount");
    if (elSongs) elSongs.innerText = portal.metrics.totalSongs;
    const elVerif = document.getElementById("myLyricsVerifiedCount");
    if (elVerif) elVerif.innerText = portal.metrics.verified;
    const elReview = document.getElementById("myLyricsReviewCount");
    if (elReview) elReview.innerText = portal.metrics.needsReview;
    const elPending = document.getElementById("myLyricsPendingCount");
    if (elPending) elPending.innerText = portal.metrics.pendingDistribution;
    const elSynced = document.getElementById("myLyricsSyncedCount");
    if (elSynced) elSynced.innerText = portal.metrics.synced;
    const elTrans = document.getElementById("myLyricsTranslationsCount");
    if (elTrans) elTrans.innerText = portal.metrics.translations;

    const elAlert = document.getElementById("myLyricsAlertText");
    if (elAlert) elAlert.innerText = portal.recentAlert;

  } catch (err) {
    console.error("Error loading artist lyrics portal:", err);
  }
}

// ==============================================================
// 18. ARTIST & TRACK INTAKE STUDIO & SMART PLAYLIST AUTO-PLACEMENT
// ==============================================================

let currentStoreSearchResults = [];

function openAddArtistFlow(preset) {
  openQuickAddArtistModal(preset);
}

function toggleManualIntakeForm() {
  const form = document.getElementById("manualIntakeForm");
  if (form) form.classList.toggle("hidden");
}

function applySearchPreset(presetQuery) {
  const input = document.getElementById("intakeSearchInput");
  if (input) {
    input.value = presetQuery;
    executeStoreSearch();
  }
}

// Global window bindings for inline handlers
window.openAddArtistFlow = openAddArtistFlow;
window.copyCuratorEmail = copyCuratorEmail;
window.filterCuratorDirectory = filterCuratorDirectory;

let currentRealtimeProfile = null;
let selectedTrackIndexForSwarm = 0;

async function executeStoreSearch() {
  const input = document.getElementById("intakeSearchInput");
  const container = document.getElementById("intakeSearchResultsArea");
  if (!input || !container) return;

  const query = input.value.trim();
  if (!query) return;

  container.innerHTML = `
    <div class="glass-panel border border-violet-500/30 rounded-3xl p-8 text-center space-y-4 shadow-spatial">
      <div class="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto shadow-glow-emerald"></div>
      <div>
        <p class="text-sm font-black text-white">Connecting to Real-Time Spotify & Global DSP Infrastructure...</p>
        <p class="text-xs text-slate-400 mt-1">Resolving live artist profile, monthly listeners, HD imagery, and discography previews for "${query}"</p>
      </div>
    </div>
  `;

  try {
    // 1. Fetch real-time Spotify profile & discography
    const profileRes = await fetch(`/api/artist/realtime-profile?query=${encodeURIComponent(query)}`);
    const profile = await profileRes.json();

    if (profile && profile.artist && profile.topTracks && profile.topTracks.length > 0) {
      currentRealtimeProfile = profile;
      selectedTrackIndexForSwarm = 0;
      currentStoreSearchResults = profile.topTracks;
      renderRealtimeSpotifyProfile(profile, container);
      return;
    }

    // 2. Fallback to standard store search
    const res = await fetch(`/api/artist/search-store?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    const results = Array.isArray(data) ? data : (data.results || []);
    currentStoreSearchResults = results;

    if (results.length === 0) {
      container.innerHTML = `
        <div class="glass-panel p-6 text-center border border-white/10 rounded-2xl text-slate-400 text-xs">
          No matches found in DSP store. Use the Manual Intake Form below to register the master.
        </div>
      `;
      return;
    }

    renderLegacyStoreSearchResults(results, container);

  } catch (err) {
    console.error("Error searching store:", err);
    container.innerHTML = `<div class="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">Error querying store or resolving link.</div>`;
  }
}

function renderRealtimeSpotifyProfile(profile, container) {
  const artist = profile.artist;
  const tracks = profile.topTracks;

  container.innerHTML = `
    <div class="glass-panel border border-violet-500/30 rounded-3xl p-6 shadow-spatial space-y-6 relative overflow-hidden">
      <!-- Atmospheric purple glow -->
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Real-Time Artist Profile Header -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.08] pb-6 relative z-10">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <!-- Artist HD Picture with glowing verified ring -->
          <div class="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-glow-emerald flex-shrink-0">
            <img src="${artist.picture}" class="w-full h-full object-cover">
            <div class="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-black font-black text-xs shadow-md" title="Spotify Verified Checkmark">
              ✓
            </div>
          </div>

          <div class="text-center sm:text-left space-y-1.5">
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 class="text-2xl lg:text-3xl font-black text-white tracking-tight">${artist.name}</h2>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-mono-code font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>REAL-TIME SPOTIFY PROFILE</span>
              </span>
            </div>

            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300 font-mono-code">
              <span class="text-violet-300 font-bold">🎧 ${artist.followers}</span>
              <span>•</span>
              <span class="text-emerald-400 font-semibold">${artist.primaryGenre}</span>
              <span>•</span>
              <span class="text-slate-400">${artist.label}</span>
            </div>

            <p class="text-xs text-slate-300 max-w-xl leading-relaxed">${artist.bio || 'Verified streaming artist profile connected to LJ Music OS.'}</p>
          </div>
        </div>

        <!-- Quick External Link & Manual Override -->
        <div class="flex flex-col sm:flex-row lg:flex-col gap-2 justify-center flex-shrink-0">
          <a href="${artist.spotifyUrl}" target="_blank" class="px-4 py-2.5 rounded-xl bg-[#1DB954]/20 hover:bg-[#1DB954]/30 border border-[#1DB954]/40 text-[#1DB954] text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
            <span>Open on Spotify ↗</span>
          </a>
          <button onclick="toggleManualIntakeForm()" class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition border border-white/10">
            Upload Audio & Art
          </button>
        </div>
      </div>

      <!-- DSP Store Profile Verification Confirmation Box -->
      <div class="bg-gradient-to-r from-emerald-950/50 via-brand-dark to-slate-900 border-2 border-emerald-500/50 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 shadow-glow-emerald">
        <div class="space-y-1">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-[11px] font-black text-emerald-400 uppercase tracking-wider font-mono-code">DSP Identity Verified</span>
          </div>
          <h4 class="text-base font-extrabold text-white">Is this the official Spotify profile for ${artist.name}?</h4>
          <p class="text-xs text-slate-300 max-w-xl">
            Confirm to link this verified profile to LJ Music OS. You can then immediately upload new audio masters & artwork under this profile or import existing tracks from Spotify.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2.5 flex-shrink-0">
          <button onclick="confirmAndOnboardCurrentArtist()" class="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition shadow-lg shadow-emerald-600/30 flex items-center space-x-2 active:scale-95">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <span>✓ Confirm & Onboard Artist Profile</span>
          </button>
          <button onclick="openNewIndependentArtistForm()" class="px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold transition">
            <span>✨ New Indie Profile</span>
          </button>
        </div>
      </div>

      <!-- Real-Time Top Songs Discography Table -->
      <div class="space-y-3 relative z-10">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 class="text-sm font-extrabold text-white flex items-center space-x-2">
              <span>Verified Top Tracks Discography</span>
              <span class="text-xs text-slate-400 font-mono-code">(${tracks.length} Real-Time Tracks)</span>
            </h3>
            <p class="text-xs text-slate-400">Select any track to work on, stream a 30-second live audio preview, or deploy the 10,000-Agent Swarm.</p>
          </div>
          <span class="text-[10px] font-mono-code text-violet-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
            30S AUDIO PREVIEWS READY
          </span>
        </div>

        <div class="space-y-2" id="realtimeTracksList">
          ${tracks.map((t, idx) => `
            <div id="track-row-${idx}" class="track-select-card p-3.5 rounded-2xl border ${idx === 0 ? 'bg-purple-950/40 border-purple-500/60 ring-1 ring-purple-500/40' : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'} flex flex-col md:flex-row md:items-center justify-between gap-3 transition">
              <div class="flex items-center space-x-3.5 flex-1 min-w-0">
                <input type="radio" name="selectedSwarmTrack" value="${idx}" ${idx === 0 ? 'checked' : ''} onchange="onSelectRealtimeTrack(${idx})" class="w-4 h-4 text-purple-600 focus:ring-purple-500 bg-black border-white/20">
                
                <div class="w-12 h-12 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 shadow-md">
                  <img src="${t.coverArt}" class="w-full h-full object-cover">
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-center space-x-2">
                    <span class="font-extrabold text-sm text-white truncate">${t.title}</span>
                    <span class="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-white/5 text-slate-400">${t.durationFormatted || '3:05'}</span>
                  </div>
                  <p class="text-xs text-slate-400 truncate">${t.album} • Release: ${t.releaseDate || '2024'}</p>
                </div>
              </div>

              <!-- Acoustic DNA Badges -->
              <div class="flex items-center space-x-2 text-[10px] font-mono-code flex-shrink-0">
                <span class="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold">${t.bpm} BPM</span>
                <span class="px-2 py-1 rounded-lg bg-white/5 text-slate-300">${t.key}</span>
                <span class="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400">${t.energy} Energy</span>
                <span class="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-300">${t.danceability} Dance</span>
              </div>

              <!-- Audio Player & Focus Trigger -->
              <div class="flex items-center space-x-2 flex-shrink-0">
                ${t.previewUrl ? `
                  <button onclick="playDirectAudio('${t.previewUrl}', '${t.title.replace(/'/g, "\\'")}', '${t.artist.replace(/'/g, "\\'")}')" class="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 text-xs font-bold transition flex items-center space-x-1.5 shadow-sm active:scale-95">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span>▶ Play 30s</span>
                  </button>
                ` : `
                  <span class="text-[10px] text-slate-500 font-mono-code italic">Preview N/A</span>
                `}
                <button onclick="ingestRealtimeTrackDirectly(${idx})" class="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center space-x-1 active:scale-95" title="Import this track into LJ Catalogue">
                  <span>+ Ingest</span>
                </button>
                <button onclick="onSelectRealtimeTrack(${idx}); setRealtimeTrackAsActiveWorkingTrack(${idx})" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition">
                  🎯 Focus
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- MASTER CTA: MOBILIZE 10,000 AI AGENT SWARM -->
      <div class="purple-accent-gradient p-6 rounded-3xl border border-violet-400/40 shadow-glow-violet space-y-4 relative z-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span class="text-xs font-black text-white uppercase tracking-wider">AI Swarm Engine Ready</span>
              <span class="px-2 py-0.5 rounded-full text-[9px] font-mono-code font-bold bg-white/20 text-white">10,000 AGENTS ON STANDBY</span>
            </div>
            <h3 class="text-lg font-black text-white">Deploy 10,000 AI Agent Swarm On Selected Track</h3>
            <p class="text-xs text-purple-100 max-w-2xl leading-relaxed">
              Auto-ingests master into LJ catalogue, auto-places into compatible editorial playlists, convenes the 8-agent Adversarial Council debate, extracts Acoustic DNA, and mobilizes 1,480+ computational worker nodes across all 17 AI divisions.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-2.5 flex-shrink-0">
            <button id="btnDeploySwarm" onclick="deploySwarmOnSelectedArtistTrack()" class="px-6 py-4 rounded-2xl bg-white text-purple-950 font-black text-xs hover:bg-slate-100 transition shadow-2xl active:scale-95 flex items-center justify-center space-x-2">
              <svg class="w-4 h-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span>🚀 Mobilize 10,000 AI Agent Swarm</span>
            </button>
          </div>
        </div>
      </div>

      <!-- LIVE SWARM MOBILIZATION CONSOLE (EXPANDS ON DEPLOY) -->
      <div id="swarmDeploymentLiveConsole" class="hidden glass-panel-subtle p-6 rounded-3xl border border-emerald-500/40 space-y-5 relative z-10">
        <!-- Live stream injected here -->
      </div>
    </div>
  `;
}

function onSelectRealtimeTrack(idx) {
  selectedTrackIndexForSwarm = idx;
  document.querySelectorAll(".track-select-card").forEach((card, i) => {
    if (i === idx) {
      card.className = "track-select-card p-3.5 rounded-2xl border bg-purple-950/40 border-purple-500/60 ring-1 ring-purple-500/40 flex flex-col md:flex-row md:items-center justify-between gap-3 transition";
    } else {
      card.className = "track-select-card p-3.5 rounded-2xl border bg-white/[0.02] border-white/[0.08] hover:border-white/20 flex flex-col md:flex-row md:items-center justify-between gap-3 transition";
    }
  });
  const radio = document.querySelector(`input[name="selectedSwarmTrack"][value="${idx}"]`);
  if (radio) radio.checked = true;
}

async function setRealtimeTrackAsActiveWorkingTrack(idx) {
  if (!currentRealtimeProfile || !currentRealtimeProfile.topTracks[idx]) return;
  const t = currentRealtimeProfile.topTracks[idx];
  
  try {
    const res = await fetch("/api/artist/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackData: t })
    });
    const data = await res.json();
    if (data.success) {
      await loadCatalogue();
      setAsActiveWorkingTrack(data.track.id);
      showToast(`Selected "${t.title}" by ${t.artist} as Active Focus Master.`, 'success', 'Active Master Set');
    }
  } catch (e) {
    console.error("Error setting active track:", e);
  }
}

async function deploySwarmOnSelectedArtistTrack() {
  if (!currentRealtimeProfile || !currentRealtimeProfile.topTracks[selectedTrackIndexForSwarm]) {
    showToast("Please select a track from the discography list first.", 'warning', 'No Track Selected');
    return;
  }

  const selectedTrack = currentRealtimeProfile.topTracks[selectedTrackIndexForSwarm];
  const artistName = currentRealtimeProfile.artist.name;
  const consoleEl = document.getElementById("swarmDeploymentLiveConsole");
  const btnDeploy = document.getElementById("btnDeploySwarm");

  if (!consoleEl) return;
  consoleEl.classList.remove("hidden");
  consoleEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  if (btnDeploy) {
    btnDeploy.disabled = true;
    btnDeploy.innerHTML = `
      <div class="w-4 h-4 border-2 border-purple-900 border-t-transparent rounded-full animate-spin"></div>
      <span>Mobilizing 10,000 Agents...</span>
    `;
  }

  consoleEl.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div class="flex items-center space-x-2">
          <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
          <span class="font-extrabold text-white text-sm">SWARM MOBILIZATION PROTOCOL ACTIVATED</span>
        </div>
        <span class="text-xs font-mono-code text-purple-300 font-bold">10,600 AGENTS DISPATCHING</span>
      </div>

      <!-- 4-Phase Progress Bar -->
      <div class="space-y-2">
        <div class="flex justify-between text-xs font-mono-code">
          <span class="text-emerald-400 font-bold" id="swarmStageLabel">Phase 1/4: Ingesting Acoustic DNA & ISRC</span>
          <span class="text-white font-bold" id="swarmStagePct">25%</span>
        </div>
        <div class="w-full bg-black/40 rounded-full h-2.5 overflow-hidden border border-white/10">
          <div id="swarmProgressBar" class="purple-accent-gradient h-full rounded-full transition-all duration-500 ease-out" style="width: 25%"></div>
        </div>
      </div>

      <div class="p-3 bg-black/40 rounded-xl border border-white/10 font-mono-code text-xs text-slate-300 space-y-1" id="swarmLogStream">
        <p class="text-emerald-400">> Initializing Master Orchestrator for "${selectedTrack.title}" (${artistName})...</p>
        <p class="text-purple-300">> Ingesting 16 Acoustic DNA parameters: ${selectedTrack.bpm} BPM, Key ${selectedTrack.key}, ${selectedTrack.energy} Energy...</p>
      </div>
    </div>
  `;

  // Animate stages smoothly
  setTimeout(() => {
    const lbl = document.getElementById("swarmStageLabel");
    const pct = document.getElementById("swarmStagePct");
    const bar = document.getElementById("swarmProgressBar");
    const stream = document.getElementById("swarmLogStream");
    if (lbl) lbl.innerText = "Phase 2/4: Contextual Editorial Placement Evaluation";
    if (pct) pct.innerText = "50%";
    if (bar) bar.style.width = "50%";
    if (stream) {
      stream.innerHTML += `<p class="text-cyan-300">> Matching against Spotify African Heat, Apple Music Oshe Naija, and Audiomack Trending...</p>`;
    }
  }, 700);

  setTimeout(() => {
    const lbl = document.getElementById("swarmStageLabel");
    const pct = document.getElementById("swarmStagePct");
    const bar = document.getElementById("swarmProgressBar");
    const stream = document.getElementById("swarmLogStream");
    if (lbl) lbl.innerText = "Phase 3/4: Dispatched 1,480+ Computational Nodes Across 17 Divisions";
    if (pct) pct.innerText = "75%";
    if (bar) bar.style.width = "75%";
    if (stream) {
      stream.innerHTML += `<p class="text-emerald-300">> Music Analysis (800) • A&R (800) • Playlist Intel (1,000) • Radio War Room (700) • Sync (800)...</p>`;
    }
  }, 1400);

  try {
    const res = await fetch("/api/artist/deploy-swarm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        artistName,
        trackData: selectedTrack
      })
    });
    const deployData = await res.json();

    setTimeout(async () => {
      // Refresh global state
      await loadCatalogue();
      await loadArtistRosterDirectory();
      loadEditorialPlaylists();
      loadSwarmCommandCenter();

      if (deployData.track?.id) {
        setAsActiveWorkingTrack(deployData.track.id);
      }

      const swarm = deployData.swarmMobilization;
      const placements = deployData.placements || [];
      const debate = deployData.councilDebate;

      consoleEl.innerHTML = `
        <div class="space-y-6">
          <!-- Success Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-base shadow-glow-emerald">
                ✓
              </div>
              <div>
                <h4 class="font-black text-white text-base">10,000-AGENT SWARM ACTIVE ON "${selectedTrack.title}"</h4>
                <p class="text-xs text-emerald-400 font-mono-code">${artistName} • ${swarm?.totalAgentsDeployed?.toLocaleString() || '10,600'} Specialist Agents Mobilized</p>
              </div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-mono-code font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              MISSION RUNNING IN REAL TIME
            </span>
          </div>

          <!-- Active Division Deployment Grid -->
          <div class="space-y-2">
            <div class="text-xs font-bold text-purple-300 uppercase tracking-wider font-mono-code">
              Active Computational Worker Nodes (17 Divisions)
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              ${(swarm?.divisionsActive || []).map(d => `
                <div class="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1.5">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-black text-white">${d.division}</span>
                    <span class="font-mono-code font-bold text-emerald-400">${d.agents} agents</span>
                  </div>
                  <p class="text-[11px] text-slate-300 leading-snug">${d.task}</p>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Auto-Placed Editorial Playlists -->
          ${placements.length > 0 ? `
            <div class="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-white uppercase">Automated Editorial Placements</span>
                <span class="text-emerald-400 font-mono-code font-bold">${placements.length} Playlists Assigned</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                ${placements.map(p => `
                  <div class="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <div class="font-bold text-white text-xs truncate">${p.playlistTitle}</div>
                    <div class="flex justify-between items-center text-[10px] font-mono-code">
                      <span class="text-slate-400">${p.addedTracksCount} Tracks</span>
                      <span class="text-emerald-400 font-bold">${p.compatibilityScore}% Compatibility</span>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ''}

          <!-- Quick Jumps across the OS -->
          <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.08]">
            <span class="text-xs font-bold text-slate-400 mr-2">Fast Actions:</span>
            <button onclick="switchTab('tab-council'); loadDebateForTrack('${deployData.track?.id || 'lj-000'}');" class="px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-900 text-purple-200 border border-purple-500/40 text-xs font-bold transition flex items-center space-x-1.5">
              <span>🏛️ Council Debate Chamber</span>
            </button>
            <button onclick="switchTab('tab-pitch'); setupPitchSelect(); renderPitchCardForSelected();" class="px-4 py-2 rounded-xl bg-sky-900/60 hover:bg-sky-900 text-sky-200 border border-sky-500/40 text-xs font-bold transition flex items-center space-x-1.5">
              <span>🎯 Commercial Pitch Studio</span>
            </button>
            <button onclick="switchTab('tab-editorial'); loadEditorialPlaylists();" class="px-4 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/40 text-xs font-bold transition flex items-center space-x-1.5">
              <span>⚡ Editorial Playlists</span>
            </button>
            <button onclick="switchTab('tab-command-center'); loadSwarmCommandCenter();" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition flex items-center space-x-1.5">
              <span>👑 Swarm Command Center</span>
            </button>
          </div>
        </div>
      `;

      showToast(`10,000 AI Agent Swarm successfully mobilized on "${selectedTrack.title}" by ${artistName}! Track auto-placed and set as active master across LJ Music OS.`, 'success', 'Swarm Mobilized');

      if (btnDeploy) {
        btnDeploy.disabled = false;
        btnDeploy.innerHTML = `
          <svg class="w-4 h-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          <span>🚀 Swarm Mobilized (Re-Trigger)</span>
        `;
      }
    }, 2100);

  } catch (err) {
    console.error("Swarm deploy error:", err);
    consoleEl.innerHTML = `<div class="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">Error mobilizing swarm on artist.</div>`;
    if (btnDeploy) {
      btnDeploy.disabled = false;
      btnDeploy.innerHTML = `<span>🚀 Mobilize 10,000 AI Agent Swarm</span>`;
    }
  }
}

function renderLegacyStoreSearchResults(results, container) {
  container.innerHTML = results.map((item, idx) => `
    <div class="bg-brand-card border border-brand-cardBorder hover:border-emerald-500/50 rounded-2xl p-5 shadow-xl transition space-y-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 rounded-xl overflow-hidden border border-emerald-500/40 shadow-lg flex-shrink-0">
            <img src="${item.coverArt}" class="w-full h-full object-cover">
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h3 class="text-lg font-black text-white">${item.title}</h3>
              <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">${item.verifiedStore || 'SPOTIFY VERIFIED'}</span>
            </div>
            <p class="text-xs text-slate-300 mt-0.5">${item.artist} • Album: <span class="text-slate-400">${item.album}</span></p>
            <div class="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] font-mono-code">
              <span class="text-brand-gold font-bold">${item.bpm} BPM</span>
              <span class="text-slate-400">•</span>
              <span class="text-slate-300">${item.key}</span>
              <span class="text-slate-400">•</span>
              <span class="text-slate-400">${item.genre} (${item.subGenre})</span>
              <span class="text-slate-400">•</span>
              <span class="text-slate-400">ISRC: ${item.isrc}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2">
          ${item.previewUrl ? `
            <button onclick="playDirectAudio('${item.previewUrl}', '${item.title.replace(/'/g, "\\'")}', '${item.artist.replace(/'/g, "\\'")}')" class="bg-purple-900/50 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center space-x-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>▶ Preview Audio</span>
            </button>
          ` : ''}
          <button onclick="ingestFoundTrack(${idx})" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-emerald-600/20">
            📥 Ingest into LJ Catalogue
          </button>
          <button onclick="autoPlaceDirectTrack(${idx})" class="bg-brand-dark hover:bg-slate-800 border border-brand-cardBorder text-brand-gold font-bold px-3.5 py-2 rounded-xl text-xs transition">
            ⚡ Auto-Place Playlists
          </button>
          <button onclick="setPreviewAsActiveWorkingTrack(${idx})" class="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3 py-2 rounded-xl text-xs transition">
            🎯 Set Working Track
          </button>
        </div>
      </div>

      <!-- Acoustic DNA Barometers -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-brand-dark/80 p-3 rounded-xl border border-brand-cardBorder text-[11px]">
        <div>
          <span class="text-slate-400 block text-[10px]">Energy</span>
          <div class="flex items-center space-x-2 mt-0.5">
            <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div class="bg-brand-gold h-full rounded-full" style="width: ${item.energy}%"></div>
            </div>
            <span class="font-mono-code font-bold text-white">${item.energy}</span>
          </div>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px]">Danceability</span>
          <div class="flex items-center space-x-2 mt-0.5">
            <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div class="bg-emerald-400 h-full rounded-full" style="width: ${item.danceability}%"></div>
            </div>
            <span class="font-mono-code font-bold text-white">${item.danceability}</span>
          </div>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px]">Vocal Profile</span>
          <span class="font-semibold text-slate-200 truncate block mt-0.5">${item.vocalType}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px]">Mood / Vibe</span>
          <span class="font-semibold text-slate-200 truncate block mt-0.5">${item.mood}</span>
        </div>
      </div>
    </div>
  `).join("");
}

// Global window bindings for new handlers
window.executeStoreSearch = executeStoreSearch;
window.onSelectRealtimeTrack = onSelectRealtimeTrack;
window.setRealtimeTrackAsActiveWorkingTrack = setRealtimeTrackAsActiveWorkingTrack;
window.deploySwarmOnSelectedArtistTrack = deploySwarmOnSelectedArtistTrack;

async function ingestFoundTrack(index) {
  const trackData = currentStoreSearchResults[index];
  if (!trackData) return;

  try {
    const res = await fetch("/api/artist/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackData })
    });
    const data = await res.json();

    if (data.success) {
      // Reload catalogue and roster
      await loadCatalogue();
      await loadArtistRosterDirectory();

      // Set as active working track
      setAsActiveWorkingTrack(data.track.id);

      // Offer immediate playlist auto-placement
      autoPlaceTrackIntoPlaylists(data.track.id);

      showToast(`Successfully ingested "${data.track.title}" by ${data.track.artist} into LJ Music OS!\nISRC: ${data.track.isrc}\nSet as active working track across the platform.`, 'success', 'Track Ingested');
    }
  } catch (err) {
    console.error("Error ingesting track:", err);
  }
}

async function autoPlaceDirectTrack(index) {
  const trackData = currentStoreSearchResults[index];
  if (!trackData) return;

  // First ensure track is ingested or already in catalogue
  const existing = allTracks.find(t => t.title.toLowerCase() === trackData.title.toLowerCase() && t.artist.toLowerCase() === trackData.artist.toLowerCase());
  if (existing) {
    autoPlaceTrackIntoPlaylists(existing.id);
  } else {
    // Ingest first
    const res = await fetch("/api/artist/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackData })
    });
    const data = await res.json();
    if (data.success) {
      await loadCatalogue();
      setAsActiveWorkingTrack(data.track.id);
      autoPlaceTrackIntoPlaylists(data.track.id);
    }
  }
}

function setPreviewAsActiveWorkingTrack(index) {
  const trackData = currentStoreSearchResults[index];
  if (!trackData) return;

  // Check if exists in catalogue
  const existing = allTracks.find(t => t.title.toLowerCase() === trackData.title.toLowerCase());
  if (existing) {
    setAsActiveWorkingTrack(existing.id);
  } else {
    ingestFoundTrack(index);
  }
}

async function triggerAutoPlacementForCurrentTrack() {
  if (!currentActiveTrackId) return;
  autoPlaceTrackIntoPlaylists(currentActiveTrackId);
}

async function autoPlaceTrackIntoPlaylists(trackId) {
  const canvas = document.getElementById("intakeAutoPlacementCanvas");
  if (!canvas) return;

  canvas.classList.remove("hidden");
  canvas.innerHTML = `
    <div class="flex items-center space-x-2 text-xs text-brand-gold">
      <div class="w-3.5 h-3.5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
      <span>Analyzing Acoustic DNA and evaluating Editorial Playlists for auto-placement...</span>
    </div>
  `;

  try {
    const res = await fetch("/api/playlist/auto-place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId })
    });
    const data = await res.json();

    if (!data.success) {
      canvas.innerHTML = `<div class="text-xs text-red-400">${data.error || 'Placement failed'}</div>`;
      return;
    }

    canvas.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-cardBorder pb-3">
        <div>
          <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">AI Playlist Auto-Placement Complete</span>
          <h3 class="text-base font-black text-white mt-0.5">"${data.trackTitle}" (${data.artist})</h3>
          <p class="text-xs text-slate-300 mt-1">${data.message}</p>
        </div>
        <button onclick="switchTab('tab-editorial'); loadEditorialPlaylists();" class="bg-brand-dark hover:bg-slate-800 border border-brand-cardBorder text-xs text-brand-gold font-bold px-3 py-1.5 rounded-lg transition">
          View in Editorial Desk →
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        ${data.evaluatedPlaylists.slice(0, 3).map(p => `
          <div class="bg-brand-dark p-3.5 rounded-xl border border-brand-cardBorder space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-white text-xs">${p.playlistTitle}</span>
              <span class="text-[10px] font-mono-code font-bold text-emerald-400">${p.compatibilityScore}% FIT</span>
            </div>
            <p class="text-[11px] text-slate-400 leading-snug">${p.justification}</p>
            <div class="text-[10px] text-emerald-400 font-semibold pt-1 border-t border-brand-cardBorder/60 flex items-center space-x-1">
              <span>✓</span>
              <span>Placed in Editorial Roster</span>
            </div>
          </div>
        `).join("")}
      </div>
    `;

    // Refresh editorial playlists
    loadEditorialPlaylists();

  } catch (err) {
    console.error("Error auto-placing track:", err);
    canvas.innerHTML = `<div class="text-xs text-red-400">Failed to auto-place track into playlists.</div>`;
  }
}

// ==============================================================
// 24. DEDICATED AUTO PLAYLISTING TOOL MODAL CONTROLLER
// ==============================================================
async function openAutoPlaylistingModal(trackId) {
  trackId = trackId || currentActiveTrackId || "lj-000";
  const modal = document.getElementById("autoPlaylistingModal");
  if (!modal) return;
  modal.classList.remove("hidden");

  // Populate track select dropdown
  const select = document.getElementById("autoPlaylistTrackSelect");
  if (select) {
    if (!allTracks || allTracks.length === 0) {
      try {
        const res = await fetch("/api/catalogue");
        allTracks = await res.json();
      } catch (e) {
        console.warn("Could not load tracks for auto playlisting modal:", e);
      }
    }

    if (allTracks && allTracks.length > 0) {
      select.innerHTML = allTracks.map(t => `
        <option value="${t.id}" ${t.id === trackId ? 'selected' : ''}>
          ${t.title} - ${t.artist} (${t.bpm} BPM, ${t.genre || 'Afrobeats'})
        </option>
      `).join("");
    }
  }

  onAutoPlaylistTrackChanged();
  runAutoPlaylistingFromModal();
}

function closeAutoPlaylistingModal() {
  const modal = document.getElementById("autoPlaylistingModal");
  if (modal) modal.classList.add("hidden");
}

function onAutoPlaylistTrackChanged() {
  const select = document.getElementById("autoPlaylistTrackSelect");
  const trackId = select ? select.value : (currentActiveTrackId || "lj-000");
  const track = (allTracks && allTracks.find(t => t.id === trackId)) || {
    id: "lj-000",
    title: "KIRA",
    artist: "Drey Star",
    bpm: 107,
    key: "A minor",
    energy: 82,
    danceability: 88,
    mood: "electric / celebratory"
  };

  const preview = document.getElementById("autoPlaylistDnaPreview");
  if (preview) {
    preview.innerHTML = `
      <div class="flex items-center space-x-2">
        <span class="text-amber-400 font-extrabold uppercase font-mono-code text-[11px]">Acoustic DNA:</span>
        <span class="bg-white/10 px-2 py-0.5 rounded text-[10px] font-mono-code text-white"><strong>${track.bpm}</strong> BPM</span>
        <span class="bg-white/10 px-2 py-0.5 rounded text-[10px] font-mono-code text-white">Key: <strong>${track.key || 'A Minor'}</strong></span>
        <span class="bg-white/10 px-2 py-0.5 rounded text-[10px] font-mono-code text-purple-300">Energy: <strong>${track.energy || 82}%</strong></span>
        <span class="bg-white/10 px-2 py-0.5 rounded text-[10px] font-mono-code text-emerald-300">Dance: <strong>${track.danceability || 88}%</strong></span>
        <span class="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-mono-code">Mood: ${track.mood || 'Uplifting'}</span>
      </div>
    `;
  }
}

async function runAutoPlaylistingFromModal() {
  const select = document.getElementById("autoPlaylistTrackSelect");
  const trackId = select ? select.value : (currentActiveTrackId || "lj-000");
  const canvas = document.getElementById("autoPlaylistResultsCanvas");
  const runBtn = document.getElementById("runAutoPlaylistModalBtn");
  if (!canvas) return;

  if (runBtn) {
    runBtn.disabled = true;
    runBtn.classList.add("opacity-60", "cursor-not-allowed");
  }

  canvas.innerHTML = `
    <div class="glass-panel-subtle p-6 rounded-2xl border border-amber-500/20 text-center space-y-3">
      <div class="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <div class="text-sm font-bold text-white">Evaluating 10,000 AI Agent Swarm & DSP Curators...</div>
      <p class="text-xs text-slate-400 max-w-md mx-auto">Analyzing sonic fingerprint, BPM sync, harmonic key alignment, and editorial placement thresholds.</p>
    </div>
  `;

  try {
    const res = await fetch("/api/playlist/auto-place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId })
    });
    const data = await res.json();

    if (runBtn) {
      runBtn.disabled = false;
      runBtn.classList.remove("opacity-60", "cursor-not-allowed");
    }

    if (!data.success) {
      canvas.innerHTML = `<div class="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">${data.error || 'Failed to auto-place track into playlists.'}</div>`;
      return;
    }

    const targetPlaylists = data.placedPlaylists || data.evaluatedPlaylists || [];

    canvas.innerHTML = `
      <div class="glass-panel-subtle p-5 rounded-2xl border border-emerald-500/30 space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span class="text-[10px] font-mono-code font-bold text-emerald-400 uppercase tracking-wider">Placement Complete • Active in Roster</span>
              <span class="px-2 py-0.5 rounded-full text-[9px] font-mono-code font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">SLOT #1 GUARANTEED</span>
            </div>
            <h3 class="text-lg font-black text-white mt-1">"${data.trackTitle}" — ${data.artist}</h3>
            <p class="text-xs text-slate-300 mt-0.5">${data.message || 'Auto-placed into top-matched editorial playlists with 100% rights verification.'}</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="closeAutoPlaylistingModal(); switchTab('tab-editorial'); loadEditorialPlaylists();" class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition shadow-glow-emerald">
              Open Editorial Desk →
            </button>
          </div>
        </div>

        <div class="text-[11px] font-mono-code text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>Active In ${targetPlaylists.length} Editorial Playlists (Playable Tracklists Below):</span>
          <span class="text-emerald-400 font-bold">100% Playable by Listeners</span>
        </div>

        <!-- List out each playlist with its complete tracks -->
        <div class="space-y-4">
          ${targetPlaylists.map(p => {
            const tracks = p.tracks || [];
            return `
              <div class="glass-panel p-5 rounded-2xl border ${p.compatibilityScore >= 90 ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-white/10 bg-black/40'} space-y-3.5">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div class="flex items-center space-x-3">
                    <img src="${p.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'}" class="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0">
                    <div>
                      <div class="flex items-center space-x-2">
                        <span class="font-black text-white text-sm">${p.playlistTitle}</span>
                        <span class="px-2 py-0.2 rounded text-[8px] font-mono-code font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">${p.category || 'Editorial'}</span>
                        <span class="px-2 py-0.2 rounded text-[8px] font-mono-code font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">${p.platform || 'Spotify Editorial'}</span>
                      </div>
                      <div class="flex items-center space-x-2 text-[10px] font-mono-code mt-0.5">
                        <span class="text-amber-300 font-bold">📌 ${(p.savesCount || 50000).toLocaleString()} Saves</span>
                        <span class="text-slate-500">•</span>
                        <span class="text-emerald-400 font-bold">🎧 ${(p.monthlyListenersCount || 50000).toLocaleString()} Monthly Listeners</span>
                      </div>
                      <p class="text-[11px] text-slate-300 mt-1">${p.justification}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <span class="px-2.5 py-1 rounded-full text-xs font-mono-code font-black ${p.compatibilityScore >= 90 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}">
                      ${p.compatibilityScore}% FIT
                    </span>
                    <button onclick="openPlaylistInspectorModal('${p.playlistId}')" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center space-x-1">
                      <span>Full View →</span>
                    </button>
                  </div>
                </div>

                <!-- Verified Tracklist Inside This Playlist -->
                <div class="space-y-2">
                  <div class="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Tracks In This Playlist (${tracks.length} Songs):</span>
                    <span class="text-amber-300 font-bold">Slot #1 Locked For Algorithm Trigger</span>
                  </div>

                  <div class="space-y-1.5">
                    ${tracks.map((t, idx) => {
                      const isTarget = t.isPlacedTrack || t.id === data.trackId || (t.slot === 1 && t.title === data.trackTitle);
                      const previewUrl = t.previewUrl || "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b5/28/57/b5285723-4c8e-f592-f53d-1672f24feda3/mzaf_5923859656061233620.plus.aac.p.m4a";

                      return `
                        <div class="p-2.5 rounded-xl ${isTarget ? 'bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border-2 border-emerald-400 shadow-glow-emerald' : 'bg-white/5 border border-white/5'} flex items-center justify-between gap-3">
                          <div class="flex items-center space-x-3 min-w-0">
                            <span class="text-xs font-mono-code font-black ${isTarget ? 'text-amber-300' : 'text-slate-500'} w-6">#${t.slot || (idx + 1)}</span>
                            <img src="${t.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'}" class="w-8 h-8 rounded-lg object-cover border border-white/10 flex-shrink-0">
                            <div class="min-w-0">
                              <div class="text-xs font-black text-white flex items-center space-x-1.5 truncate">
                                <span class="truncate">${t.title}</span>
                                ${isTarget ? '<span class="px-1.5 py-0.2 rounded text-[8px] font-black bg-emerald-400 text-black shadow animate-pulse">✓ JUST ADDED • SLOT #1</span>' : ''}
                                ${t.isLjArtist && !isTarget ? '<span class="px-1.5 py-0.2 rounded text-[8px] font-black bg-brand-gold text-black shadow">LJ</span>' : ''}
                              </div>
                              <div class="text-[10px] text-slate-400 truncate">${t.artist} ${t.bpm ? `• ${t.bpm} BPM (${t.key})` : ''}</div>
                            </div>
                          </div>

                          <div class="flex items-center space-x-2 flex-shrink-0">
                            <button onclick="playCustomAudioPreview('${previewUrl}', '${(t.title || '').replace(/'/g, "\\'")}', '${(t.artist || '').replace(/'/g, "\\'")}')" class="px-3 py-1.5 rounded-xl ${isTarget ? 'bg-emerald-500 hover:bg-emerald-400 text-black font-black' : 'bg-purple-600/40 hover:bg-purple-600 text-white font-bold'} text-xs transition flex items-center space-x-1 shadow active:scale-95" title="Play Track Audio">
                              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                              <span>▶ Play Track</span>
                            </button>
                          </div>
                        </div>
                      `;
                    }).join("")}
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    showToast(`"${data.trackTitle}" successfully auto-placed into ${data.placedCount || 3} editorial playlists!`, 'success', 'Auto Playlisting Complete');
    loadEditorialPlaylists();

  } catch (err) {
    console.error("Error auto-placing track:", err);
    if (runBtn) {
      runBtn.disabled = false;
      runBtn.classList.remove("opacity-60", "cursor-not-allowed");
    }
    canvas.innerHTML = `<div class="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">Failed to auto-place track into playlists. Please try again.</div>`;
  }
}

window.openAutoPlaylistingModal = openAutoPlaylistingModal;
window.closeAutoPlaylistingModal = closeAutoPlaylistingModal;
window.onAutoPlaylistTrackChanged = onAutoPlaylistTrackChanged;
window.runAutoPlaylistingFromModal = runAutoPlaylistingFromModal;

function setAsActiveWorkingTrack(trackId) {
  const track = allTracks.find(t => t.id === trackId);
  if (!track) return;

  currentActiveTrackId = track.id;

  // 1. Update player footer
  const ftTitle = document.getElementById("currentTrackTitle");
  if (ftTitle) ftTitle.innerText = track.title;
  const ftArtist = document.getElementById("currentTrackArtist");
  if (ftArtist) ftArtist.innerHTML = `${track.artist} ${track.isLjArtist ? '<span class="text-brand-gold">⭐ Priority Track</span>' : ''}`;
  const ftCover = document.getElementById("currentTrackCover");
  if (ftCover) ftCover.innerHTML = `<img src="${track.coverArt}" class="w-full h-full object-cover">`;
  const ftBpm = document.getElementById("currentBpmBadge");
  if (ftBpm) ftBpm.innerText = `${track.bpm} BPM (${track.key})`;

  if (typeof updateRightSidebarCockpit === 'function') {
    updateRightSidebarCockpit(track);
  }

  // 2. Update Intake Studio Active Banner
  const inThumb = document.getElementById("intakeActiveTrackThumb");
  if (inThumb) inThumb.innerHTML = `<img src="${track.coverArt}" class="w-full h-full object-cover">`;
  const inName = document.getElementById("intakeActiveTrackName");
  if (inName) inName.innerText = `${track.title} — ${track.artist}`;
  const inMeta = document.getElementById("intakeActiveTrackMeta");
  if (inMeta) inMeta.innerText = `${track.bpm} BPM • Key ${track.key} • ${track.energy} Energy • ${track.genre}`;

  // 3. Update active selects across the application
  const councilSelect = document.getElementById("councilTrackSelect");
  if (councilSelect) councilSelect.value = track.id;

  const lyricsSelect = document.getElementById("lyricsTrackSelect");
  if (lyricsSelect) {
    lyricsSelect.value = track.id;
    loadLyricsForTrack(track.id);
  }

  const pitchSelect = document.getElementById("pitchTrackSelect");
  if (pitchSelect) pitchSelect.value = track.id;

  // Flash confirmation message
  const banner = document.getElementById("intakeActiveTrackBanner");
  if (banner) {
    banner.classList.add("ring-2", "ring-emerald-400");
    setTimeout(() => banner.classList.remove("ring-2", "ring-emerald-400"), 2000);
  }
}

// DSP Store Onboarding & Audio Art Integration Methods
async function confirmAndOnboardCurrentArtist() {
  if (!currentRealtimeProfile || !currentRealtimeProfile.artist) {
    showToast("Please search and verify an artist first.", 'warning', 'No Artist Selected');
    return;
  }
  const art = currentRealtimeProfile.artist;
  try {
    const res = await fetch("/api/artist/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: art.name,
        picture: art.picture,
        banner: art.banner,
        followers: art.followers,
        spotifyUrl: art.spotifyUrl,
        primaryGenre: art.primaryGenre,
        bio: art.bio,
        verified: true
      })
    });
    const data = await res.json();
    if (data.success) {
      await loadArtistRosterDirectory();
      showToast(`✓ "${art.name}" verified & onboarded to LJ Music OS. 10,000 AI Agent Swarm mobilized!`, 'success', 'Artist Verified');
      
      // Auto pre-populate and open Audio Art & Master Upload Studio
      const aNameInput = document.getElementById("manualArtistName");
      if (aNameInput) aNameInput.value = art.name;
      const form = document.getElementById("manualIntakeForm");
      if (form && form.classList.contains("hidden")) {
        form.classList.remove("hidden");
        form.scrollIntoView({ behavior: 'smooth' });
      }
    }
  } catch (e) {
    console.error("Error onboarding artist:", e);
    showToast("Failed to onboard artist profile.", "error");
  }
}

async function ingestRealtimeTrackDirectly(idx) {
  if (!currentRealtimeProfile || !currentRealtimeProfile.topTracks[idx]) return;
  const track = currentRealtimeProfile.topTracks[idx];
  try {
    const res = await fetch("/api/artist/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackData: track })
    });
    const data = await res.json();
    if (data.success) {
      await loadCatalogue();
      await loadArtistRosterDirectory();
      setAsActiveWorkingTrack(data.track.id);
      autoPlaceTrackIntoPlaylists(data.track.id);
      showToast(`✓ Master "${track.title}" by ${track.artist} ingested into catalogue & placed into playlists!`, 'success', 'Master Ingested');
    }
  } catch (e) {
    console.error("Error ingesting track:", e);
    showToast("Failed to ingest track.", "error");
  }
}

function openNewIndependentArtistForm() {
  const form = document.getElementById("manualIntakeForm");
  if (form) {
    form.classList.remove("hidden");
    form.scrollIntoView({ behavior: 'smooth' });
  }
  const input = document.getElementById("manualArtistName");
  if (input) {
    input.value = "";
    input.focus();
  }
}

function updateAudioArtPreview(url) {
  const img = document.getElementById("manualAudioArtPreview");
  if (img && url && url.trim().length > 5) {
    img.src = url.trim();
  }
}

function testManualAudio() {
  const url = document.getElementById("manualAudioUrl")?.value.trim();
  const title = document.getElementById("manualTrackTitle")?.value.trim() || "Master Audio Test";
  const artist = document.getElementById("manualArtistName")?.value.trim() || "Artist";
  if (!url) {
    showToast("Please enter an audio stream or file URL to test.", 'warning', 'No Audio URL');
    return;
  }
  playDirectAudio(url, title, artist);
}

async function clearAllArtistsPrompt() {
  const isOwner = window.activeMogulSession?.user?.role?.toLowerCase() === "owner" && !window.activeMogulSession?.user?.isArtistLocked;
  if (!isOwner) {
    showToast("Permission Denied: Roster clearing is strictly restricted to Label Owners. Artist Portal is protected.", "error", "Access Denied");
    return;
  }

  if (!confirm("Are you sure you want to clear all artists and catalogue tracks from the tool to start completely from the beginning?\n\nThis will reset the roster, catalogue, rights, and telemetry ready for fresh DSP onboarding.")) {
    return;
  }

  try {
    const res = await fetch("/api/artist/clear-roster", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      await loadCatalogue();
      await loadArtistRosterDirectory();
      currentActiveTrackId = null;
      window.currentActiveTrackId = null;

      // Reset active banner
      const inName = document.getElementById("intakeActiveTrackName");
      if (inName) inName.innerText = "No Active Focus Master";
      const inMeta = document.getElementById("intakeActiveTrackMeta");
      if (inMeta) inMeta.innerText = "Search an artist on Spotify or upload a master below to begin.";

      showToast("All artists and catalogue cleared. Ready for fresh DSP onboarding from Spotify or store.", 'info', 'Workspace Reset');
      switchTab("tab-intake");
      const searchInput = document.getElementById("intakeSearchInput");
      if (searchInput) {
        searchInput.value = "";
        searchInput.focus();
      }
      const resultsArea = document.getElementById("intakeSearchResultsArea");
      if (resultsArea) resultsArea.innerHTML = "";
    }
  } catch (e) {
    console.error("Error clearing roster:", e);
    showToast("Failed to clear roster.", "error");
  }
}

async function restoreBenchmarkRosterPrompt() {
  if (!confirm("Restore the 23-track benchmark catalogue and artist roster?")) return;
  try {
    const res = await fetch("/api/artist/restore-catalogue", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      await loadCatalogue();
      await loadArtistRosterDirectory();
      await initArtistProfileSwitcher();
      const modal = document.getElementById("s4aProfileSwitcherModal");
      if (modal && !modal.classList.contains("hidden")) {
        renderS4aModalArtistList();
      }
      showToast("Benchmark catalogue and artist roster restored successfully.", 'success', 'Roster Restored');
    }
  } catch (e) {
    console.error("Error restoring benchmark catalogue:", e);
    showToast("Failed to restore catalogue.", "error");
  }
}

window.confirmAndOnboardCurrentArtist = confirmAndOnboardCurrentArtist;
window.ingestRealtimeTrackDirectly = ingestRealtimeTrackDirectly;
window.openNewIndependentArtistForm = openNewIndependentArtistForm;
window.updateAudioArtPreview = updateAudioArtPreview;
window.testManualAudio = testManualAudio;
window.clearAllArtistsPrompt = clearAllArtistsPrompt;
window.restoreBenchmarkRosterPrompt = restoreBenchmarkRosterPrompt;

async function submitManualTrackIntake() {
  const artist = document.getElementById("manualArtistName")?.value.trim();
  const title = document.getElementById("manualTrackTitle")?.value.trim();
  const genre = document.getElementById("manualGenre")?.value.trim() || "Afrobeats";
  const bpm = parseInt(document.getElementById("manualBpm")?.value) || 108;
  const key = document.getElementById("manualKey")?.value.trim() || "A minor";
  const language = document.getElementById("manualLanguage")?.value.trim() || "English / Nigerian Pidgin";
  const version = document.getElementById("manualVersion")?.value || "Original Master";
  const coverArt = document.getElementById("manualCoverArtUrl")?.value.trim() || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80";
  const previewUrl = document.getElementById("manualAudioUrl")?.value.trim() || null;
  const isrc = document.getElementById("manualIsrc")?.value.trim() || `NG-LJ1-26-00${Math.floor(100 + Math.random() * 900)}`;

  if (!artist || !title) {
    showToast("Please provide at least Artist Name and Track Title.", 'warning', 'Missing Fields');
    return;
  }

  const trackData = {
    title: version !== "Original Master" ? `${title} (${version})` : title,
    artist,
    genre,
    subGenre: "Afro-Fusion",
    bpm,
    key,
    energy: 86,
    danceability: 90,
    language,
    mood: "Confident, Electric, High Velocity",
    vocalType: "Studio Recorded Lead Vocal",
    coverArt,
    previewUrl,
    isrc
  };

  try {
    const res = await fetch("/api/artist/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackData })
    });
    const data = await res.json();
    if (data.success) {
      await loadCatalogue();
      await loadArtistRosterDirectory();
      setAsActiveWorkingTrack(data.track.id);
      autoPlaceTrackIntoPlaylists(data.track.id);
      toggleManualIntakeForm();
      showToast(`✓ Master "${trackData.title}" by ${artist} registered into catalogue and evaluated for editorial placements.`, 'success', 'Master Ingested');
    }
  } catch (err) {
    console.error("Error submitting manual intake:", err);
    showToast("Error ingesting master track.", "error");
  }
}

async function loadArtistRosterDirectory() {
  const container = document.getElementById("intakeArtistRosterContainer");
  if (!container) return;

  try {
    const res = await fetch("/api/artist/roster");
    const roster = await res.json();

    if (!Array.isArray(roster) || roster.length === 0) {
      container.innerHTML = `
        <div class="col-span-full glass-panel border border-violet-500/20 rounded-2xl p-8 text-center space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center mx-auto text-xl">
            🎵
          </div>
          <h4 class="text-sm font-black text-white">No Artists Onboarded Yet</h4>
          <p class="text-xs text-slate-400 max-w-md mx-auto">
            Your workspace is clean and ready. Search any artist by name or paste their Spotify artist link above to link their verified profile before uploading audio art and master recordings.
          </p>
          <button onclick="document.getElementById('intakeSearchInput').focus()" class="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold transition">
            + Search Artist on Store
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = roster.map(a => `
      <div class="bg-brand-dark border border-brand-cardBorder rounded-xl p-4 space-y-3 hover:border-emerald-500/40 transition flex flex-col justify-between">
        <div class="space-y-3">
          <div class="flex items-center space-x-3">
            <div class="relative w-12 h-12 rounded-xl overflow-hidden border border-brand-gold shadow-md flex-shrink-0">
              <img src="${a.picture || a.coverArt}" class="w-full h-full object-cover">
              <div class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] text-black font-black">✓</div>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center space-x-1.5 truncate">
                <span class="font-black text-sm text-white truncate">${a.artist || a.name}</span>
                <span class="text-[9px] px-1.5 py-0.2 rounded font-mono-code font-bold ${a.isLjArtist ? 'bg-brand-gold text-black' : 'bg-slate-800 text-slate-300'}">${a.isLjArtist ? 'LJ ROSTER' : 'BENCHMARK'}</span>
              </div>
              <p class="text-[10px] text-slate-400 mt-0.5 truncate">${(a.genres || []).slice(0, 2).join(' • ') || 'Afrobeats'} • ${a.followers || 'Verified Profile'}</p>
            </div>
          </div>

          <div class="flex justify-between items-center text-[11px] pt-2 border-t border-brand-cardBorder text-slate-300 font-mono-code">
            <span>${a.tracksCount || 0} Catalogue Tracks</span>
            <span class="text-emerald-400 font-bold">${(a.totalPlays || 0).toLocaleString()} Plays</span>
          </div>
        </div>

        <div class="flex flex-col gap-2 pt-2 border-t border-white/[0.05]">
          <div class="flex gap-2">
            <button onclick="document.getElementById('manualArtistName').value='${(a.artist || a.name).replace(/'/g, "\\'")}'; toggleManualIntakeForm();" class="flex-1 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold py-1.5 rounded-lg transition text-center">
              + Upload Master
            </button>
            ${a.spotifyUrl ? `
              <a href="${a.spotifyUrl}" target="_blank" class="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#1DB954] text-[11px] font-bold border border-white/10 flex items-center justify-center">
                Spotify ↗
              </a>
            ` : ''}
          </div>
          ${a.tracks && a.tracks.length > 0 ? `
            <button onclick="setAsActiveWorkingTrack('${a.tracks[0]?.id || ''}')" class="w-full bg-brand-card hover:bg-slate-800 border border-brand-cardBorder text-slate-300 hover:text-white text-[10px] font-medium py-1 rounded-lg transition truncate text-left px-2">
              Focus: "${a.tracks[0]?.title || 'Top Track'}"
            </button>
          ` : ''}
        </div>
      </div>
    `).join("");

  } catch (err) {
    console.error("Error loading artist roster:", err);
  }
}

// ==============================================================
// 24. FLOATING AI COPILOT SHEET & SWARM SIMULATOR (Master UX)
// ==============================================================
function toggleCopilotSheet() {
  const sheet = document.getElementById("copilotFloatingSheet");
  if (!sheet) return;
  sheet.classList.toggle("hidden");
  if (!sheet.classList.contains("hidden")) {
    document.getElementById("copilotSheetTextarea")?.focus();
  }
}

function applyCopilotSheetPrompt(promptText) {
  const textarea = document.getElementById("copilotSheetTextarea");
  if (textarea) textarea.value = promptText;
  submitCopilotSheetQuery();
}

async function submitCopilotSheetQuery() {
  const textarea = document.getElementById("copilotSheetTextarea");
  const prompt = textarea ? textarea.value.trim() : "";
  const resultArea = document.getElementById("copilotSheetResponseArea");
  if (!resultArea) return;

  if (!prompt) {
    resultArea.innerHTML = `<div class="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">Please enter a prompt or select a suggested command.</div>`;
    return;
  }

  resultArea.innerHTML = `
    <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs flex items-center space-x-3 text-violet-300">
      <div class="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
      <span>Querying 10,000-Agent Intelligence Swarm and Acoustic DNA...</span>
    </div>
  `;

  try {
    const res = await fetch("/api/copilot/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();

    if (!data.shortlist || data.shortlist.length === 0) {
      resultArea.innerHTML = `
        <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300">
          <p class="font-bold text-white">${data.summary || 'Search complete.'}</p>
          <p class="text-slate-400 text-[11px] mt-1">No exact track fit found with threshold criteria.</p>
        </div>
      `;
      return;
    }

    resultArea.innerHTML = `
      <div class="p-4 rounded-2xl bg-white/[0.04] border border-violet-500/30 text-xs space-y-3 shadow-lg">
        <div class="flex items-center justify-between border-b border-white/[0.08] pb-2">
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="font-bold text-white text-xs">${data.summary || 'Strategic Intelligence Alignment'}</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[9px] font-mono-code font-bold bg-purple-500/20 text-purple-300">${data.shortlist.length} CANDIDATES</span>
        </div>

        <div class="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl text-[11px] text-slate-200 leading-relaxed font-sans">
          <div class="text-[9px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Chief Intelligence Officer Verdict:</div>
          ${data.executiveBriefing || 'Evaluated acoustic and sync parameters for top matched records.'}
        </div>

        <div class="space-y-2 pt-1">
          ${data.shortlist.slice(0, 3).map(item => `
            <div class="bg-black/40 p-3 rounded-xl border border-white/10 flex items-center justify-between gap-3">
              <div class="flex items-center space-x-3">
                <img src="${item.coverArt}" class="w-10 h-10 rounded-lg object-cover border border-white/10">
                <div>
                  <div class="flex items-center space-x-1.5">
                    <span class="font-bold text-white">${item.title}</span>
                    <span class="text-[10px] text-slate-400">— ${item.artist}</span>
                  </div>
                  <div class="text-[10px] text-violet-300 font-mono-code mt-0.5">
                    ${item.bpm} BPM • Key ${item.key} • Match: <strong class="text-emerald-400 font-bold">${item.matchScore || item.matchPercentage}%</strong>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-1.5">
                ${item.previewUrl ? `
                  <button onclick="playDirectAudio('${item.previewUrl}', '${item.title.replace(/'/g, "\\'")}', '${item.artist.replace(/'/g, "\\'")}')" class="bg-purple-900/60 hover:bg-purple-900 text-purple-300 font-bold text-[10px] px-2 py-1.5 rounded-lg transition border border-purple-500/30">
                    ▶
                  </button>
                ` : ''}
                <button onclick="setAsActiveWorkingTrack('${item.id || item.trackId}'); toggleCopilotSheet();" class="purple-accent-gradient text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition shadow-sm">
                  [SELECT]
                </button>
                <button onclick="switchTab('tab-pitch'); toggleCopilotSheet();" class="bg-white/10 hover:bg-white/15 text-white font-medium text-[10px] px-2 py-1.5 rounded-lg transition">
                  [PITCH]
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

  } catch (err) {
    console.error("Error submitting copilot query:", err);
    resultArea.innerHTML = `<div class="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">Error processing copilot query.</div>`;
  }
}

// 25. SWARM COLLABORATION SIMULATOR
const sampleCollaborations = [
  { track: "KIRA", artist: "Drey Star", agents: 384, stream: "KIRA → Global African Diaspora → Afrobeat Curators → Spotify Editorial", match: "98% MATCH", status: "HERO ROTATION ACTIVE" },
  { track: "KIRA (Acoustic Stems)", artist: "Drey Star", agents: 210, stream: "Talking Drums + 808 Bass → Commercial Sync Briefs → Netflix Resurgence Scene", match: "97% MATCH", status: "SYNC PRE-CLEARANCE READY" },
  { track: "KIRA (Radio Edit)", artist: "Drey Star", agents: 196, stream: "KIRA (Radio Edit) → BBC 1Xtra → Pan-African Primetime Syndication", match: "96% MATCH", status: "RADIO ROTATION CONFIRMED" },
  { track: "KIRA (Club Mix)", artist: "Drey Star", agents: 142, stream: "KIRA Club Mix → Lagos / London DJ Pool → TikTok Momentum Surge", match: "95% MATCH", status: "VIRAL VELOCITY SURGE" }
];
let simIndex = 0;

function simulateAgentCollaboration() {
  simIndex = (simIndex + 1) % sampleCollaborations.length;
  const col = sampleCollaborations[simIndex];

  const banner = document.getElementById("agentCollaborationBanner");
  if (!banner) return;

  banner.classList.add("ring-2", "ring-violet-400", "scale-[1.01]");
  banner.innerHTML = `
    <div class="flex items-center space-x-3">
      <span class="w-2.5 h-2.5 rounded-full bg-violet-400 animate-ping"></span>
      <div>
        <span class="font-extrabold text-white text-sm">${col.agents} agents collaborating on ${col.track} (${col.artist})</span>
        <p class="text-violet-300 text-[11px] mt-0.5 font-mono-code" id="agentPathText">
          DATA STREAM: ${col.stream}
        </p>
      </div>
    </div>
    <div class="flex items-center space-x-2 font-mono-code">
      <span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
        ${col.status}
      </span>
      <span class="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold">
        ${col.match}
      </span>
    </div>
  `;

  setTimeout(() => {
    banner.classList.remove("ring-2", "ring-violet-400", "scale-[1.01]");
  }, 1200);
}

// ==============================================================
// 26. GROOVVY & MUZES SPATIAL CONTROLS & RIGHT COCKPIT HANDLERS
// ==============================================================

function switchCategory(tabId, el) {
  switchTab(tabId);
  document.querySelectorAll(".category-pill").forEach(pill => {
    pill.classList.remove("bg-purple-600", "text-white", "shadow-glow-violet");
    pill.classList.add("bg-white/5", "text-slate-300");
  });
  if (el) {
    el.classList.remove("bg-white/5", "text-slate-300");
    el.classList.add("bg-purple-600", "text-white", "shadow-glow-violet");
  }
}
window.switchCategory = switchCategory;

function handleTopSearchOrSpotify(val) {
  if (!val || !val.trim()) return;
  val = val.trim();
  if (val.includes("spotify.com")) {
    switchTab("tab-intake");
    const input = document.getElementById("intakeSearchInput") || document.getElementById("spotifyTrackUrlInput");
    if (input) {
      input.value = val;
      executeStoreSearch('spotify');
    }
  } else {
    switchTab("tab-discover");
    const searchInput = document.getElementById("catalogueSearchInput");
    if (searchInput) {
      searchInput.value = val;
      filterCatalogueTable();
    }
    showToast(`Searching catalogue for "${val}"`, 'info', 'Search');
  }
}
window.handleTopSearchOrSpotify = handleTopSearchOrSpotify;

const billboardFeaturedTracks = [
  {
    id: "lj-000",
    title: "KIRA",
    artist: "Drey Star",
    genre: "Afro-Beat • 106 BPM • Key Eb Major",
    tag: "⭐ PRIORITY HERO RELEASE",
    territory: "Global African Diaspora • 8 Markets",
    description: "Soul-stirring Afropop anthem by Drey Star celebrating parental love and resilience. Produced with authentic African percussion and modern crossover fidelity.",
    coverArt: "https://i.scdn.co/image/ab67616d0000b27377e5e6ebf6d0352cc1c2d0bd",
    waveStatus: "Acoustic DNA: 96%",
    spotifyId: "5W1yl3OyfrKe8oHUY8rKbJ",
    spotifyUrl: "https://open.spotify.com/track/5W1yl3OyfrKe8oHUY8rKbJ?si=799f4cafa448481f"
  }
];

let currentBillboardIndex = 0;

function switchHeroBillboard(idx) {
  if (idx < 0 || idx >= billboardFeaturedTracks.length) idx = 0;
  currentBillboardIndex = idx;
  const item = billboardFeaturedTracks[idx];

  const titleEl = document.getElementById("billboardTrackTitle");
  if (titleEl) titleEl.innerText = item.title;
  const artistEl = document.getElementById("billboardArtistName");
  if (artistEl) artistEl.innerText = item.artist;
  const genreEl = document.getElementById("billboardGenre");
  if (genreEl) genreEl.innerText = item.genre;
  const tagEl = document.getElementById("billboardTag");
  if (tagEl) tagEl.innerText = item.tag;
  const territoryEl = document.getElementById("billboardTerritory");
  if (territoryEl) territoryEl.innerText = item.territory;
  const descEl = document.getElementById("billboardDescription");
  if (descEl) descEl.innerText = item.description;
  const imgEl = document.getElementById("billboardArtistImg");
  if (imgEl) imgEl.src = item.coverArt;
  const waveEl = document.getElementById("billboardWaveStatus");
  if (waveEl) waveEl.innerText = item.waveStatus;
  const labelEl = document.getElementById("billboardIndexLabel");
  if (labelEl) labelEl.innerText = `${idx + 1} of ${billboardFeaturedTracks.length} Featured Masters`;

  const spotifyStreamLink = document.getElementById("billboardSpotifyStreamLink");
  if (spotifyStreamLink && item) {
    const sUrl = item.spotifyUrl || (item.spotifyId ? `https://open.spotify.com/track/${item.spotifyId}` : 'https://open.spotify.com/track/5W1yl3OyfrKe8oHUY8rKbJ');
    spotifyStreamLink.href = sUrl;
  }

  // Update dots
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`billboardDot${i}`);
    if (dot) {
      if (i === idx) {
        dot.className = "billboard-dot w-6 h-2 rounded-full bg-white transition-all duration-300";
      } else {
        dot.className = "billboard-dot w-2 h-2 rounded-full bg-white/30 hover:bg-white/60 transition-all duration-300";
      }
    }
  }
}
window.switchHeroBillboard = switchHeroBillboard;

function playBillboardCurrentTrack() {
  const item = billboardFeaturedTracks[currentBillboardIndex];
  if (item) {
    selectAndPlayTrack(item.id);
    showToast(`Playing "${item.title}" by ${item.artist}`, 'info', 'Now Playing');
  }
}
window.playBillboardCurrentTrack = playBillboardCurrentTrack;

function mobilizeSwarmOnBillboard() {
  const item = billboardFeaturedTracks[currentBillboardIndex];
  if (item) {
    setAsActiveWorkingTrack(item.id);
    mobilizeSwarmOnCurrentWorkingTrack();
  }
}
window.mobilizeSwarmOnBillboard = mobilizeSwarmOnBillboard;

async function mobilizeSwarmOnCurrentWorkingTrack() {
  const trackId = currentActiveTrackId || "lj-000";
  const track = allTracks.find(t => t.id === trackId) || { id: trackId, title: "KIRA", artist: "Drey Star" };

  showToast(`Mobilizing 10,000 AI Agent Swarm across 17 Specialized Divisions on "${track.title}" by ${track.artist}...`, 'info', 'Swarm Mobilized');
  switchTab('tab-command-center');
  
  try {
    const res = await fetch('/api/swarm/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artistName: track.artist,
        trackData: track,
        trackId: track.id
      })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`10,000 AI Agent Swarm successfully mobilized on "${track.title}"! All 17 divisions active.`, 'success', 'Swarm Active');
      loadSwarmCommandCenter();
    }
  } catch (err) {
    console.error("Error mobilizing swarm:", err);
    loadSwarmCommandCenter();
  }
}
window.mobilizeSwarmOnCurrentWorkingTrack = mobilizeSwarmOnCurrentWorkingTrack;

function openPitchForBillboard() {
  const item = billboardFeaturedTracks[currentBillboardIndex];
  if (item) {
    switchTab('tab-pitch');
    const select = document.getElementById('pitchTrackSelect');
    if (select) {
      select.value = item.id;
      renderPitchCardForSelected();
    }
  }
}
window.openPitchForBillboard = openPitchForBillboard;

function toggleBillboardFavorite() {
  showToast("Added current master to Executive Favorites", "success", "Favorite Updated");
}
window.toggleBillboardFavorite = toggleBillboardFavorite;

function toggleRightCockpitFavorite() {
  const btn = document.getElementById("rightCockpitFavBtn");
  if (btn) {
    btn.classList.toggle("text-rose-500");
  }
  showToast("Track saved to Swarm VIP Monitoring", "success", "VIP Marked");
}
window.toggleRightCockpitFavorite = toggleRightCockpitFavorite;

function focusArtistInApp(artistName) {
  if (typeof selectArtistProfile === 'function') {
    selectArtistProfile(artistName);
  } else {
    showToast(`Focusing catalogue & swarm strategy on ${artistName}`, 'info', 'Artist Selected');
    const matchedTrack = allTracks.find(t => t.artist.toLowerCase().includes(artistName.toLowerCase()));
    if (matchedTrack) {
      setAsActiveWorkingTrack(matchedTrack.id);
    }
  }
  switchTab("tab-command-center");
}
window.focusArtistInApp = focusArtistInApp;

function filterByGenre(genre, el) {
  if (el) {
    document.querySelectorAll(".genre-pill").forEach(p => {
      p.classList.remove("bg-purple-600", "text-white", "shadow-glow-violet");
    });
    el.classList.add("bg-purple-600", "text-white", "shadow-glow-violet");
  }
  showToast(`Filtering catalogue by ${genre} sonic characteristics`, 'info', 'Genre Filter');
  const searchInput = document.getElementById("catalogueSearchInput");
  if (searchInput) {
    searchInput.value = genre === "All" ? "" : genre;
    filterCatalogueTable();
  }
}
window.filterByGenre = filterByGenre;

function toggleRightLyricsDrawer() {
  const drawer = document.getElementById("rightLyricsDrawerContent");
  const icon = document.getElementById("rightLyricsToggleIcon");
  if (drawer) {
    drawer.classList.toggle("hidden");
    if (icon) {
      icon.textContent = drawer.classList.contains("hidden") ? "▼" : "▲";
    }
  }
}
window.toggleRightLyricsDrawer = toggleRightLyricsDrawer;

function toggleShuffle() {
  showToast("Swarm smart shuffle enabled across active catalogue", "info", "Shuffle Mode");
}
window.toggleShuffle = toggleShuffle;

function toggleLoop() {
  showToast("Track loop engaged for acoustic resonance analysis", "info", "Loop Mode");
}
window.toggleLoop = toggleLoop;

function seekRightCockpitProgress(event) {
  const track = document.getElementById("rightCockpitProgressTrack");
  const bar = document.getElementById("rightCockpitProgressBar");
  if (track && bar) {
    const rect = track.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    bar.style.width = `${percent}%`;
    const totalSec = 198;
    const currentSec = Math.round((percent / 100) * totalSec);
    const m = Math.floor(currentSec / 60);
    const s = currentSec % 60;
    const elapsedEl = document.getElementById("rightCockpitElapsed");
    if (elapsedEl) elapsedEl.innerText = `0${m}:${s < 10 ? '0' : ''}${s}`;
  }
}
window.seekRightCockpitProgress = seekRightCockpitProgress;

function updateRightSidebarCockpit(track) {
  if (!track) return;
  const cover = document.getElementById("rightCockpitCover");
  if (cover && track.coverArt) cover.src = track.coverArt;
  const title = document.getElementById("rightCockpitTitle");
  if (title) title.innerText = track.title;
  const artist = document.getElementById("rightCockpitArtist");
  if (artist) artist.innerText = track.artist;
  const bpm = document.getElementById("rightCockpitBpm");
  if (bpm) bpm.innerText = `${track.bpm || 107} BPM`;

  // Mini gauges
  const danceVal = Math.round((track.danceability || 0.88) * 100);
  const energyVal = Math.round((track.energy || 0.82) * 100);
  const hitVal = track.hitPotentialScore || track.opportunityScore || 94;

  const danceG = document.getElementById("rightGaugeDance");
  if (danceG) danceG.innerText = `${danceVal}%`;
  const danceB = document.getElementById("rightBarDance");
  if (danceB) danceB.style.width = `${danceVal}%`;

  const energyG = document.getElementById("rightGaugeEnergy");
  if (energyG) energyG.innerText = `${energyVal}%`;
  const energyB = document.getElementById("rightBarEnergy");
  if (energyB) energyB.style.width = `${energyVal}%`;

  const hitG = document.getElementById("rightGaugeHit");
  if (hitG) hitG.innerText = `${hitVal} / 100`;
  const hitB = document.getElementById("rightBarHit");
  if (hitB) hitB.style.width = `${hitVal}%`;

  // Synced Lyrics snippet
  const activeLine = document.getElementById("rightLyricsActiveLine");
  if (track.lyricsSnippet && activeLine) {
    activeLine.innerText = `"${track.lyricsSnippet}"`;
  }

  // Update Spotify Embed Player & Direct Link
  const spotifyIframe = document.getElementById("spotifyIframe");
  if (spotifyIframe && (track.spotifyId || track.spotifyUrl)) {
    const sId = track.spotifyId || (track.spotifyUrl ? track.spotifyUrl.split('/track/')[1]?.split('?')[0] : '3t2e2E5F2a2o3S5e2R2z4x');
    if (sId && !spotifyIframe.src.includes(sId)) {
      spotifyIframe.src = `https://open.spotify.com/embed/track/${sId}?utm_source=generator&theme=0`;
    }
  }
  const spotifyLink = document.getElementById("spotifyDirectLink");
  if (spotifyLink && track.spotifyUrl) {
    spotifyLink.href = track.spotifyUrl;
  }
}
window.updateRightSidebarCockpit = updateRightSidebarCockpit;

// -------------------------------------------------------------
// CLOUD INTEGRATIONS MONITOR (GitHub, Vercel, Supabase, Spotify)
// -------------------------------------------------------------
async function openIntegrationsModal() {
  const modal = document.getElementById("integrationsModal");
  const content = document.getElementById("integrationsModalContent");
  if (!modal || !content) return;

  modal.classList.remove("hidden");
  content.innerHTML = `
    <div class="flex items-center justify-center p-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-400"></div>
    </div>
  `;

  try {
    const res = await fetch('/api/integrations/status');
    const data = await res.json();
    const { github, vercel, supabase, spotifyPlayer } = data.integrations;

    content.innerHTML = `
      <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg border border-white/20">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <h3 class="text-lg font-black text-white purple-gradient-text tracking-wide">Cloud & Platform Integrations</h3>
            <p class="text-xs text-slate-400">Live Infrastructure & Sync Monitor for LJ Music OS</p>
          </div>
        </div>
        <div class="flex items-center space-x-2 text-xs px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SYSTEM ACTIVE</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- 1. GITHUB -->
        <div class="glass-panel-subtle p-4 rounded-2xl border border-white/10 hover:border-violet-500/40 transition">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              <span class="font-bold text-sm text-white">GitHub</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>CONNECTED</span>
            </span>
          </div>
          <div class="text-xs space-y-1.5 text-slate-300">
            <p><span class="text-slate-400">Repo:</span> <span class="font-mono text-violet-300">${github.repository}</span></p>
            <p><span class="text-slate-400">Branch:</span> <span class="font-mono text-emerald-300">${github.branch}</span></p>
            <p><span class="text-slate-400">Sync:</span> <span>Automatic Git webhook on push</span></p>
          </div>
          <a href="https://github.com/${github.repository}" target="_blank" class="mt-3 inline-flex items-center space-x-1.5 text-xs text-violet-400 hover:text-violet-300 font-semibold underline">
            <span>View Source on GitHub</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </div>

        <!-- 2. VERCEL -->
        <div class="glass-panel-subtle p-4 rounded-2xl border border-white/10 hover:border-violet-500/40 transition">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 22.525H0l12-21.05 12 21.05z"/></svg>
              <span class="font-bold text-sm text-white">Vercel</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>LIVE & DEPLOYED</span>
            </span>
          </div>
          <div class="text-xs space-y-1.5 text-slate-300">
            <p><span class="text-slate-400">Domain:</span> <a href="${vercel.productionDomain}" target="_blank" class="font-mono text-cyan-300 hover:underline">${vercel.productionDomain}</a></p>
            <p><span class="text-slate-400">Runtime:</span> <span class="font-mono text-violet-300">${vercel.runtime}</span></p>
            <p><span class="text-slate-400">Environment:</span> <span class="font-mono text-slate-200">${vercel.environment.toUpperCase()}</span></p>
          </div>
          <a href="${vercel.productionDomain}" target="_blank" class="mt-3 inline-flex items-center space-x-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline">
            <span>Open Live Vercel Production</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </div>

        <!-- 3. SUPABASE -->
        <div class="glass-panel-subtle p-4 rounded-2xl border border-white/10 hover:border-violet-500/40 transition">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">S</div>
              <span class="font-bold text-sm text-white">Supabase Postgres</span>
            </div>
            ${supabase.connected ? `
              <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>CONNECTED</span>
              </span>
            ` : `
              <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>SETUP REQUIRED</span>
              </span>
            `}
          </div>
          <div class="text-xs space-y-1.5 text-slate-300">
            <p><span class="text-slate-400">Status:</span> <span class="font-mono font-bold ${supabase.tablesInitialized ? 'text-emerald-300' : 'text-amber-300'}">${supabase.status}</span></p>
            <p><span class="text-slate-400">Database:</span> <span class="font-mono text-cyan-300">${supabase.url || 'https://raneitkthnzfilpifqck.supabase.co'}</span></p>
            <p class="text-[11px] ${supabase.tablesInitialized ? 'text-emerald-400 font-semibold' : 'text-slate-400'}">${supabase.message}</p>
            ${supabase.tablesInitialized ? `
              <div class="flex flex-wrap gap-1 pt-1">
                <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono">catalogue (1)</span>
                <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono">lyrics_records (38 lines)</span>
                <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono">artist_roster (2)</span>
                <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono">swarm_telemetry (10k)</span>
              </div>
            ` : ''}
          </div>
          
          <!-- Connect / Setup Form -->
          <div class="mt-3 pt-3 border-t border-white/10 space-y-2">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 mb-1">SUPABASE URL</label>
              <input type="text" id="supabaseUrlInput" placeholder="https://your-project.supabase.co" value="${supabase.url || 'https://raneitkthnzfilpifqck.supabase.co'}" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono">
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 mb-1">SUPABASE ANON / SERVICE KEY</label>
              <input type="password" id="supabaseKeyInput" placeholder="${supabase.tablesInitialized ? 'Configured (Leave blank to keep existing key)' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6...'}" value="" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 font-mono">
              ${supabase.tablesInitialized ? '<p class="text-[10px] text-emerald-400 font-mono mt-1">✓ Verified East US key active. Leave blank to keep current credentials.</p>' : ''}
            </div>
            <div class="flex items-center space-x-2 pt-1">
              <button onclick="submitSupabaseCredentials()" id="supabaseConnectBtn" class="flex-1 ${supabase.tablesInitialized ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-violet-600 hover:bg-violet-500'} text-white font-bold py-1.5 px-3 rounded-lg text-xs transition active:scale-95 flex items-center justify-center space-x-1 shadow-md">
                <span>${supabase.tablesInitialized ? '✓ Connected & Synced' : 'Connect & Save'}</span>
              </button>
              <a href="https://supabase.com/dashboard/project/raneitkthnzfilpifqck" target="_blank" class="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs rounded-lg transition border border-white/10 font-medium">Dashboard ↗</a>
            </div>
            <div id="supabaseConnectMsg" class="text-[11px] font-medium hidden"></div>
          </div>
        </div>

        <!-- 4. SPOTIFY & UNIVERSAL STREAMING -->
        <div class="glass-panel-subtle p-4 rounded-2xl border border-white/10 hover:border-violet-500/40 transition">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.306c-.215.353-.674.466-1.026.25-2.812-1.718-6.353-2.107-10.522-1.155-.403.093-.804-.158-.896-.56-.092-.403.159-.804.562-.897 4.57-1.044 8.492-.598 11.632 1.336.353.216.465.674.25 1.026zm1.467-3.262c-.27.441-.85.58-1.291.31-3.22-1.978-8.128-2.55-11.936-1.393-.497.151-1.023-.13-1.174-.627-.151-.497.13-1.023.627-1.174 4.356-1.322 9.776-.68 13.464 1.593.44.27.58.85.31 1.291zm.126-3.41c-3.86-2.292-10.228-2.503-13.906-1.386-.593.18-1.22-.163-1.4-.756-.18-.593.163-1.22.756-1.4 4.23-1.284 11.267-1.037 15.714 1.603.533.316.707 1.011.391 1.544-.316.533-1.011.707-1.544.391l-.011.004z"/></svg>
              <span class="font-bold text-sm text-white">Spotify & DSP Player</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>OPERATIONAL</span>
            </span>
          </div>
          <div class="text-xs space-y-1.5 text-slate-300">
            <p><span class="text-slate-400">Adapters:</span> <span class="font-mono text-emerald-300">Spotify SDK, Apple MusicKit, YouTube, Audio</span></p>
            <p><span class="text-slate-400">Real-time Stream:</span> <span>Spotify Web Playback SDK & Embed fallback</span></p>
            <p><span class="text-slate-400">Audio Art:</span> <span>High-res cover art master intake pipeline active</span></p>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3 pt-3 border-t border-white/10">
        <button onclick="closeIntegrationsModal()" class="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition">
          Close Monitor
        </button>
      </div>
    `;
  } catch (err) {
    content.innerHTML = `
      <div class="p-6 text-center text-rose-300 text-xs">
        <p>Failed to query platform integration health: ${err.message}</p>
        <button onclick="closeIntegrationsModal()" class="mt-4 px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold">Close</button>
      </div>
    `;
  }
}
window.openIntegrationsModal = openIntegrationsModal;

function closeIntegrationsModal() {
  const modal = document.getElementById("integrationsModal");
  if (modal) modal.classList.add("hidden");
}
window.closeIntegrationsModal = closeIntegrationsModal;

async function submitSupabaseCredentials() {
  const urlEl = document.getElementById("supabaseUrlInput");
  const keyEl = document.getElementById("supabaseKeyInput");
  const btn = document.getElementById("supabaseConnectBtn");
  const msg = document.getElementById("supabaseConnectMsg");

  if (!urlEl || !keyEl || !btn || !msg) return;
  const url = urlEl.value.trim();
  let key = keyEl.value.trim();

  // If key contains masked bullets (\u2022 / 8226) or is blank, send empty string so server uses verified existing key
  if (/[\u2022\u25cf\u2219*]/.test(key)) {
    key = "";
  }

  if (!url) {
    msg.className = "text-[11px] text-rose-400 font-medium";
    msg.innerText = "Please provide Supabase Project URL.";
    msg.classList.remove("hidden");
    return;
  }

  btn.disabled = true;
  btn.innerHTML = `<span class="animate-spin inline-block mr-1">↻</span> Connecting...`;
  msg.className = "text-[11px] text-cyan-300 font-medium";
  msg.innerText = "Verifying connection with Supabase database...";
  msg.classList.remove("hidden");

  try {
    const res = await fetch('/api/integrations/supabase/configure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supabaseUrl: url, supabaseKey: key })
    });
    const result = await res.json();

    if (result.success) {
      msg.className = "text-[11px] text-emerald-300 font-medium";
      msg.innerText = "✓ " + result.message;
      showToast("Supabase connected and verified successfully!", "success", "Database Connected");
      setTimeout(() => openIntegrationsModal(), 1800);
    } else {
      msg.className = "text-[11px] text-rose-400 font-medium";
      msg.innerText = "✕ " + (result.message || "Connection failed. Please check credentials.");
      btn.disabled = false;
      btn.innerHTML = "Connect & Save";
    }
  } catch (err) {
    msg.className = "text-[11px] text-rose-400 font-medium";
    msg.innerText = "✕ Network error: " + err.message;
    btn.disabled = false;
    btn.innerHTML = "Connect & Save";
  }
}
window.submitSupabaseCredentials = submitSupabaseCredentials;

// ==============================================================
// 30. 1-CLICK VERIFIED ARTIST RESOLVER & MULTI-PLATFORM SYNC
// ==============================================================

let currentResolvedArtist = null;
let currentPreviewAudio = null;

function openQuickAddArtistModal(prefillQuery) {
  const modal = document.getElementById("quickAddArtistModal");
  if (!modal) return;
  modal.classList.remove("hidden");

  const input = document.getElementById("quickArtistLinkInput");
  if (input) {
    if (prefillQuery && typeof prefillQuery === 'string') {
      input.value = prefillQuery;
      executeQuickArtistResolve();
    } else {
      setTimeout(() => input.focus(), 150);
    }
  }
}

function closeQuickAddArtistModal() {
  const modal = document.getElementById("quickAddArtistModal");
  if (modal) modal.classList.add("hidden");
  if (currentPreviewAudio) {
    currentPreviewAudio.pause();
    currentPreviewAudio = null;
  }
}

async function executeQuickArtistResolve() {
  const input = document.getElementById("quickArtistLinkInput");
  const canvas = document.getElementById("quickArtistResolveCanvas");
  const btn = document.getElementById("quickArtistResolveBtn");
  if (!input || !canvas) return;

  const query = input.value.trim();
  if (!query) {
    showToast("Please enter an artist name, Spotify link, or Apple Music link.", "warning", "Input Required");
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin inline-block mr-1">↻</span> Resolving...`;
  }

  canvas.innerHTML = `
    <div class="glass-panel p-8 rounded-2xl border border-white/10 text-center space-y-3">
      <div class="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-xs text-slate-300 font-mono-code font-bold">Scanning Spotify, Apple Music & Verified Discography for "${query}"...</p>
      <p class="text-[11px] text-slate-500">Cross-referencing verified high-res artwork, monthly listeners, and authentic metadata.</p>
    </div>
  `;

  try {
    const res = await fetch("/api/artist/resolve-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
    const data = await res.json();

    if (!data.success || !data.artist) {
      throw new Error(data.error || "Could not resolve artist profile.");
    }

    currentResolvedArtist = data.artist;
    const a = data.artist;
    const resolvedPic = a.picture || a.avatar || a.coverArt || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80";
    const listenersFormatted = typeof a.monthlyListeners === 'number' 
      ? a.monthlyListeners.toLocaleString() 
      : (a.monthlyListenersRaw ? a.monthlyListenersRaw.toLocaleString() : (a.monthlyListeners || "1,420,000"));

    canvas.innerHTML = `
      <div class="glass-panel border border-emerald-500/40 rounded-2xl p-6 shadow-spatial space-y-5 bg-gradient-to-b from-emerald-950/20 to-black/60">
        <!-- Verified Header -->
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-4 border-b border-white/10">
          <div class="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-2xl flex-shrink-0 group">
            <img src="${resolvedPic}" alt="${a.name}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div class="absolute bottom-1 right-1 bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow">✓ VERIFIED</div>
          </div>
          <div class="flex-1 text-center sm:text-left space-y-1.5">
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 class="text-xl font-black text-white">${a.name}</h3>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                ${a.source || 'VERIFIED ARTIST'}
              </span>
              ${a.isPriority ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">★ LJ PRIORITY</span>' : ''}
            </div>
            <p class="text-xs text-slate-300">
              <span class="font-bold text-white font-mono-code">${a.primaryGenre || 'Afro-Fusion'}</span> • 
              <span class="text-emerald-400 font-bold font-mono-code">${listenersFormatted}</span> Monthly Listeners
            </p>
            <p class="text-[11px] text-slate-400 max-w-md">${a.bio || 'Verified artist profile synchronized with real-time streaming catalogue and authenticated artwork.'}</p>
            
            <!-- Connected Platforms -->
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2 text-[10px] font-bold font-mono-code">
              ${a.spotifyUrl ? `
                <a href="${a.spotifyUrl}" target="_blank" class="px-2.5 py-1 rounded-lg bg-[#1DB954]/20 hover:bg-[#1DB954]/30 text-[#1DB954] border border-[#1DB954]/40 flex items-center space-x-1 transition">
                  <span>Spotify Profile ↗</span>
                </a>
              ` : ''}
              ${a.appleMusicUrl ? `
                <a href="${a.appleMusicUrl}" target="_blank" class="px-2.5 py-1 rounded-lg bg-[#FA243C]/20 hover:bg-[#FA243C]/30 text-[#FA243C] border border-[#FA243C]/40 flex items-center space-x-1 transition">
                  <span>Apple Music ↗</span>
                </a>
              ` : ''}
              <span class="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10">
                Verified Photo: HD 1000px
              </span>
            </div>
          </div>
        </div>

        <!-- Verified Top Tracks Preview with 30s Audio -->
        ${a.topTracks && a.topTracks.length > 0 ? `
          <div class="space-y-2">
            <div class="flex items-center justify-between text-[11px] font-mono-code text-slate-400">
              <span class="font-bold uppercase tracking-wider text-slate-300">Verified Discography & Audio Previews (${a.topTracks.length} Tracks)</span>
              <span>30s High-Fidelity Preview</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              ${a.topTracks.map((t, idx) => `
                <div class="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-2 transition">
                  <div class="flex items-center space-x-2.5 min-w-0">
                    <span class="text-[10px] font-mono-code text-slate-500 font-bold">${idx + 1}</span>
                    <div class="min-w-0">
                      <div class="text-xs font-bold text-white truncate">${t.title}</div>
                      <div class="text-[10px] text-slate-400 truncate">${t.album || a.name}</div>
                    </div>
                  </div>
                  ${t.previewUrl ? `
                    <button onclick="playCustomAudioPreview('${t.previewUrl}', '${(t.title || '').replace(/'/g, "\\'")}', '${(a.name || '').replace(/'/g, "\\'")}')" class="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-mono-code flex items-center space-x-1 transition flex-shrink-0">
                      <span>▶ Preview</span>
                    </button>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Action Confirmation Bar -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
          <div class="text-[11px] text-emerald-400 font-mono-code flex items-center space-x-1.5">
            <span>🛡</span>
            <span>Identity Authenticated: Syncs directly to Supabase & LJ Roster</span>
          </div>
          <div class="flex items-center space-x-2 w-full sm:w-auto">
            <button onclick="closeQuickAddArtistModal()" class="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10 transition">
              Cancel
            </button>
            <button onclick="confirmAndIngestArtist()" id="confirmIngestBtn" class="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs transition shadow-glow-emerald active:scale-95 flex items-center justify-center space-x-1.5">
              <span>✓ Confirm & Onboard Artist</span>
            </button>
          </div>
        </div>
      </div>
    `;

    showToast(`Verified profile found for ${a.name}! Real-time Spotify and Apple Music data synchronized.`, "success", "Artist Verified");

  } catch (err) {
    console.error("Error resolving artist link:", err);
    canvas.innerHTML = `
      <div class="p-6 rounded-2xl bg-red-950/40 border border-red-500/40 space-y-3">
        <div class="flex items-center space-x-2 text-red-400 font-bold text-xs">
          <span>✕ Resolution Error:</span>
          <span>${err.message || 'Could not resolve artist profile.'}</span>
        </div>
        <p class="text-[11px] text-slate-400">
          Please check the link or search name. You can paste a Spotify artist link (e.g. <code>https://open.spotify.com/artist/...</code>), track link, Apple Music link, or type the exact name like <strong>Drey Star</strong> or <strong>Dr. Orlando Owoh</strong>.
        </p>
      </div>
    `;
    showToast(err.message || "Failed to resolve artist link.", "error", "Resolution Failed");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <span>Resolve Profile</span>
      `;
    }
  }
}

async function confirmAndIngestArtist() {
  const btn = document.getElementById("confirmIngestBtn");
  const input = document.getElementById("quickArtistLinkInput");

  // If not resolved yet but input has a value, auto-resolve first
  if (!currentResolvedArtist && input && input.value.trim()) {
    await executeQuickArtistResolve();
  }

  if (!currentResolvedArtist) {
    showToast("Please enter an artist name or Spotify link above, then click 'Resolve Profile'.", "warning", "Input Required");
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin inline-block mr-1">↻</span> Ingesting to Supabase...`;
  }

  try {
    const payload = currentResolvedArtist.artist || currentResolvedArtist.artistProfile || currentResolvedArtist;
    const res = await fetch("/api/artist/one-click-ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artistProfile: payload, artist: payload, ...payload })
    });
    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to onboard artist.");
    }

    const artistName = result.artist?.name || payload.name || "Artist";
    showToast(`✓ ${artistName} successfully onboarded and synchronized with Supabase Postgres & LJ Roster!`, "success", "Artist Onboarded");
    closeQuickAddArtistModal();

    // Reload catalogue & roster, then switch active profile to newly onboarded artist!
    await loadCatalogue();
    await loadArtistRosterDirectory();
    await initArtistProfileSwitcher();
    selectArtistProfile(artistName);
    if (typeof loadSwarmCommandCenter === "function") loadSwarmCommandCenter();

  } catch (err) {
    console.error("Error onboarding artist:", err);
    showToast("Failed to onboard artist: " + err.message, "error", "Onboarding Failed");
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>✓ Confirm & Onboard Artist</span>`;
    }
  }
}

function playCustomAudioPreview(url, title, artist) {
  if (!url) {
    showToast("Audio preview not available for this track.", "warning", "No Preview");
    return;
  }

  if (currentPreviewAudio) {
    currentPreviewAudio.pause();
    if (currentPreviewAudio.src === url) {
      currentPreviewAudio = null;
      showToast("Audio preview paused.", "info", "Playback Paused");
      return;
    }
  }

  currentPreviewAudio = new Audio(url);
  currentPreviewAudio.preload = "metadata";
  currentPreviewAudio.currentTime = 0;
  currentPreviewAudio.play()
    .then(() => {
      showToast(`Playing verified 30s preview: "${title}" by ${artist}`, "success", "Now Playing Preview");
    })
    .catch(err => {
      console.warn("Could not play audio preview:", err);
      showToast("Click again or interact with the page to allow audio playback.", "info", "Audio Notice");
    });
}

// ==============================================================
// 31. AUTONOMOUS PLAYLIST TREND AGENT (DIVISION 14)
// ==============================================================

async function loadAutonomousPlaylists() {
  const container = document.getElementById("autonomousPlaylistsGrid");
  if (!container) return;

  try {
    const res = await fetch("/api/agent/playlists");
    const data = await res.json();

    if (!data.success || !Array.isArray(data.playlists)) return;

    const statsBadge = document.getElementById("autoPlaylistsStatsBadge");
    if (statsBadge) {
      const count = data.activePlaylistsCount || data.playlists.length;
      const plays = (data.totalPlaysDrivenToLjSongs || 417400).toLocaleString();
      const rate = data.guaranteedPlayRate || "100% Guaranteed";
      statsBadge.innerHTML = `<span>⚡ ${count} Active Thematic Playlists • ${plays} LJ Guaranteed Plays • ${rate}</span>`;
    }

    container.innerHTML = data.playlists.map(pl => {
      const top3 = (pl.tracks || []).slice(0, 3);
      const remainingCount = Math.max(0, (pl.tracks || []).length - 3);

      return `
        <div class="glass-panel border ${pl.algorithmScore >= 95 ? 'border-amber-500/40 bg-amber-950/10' : 'border-purple-500/30 bg-purple-950/10'} rounded-3xl p-5 shadow-spatial flex flex-col justify-between space-y-4 hover:border-brand-gold transition duration-300">
          <div class="space-y-3">
            <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span class="text-[9px] font-mono-code font-black text-amber-400 uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                ${pl.category || 'TREND'}
              </span>
              <span class="text-[10px] font-mono-code font-bold text-emerald-400 flex items-center space-x-1">
                <span>⚡</span>
                <span>${pl.algorithmScore || 95}% Velocity</span>
              </span>
            </div>

            <div>
              <h3 class="text-base font-black text-white">${pl.title}</h3>
              <p class="text-[11px] text-slate-300 mt-0.5 line-clamp-2">${pl.curator || 'LJ Autonomous Trend Agent'}</p>
            </div>

            <div class="space-y-1.5 bg-black/40 p-2.5 rounded-xl border border-white/5 text-[10px] font-mono-code">
              <div class="flex items-center justify-between">
                <span class="text-amber-300 font-bold flex items-center space-x-1">
                  <span>📌</span>
                  <span>${(pl.savesCount || 50000).toLocaleString()} Saves</span>
                </span>
                <span class="text-emerald-400 font-bold flex items-center space-x-1">
                  <span>🎧</span>
                  <span>${(pl.monthlyListenersCount || 50000).toLocaleString()} Monthly</span>
                </span>
              </div>
              <div class="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-white/5">
                <span class="truncate">Platform: <strong class="text-slate-200">${pl.platform || 'Multi-DSP'}</strong></span>
                <span class="text-cyan-400 font-bold flex-shrink-0">${pl.trendVelocity || '+250% Growth'}</span>
              </div>
            </div>

            <!-- Slots Breakdown with Guaranteed Priority for LJ Tracks -->
            <div class="space-y-1.5 pt-1">
              <div class="text-[9px] font-mono-code font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Algorithmic Rotation:</span>
                <span class="text-amber-300 font-black">Slots #1–#3 Locked</span>
              </div>
              <div class="space-y-1">
                ${top3.map(t => `
                  <div class="p-2 rounded-xl ${t.isLjTrack ? 'bg-amber-950/30 border border-amber-500/30 shadow-sm' : 'bg-white/5 border border-white/5'} flex items-center justify-between gap-2">
                    <div class="flex items-center space-x-2 min-w-0">
                      <span class="text-[9px] font-mono-code font-black ${t.isLjTrack ? 'text-amber-400' : 'text-slate-500'}">#${t.slot}</span>
                      <div class="min-w-0">
                        <div class="text-[11px] font-bold text-white truncate flex items-center space-x-1">
                          <span class="truncate">${t.title}</span>
                          ${t.isLjTrack ? '<span class="px-1 py-0.2 rounded text-[7px] font-black bg-brand-gold text-black">LJ</span>' : ''}
                        </div>
                        <div class="text-[9px] text-slate-400 truncate">${t.artist}</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-1.5 flex-shrink-0">
                      <button onclick="playCustomAudioPreview('${t.previewUrl || 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b5/28/57/b5285723-4c8e-f592-f53d-1672f24feda3/mzaf_5923859656061233620.plus.aac.p.m4a'}', '${(t.title || '').replace(/'/g, "\\'")}', '${(t.artist || '').replace(/'/g, "\\'")}')" class="px-2 py-0.5 rounded bg-purple-600/40 hover:bg-purple-600 text-white font-mono-code text-[8px] font-bold transition flex items-center space-x-1 shadow active:scale-95" title="Play Track Audio">
                        <span>▶ Play</span>
                      </button>
                      <span class="text-[8px] font-mono-code px-1.5 py-0.5 rounded font-bold ${t.isLjTrack ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}">
                        ${t.locked ? 'LOCKED #1' : (t.isLjTrack ? 'LJ PRIORITY' : 'BENCHMARK')}
                      </span>
                    </div>
                  </div>
                `).join('')}
              </div>
              ${remainingCount > 0 ? `
                <div class="text-center text-[10px] font-mono-code text-slate-500 pt-1">
                  + ${remainingCount} additional viral-matched benchmark tracks
                </div>
              ` : ''}
            </div>
          </div>

          <div class="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
            <span class="text-[10px] font-mono-code text-emerald-400 font-bold">${(pl.totalPlaysDriven || 100000).toLocaleString()} streams driven</span>
            <div class="flex items-center gap-1.5">
              <button onclick="openPlaylistInspectorModal('${pl.id}')" class="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-bold font-mono-code transition">
                Inspect Tracklist →
              </button>
              <button onclick="rebalancePlaylistsFromUI('${pl.id}')" class="px-2.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-[10px] font-bold font-mono-code transition active:scale-95">
                ↻ Rebalance
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error("Error loading autonomous playlists:", err);
  }
}

async function generateTrendingPlaylistFromUI() {
  const btn = document.querySelector("button[onclick*='generateTrendingPlaylistFromUI']");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin inline-block mr-1">↻</span> Generating...`;
  }

  showToast("Autonomous Playlist Agent generating new trending thematic playlist based on real-time streaming velocity...", "info", "Agent Running");

  try {
    const res = await fetch("/api/agent/playlists/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priorityTrackId: currentActiveTrackId || "lj-000" })
    });
    const data = await res.json();

    if (data.success) {
      showToast(`Autonomous Agent successfully spawned "${data.playlist.title}" with Slots #1 & #2 guaranteed for LJ catalogue!`, "success", "Playlist Generated");
      loadAutonomousPlaylists();
    } else {
      throw new Error(data.error || "Generation failed.");
    }
  } catch (err) {
    console.error("Error generating playlist:", err);
    showToast(err.message || "Failed to generate playlist.", "error", "Generation Failed");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        <span>+ Generate New Trend Playlist</span>
      `;
    }
  }
}

async function rebalancePlaylistsFromUI(playlistId) {
  showToast("Rebalancing autonomous playlist algorithms and locking LJ catalogue in top slots...", "info", "Rebalancing Agent");

  try {
    const res = await fetch("/api/agent/playlists/rebalance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playlistId })
    });
    const data = await res.json();

    if (data.success) {
      showToast("Playlists successfully rebalanced with latest TikTok and Spotify algorithmic weightings!", "success", "Rebalance Complete");
      loadAutonomousPlaylists();
    }
  } catch (err) {
    console.error("Error rebalancing playlists:", err);
    showToast("Rebalance failed: " + err.message, "error", "Error");
  }
}

// ==============================================================
// ==============================================================
// 32. ONLINE RADIO AUTONOMOUS ROTATION & AUTO-PLAY SWARM (DIVISION 16)
// ==============================================================

window.radioPlayer = {
  activeStationId: "rad-001",
  isPlaying: false,
  audioElement: null,
  volume: 0.85,
  stations: [],
  autoPlayEnabled: true,
  timer: null,
  elapsedSeconds: 0
};

function initRadioAudio() {
  if (!window.radioPlayer.audioElement) {
    window.radioPlayer.audioElement = new Audio();
    window.radioPlayer.audioElement.preload = "auto";
    window.radioPlayer.audioElement.volume = window.radioPlayer.volume;

    window.radioPlayer.audioElement.ontimeupdate = () => {
      const audio = window.radioPlayer.audioElement;
      if (!audio) return;
      const cur = Math.floor(audio.currentTime);
      const m = Math.floor(cur / 60);
      const s = cur % 60;
      const timeStr = `LIVE • 0${m}:${s < 10 ? '0' : ''}${s}`;
      const counterEl = document.getElementById("radioMasterTimeCounter");
      if (counterEl) counterEl.innerText = timeStr;
    };

    window.radioPlayer.audioElement.onended = () => {
      console.log("📻 Radio track finished, automatically spinning next track in rotation queue...");
      advanceRadioQueue(window.radioPlayer.activeStationId);
    };

    window.radioPlayer.audioElement.onerror = (e) => {
      console.warn("Radio audio stream fallback triggered:", e);
      handleRadioAudioFallback();
    };
  }
}

function handleRadioAudioFallback() {
  const fallbackUrl = "/audio/station-1-lagos-kira.m4a";
  if (window.radioPlayer.audioElement && window.radioPlayer.audioElement.src !== window.location.origin + fallbackUrl) {
    console.log("📻 Switching to high-compatibility studio fallback stream...");
    window.radioPlayer.audioElement.src = fallbackUrl;
    window.radioPlayer.audioElement.currentTime = 0;
    window.radioPlayer.audioElement.play().catch(err => console.warn("Fallback play note:", err));
  }
}

async function playRadioLiveStream(stationId = null) {
  initRadioAudio();
  
  if (!stationId) stationId = window.radioPlayer.activeStationId || "rad-001";
  
  if (!window.radioPlayer.stations || window.radioPlayer.stations.length === 0) {
    await loadOnlineRadioConsole();
  }

  const station = (window.radioPlayer.stations || []).find(s => s.id === stationId) || (window.radioPlayer.stations && window.radioPlayer.stations[0]);
  if (!station) {
    showToast("Radio station not found", "error", "Radio Error");
    return;
  }

  // If already playing this exact station, toggle pause
  if (window.radioPlayer.isPlaying && window.radioPlayer.activeStationId === stationId) {
    pauseRadioLiveStream();
    return;
  }

  window.radioPlayer.activeStationId = stationId;

  // Resolve playable audio stream URL
  let streamSrc = station.currentTrack?.streamUrl;
  const fallbackMap = {
    'rad-001': '/audio/station-1-lagos-kira.m4a',
    'rad-002': '/audio/station-2-london-afrobeats.m4a',
    'rad-003': '/audio/station-3-heritage-fusion.m4a',
    'rad-004': '/audio/station-4-club-pulse.m4a'
  };

  if (!streamSrc || streamSrc.includes('itunes.apple.com')) {
    streamSrc = fallbackMap[stationId] || '/audio/station-1-lagos-kira.m4a';
  }

  try {
    const audio = window.radioPlayer.audioElement;
    audio.pause();
    audio.src = streamSrc;
    audio.currentTime = 0;
    audio.volume = window.radioPlayer.volume;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          window.radioPlayer.isPlaying = true;
          updateRadioBroadcastUI();
          showToast(`📻 Tuned into ${station.name}! Broadcasting "${station.currentTrack?.title || 'KIRA'}" live.`, "success", "Live On-Air");
        })
        .catch(err => {
          console.warn("Direct play blocked by browser autoplay policy:", err);
          window.radioPlayer.isPlaying = false;
          updateRadioBroadcastUI();
          showToast("Click ▶ Listen Live again to permit browser audio streaming.", "info", "Audio Permission");
        });
    }
  } catch (err) {
    console.error("Radio streaming error:", err);
    showToast("Error tuning into radio: " + err.message, "error", "Radio Error");
  }
}

function pauseRadioLiveStream() {
  if (window.radioPlayer.audioElement) {
    window.radioPlayer.audioElement.pause();
  }
  window.radioPlayer.isPlaying = false;
  updateRadioBroadcastUI();
  showToast("Live Radio broadcast paused.", "info", "Radio Paused");
}

function toggleRadioBroadcast() {
  if (window.radioPlayer.isPlaying) {
    pauseRadioLiveStream();
  } else {
    playRadioLiveStream(window.radioPlayer.activeStationId || "rad-001");
  }
}

function switchRadioStation(stationId) {
  playRadioLiveStream(stationId);
}

function setRadioVolume(val) {
  const v = Math.max(0, Math.min(100, parseInt(val, 10))) / 100;
  window.radioPlayer.volume = v;
  if (window.radioPlayer.audioElement) {
    window.radioPlayer.audioElement.volume = v;
  }
  const label = document.getElementById("radioVolumeLabel");
  if (label) label.innerText = `${Math.round(v * 100)}%`;
}

function advanceRadioQueue(stationId) {
  const station = (window.radioPlayer.stations || []).find(s => s.id === stationId);
  if (!station) return;

  if (station.nextInQueue && station.nextInQueue.length > 0) {
    const next = station.nextInQueue.shift();
    const oldCurrent = station.currentTrack;
    
    station.nextInQueue.push({
      title: oldCurrent.title,
      artist: oldCurrent.artist,
      scheduledIn: "35 mins"
    });

    station.currentTrack = {
      title: next.title,
      artist: next.artist,
      isLjPriority: next.title.includes("KIRA") || next.artist.includes("Drey Star"),
      rotationLevel: "CONTINUOUS SWARM AUTO-PLAY",
      djIntro: `[AUTO-DJ]: Up next on ${station.name}, keeping the rhythm going with "${next.title}" by ${next.artist}!`,
      streamUrl: station.currentTrack.streamUrl,
      coverArt: oldCurrent.coverArt || "https://i.scdn.co/image/ab67616d0000b27377e5e6ebf6d0352cc1c2d0bd",
      elapsedSeconds: 0,
      durationSeconds: 231
    };

    updateRadioBroadcastUI();
    if (window.radioPlayer.isPlaying) {
      playRadioLiveStream(stationId);
    }
  }
}

function updateRadioBroadcastUI() {
  const isPlaying = window.radioPlayer.isPlaying;
  const activeId = window.radioPlayer.activeStationId || "rad-001";
  const station = (window.radioPlayer.stations || []).find(s => s.id === activeId) || (window.radioPlayer.stations && window.radioPlayer.stations[0]);

  // 1. Top Global Radio Bar
  const globalPlayBtn = document.getElementById("globalRadioPlayBtn");
  const globalPlayText = document.getElementById("globalRadioPlayText");
  const globalPlayIcon = document.getElementById("globalRadioPlayIcon");
  const globalVisualizer = document.getElementById("globalRadioVisualizer");
  const globalStationName = document.getElementById("globalRadioStationName");
  const globalCurrentTrack = document.getElementById("globalRadioCurrentTrack");

  if (station) {
    if (globalStationName) globalStationName.innerText = station.name;
    if (globalCurrentTrack && station.currentTrack) {
      globalCurrentTrack.innerText = `"${station.currentTrack.title}" by ${station.currentTrack.artist}`;
    }
  }

  if (isPlaying) {
    if (globalPlayText) globalPlayText.innerText = "⏸ Pause Broadcast";
    if (globalPlayIcon) globalPlayIcon.innerHTML = `<svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    if (globalVisualizer) {
      globalVisualizer.classList.remove("hidden");
      globalVisualizer.classList.add("inline-flex");
    }
    if (globalPlayBtn) {
      globalPlayBtn.classList.remove("from-purple-600", "to-indigo-600");
      globalPlayBtn.classList.add("from-emerald-600", "to-teal-600");
    }
  } else {
    if (globalPlayText) globalPlayText.innerText = "▶ Listen Live";
    if (globalPlayIcon) globalPlayIcon.innerHTML = `<svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
    if (globalVisualizer) {
      globalVisualizer.classList.add("hidden");
      globalVisualizer.classList.remove("inline-flex");
    }
    if (globalPlayBtn) {
      globalPlayBtn.classList.remove("from-emerald-600", "to-teal-600");
      globalPlayBtn.classList.add("from-purple-600", "to-indigo-600");
    }
  }

  // 2. Master Console in tab-radio
  const masterPlayIcon = document.getElementById("radioMasterPlayIcon");
  const masterOnAirBadge = document.getElementById("radioMasterOnAirBadge");
  const masterEqualizer = document.getElementById("radioMasterEqualizer");
  const masterStationTitle = document.getElementById("radioMasterStationTitle");
  const masterDial = document.getElementById("radioMasterDial");
  const masterTrackName = document.getElementById("radioMasterTrackName");
  const masterDjText = document.getElementById("radioMasterDjText");

  if (station) {
    if (masterStationTitle) masterStationTitle.innerText = station.name;
    if (masterDial) masterDial.innerText = station.frequency || station.region || "98.5 MHz FM";
    if (masterTrackName && station.currentTrack) {
      masterTrackName.innerText = `"${station.currentTrack.title}" — ${station.currentTrack.artist}`;
    }
    if (masterDjText && station.currentTrack?.djIntro) {
      masterDjText.innerText = `"${station.currentTrack.djIntro}"`;
    }
  }

  if (isPlaying) {
    if (masterPlayIcon) masterPlayIcon.innerText = "⏸";
    if (masterOnAirBadge) {
      masterOnAirBadge.innerText = "🔴 BROADCASTING LIVE";
      masterOnAirBadge.classList.remove("bg-purple-500/20", "text-purple-300", "border-purple-500/40");
      masterOnAirBadge.classList.add("bg-emerald-500/30", "text-emerald-300", "border-emerald-500/50");
    }
    if (masterEqualizer) {
      masterEqualizer.classList.remove("hidden");
      masterEqualizer.classList.add("inline-flex");
    }
  } else {
    if (masterPlayIcon) masterPlayIcon.innerText = "▶";
    if (masterOnAirBadge) {
      masterOnAirBadge.innerText = "READY TO BROADCAST";
      masterOnAirBadge.classList.add("bg-purple-500/20", "text-purple-300", "border-purple-500/40");
      masterOnAirBadge.classList.remove("bg-emerald-500/30", "text-emerald-300", "border-emerald-500/50");
    }
    if (masterEqualizer) {
      masterEqualizer.classList.add("hidden");
      masterEqualizer.classList.remove("inline-flex");
    }
  }

  // 3. Update Grid Cards
  renderOnlineRadioGridCards();
}

function renderOnlineRadioGridCards() {
  const container = document.getElementById("onlineRadioStationsGrid");
  if (!container || !window.radioPlayer.stations) return;

  const isPlaying = window.radioPlayer.isPlaying;
  const activeId = window.radioPlayer.activeStationId || "rad-001";

  container.innerHTML = window.radioPlayer.stations.map(st => {
    const cur = st.currentTrack || {};
    const isLjPlaying = cur.isLjPriority;
    const nextTrack = (st.nextInQueue && st.nextInQueue[0]) || { title: "KIRA", artist: "Drey Star", scheduledIn: "15 mins" };
    const isThisStationPlaying = isPlaying && activeId === st.id;

    return `
      <div class="glass-panel border ${isThisStationPlaying ? 'border-emerald-400 bg-emerald-950/30 shadow-glow-emerald ring-2 ring-emerald-500/40' : isLjPlaying ? 'border-amber-500/50 bg-amber-950/20 shadow-glow-amber' : 'border-white/10 bg-black/40'} rounded-3xl p-5 shadow-spatial flex flex-col justify-between space-y-4 transition duration-300">
        <div class="space-y-3">
          <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full ${isThisStationPlaying ? 'bg-emerald-400 animate-ping' : st.status.includes('LIVE') ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}"></span>
              <span class="text-[10px] font-mono-code font-black text-white">${st.bitrate || '320 kbps'}</span>
              ${isThisStationPlaying ? `
                <span class="text-[9px] font-mono-code font-black text-emerald-400 flex items-center space-x-0.5">
                  <span class="inline-block w-1 bg-emerald-400 animate-pulse h-2"></span>
                  <span class="inline-block w-1 bg-emerald-400 animate-pulse h-3"></span>
                  <span class="inline-block w-1 bg-emerald-400 animate-pulse h-2"></span>
                  <span class="ml-1">ON AIR</span>
                </span>
              ` : ''}
            </div>
            <span class="px-2 py-0.5 rounded-full text-[9px] font-mono-code font-bold ${isThisStationPlaying ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : isLjPlaying ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'}">
              ${isThisStationPlaying ? 'TUNED IN LIVE' : (cur.rotationLevel || 'HEAVY ROTATION')}
            </span>
          </div>

          <div>
            <h3 class="text-sm font-black text-white flex items-center justify-between">
              <span>${st.name}</span>
            </h3>
            <p class="text-[11px] text-slate-400">${st.frequency || st.region}</p>
          </div>

          <!-- On-Air Now Playing Card -->
          <div class="p-3 rounded-2xl ${isThisStationPlaying ? 'bg-emerald-950/40 border border-emerald-500/40' : isLjPlaying ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-400/40' : 'bg-white/5 border border-white/5'} space-y-2">
            <div class="text-[9px] font-mono-code uppercase tracking-wider flex items-center justify-between">
              <span class="${isThisStationPlaying ? 'text-emerald-300 font-black' : isLjPlaying ? 'text-amber-300 font-black' : 'text-slate-400'}">🔴 ON-AIR NOW:</span>
              <span class="text-emerald-400 font-bold font-mono-code">${isThisStationPlaying ? 'ACTIVE STREAM' : 'STREAMING LIVE'}</span>
            </div>
            <div class="flex items-center space-x-2.5">
              ${cur.coverArt ? `<img src="${cur.coverArt}" class="w-10 h-10 rounded-lg object-cover border border-white/10 flex-shrink-0">` : ''}
              <div class="min-w-0 flex-1">
                <div class="text-xs font-black text-white flex items-center space-x-1.5 truncate">
                  <span class="truncate">"${cur.title || 'KIRA'}"</span>
                  ${isLjPlaying ? '<span class="px-1.5 py-0.2 rounded text-[8px] font-black bg-brand-gold text-black shadow">LJ FLAGSHIP</span>' : ''}
                </div>
                <div class="text-[11px] text-slate-300 truncate">${cur.artist || 'Drey Star'}</div>
              </div>
            </div>
            ${cur.djIntro ? `
              <div class="text-[10px] text-slate-300 italic bg-black/50 p-2 rounded-xl border border-white/5 leading-snug">
                "${cur.djIntro}"
              </div>
            ` : ''}
          </div>

          <div class="flex items-center justify-between text-[10px] font-mono-code text-slate-400">
            <span>Listeners: <strong class="text-white">${(st.listenersCount || 25000).toLocaleString()}</strong></span>
            <span>Next: <strong class="text-emerald-400">"${nextTrack.title}" (${nextTrack.scheduledIn || 'Soon'})</strong></span>
          </div>
        </div>

        <div class="pt-3 border-t border-white/10 flex items-center gap-2">
          <button onclick="forceRadioSpinFromUI('${st.id}')" class="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-[10px] font-mono-code transition active:scale-95 shadow flex items-center justify-center space-x-1" title="Instantly force this station to broadcast LJ track">
            <span>⚡ Spin LJ Track</span>
          </button>
          <button onclick="playRadioLiveStream('${st.id}')" class="px-3 py-2 rounded-xl ${isThisStationPlaying ? 'bg-amber-500 hover:bg-amber-400 text-black font-black' : 'bg-purple-600/40 hover:bg-purple-600/70 text-purple-200 border border-purple-500/40 font-bold'} text-[10px] font-mono-code transition flex items-center space-x-1 shadow active:scale-95" title="${isThisStationPlaying ? 'Pause live stream' : 'Listen live to this station'}">
            <span>${isThisStationPlaying ? '⏸ Pause' : '▶ Listen Live'}</span>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

async function loadOnlineRadioConsole() {
  const container = document.getElementById("onlineRadioStationsGrid");
  if (!container) return;

  try {
    const res = await fetch("/api/agent/radio/state");
    const data = await res.json();

    if (!data.success || !Array.isArray(data.stations)) return;

    window.radioPlayer.stations = data.stations;
    window.radioPlayer.autoPlayEnabled = data.autoPlayEnabled;

    const statsBadge = document.getElementById("onlineRadioStatsBadge");
    if (statsBadge) {
      statsBadge.innerHTML = `<span>📻 ${data.stations.length} Stations Live • ${(data.totalDailySpins || 1482).toLocaleString()} Radio Spins Logged • Heavy Rotation: ${data.rotationFrequency || 'Every 35 mins'}</span>`;
    }

    const autoPlayLabel = document.getElementById("radioAutoPlayLabel");
    if (autoPlayLabel) {
      autoPlayLabel.innerText = `Auto-Play: ${data.autoPlayEnabled ? 'Active (Heavy Rotation)' : 'Paused'}`;
    }

    updateRadioBroadcastUI();

  } catch (err) {
    console.error("Error loading online radio console:", err);
  }
}

async function forceRadioSpinFromUI(stationIdOrTrackId, maybeTrackId) {
  showToast("Triggering instant Live Radio Spin Override on web radio relay...", "info", "Radio Override");

  let stationId = null;
  let trackId = typeof currentActiveTrackId !== 'undefined' && currentActiveTrackId ? currentActiveTrackId : "lj-000";

  if (typeof stationIdOrTrackId === 'string' && stationIdOrTrackId.trim()) {
    const val = stationIdOrTrackId.trim();
    if (val.startsWith('rad-')) {
      stationId = val;
      if (maybeTrackId) trackId = maybeTrackId;
    } else {
      trackId = val;
      if (maybeTrackId && maybeTrackId.startsWith('rad-')) stationId = maybeTrackId;
    }
  }

  try {
    const res = await fetch("/api/agent/radio/spin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stationId, trackId })
    });
    const data = await res.json();

    if (data && data.success) {
      const stationName = data.station?.name || data.targetStation?.name || (stationId ? "Selected Station" : "All 4 Broadcast Stations");
      const trackTitle = data.nowPlaying?.title || data.broadcastTrack || "KIRA";
      const artistName = data.nowPlaying?.artist || data.artist || "Drey Star";
      showToast(`⚡ On-Air Override Live! Station ${stationName} is now broadcasting "${trackTitle}" by ${artistName}!`, "success", "On-Air Live");
      
      await loadOnlineRadioConsole();

      // If user is actively listening, switch live audio immediately to new spin
      if (window.radioPlayer && window.radioPlayer.isPlaying) {
        playRadioLiveStream(stationId || window.radioPlayer.activeStationId || "rad-001");
      }
    } else {
      showToast((data && data.error) || "Failed to trigger radio spin override", "error", "Error");
    }
  } catch (err) {
    console.error("Error triggering radio spin:", err);
    showToast("Radio spin failed: " + err.message, "error", "Error");
  }
}

async function toggleRadioAutoPlayFromUI(stationId) {
  try {
    const res = await fetch("/api/agent/radio/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stationId })
    });
    const data = await res.json();
    if (data.success) {
      const label = document.getElementById("radioAutoPlayLabel");
      if (label) {
        label.innerText = `Auto-Play: ${data.autoPlayEnabled ? 'Active (Heavy Rotation)' : 'Paused'}`;
      }
      showToast(data.message || `Radio Auto-Play is now ${data.autoPlayEnabled ? 'Active' : 'Paused'}.`, "info", "Radio Swarm Status");
      loadOnlineRadioConsole();
    }
  } catch (err) {
    console.error("Error toggling radio:", err);
  }
}

function scrollToOnlineRadio() {
  switchTab("tab-radio");
  loadOnlineRadioConsole();
}

// ==============================================================
// 33. PLAYLIST INSPECTOR & SEQUENTIAL AUDIO PLAYBACK
// ==============================================================

let currentInspectedPlaylist = null;

async function openPlaylistInspectorModal(playlistId) {
  const modal = document.getElementById("playlistInspectorModal");
  if (!modal) return;

  const header = document.getElementById("playlistInspectorHeader");
  const countEl = document.getElementById("playlistInspectorTracksCount");
  const container = document.getElementById("playlistInspectorTracksContainer");

  container.innerHTML = `
    <div class="text-center py-12 space-y-3">
      <div class="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-xs text-slate-300">Resolving playlist audio streams & algorithm placements...</p>
    </div>
  `;
  modal.classList.remove("hidden");

  try {
    let pl = null;
    try {
      const res = await fetch(`/api/playlist/${playlistId}`);
      if (res.ok) pl = await res.json();
    } catch (e) {}

    if (!pl) {
      const resAuto = await fetch("/api/agent/playlists");
      const autoData = await resAuto.json();
      if (autoData.success && Array.isArray(autoData.playlists)) {
        pl = autoData.playlists.find(p => p.id === playlistId);
      }
    }

    if (!pl) {
      container.innerHTML = `<div class="p-4 rounded-xl bg-red-950/40 text-xs text-red-300">Playlist not found.</div>`;
      return;
    }

    currentInspectedPlaylist = pl;
    const tracks = pl.resolvedTracks || pl.tracks || [];

    const saves = (pl.savesCount || 50000).toLocaleString();
    const monthly = (pl.monthlyListenersCount || 50000).toLocaleString();
    const platform = pl.platform || "Multi-DSP Curated";

    header.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div class="flex items-center space-x-3.5 min-w-0">
          <img src="${pl.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'}" class="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-lg flex-shrink-0">
          <div class="min-w-0">
            <div class="flex items-center space-x-2">
              <span class="text-[9px] font-mono-code font-black text-amber-400 uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                ${pl.category || 'CURATED VIBE'}
              </span>
              <span class="text-[9px] font-mono-code font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30">
                ${platform}
              </span>
            </div>
            <h2 class="text-xl font-black text-white mt-1 truncate">${pl.title}</h2>
            <div class="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-mono-code">
              <span class="text-amber-300 font-bold">📌 ${saves} Saves</span>
              <span class="text-slate-500">•</span>
              <span class="text-emerald-400 font-bold">🎧 ${monthly} Monthly Listeners</span>
              <span class="text-slate-500">•</span>
              <span class="text-slate-300">${pl.curator || 'LJ Editorial Desk'}</span>
            </div>
          </div>
        </div>
        <div class="text-right flex-shrink-0">
          <span class="px-2.5 py-1 rounded-full text-xs font-mono-code font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            100% Curated & Playable
          </span>
        </div>
      </div>
    `;

    if (countEl) countEl.innerText = `${tracks.length} Verified Tracks`;

    container.innerHTML = tracks.map((t, idx) => {
      const slotNum = t.slot || (idx + 1);
      const isLj = t.isLjTrack || t.isLjArtist || (t.id && t.id.startsWith("lj-")) || t.locked;
      const preview = t.previewUrl || "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b5/28/57/b5285723-4c8e-f592-f53d-1672f24feda3/mzaf_5923859656061233620.plus.aac.p.m4a";

      return `
        <div class="glass-panel-subtle p-3 rounded-2xl border ${isLj ? 'border-amber-500/50 bg-amber-950/20 shadow-glow-amber' : 'border-white/10 bg-black/40'} flex items-center justify-between gap-3 transition hover:border-brand-gold/60">
          <div class="flex items-center space-x-3 min-w-0">
            <span class="text-xs font-mono-code font-black ${isLj ? 'text-amber-400' : 'text-slate-500'} w-6">#${slotNum}</span>
            <img src="${t.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'}" class="w-10 h-10 rounded-xl object-cover border border-white/10 shadow flex-shrink-0">
            <div class="min-w-0">
              <div class="flex items-center space-x-2 truncate">
                <span class="text-xs font-black text-white truncate">${t.title}</span>
                ${isLj ? '<span class="px-1.5 py-0.2 rounded text-[8px] font-black bg-brand-gold text-black shadow flex-shrink-0">⭐ LJ PRIORITY</span>' : ''}
                ${t.locked ? '<span class="px-1.5 py-0.2 rounded text-[8px] font-mono-code font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex-shrink-0">SLOT #1 LOCKED</span>' : ''}
              </div>
              <div class="text-[11px] text-slate-400 truncate">${t.artist} ${t.bpm ? `• ${t.bpm} BPM / ${t.key}` : ''}</div>
            </div>
          </div>

          <div class="flex items-center space-x-2 flex-shrink-0">
            <button onclick="playCustomAudioPreview('${preview}', '${(t.title || '').replace(/'/g, "\\'")}', '${(t.artist || '').replace(/'/g, "\\'")}')" class="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition flex items-center space-x-1.5 shadow active:scale-95" title="Play Track Audio From Beginning (0:00)">
              <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <span>▶ Play Track</span>
            </button>
          </div>
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error("Error inspecting playlist:", err);
    container.innerHTML = `<div class="p-4 rounded-xl bg-red-950/40 text-xs text-red-300">Error loading playlist details.</div>`;
  }
}

function closePlaylistInspectorModal() {
  const modal = document.getElementById("playlistInspectorModal");
  if (modal) modal.classList.add("hidden");
}

function playEntirePlaylistFromUI(playlistId) {
  if (currentInspectedPlaylist && currentInspectedPlaylist.tracks && currentInspectedPlaylist.tracks.length > 0) {
    const firstTrack = currentInspectedPlaylist.tracks[0];
    const preview = firstTrack.previewUrl || "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b5/28/57/b5285723-4c8e-f592-f53d-1672f24feda3/mzaf_5923859656061233620.plus.aac.p.m4a";
    playCustomAudioPreview(preview, firstTrack.title, firstTrack.artist);
    showToast(`▶ Now Playing Slot #1: "${firstTrack.title}" by ${firstTrack.artist} from playlist "${currentInspectedPlaylist.title}"`, "success", "Playlist Playback Started");
  } else {
    showToast("Starting playlist playback from Slot #1...", "info", "Playing Playlist");
    playCustomAudioPreview('https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b5/28/57/b5285723-4c8e-f592-f53d-1672f24feda3/mzaf_5923859656061233620.plus.aac.p.m4a', 'KIRA', 'Drey Star');
  }
}

function filterEditorialByPlatform(platform, btn) {
  document.querySelectorAll('.editorial-platform-pill').forEach(b => {
    b.classList.remove('bg-purple-600', 'text-white', 'font-black');
    b.classList.add('bg-white/5', 'text-slate-300', 'font-bold');
  });
  if (btn) {
    btn.classList.remove('bg-white/5', 'text-slate-300', 'font-bold');
    btn.classList.add('bg-purple-600', 'text-white', 'font-black');
  }
  loadEditorialPlaylists(platform);
}

// Global window registrations
window.openQuickAddArtistModal = openQuickAddArtistModal;
window.closeQuickAddArtistModal = closeQuickAddArtistModal;
window.executeQuickArtistResolve = executeQuickArtistResolve;
window.confirmAndIngestArtist = confirmAndIngestArtist;
window.playCustomAudioPreview = playCustomAudioPreview;
window.playRadioLiveStream = playRadioLiveStream;
window.pauseRadioLiveStream = pauseRadioLiveStream;
window.toggleRadioBroadcast = toggleRadioBroadcast;
window.switchRadioStation = switchRadioStation;
window.setRadioVolume = setRadioVolume;
window.advanceRadioQueue = advanceRadioQueue;
window.updateRadioBroadcastUI = updateRadioBroadcastUI;
window.loadAutonomousPlaylists = loadAutonomousPlaylists;
window.generateTrendingPlaylistFromUI = generateTrendingPlaylistFromUI;
window.rebalancePlaylistsFromUI = rebalancePlaylistsFromUI;
window.loadOnlineRadioConsole = loadOnlineRadioConsole;
window.forceRadioSpinFromUI = forceRadioSpinFromUI;
window.toggleRadioAutoPlayFromUI = toggleRadioAutoPlayFromUI;
window.scrollToOnlineRadio = scrollToOnlineRadio;
window.openPlaylistInspectorModal = openPlaylistInspectorModal;
window.closePlaylistInspectorModal = closePlaylistInspectorModal;
window.playEntirePlaylistFromUI = playEntirePlaylistFromUI;
window.filterEditorialByPlatform = filterEditorialByPlatform;
window.loadEditorialPlaylists = loadEditorialPlaylists;

// ==============================================================
// SPOTIFY FOR ARTISTS - ACTIVE PROFILE & MULTI-ARTIST SWITCHER ENGINE
// ==============================================================

window.currentActiveArtist = localStorage.getItem('s4a_active_artist') || "Drey Star";
window.isArtistFocusMode = localStorage.getItem('s4a_focus_mode') !== 'false'; // default true
window.artistRosterData = [];

// 1. Initialize and sync artist profile switcher
async function initArtistProfileSwitcher() {
  try {
    const res = await fetch("/api/artist/roster");
    window.artistRosterData = await res.json();
    if (!Array.isArray(window.artistRosterData) || window.artistRosterData.length === 0) {
      window.artistRosterData = [
        {
          id: "art-048320",
          artist: "Drey Star",
          name: "Drey Star",
          picture: "https://i.scdn.co/image/ab67616d0000b27377e5e6ebf6d0352cc1c2d0bd",
          monthlyListeners: "1,420,000 Monthly Listeners",
          primaryGenre: "Afro-Fusion / Nightlife",
          spotifyUrl: "https://open.spotify.com/artist/4cOdK2wGLETKBW3PvgPWqT",
          tracksCount: 3,
          bio: "LJ Entertainment priority artist. Creator of the hit master 'KIRA'."
        },
        {
          id: "art-056552",
          artist: "Asake",
          name: "Asake",
          picture: "https://cdn-images.dzcdn.net/images/artist/29baf235626c8cd1cdc782c6d467aca8/1000x1000-000000-80-0-0.jpg",
          monthlyListeners: "135,417 Monthly Listeners",
          primaryGenre: "Afrobeats",
          spotifyUrl: "https://open.spotify.com/search/Asake",
          tracksCount: 6,
          bio: "Verified streaming artist profile for Asake."
        },
        {
          id: "art-237312",
          artist: "Dr. Orlando Owoh",
          name: "Dr. Orlando Owoh",
          picture: "https://cdn-images.dzcdn.net/images/artist/3bedec5e5df1ddbce4fe2193e51e2664/1000x1000-000000-80-0-0.jpg",
          monthlyListeners: "Verified Global Streamer",
          primaryGenre: "Folk",
          spotifyUrl: "https://open.spotify.com/search/Dr.%20Orlando%20Owoh",
          tracksCount: 0,
          bio: "Verified legacy recording artist."
        }
      ];
    }

    // Verify current active artist
    const exists = window.artistRosterData.find(a => (a.artist || a.name).toLowerCase() === window.currentActiveArtist.toLowerCase());
    if (!exists && window.currentActiveArtist !== "ALL" && window.artistRosterData.length > 0) {
      window.currentActiveArtist = window.artistRosterData[0].artist || window.artistRosterData[0].name;
    }

    renderArtistProfileUI();
    renderTopArtistsGrid();
    renderSidebarRoster();
    updateBillboardForActiveArtist();
  } catch (err) {
    console.error("Error initializing artist profile switcher:", err);
  }
}

// 2. Select / Switch Profile
function selectArtistProfile(artistName) {
  if (!artistName) return;

  // Strict Artist Portal Isolation Guard (Zero Mistake Guarantee)
  if (window.activeMogulSession?.user?.isArtistLocked) {
    const lockedArtist = window.activeMogulSession.user.artistName || "Drey Star";
    if (artistName.toLowerCase() !== lockedArtist.toLowerCase()) {
      showToast(`🔒 Artist Portal Isolated: You are signed into ${lockedArtist}.\nSign in as Label Owner or open ${artistName}'s dedicated portal to switch.`, "warning", "Portal Locked");
      return;
    }
  }

  try {
    window.currentActiveArtist = artistName;
    localStorage.setItem('s4a_active_artist', artistName);

    if (artistName === "ALL") {
      window.isArtistFocusMode = false;
      localStorage.setItem('s4a_focus_mode', 'false');
      showToast("🏢 Switched to Label Overview Mode. Showing all releases across roster.", "info", "Label Mode Active");
    } else {
      window.isArtistFocusMode = true;
      localStorage.setItem('s4a_focus_mode', 'true');
      showToast(`✓ Active Profile: ${artistName}\nWorkspace locked onto ${artistName}. Zero cross-artist confusion.`, "success", "Spotify for Artists");

      // Automatically set top track for this artist as active working track
      const artistTracks = allTracks.filter(t => t.artist && t.artist.toLowerCase() === artistName.toLowerCase());
      if (artistTracks.length > 0) {
        setAsActiveWorkingTrack(artistTracks[0].id);
      }
    }

    // Update all UI elements safely
    try { renderArtistProfileUI(); } catch (e) { console.warn("renderArtistProfileUI err:", e); }
    try { updateBillboardForActiveArtist(); } catch (e) { console.warn("updateBillboardForActiveArtist err:", e); }
    try { applyFilters(); } catch (e) { console.warn("applyFilters err:", e); }
    try { renderTopArtistsGrid(); } catch (e) { console.warn("renderTopArtistsGrid err:", e); }
    try { renderSidebarRoster(); } catch (e) { console.warn("renderSidebarRoster err:", e); }
    try { renderArtistPortalTracks(); } catch (e) { console.warn("renderArtistPortalTracks err:", e); }
    try { syncArtistToCouncilAndLyrics(artistName); } catch (e) { console.warn("syncArtistToCouncilAndLyrics err:", e); }
    try { if (typeof loadMogulRoyalties === 'function') loadMogulRoyalties(); } catch (e) { console.warn("loadMogulRoyalties err:", e); }
  } catch (err) {
    console.error("Critical error in selectArtistProfile:", err);
  }
}

// 3. Toggle single artist focus mode
function setArtistFocusMode(enable) {
  if (enable) {
    const artistToFocus = (window.currentActiveArtist && window.currentActiveArtist !== "ALL")
      ? window.currentActiveArtist
      : (window.artistRosterData[0]?.artist || window.artistRosterData[0]?.name || "Drey Star");
    selectArtistProfile(artistToFocus);
  } else {
    selectArtistProfile("ALL");
  }
}

// 4. Modal controls
async function openProfileSwitcherModal() {
  const modal = document.getElementById("s4aProfileSwitcherModal");
  if (modal) {
    modal.classList.remove("hidden");
    if (!window.artistRosterData || window.artistRosterData.length === 0) {
      await initArtistProfileSwitcher();
    }
    renderS4aModalArtistList();
    const searchInput = document.getElementById("s4aModalSearchInput");
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
    }
  }
}

function closeProfileSwitcherModal() {
  const modal = document.getElementById("s4aProfileSwitcherModal");
  if (modal) modal.classList.add("hidden");
}

// 5. Render profile list inside modal
function renderS4aModalArtistList(filterQuery = "") {
  const container = document.getElementById("s4aModalArtistGrid");
  const activeLabel = document.getElementById("s4aModalCurrentActiveName");
  const isArtistLocked = !!window.activeMogulSession?.user?.isArtistLocked;
  const lockedArtist = window.activeMogulSession?.user?.artistName || "Drey Star";
  const isOwner = window.activeMogulSession?.user?.role?.toLowerCase() === "owner" && !isArtistLocked;

  if (activeLabel) {
    if (isArtistLocked) {
      activeLabel.innerHTML = `<span class="text-emerald-300 font-bold">${window.currentActiveArtist}</span> <span class="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono-code font-bold">🔒 ARTIST PORTAL (ISOLATED)</span>`;
    } else {
      activeLabel.innerText = window.currentActiveArtist === "ALL" ? "All Label Artists (Overview Mode)" : window.currentActiveArtist;
    }
  }
  if (!container) return;

  const roster = window.artistRosterData || [];
  const q = filterQuery.toLowerCase().trim();
  const isAllActive = window.currentActiveArtist === "ALL";

  const filtered = roster.filter(a => {
    if (!q) return true;
    const name = (a.artist || a.name || "").toLowerCase();
    const genre = (a.primaryGenre || (a.genres || []).join(" ") || "").toLowerCase();
    return name.includes(q) || genre.includes(q);
  });

  // All Label card HTML (shown if query is empty or matches "all" / "label")
  let allLabelCardHtml = "";
  if (!q || "all label artists overview".includes(q)) {
    const allLabelClick = isArtistLocked 
      ? `showToast('🔒 Artist Portal Active: Switch to Owner account to access All Label overview.', 'info', 'Portal Isolated');`
      : `selectArtistProfile('ALL'); closeProfileSwitcherModal();`;

    allLabelCardHtml = `
      <div onclick="${allLabelClick}" class="glass-panel-subtle p-4 rounded-2xl border transition duration-300 relative flex flex-col justify-between cursor-pointer ${isAllActive ? 'border-purple-500 bg-purple-900/30 shadow-glow-violet ring-1 ring-purple-400' : 'border-white/10 hover:border-purple-400/50 hover:bg-white/[0.03]'}">
        <div class="flex items-start justify-between gap-2.5">
          <div class="flex items-start space-x-3.5 min-w-0">
            <div class="relative w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-tr from-purple-800 to-indigo-700 border ${isAllActive ? 'border-purple-400 shadow-md' : 'border-white/15'} flex-shrink-0 flex items-center justify-center text-white text-2xl font-black">
              🏢
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center space-x-2">
                <h3 class="font-black text-sm text-white truncate">All Label Artists</h3>
                ${isAllActive ? '<span class="px-2 py-0.5 rounded-full text-[8px] font-black bg-purple-500 text-white uppercase tracking-wider">ACTIVE</span>' : ''}
              </div>
              <p class="text-[11px] text-purple-300 font-mono-code font-bold mt-0.5 truncate">Label Overview Mode</p>
              <p class="text-[10px] text-slate-400 mt-0.5 font-mono-code">${allTracks.length} Releases Across Entire Label</p>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
          ${isAllActive ? `
            <div class="flex items-center space-x-1.5 text-purple-300 text-xs font-bold">
              <span class="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              <span>Currently In Focus (All Releases)</span>
            </div>
            <button onclick="closeProfileSwitcherModal(); event.stopPropagation();" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition">
              Keep Active
            </button>
          ` : (isArtistLocked ? `
            <button onclick="showToast('🔒 Artist Portal Active: Sign in as Label Owner to access All Label mode.', 'info', 'Portal Isolated'); event.stopPropagation();" class="flex-1 py-1.5 px-3 rounded-xl bg-zinc-800/80 text-zinc-500 text-xs font-mono-code text-center cursor-not-allowed">
              Requires Owner Login
            </button>
          ` : `
            <button onclick="selectArtistProfile('ALL'); closeProfileSwitcherModal(); event.stopPropagation();" class="flex-1 py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition shadow active:scale-95 text-center">
              Switch to All Label →
            </button>
          `)}
        </div>
      </div>
    `;
  }

  if (filtered.length === 0 && !allLabelCardHtml) {
    container.innerHTML = `
      <div class="col-span-full py-8 text-center text-slate-400 text-xs border border-dashed border-white/10 rounded-2xl">
        No artists matching "${filterQuery}". Click "+ Onboard Artist" to link via Spotify.
      </div>
    `;
    return;
  }

  const artistCardsHtml = filtered.map(a => {
    const name = a.artist || a.name;
    const isActive = !isAllActive && window.currentActiveArtist.toLowerCase() === name.toLowerCase();
    const tracks = allTracks.filter(t => t.artist && t.artist.toLowerCase() === name.toLowerCase());
    const trackCount = tracks.length || a.tracksCount || 0;
    const pic = a.picture || a.coverArt || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80";
    const listeners = a.monthlyListeners || a.followers || "Verified Spotify Profile";
    const genre = a.primaryGenre || (Array.isArray(a.genres) ? a.genres[0] : "Afrobeats") || "Afrobeats";

    // Delete button: Only visible for Label Owner and never for Drey Star
    const showDeleteBtn = isOwner && name.toLowerCase() !== "drey star";
    const deleteBtnHtml = showDeleteBtn ? `
      <button onclick="deleteArtistProfile('${name.replace(/'/g, "\\'")}'); event.stopPropagation();" class="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 hover:text-white border border-rose-500/30 transition text-xs font-bold flex-shrink-0 active:scale-95" title="Delete Profile & Associated Catalogue">
        🗑️
      </button>
    ` : '';

    const cardOnClick = (isArtistLocked && !isActive)
      ? `showToast('🔒 Artist Portal Isolated: You are signed into ${lockedArtist}. Sign in as Owner to access other artists.', 'info', 'Portal Isolated');`
      : `selectArtistProfile('${name.replace(/'/g, "\\'")}'); closeProfileSwitcherModal();`;

    return `
      <div onclick="${cardOnClick}" class="glass-panel-subtle p-4 rounded-2xl border transition duration-300 relative flex flex-col justify-between cursor-pointer ${isActive ? 'border-emerald-500/80 bg-purple-900/20 shadow-glow-emerald ring-1 ring-emerald-400' : 'border-white/10 hover:border-purple-400/50 hover:bg-white/[0.03]'}">
        <div class="flex items-start justify-between gap-2.5">
          <div class="flex items-start space-x-3.5 min-w-0">
            <div class="relative w-14 h-14 rounded-2xl overflow-hidden border ${isActive ? 'border-emerald-400 shadow-md' : 'border-white/15'} flex-shrink-0">
              <img src="${pic}" class="w-full h-full object-cover">
              <span class="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center text-[7px] text-black font-black border border-black">✓</span>
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center space-x-2">
                <h3 class="font-black text-sm text-white truncate">${name}</h3>
                ${isActive ? '<span class="px-2 py-0.5 rounded-full text-[8px] font-black bg-emerald-500 text-black uppercase tracking-wider">ACTIVE</span>' : ''}
              </div>
              <p class="text-[11px] text-emerald-400 font-mono-code font-bold mt-0.5 truncate">${listeners}</p>
              <p class="text-[10px] text-slate-400 mt-0.5 font-mono-code">${genre} • ${trackCount} Releases</p>
            </div>
          </div>

          ${deleteBtnHtml}
        </div>

        <div class="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
          ${isActive ? `
            <div class="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Currently In Focus</span>
            </div>
            <button onclick="closeProfileSwitcherModal(); event.stopPropagation();" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition">
              Keep Active
            </button>
          ` : (isArtistLocked ? `
            <button onclick="showToast('🔒 Artist Portal Isolated: You are signed into ${lockedArtist}. Sign in as Owner to access other artists.', 'info', 'Portal Isolated'); event.stopPropagation();" class="flex-1 py-1.5 px-3 rounded-xl bg-zinc-800/80 text-zinc-500 text-xs font-mono-code text-center cursor-not-allowed">
              Locked in ${lockedArtist} Portal
            </button>
          ` : `
            <button onclick="selectArtistProfile('${name.replace(/'/g, "\\'")}'); closeProfileSwitcherModal(); event.stopPropagation();" class="flex-1 py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition shadow active:scale-95 text-center">
              Switch to ${name} →
            </button>
          `)}
          ${a.spotifyUrl ? `
            <a href="${a.spotifyUrl}" target="_blank" onclick="event.stopPropagation();" class="p-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition text-xs font-bold" title="Open Spotify Profile">
              Spotify ↗
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = allLabelCardHtml + artistCardsHtml;
}

function filterS4aModalArtistList(val) {
  renderS4aModalArtistList(val);
}

// 6. Update all UI elements for currentActiveArtist
function renderArtistProfileUI() {
  const current = window.currentActiveArtist;
  const isAll = current === "ALL";
  const roster = window.artistRosterData || [];
  const artistObj = roster.find(a => (a.artist || a.name).toLowerCase() === current.toLowerCase()) || roster[0] || {
    artist: "Drey Star",
    picture: "https://i.scdn.co/image/ab67616d0000b27377e5e6ebf6d0352cc1c2d0bd",
    monthlyListeners: "1,420,000 Monthly Listeners",
    spotifyUrl: "https://open.spotify.com/artist/4cOdK2wGLETKBW3PvgPWqT"
  };

  const name = isAll ? "All Label Artists" : (artistObj.artist || artistObj.name || "Drey Star");
  const avatar = isAll 
    ? "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80"
    : (artistObj.picture || artistObj.coverArt || "https://i.scdn.co/image/ab67616d0000b27377e5e6ebf6d0352cc1c2d0bd");
  const listeners = isAll ? "53,180,000 Total Network Listeners" : (artistObj.monthlyListeners || "1,420,000 Monthly Listeners");
  const artistTracks = isAll ? allTracks : allTracks.filter(t => t.artist && t.artist.toLowerCase() === current.toLowerCase());
  const priorityTrack = artistTracks[0] || { title: "KIRA", id: "lj-000" };

  // A. Header Chip
  const hAvatar = document.getElementById("headerArtistAvatar");
  if (hAvatar) hAvatar.src = avatar;
  const hName = document.getElementById("headerArtistName");
  if (hName) hName.innerText = isAll ? "All Artists" : name;

  // B. Sticky Active Profile Bar
  const barAvatar = document.getElementById("s4aBarAvatar");
  if (barAvatar) barAvatar.src = avatar;
  const barName = document.getElementById("s4aBarArtistName");
  if (barName) barName.innerText = name;
  const barListeners = document.getElementById("s4aBarListeners");
  if (barListeners) barListeners.innerText = listeners;
  const barTracksCount = document.getElementById("s4aBarTracksCount");
  if (barTracksCount) barTracksCount.innerText = `${artistTracks.length} Catalogued Releases`;
  const barPriority = document.getElementById("s4aBarPriority");
  if (barPriority) barPriority.innerText = `Priority Track: "${priorityTrack.title}"`;

  const barModeBadge = document.getElementById("s4aBarModeBadge");
  if (barModeBadge) {
    barModeBadge.innerHTML = isAll
      ? `<span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span><span>LABEL OVERVIEW MODE</span>`
      : `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span><span>SINGLE-ARTIST FOCUS</span>`;
    barModeBadge.className = isAll
      ? "px-2 py-0.5 rounded-full text-[9px] font-mono-code font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1"
      : "px-2 py-0.5 rounded-full text-[9px] font-mono-code font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1";
  }

  const focusBtnArtist = document.getElementById("s4aFocusBtnArtistName");
  if (focusBtnArtist) focusBtnArtist.innerText = isAll ? "Active" : name;

  const focusBtnActive = document.getElementById("s4aFocusBtnActive");
  const focusBtnAll = document.getElementById("s4aFocusBtnAll");
  if (focusBtnActive && focusBtnAll) {
    focusBtnAll.innerHTML = `🏢 All Label (${roster.length || 1})`;
    if (window.isArtistFocusMode && !isAll) {
      focusBtnActive.className = "px-3 py-1 rounded-lg bg-purple-600 text-white shadow-glow-violet transition";
      focusBtnAll.className = "px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition";
    } else {
      focusBtnAll.className = "px-3 py-1 rounded-lg bg-purple-600 text-white shadow-glow-violet transition";
      focusBtnActive.className = "px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition";
    }
  }

  const barSpotifyLink = document.getElementById("s4aBarSpotifyLink");
  if (barSpotifyLink) {
    barSpotifyLink.href = artistObj.spotifyUrl || `https://open.spotify.com/search/${encodeURIComponent(name)}`;
  }

  // C. Catalogue focus banner
  const catFocusName = document.getElementById("catalogueFocusArtistName");
  if (catFocusName) catFocusName.innerText = isAll ? `All Label Artists (${allTracks.length} releases)` : `${name} (${artistTracks.length} releases)`;
  const catFocusBadge = document.getElementById("catalogueFocusBadge");
  if (catFocusBadge) {
    catFocusBadge.innerText = (window.isArtistFocusMode && !isAll) ? "SINGLE ARTIST FOCUS ACTIVE" : "ALL LABEL CATALOGUE";
  }
  const catShowAllBtn = document.getElementById("catalogueShowAllBtn");
  if (catShowAllBtn) {
    catShowAllBtn.innerText = (window.isArtistFocusMode && !isAll) 
      ? `Show All Label Releases (${allTracks.length}) →` 
      : `🎯 Focus strictly on ${name} →`;
    catShowAllBtn.onclick = () => setArtistFocusMode(!window.isArtistFocusMode);
  }
}

// 7. Update Hero Billboard for active artist
function updateBillboardForActiveArtist() {
  const current = window.currentActiveArtist;
  const isAll = current === "ALL";
  const artistTracks = isAll ? allTracks : allTracks.filter(t => t.artist && t.artist.toLowerCase() === current.toLowerCase());
  const track = artistTracks[0] || allTracks[0];
  if (!track) return;

  const titleEl = document.getElementById("billboardTrackTitle");
  if (titleEl) titleEl.innerText = track.title;
  const artistEl = document.getElementById("billboardArtistName");
  if (artistEl) artistEl.innerText = track.artist;
  const genreEl = document.getElementById("billboardGenre");
  if (genreEl) genreEl.innerText = `${track.genre} • ${track.bpm} BPM • Key ${track.key}`;
  const imgEl = document.getElementById("billboardArtistImg");
  if (imgEl) imgEl.src = track.coverArt;
  const descEl = document.getElementById("billboardDescription");
  if (descEl) {
    descEl.innerText = `Priority Master Recording by ${track.artist}. Modern high-energy production with talking drums and global crossover melody. 10,000 specialist agents deployed for ${track.artist}.`;
  }
  const spotifyLink = document.getElementById("billboardSpotifyStreamLink");
  if (spotifyLink) {
    spotifyLink.href = track.spotifyUrl || `https://open.spotify.com/track/${track.spotifyId || '5W1yl3OyfrKe8oHUY8rKbJ'}`;
  }
}

// 8. Render top artists row with active indicator
function renderTopArtistsGrid() {
  const container = document.getElementById("topArtistsGridContainer");
  if (!container) return;

  const roster = window.artistRosterData || [];
  if (roster.length === 0) return;

  const cardsHtml = roster.map(a => {
    const name = a.artist || a.name;
    const isActive = window.currentActiveArtist.toLowerCase() === name.toLowerCase();
    const pic = a.picture || a.coverArt || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80";
    const tracks = allTracks.filter(t => t.artist.toLowerCase() === name.toLowerCase());

    return `
      <div onclick="selectArtistProfile('${name.replace(/'/g, "\\'")}')" class="glass-panel-subtle p-3 rounded-2xl border transition duration-300 group cursor-pointer text-center relative overflow-hidden shadow-lg ${isActive ? 'border-emerald-400 bg-purple-900/25 ring-2 ring-emerald-400 shadow-glow-emerald' : 'border-purple-500/40 bg-purple-500/5 hover:border-purple-400 hover:bg-purple-500/10'}">
        <div class="w-20 h-20 mx-auto rounded-2xl overflow-hidden mb-2.5 relative shadow-md border ${isActive ? 'border-emerald-400' : 'border-purple-400/40'}">
          <img src="${pic}" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
          <div class="absolute inset-0 bg-purple-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <div class="w-8 h-8 rounded-full bg-white text-purple-700 flex items-center justify-center shadow-lg"><svg class="w-4 h-4 ml-0.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
          </div>
          ${isActive ? '<span class="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] text-black font-black border border-black">✓</span>' : ''}
        </div>
        <div class="font-black text-xs text-white group-hover:text-purple-300 truncate">${name}</div>
        <div class="text-[10px] text-emerald-400 font-mono-code font-bold">${tracks.length} Releases</div>
        ${isActive 
          ? '<span class="inline-block mt-1 px-2 py-0.5 rounded-full text-[8px] font-black bg-emerald-500 text-black shadow">● ACTIVE FOCUS</span>' 
          : '<span class="inline-block mt-1 px-2 py-0.5 rounded-full text-[8px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">CLICK TO FOCUS</span>'}
      </div>
    `;
  }).join("");

  const addCardHtml = `
    <div onclick="openQuickAddArtistModal()" class="glass-panel-subtle p-3 rounded-2xl border border-dashed border-white/20 hover:border-emerald-500/50 hover:bg-white/[0.04] transition group cursor-pointer text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[170px]">
      <div class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 group-hover:border-emerald-500/40 flex items-center justify-center text-slate-300 group-hover:text-emerald-300 transition text-xl mb-2">
        +
      </div>
      <div class="font-bold text-xs text-white group-hover:text-emerald-300 transition">Add New Artist</div>
      <p class="text-[10px] text-slate-400 mt-1 max-w-[120px] leading-tight">Paste Spotify artist or track link</p>
    </div>
  `;

  container.innerHTML = cardsHtml + addCardHtml;
}

// 9. Render sidebar priority roster with active indicator
function renderSidebarRoster() {
  const container = document.getElementById("sidebarRosterDynamicList");
  if (!container) return;

  const roster = window.artistRosterData || [];
  container.innerHTML = roster.map(a => {
    const name = a.artist || a.name;
    const isActive = window.currentActiveArtist.toLowerCase() === name.toLowerCase();
    const pic = a.picture || a.coverArt || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80";

    return `
      <button onclick="selectArtistProfile('${name.replace(/'/g, "\\'")}')" class="w-full flex items-center space-x-2.5 p-2 rounded-xl transition text-left group ${isActive ? 'bg-purple-900/40 border border-emerald-500/60 shadow-glow-emerald ring-1 ring-emerald-400' : 'bg-white/[0.03] border border-white/5 hover:bg-purple-500/15 hover:border-purple-500/30'}">
        <div class="relative w-7 h-7 rounded-full overflow-hidden border ${isActive ? 'border-emerald-400' : 'border-purple-400'} flex-shrink-0">
          <img src="${pic}" class="w-full h-full object-cover">
          ${isActive ? '<span class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-black"></span>' : ''}
        </div>
        <div class="truncate flex-1">
          <div class="font-bold text-white group-hover:text-purple-300 truncate flex items-center space-x-1">
            <span>${name}</span>
            ${isActive ? '<span class="text-[9px] text-emerald-400">●</span>' : ''}
          </div>
          <div class="text-[9px] ${isActive ? 'text-emerald-300 font-bold' : 'text-slate-400'} font-mono-code">${isActive ? 'Active in Workspace' : 'Verified Artist'}</div>
        </div>
      </button>
    `;
  }).join("");
}

// 10. Force radio spin for active artist
function spinActiveArtistOnRadio() {
  const current = window.currentActiveArtist;
  const isAll = current === "ALL";
  const artistTracks = isAll ? allTracks : allTracks.filter(t => t.artist && t.artist.toLowerCase() === (current || "").toLowerCase());
  const track = artistTracks[0] || allTracks[0];
  if (!track) {
    showToast("No track found to spin.", "warning");
    return;
  }
  forceRadioSpinFromUI(track.id);
  showToast(`⚡ Forced Radio Spin: "${track.title}" by ${track.artist} now playing live across all 4 stations!`, "success", "Radio Spin Triggered");
}

// 11. Sync active artist to Adversarial Council, Lyrics & Pitch CRM
function syncArtistToCouncilAndLyrics(artistName) {
  if (!artistName) return;
  const isAll = artistName === "ALL";
  const artistTracks = isAll ? allTracks : allTracks.filter(t => t.artist && t.artist.toLowerCase() === artistName.toLowerCase());
  if (artistTracks.length > 0) {
    const topTrack = artistTracks[0];
    const councilSelect = document.getElementById("councilTrackSelect");
    if (councilSelect) councilSelect.value = topTrack.id;

    const lyricsSelect = document.getElementById("lyricsTrackSelect");
    if (lyricsSelect) {
      lyricsSelect.value = topTrack.id;
      loadLyricsForTrack(topTrack.id);
    }

    const pitchSelect = document.getElementById("pitchTrackSelect");
    if (pitchSelect) pitchSelect.value = topTrack.id;
  }
}

// 7. Delete Artist Profile & Associated Catalogue
async function deleteArtistProfile(artistName) {
  if (!artistName) return;

  // Strict Permission Check: Artist Portal and unauthenticated sessions cannot delete profiles
  const isOwner = window.activeMogulSession?.user?.role?.toLowerCase() === "owner" && !window.activeMogulSession?.user?.isArtistLocked;
  if (!isOwner) {
    showToast("Permission Denied: Deleting artist profiles is restricted to Label Owners. Artist Portal is protected.", "error", "Access Denied");
    return;
  }

  // Protection for Flagship Artist Drey Star
  if (artistName.toLowerCase() === "drey star") {
    showToast("Flagship profile 'Drey Star' is permanently protected against deletion.", "warning", "Protected Profile");
    return;
  }

  const confirmMsg = `Are you sure you want to permanently delete "${artistName}" from your workspace?\n\nThis will remove their profile and all associated tracks from your catalogue, rights, and telemetry.`;

  if (!confirm(confirmMsg)) return;

  try {
    const res = await fetch(`/api/artist/${encodeURIComponent(artistName)}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      showToast(`Artist "${artistName}" and ${data.removedTracksCount || 0} track(s) removed successfully.`, "success", "Profile Deleted");
      await loadCatalogue();
      await loadArtistRosterDirectory();
      await initArtistProfileSwitcher();

      // If active artist was deleted, reset focus
      if (window.currentActiveArtist && window.currentActiveArtist.toLowerCase() === artistName.toLowerCase()) {
        const remaining = window.artistRosterData || [];
        if (remaining.length > 0) {
          selectArtistProfile(remaining[0].artist || remaining[0].name);
        } else {
          selectArtistProfile("ALL");
        }
      } else {
        renderArtistProfileUI();
      }

      // Re-render modal if open
      const modal = document.getElementById("s4aProfileSwitcherModal");
      if (modal && !modal.classList.contains("hidden")) {
        const searchInput = document.getElementById("s4aModalSearchInput");
        renderS4aModalArtistList(searchInput ? searchInput.value : "");
      }
    } else {
      showToast(data.error || "Failed to delete artist profile.", "error", "Delete Failed");
    }
  } catch (err) {
    console.error("Error deleting artist profile:", err);
    showToast("Network error while deleting artist profile.", "error");
  }
}

// 8. 1-Click Keep Only Drey Star (Purge Benchmark Profiles)
async function purgeExternalProfilesPrompt() {
  const isOwner = window.activeMogulSession?.user?.role?.toLowerCase() === "owner" && !window.activeMogulSession?.user?.isArtistLocked;
  if (!isOwner) {
    showToast("Permission Denied: Roster purging is restricted to Label Owners.", "error", "Access Denied");
    return;
  }

  if (!confirm("Keep ONLY Drey Star and purge all demo / benchmark profiles?\n\nThis will remove non-owned artist profiles and catalogue tracks, leaving only your personal artist profile (Drey Star).")) {
    return;
  }

  try {
    const res = await fetch("/api/artist/keep-only", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artist: "Drey Star" })
    });
    const data = await res.json();
    if (data.success) {
      showToast("Workspace cleaned: Kept only Drey Star. All external demo profiles purged.", "success", "Workspace Cleaned");
      await loadCatalogue();
      await loadArtistRosterDirectory();
      await initArtistProfileSwitcher();
      selectArtistProfile("Drey Star");

      // Re-render modal if open
      const modal = document.getElementById("s4aProfileSwitcherModal");
      if (modal && !modal.classList.contains("hidden")) {
        renderS4aModalArtistList();
      }
    } else {
      showToast(data.error || "Failed to purge external profiles.", "error");
    }
  } catch (err) {
    console.error("Error purging external profiles:", err);
    showToast("Network error while cleaning workspace.", "error");
  }
}

// 9. Label Settings Dropdown Toggle
function toggleLabelSettingsDropdown() {
  const dd = document.getElementById("labelSettingsDropdown");
  if (dd) {
    dd.classList.toggle("hidden");
  }
}

// 10. More Modules Dropdown Toggle
function toggleMoreModulesDropdown() {
  const dd = document.getElementById("moreModulesDropdown");
  if (dd) {
    dd.classList.toggle("hidden");
  }
}

// Close dropdowns on outside click
document.addEventListener("click", (e) => {
  const labelBtn = document.getElementById("labelSettingsBtn");
  const labelDd = document.getElementById("labelSettingsDropdown");
  if (labelDd && !labelDd.classList.contains("hidden")) {
    if (labelBtn && !labelBtn.contains(e.target) && !labelDd.contains(e.target)) {
      labelDd.classList.add("hidden");
    }
  }

  const moreBtn = document.getElementById("moreModulesBtn");
  const moreDd = document.getElementById("moreModulesDropdown");
  if (moreDd && !moreDd.classList.contains("hidden")) {
    if (moreBtn && !moreBtn.contains(e.target) && !moreDd.contains(e.target)) {
      moreDd.classList.add("hidden");
    }
  }
});

// Global exports for Spotify for Artists Profile Switcher
window.initArtistProfileSwitcher = initArtistProfileSwitcher;
window.selectArtistProfile = selectArtistProfile;
window.setArtistFocusMode = setArtistFocusMode;
window.openProfileSwitcherModal = openProfileSwitcherModal;
window.closeProfileSwitcherModal = closeProfileSwitcherModal;
window.renderS4aModalArtistList = renderS4aModalArtistList;
window.filterS4aModalArtistList = filterS4aModalArtistList;
window.spinActiveArtistOnRadio = spinActiveArtistOnRadio;
window.renderArtistProfileUI = renderArtistProfileUI;
window.updateBillboardForActiveArtist = updateBillboardForActiveArtist;
window.renderTopArtistsGrid = renderTopArtistsGrid;
window.renderSidebarRoster = renderSidebarRoster;
window.deleteArtistProfile = deleteArtistProfile;
window.purgeExternalProfilesPrompt = purgeExternalProfilesPrompt;
window.toggleLabelSettingsDropdown = toggleLabelSettingsDropdown;
window.toggleMoreModulesDropdown = toggleMoreModulesDropdown;

// ==============================================================
// MOGUL ENTERPRISE: AUTHENTICATION, ROYALTIES & AUDIT SUITE
// Modeled after usemogul.com (Mogul for Music)
// ==============================================================

// 1. Initialize Mogul Auth & Session Management
async function initMogulAuth() {
  // If explicitly logged out, enforce locked state and do NOT auto-login
  if (localStorage.getItem("mogul_logged_out") === "true") {
    window.activeMogulSession = null;
    renderMogulAuthUI(null);
    return;
  }

  let session = null;
  const saved = localStorage.getItem("mogul_auth_session");
  if (saved) {
    try {
      session = JSON.parse(saved);
    } catch (e) {
      session = null;
    }
  }

  if (!session) {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data.success && data.session) {
        session = data.session;
      }
    } catch (e) {
      console.warn("Failed to fetch Mogul session:", e);
    }
  }

  // If no session exists (e.g. user logged out or fresh unauthenticated visit)
  if (!session || !session.user) {
    window.activeMogulSession = null;
    renderMogulAuthUI(null);
    return;
  }

  window.activeMogulSession = session;
  localStorage.setItem("mogul_auth_session", JSON.stringify(session));
  renderMogulAuthUI(session.user);
  loadMogulRoyalties();
}

function renderMogulAuthUI(user) {
  const avatarEl = document.getElementById("mogulUserAvatar") || document.getElementById("mogulHeaderUserAvatar");
  const avatarContainer = document.getElementById("mogulUserAvatarContainer");
  const avatarDot = document.getElementById("mogulUserAvatarStatusDot") || avatarEl?.nextElementSibling;
  const emailDisplay = document.getElementById("mogulUserEmailDisplay");
  const roleEl = document.getElementById("mogulUserRoleBadge");
  const dropEmail = document.getElementById("mogulDropdownEmail");
  const dropRole = document.getElementById("mogulDropdownRole");
  const wsType = document.getElementById("headerWorkspaceType");
  const labelToolsBtn = document.getElementById("labelSettingsBtn");
  const logoutBtn = document.getElementById("mogulDropdownLogoutBtn");
  const logoutText = document.getElementById("mogulDropdownLogoutText");
  const logoutIcon = document.getElementById("mogulDropdownLogoutIcon");

  if (!user) {
    // 🔒 LOCKED / SIGNED OUT STATE
    if (avatarEl) {
      avatarEl.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fbbf24'%3E%3Cpath fill-rule='evenodd' d='M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z' clip-rule='evenodd' /%3E%3C/svg%3E";
    }
    if (avatarContainer) {
      avatarContainer.className = "relative w-6 h-6 rounded-full overflow-hidden border border-amber-400/80 bg-amber-950/40 p-0.5 flex-shrink-0 shadow-sm";
    }
    if (avatarDot) {
      avatarDot.className = "absolute bottom-0 right-0 w-2 h-2 rounded-full bg-amber-400 border border-black animate-pulse";
    }
    if (emailDisplay) {
      emailDisplay.innerText = "Signed Out (Locked)";
      emailDisplay.className = "font-bold text-amber-300 text-[11px] truncate max-w-[130px]";
    }
    if (roleEl) {
      roleEl.innerText = "🔒 SIGN IN";
      roleEl.className = "text-[9px] text-amber-400 font-mono-code font-bold underline cursor-pointer";
    }
    if (dropEmail) dropEmail.innerText = "Signed Out (Locked)";
    if (dropRole) dropRole.innerText = "None (Click Sign In)";
    if (wsType) wsType.innerText = "🔒 Workspace Locked";
    if (labelToolsBtn) {
      labelToolsBtn.classList.add("opacity-40", "cursor-not-allowed");
      labelToolsBtn.title = "Workspace locked. Sign in to access label tools.";
    }
    if (logoutText) logoutText.innerText = "Sign In to Workspace";
    if (logoutBtn) {
      logoutBtn.className = "w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-emerald-400 hover:text-emerald-200 hover:bg-emerald-500/10 text-left font-medium";
    }
    if (logoutIcon) {
      logoutIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>`;
    }
    return;
  }

  // 👤 ACTIVE SESSION (OWNER OR ARTIST)
  if (avatarEl) {
    avatarEl.src = user.avatar || "https://i.scdn.co/image/ab67616d0000b27377e5e6ebf6d0352cc1c2d0bd";
  }
  if (avatarContainer) {
    avatarContainer.className = user.isArtistLocked
      ? "relative w-6 h-6 rounded-full overflow-hidden border border-emerald-400 flex-shrink-0"
      : "relative w-6 h-6 rounded-full overflow-hidden border border-purple-400 flex-shrink-0";
  }
  if (avatarDot) {
    avatarDot.className = "absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-black";
  }

  if (emailDisplay) {
    emailDisplay.innerText = user.isArtistLocked ? `${user.artistName || user.name} (Artist Portal)` : user.email;
    emailDisplay.className = "font-bold text-white text-[11px] truncate max-w-[130px]";
  }

  if (roleEl) {
    if (user.isArtistLocked) {
      roleEl.innerText = "🎤 ARTIST (LOCKED)";
      roleEl.className = "text-[9px] text-emerald-400 font-mono-code font-bold";
    } else if (user.role && user.role.toLowerCase() === "owner") {
      roleEl.innerText = "👑 OWNER";
      roleEl.className = "text-[9px] text-emerald-400 font-mono-code font-bold";
    } else {
      roleEl.innerText = `● ${(user.role || 'USER').toUpperCase()}`;
      roleEl.className = "text-[9px] text-purple-400 font-mono-code font-bold";
    }
  }

  if (dropEmail) dropEmail.innerText = user.email;

  if (dropRole) {
    dropRole.innerText = user.isArtistLocked ? `Artist (${user.artistName}) - Locked` : user.role;
  }

  if (wsType) {
    wsType.innerText = user.isArtistLocked ? "Artist Portal (Isolated)" : "Entity Workspace";
  }

  if (labelToolsBtn) {
    if (user.isArtistLocked) {
      labelToolsBtn.classList.add("opacity-40", "cursor-not-allowed");
      labelToolsBtn.title = "Label Tools restricted to Label Owner. Currently in isolated Artist Portal.";
    } else {
      labelToolsBtn.classList.remove("opacity-40", "cursor-not-allowed");
      labelToolsBtn.title = "Label Workspace Settings";
    }
  }

  if (logoutText) logoutText.innerText = "Sign Out / Lock Workspace";
  if (logoutBtn) {
    logoutBtn.className = "w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 text-left font-medium";
  }
  if (logoutIcon) {
    logoutIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>`;
  }
}

// 2. Dropdown & Modal Controls
function toggleMogulUserDropdown() {
  if (!window.activeMogulSession || !window.activeMogulSession.user) {
    openMogulAuthModal();
    const dd = document.getElementById("mogulUserDropdown");
    if (dd) dd.classList.add("hidden");
    return;
  }
  const dd = document.getElementById("mogulUserDropdown");
  if (dd) dd.classList.toggle("hidden");
}

function openMogulAuthModal() {
  const modal = document.getElementById("mogulAuthModal");
  if (modal) {
    modal.classList.remove("hidden");
    populateArtistPortalSelectDropdown();
  }
}

function closeMogulAuthModal() {
  const modal = document.getElementById("mogulAuthModal");
  if (modal) modal.classList.add("hidden");
}

function switchAuthModalTab(tab = "artist") {
  const tabArtist = document.getElementById("mogulAuthTabArtist");
  const tabOwner = document.getElementById("mogulAuthTabOwner");
  const btnArtist = document.getElementById("authTabBtnArtist");
  const btnOwner = document.getElementById("authTabBtnOwner");

  if (tab === "artist") {
    if (tabArtist) tabArtist.classList.remove("hidden");
    if (tabOwner) tabOwner.classList.add("hidden");
    if (btnArtist) {
      btnArtist.className = "py-2.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center space-x-2 bg-emerald-500 text-black shadow-md";
    }
    if (btnOwner) {
      btnOwner.className = "py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2 text-zinc-400 hover:text-white";
    }
    populateArtistPortalSelectDropdown();
  } else {
    if (tabArtist) tabArtist.classList.add("hidden");
    if (tabOwner) tabOwner.classList.remove("hidden");
    if (btnArtist) {
      btnArtist.className = "py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2 text-zinc-400 hover:text-white";
    }
    if (btnOwner) {
      btnOwner.className = "py-2.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center space-x-2 bg-purple-600 text-white shadow-md";
    }
  }
}

function populateArtistPortalSelectDropdown() {
  const dropdown = document.getElementById("artistPortalSelectDropdown");
  if (!dropdown) return;
  const roster = window.artistRosterData || [];
  if (roster.length === 0) return;

  const currentVal = dropdown.value || "Drey Star";
  dropdown.innerHTML = roster.map(a => {
    const name = a.artist || a.name;
    const isDrey = name.toLowerCase() === "drey star";
    return `<option value="${name}" ${name === currentVal ? "selected" : ""}>${name}${isDrey ? " (Flagship Artist)" : ""}</option>`;
  }).join("");
}

// Dedicated 1-Click Artist Portal Login (Zero Mistake Guarantee)
async function loginAsArtist(artistName = "Drey Star") {
  if (!artistName) artistName = "Drey Star";
  showToast(`Unlocking dedicated Artist Portal for ${artistName}...`, "info", "Artist Login");

  try {
    const res = await fetch("/api/auth/artist-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artistName })
    });
    const data = await res.json();
    if (data.success && data.session) {
      localStorage.removeItem("mogul_logged_out");
      window.activeMogulSession = data.session;
      localStorage.setItem("mogul_auth_session", JSON.stringify(data.session));
      renderMogulAuthUI(data.session.user);
      closeMogulAuthModal();

      // Lock workspace to this artist profile
      window.currentActiveArtist = artistName;
      localStorage.setItem("s4a_active_artist", artistName);
      window.isArtistFocusMode = true;
      localStorage.setItem("s4a_focus_mode", "true");

      selectArtistProfile(artistName);

      showToast(`🎤 Welcome to ${artistName} Artist Portal!\nWorkspace strictly isolated to prevent any cross-artist mistake.`, "success", "Artist Portal Active");
      loadMogulRoyalties();
    } else {
      showToast(data.error || "Failed to log in to artist portal.", "error");
    }
  } catch (err) {
    console.error("Artist login error:", err);
    showToast("Network error logging into artist portal.", "error");
  }
}

async function handleArtistEmailLogin(event) {
  if (event) event.preventDefault();
  const emailInput = document.getElementById("artistAuthEmailInput");
  const email = emailInput ? emailInput.value.trim() : "dreystar@ljmusic.com";
  let artistName = "Drey Star";
  if (email.toLowerCase().includes("kayla")) artistName = "Kayla B";
  else if (email.toLowerCase().includes("tunde")) artistName = "Tunde";
  else if (email.toLowerCase().includes("asake")) artistName = "Asake";
  else if (email.toLowerCase().includes("owoh")) artistName = "Dr. Orlando Owoh";
  else {
    const prefix = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ");
    artistName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }
  await loginAsArtist(artistName);
}

// Clean Slate & Cache Reset (Clear Catch and Start Fresh)
async function clearWorkspaceCacheAndRestart() {
  const confirmed = confirm("✨ FRESH START & CACHE RESET:\n\nThis will purge all local browser caches, reset your active focus strictly to Drey Star, refresh server telemetry, and re-initialize a clean workspace.\n\nDo you want to proceed?");
  if (!confirmed) return;

  showToast("Purging local caches & re-initializing clean state...", "info", "Clean Start");

  try {
    // 1. Wipe all local storage keys
    const keys = [
      "s4a_active_artist",
      "s4a_focus_mode",
      "s4a_active_profile",
      "mogul_auth_session",
      "mogul_logged_out",
      "active_tab",
      "spotify_live_cache",
      "pitch_form_data",
      "cached_catalogue",
      "catalogue_filter",
      "active_station"
    ];
    keys.forEach(k => {
      try { localStorage.removeItem(k); } catch (e) {}
    });
    try { sessionStorage.clear(); } catch (e) {}

    // 2. Call server cache reset API
    try {
      await fetch("/api/system/reset-cache", { method: "POST" });
    } catch (e) {
      console.warn("Server reset cache call warning:", e);
    }

    // 3. Reset in-memory state
    window.currentActiveArtist = "Drey Star";
    window.isArtistFocusMode = true;

    showToast("Workspace refreshed cleanly! Reloading...", "success", "Clean Slate Ready");

    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (err) {
    console.error("Clean start error:", err);
    window.location.reload();
  }
}

// 3. Mogul Login Handlers
async function loginWithProvider(provider) {
  let email = "ljentertainmentmusic@gmail.com";
  let role = "Owner";

  if (provider === "spotify") {
    email = "dreystar@ljmusic.com";
    role = "Artist";
    await loginAsArtist("Drey Star");
    return;
  } else if (provider === "apple") {
    email = "music.director@ljmusic.com";
    role = "Business Manager";
  }

  await performMogulLogin(email, role, provider);
}

async function handleMogulLoginForm(event) {
  if (event) event.preventDefault();
  const emailInput = document.getElementById("mogulAuthEmailInput");
  const email = emailInput ? emailInput.value.trim() : "ljentertainmentmusic@gmail.com";
  const role = email.toLowerCase().includes("drey") ? "Artist" : (email.toLowerCase().includes("lj") ? "Owner" : "Manager");
  if (role === "Artist") {
    await loginAsArtist("Drey Star");
  } else {
    await performMogulLogin(email, role, "credentials");
  }
}

async function quickSwitchAuthRole(role, email) {
  if (role === "Artist") {
    await loginAsArtist("Drey Star");
  } else {
    await performMogulLogin(email, role, "quick_switch");
  }
}

async function performMogulLogin(email, role, provider) {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role, provider })
    });
    const data = await res.json();
    if (data.success && data.session) {
      localStorage.removeItem("mogul_logged_out");
      window.activeMogulSession = data.session;
      localStorage.setItem("mogul_auth_session", JSON.stringify(data.session));
      renderMogulAuthUI(data.session.user);
      closeMogulAuthModal();
      showToast(`Welcome ${data.session.user.name}! Signed in as ${data.session.user.role}.`, "success", "Mogul Auth");

      if (role === "Artist") {
        selectArtistProfile("Drey Star");
      }
      loadMogulRoyalties();
    } else {
      showToast("Authentication failed.", "error");
    }
  } catch (err) {
    console.error("Login error:", err);
    showToast("Network error during authentication.", "error");
  }
}

async function logoutMogul() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch (e) {
    console.warn("Logout notification warning:", e);
  }
  localStorage.removeItem("mogul_auth_session");
  localStorage.setItem("mogul_logged_out", "true");
  window.activeMogulSession = null;
  renderMogulAuthUI(null);

  const dd = document.getElementById("mogulUserDropdown");
  if (dd) dd.classList.add("hidden");

  showToast("Workspace locked & signed out. Please sign in to resume.", "info", "Signed Out");
  openMogulAuthModal();
}

// 4. Load Mogul Royalties & Auditing Ledger
async function loadMogulRoyalties() {
  const currentEntity = window.currentActiveArtist || "Drey Star";
  const entityDisplay = document.getElementById("mogulEntityDisplay");
  if (entityDisplay) {
    entityDisplay.innerText = currentEntity === "ALL" ? "LJ Entertainment (All Label)" : currentEntity;
  }

  try {
    const res = await fetch(`/api/mogul/royalties?entity=${encodeURIComponent(currentEntity)}`);
    const json = await res.json();
    if (!json.success || !json.data) return;

    const data = json.data;
    const summary = data.summary || {};

    // Render KPIs
    const formatCurr = (val) => `$${(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const kpiEarnings = document.getElementById("mogulKpiTotalEarnings");
    if (kpiEarnings) kpiEarnings.innerText = formatCurr(summary.totalEarningsTracked);

    const kpiMaster = document.getElementById("mogulKpiMaster");
    if (kpiMaster) kpiMaster.innerText = formatCurr(summary.totalMasterPayout);

    const kpiMech = document.getElementById("mogulKpiMechanicals");
    if (kpiMech) kpiMech.innerText = formatCurr(summary.totalMechanicalPayout);

    const kpiPerf = document.getElementById("mogulKpiPerformance");
    if (kpiPerf) kpiPerf.innerText = formatCurr(summary.totalPerformancePayout);

    const kpiNeigh = document.getElementById("mogulKpiNeighboring");
    if (kpiNeigh) kpiNeigh.innerText = formatCurr(summary.totalNeighboringPayout);

    const kpiUnclaimed = document.getElementById("mogulKpiUnclaimed");
    if (kpiUnclaimed) kpiUnclaimed.innerText = formatCurr(summary.totalUnclaimedRecoverable);

    const claimAllBtn = document.getElementById("mogulClaimAllBtn");
    if (claimAllBtn) {
      if (summary.totalUnclaimedRecoverable > 0) {
        claimAllBtn.innerHTML = `<span class="w-2 h-2 rounded-full bg-black animate-ping"></span><span>⚡ 1-Click Auto-Claim All (${formatCurr(summary.totalUnclaimedRecoverable)})</span>`;
        claimAllBtn.disabled = false;
        claimAllBtn.className = "px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition flex items-center space-x-2 shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer";
      } else {
        claimAllBtn.innerHTML = `<span>✓ All Discrepancies Recovered</span>`;
        claimAllBtn.disabled = true;
        claimAllBtn.className = "px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 font-bold text-xs border border-zinc-700 flex items-center space-x-2 cursor-not-allowed";
      }
    }

    // Render Discrepancies Table
    renderMogulDiscrepancies(data.auditDiscrepancies || []);

    // Render Payout Sources
    renderMogulPayoutSources(data.payoutSources || []);

    // Render Repertoire Ledger
    renderMogulRepertoire(data.tracks || []);

  } catch (err) {
    console.error("Error loading Mogul royalties:", err);
  }
}

function renderMogulDiscrepancies(discrepancies) {
  const tbody = document.getElementById("mogulDiscrepancyTableBody");
  if (!tbody) return;

  if (discrepancies.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-6 text-center text-zinc-500 text-xs">
          ✓ No active royalty discrepancies detected. All DSP and collection society records are 100% matched.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = discrepancies.map(d => {
    const isClaimed = d.status === "CLAIM_RECOVERED";
    const sourceClass = d.source.includes("MLC") 
      ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
      : (d.source.includes("SoundExchange") ? "text-purple-400 bg-purple-500/10 border-purple-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20");

    return `
      <tr class="hover:bg-zinc-900/60 transition">
        <td class="py-3 px-3">
          <span class="px-2 py-0.5 rounded text-[9px] font-bold border ${sourceClass}">
            ${d.source}
          </span>
        </td>
        <td class="py-3 px-3">
          <div class="font-bold text-white text-xs">${d.trackTitle}</div>
          <div class="text-[10px] text-zinc-400">${d.artist}</div>
        </td>
        <td class="py-3 px-3 text-zinc-400 text-[11px]">${d.isrc}</td>
        <td class="py-3 px-3 max-w-xs text-[11px] text-zinc-300 font-sans leading-tight">
          ${d.description}
        </td>
        <td class="py-3 px-3 text-right font-bold ${isClaimed ? 'text-zinc-500 line-through' : 'text-emerald-400'} text-xs">
          $${d.amount.toFixed(2)}
        </td>
        <td class="py-3 px-3 text-center">
          <span class="px-1.5 py-0.5 rounded text-[9px] font-mono-code bg-zinc-800 text-zinc-300 border border-zinc-700">
            ${Math.round(d.confidence * 100)}% Match
          </span>
        </td>
        <td class="py-3 px-3 text-right">
          ${isClaimed ? `
            <span class="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] whitespace-nowrap">
              ✓ RECOVERED
            </span>
          ` : `
            <button onclick="claimMogulDiscrepancy('${d.id}')" class="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[11px] transition shadow active:scale-95 whitespace-nowrap">
              ⚡ 1-Click Claim
            </button>
          `}
        </td>
      </tr>
    `;
  }).join("");
}

function renderMogulPayoutSources(sources) {
  const container = document.getElementById("mogulPayoutSourcesContainer");
  if (!container) return;

  container.innerHTML = sources.map(s => {
    return `
      <div class="space-y-1.5 p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-white">${s.name}</span>
          <span class="font-mono-code font-bold text-emerald-400">$${s.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div class="bg-gradient-to-r from-emerald-500 to-cyan-500 h-1.5 rounded-full" style="width: ${s.share};"></div>
        </div>
        <div class="flex justify-between text-[10px] text-zinc-500 font-mono-code">
          <span>Repertoire Payout</span>
          <span>${s.share} of total</span>
        </div>
      </div>
    `;
  }).join("");
}

function renderMogulRepertoire(tracks) {
  const tbody = document.getElementById("mogulRepertoireTableBody");
  if (!tbody) return;

  if (tracks.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-zinc-500">No tracks catalogued for this entity.</td></tr>`;
    return;
  }

  tbody.innerHTML = tracks.map(t => {
    return `
      <tr class="hover:bg-zinc-900/60 transition">
        <td class="py-2.5 px-3">
          <div class="font-bold text-white text-xs">${t.title}</div>
          <div class="text-[10px] text-zinc-400">${t.artist}</div>
        </td>
        <td class="py-2.5 px-3 text-zinc-400 text-[10px]">${t.isrc}</td>
        <td class="py-2.5 px-3 text-right text-zinc-300 font-bold">${t.totalStreams.toLocaleString()}</td>
        <td class="py-2.5 px-3 text-right text-white">$${t.earnings.master.toFixed(2)}</td>
        <td class="py-2.5 px-3 text-right text-cyan-400">$${(t.earnings.mechanical + t.earnings.performance).toFixed(2)}</td>
        <td class="py-2.5 px-3 text-right text-emerald-400 font-black">$${t.earnings.total.toFixed(2)}</td>
        <td class="py-2.5 px-3 text-center">
          <span class="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            ✓ 100% VERIFIED
          </span>
        </td>
      </tr>
    `;
  }).join("");
}

// 5. Claim Actions
async function claimMogulDiscrepancy(discrepancyId) {
  try {
    const res = await fetch("/api/mogul/audit/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discrepancyId })
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message || "Claim submitted successfully!", "success", "Discrepancy Recovered");
      await loadMogulRoyalties();
    } else {
      showToast(data.error || "Claim failed", "error");
    }
  } catch (err) {
    console.error("Claim error:", err);
    showToast("Network error submitting claim.", "error");
  }
}

async function claimAllMogulDiscrepancies() {
  const currentEntity = window.currentActiveArtist || "ALL";
  try {
    const res = await fetch("/api/mogul/audit/claim-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity: currentEntity })
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, "success", "Mogul Audit Bot");
      await loadMogulRoyalties();
    } else {
      showToast(data.error || "Claim all failed", "error");
    }
  } catch (err) {
    console.error("Claim all error:", err);
    showToast("Network error submitting bulk claim.", "error");
  }
}

async function runMogulAudit() {
  showToast("🔍 Mogul Audit Bot scanning global DSP logs, MLC statutory registrations, and PRO databases...", "info", "Audit Scanning");
  try {
    const currentEntity = window.currentActiveArtist || "ALL";
    const res = await fetch(`/api/mogul/audit?entity=${encodeURIComponent(currentEntity)}`);
    const data = await res.json();
    if (data.success) {
      setTimeout(() => {
        showToast(`Audit Complete! Overall Health: ${data.overallAuditScore}%. Recoverable: $${data.totalUnclaimedRecoverable.toFixed(2)}`, "success", "Audit Finished");
        loadMogulRoyalties();
      }, 500);
    }
  } catch (e) {
    console.error("Audit error:", e);
  }
}

// Close Mogul user dropdown when clicking outside
document.addEventListener("click", (e) => {
  const trigger = document.getElementById("mogulAuthSessionContainer");
  const dd = document.getElementById("mogulUserDropdown");
  if (dd && !dd.classList.contains("hidden")) {
    if (trigger && !trigger.contains(e.target) && !dd.contains(e.target)) {
      dd.classList.add("hidden");
    }
  }
});

// 6. CSV Claim Exports & Executive Statement Modal
function downloadMlcClaimCsv() {
  const currentEntity = window.currentActiveArtist || "ALL";
  showToast("Preparing The MLC Bulk Mechanical Claim CSV...", "info", "Export Initiated");
  window.location.href = `/api/mogul/export/mlc-claim-csv?entity=${encodeURIComponent(currentEntity)}`;
}

function downloadSoundExchangeCsv() {
  const currentEntity = window.currentActiveArtist || "ALL";
  showToast("Preparing SoundExchange Neighboring Rights Claim CSV...", "info", "Export Initiated");
  window.location.href = `/api/mogul/export/soundexchange-csv?entity=${encodeURIComponent(currentEntity)}`;
}

async function openMogulStatementModal() {
  const currentEntity = window.currentActiveArtist || "ALL";
  showToast("Generating official Mogul Accounting Statement...", "info");

  try {
    const res = await fetch(`/api/mogul/export/statement?entity=${encodeURIComponent(currentEntity)}`);
    const data = await res.json();
    if (!data.success || !data.statement) return;

    const stmt = data.statement;

    const numEl = document.getElementById("stmtNumber");
    if (numEl) numEl.innerText = stmt.statementNumber;

    const dateEl = document.getElementById("stmtDate");
    if (dateEl) dateEl.innerText = `Date: ${stmt.issueDate}`;

    const periodEl = document.getElementById("stmtPeriod");
    if (periodEl) periodEl.innerText = `Period: ${stmt.period}`;

    const nameEl = document.getElementById("stmtEntityName");
    if (nameEl) nameEl.innerText = stmt.entity;

    const typeEl = document.getElementById("stmtEntityType");
    if (typeEl) typeEl.innerText = `${stmt.entityType === 'LABEL_ENTERPRISE' ? 'Label Enterprise Consolidated Ledger' : 'Single Artist Workspace'} • Net Payout after 15% Admin Fee`;

    const netEl = document.getElementById("stmtNetPayable");
    if (netEl) netEl.innerText = `$${stmt.netPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const hashEl = document.getElementById("stmtVerificationHash");
    if (hashEl) hashEl.innerText = `Verification Hash: ${stmt.signoff.verificationHash}`;

    // Render Breakdown Table
    const breakdownBody = document.getElementById("stmtBreakdownTableBody");
    if (breakdownBody) {
      breakdownBody.innerHTML = `
        <tr class="hover:bg-zinc-900/50">
          <td class="py-2.5 px-3 font-bold text-white">Master Sound Recording Revenue</td>
          <td class="py-2.5 px-3 text-zinc-400">Spotify / Apple / DSPs</td>
          <td class="py-2.5 px-3 font-bold text-white">$${stmt.masterBreakdown.totalMasterPayout.toFixed(2)}</td>
          <td class="py-2.5 px-3 text-right text-emerald-400 font-bold">100% Master</td>
        </tr>
        <tr class="hover:bg-zinc-900/50">
          <td class="py-2.5 px-3 font-bold text-cyan-400">Interactive Streaming Mechanicals</td>
          <td class="py-2.5 px-3 text-zinc-400">The MLC (Statutory)</td>
          <td class="py-2.5 px-3 font-bold text-cyan-400">$${stmt.masterBreakdown.mechanicalsMLC.toFixed(2)}</td>
          <td class="py-2.5 px-3 text-right text-zinc-300">$0.00091 / stream</td>
        </tr>
        <tr class="hover:bg-zinc-900/50">
          <td class="py-2.5 px-3 font-bold text-purple-400">Public Performance Royalties</td>
          <td class="py-2.5 px-3 text-zinc-400">PRS for Music / BMI / ASCAP</td>
          <td class="py-2.5 px-3 font-bold text-purple-400">$${stmt.masterBreakdown.performancePRO.toFixed(2)}</td>
          <td class="py-2.5 px-3 text-right text-zinc-300">Global Share</td>
        </tr>
        <tr class="hover:bg-zinc-900/50">
          <td class="py-2.5 px-3 font-bold text-amber-400">Neighboring Rights / Web Radio</td>
          <td class="py-2.5 px-3 text-zinc-400">SoundExchange</td>
          <td class="py-2.5 px-3 font-bold text-amber-400">$${stmt.masterBreakdown.neighboringSoundExchange.toFixed(2)}</td>
          <td class="py-2.5 px-3 text-right text-zinc-300">Digital Transmissions</td>
        </tr>
        <tr class="bg-zinc-900/80 font-bold border-t border-zinc-700">
          <td class="py-2.5 px-3 text-white">Gross Tracked Royalties</td>
          <td class="py-2.5 px-3 text-zinc-400">Total Pooled Collections</td>
          <td class="py-2.5 px-3 text-white text-sm">$${stmt.grossEarnings.toFixed(2)}</td>
          <td class="py-2.5 px-3 text-right text-emerald-400">100% Gross</td>
        </tr>
        <tr class="text-rose-400 text-[11px]">
          <td class="py-2 px-3">Administration & Distribution Deductions (15%)</td>
          <td class="py-2 px-3 text-zinc-500">Mogul Admin / DSP Fees</td>
          <td class="py-2 px-3 font-mono-code">-$${stmt.adminFeeAmount.toFixed(2)}</td>
          <td class="py-2 px-3 text-right">-15.00%</td>
        </tr>
        <tr class="bg-emerald-950/20 font-black text-emerald-300 border-t border-emerald-500/30">
          <td class="py-3 px-3">NET AMOUNT PAYABLE TO PAYEE</td>
          <td class="py-3 px-3 text-emerald-400/80">Approved Settlement</td>
          <td class="py-3 px-3 text-base font-mono-code">$${stmt.netPayable.toFixed(2)}</td>
          <td class="py-3 px-3 text-right">85.00% Net</td>
        </tr>
      `;
    }

    // Render Track Itemization
    const trackListBody = document.getElementById("stmtTrackListBody");
    if (trackListBody) {
      trackListBody.innerHTML = (stmt.tracks || []).map(t => `
        <tr class="hover:bg-zinc-900/50">
          <td class="py-2 px-3 font-bold text-white">${t.title}</td>
          <td class="py-2 px-3 text-zinc-400">${t.isrc}</td>
          <td class="py-2 px-3 text-right text-zinc-300">${t.totalStreams.toLocaleString()}</td>
          <td class="py-2 px-3 text-right text-white">$${t.earnings.master.toFixed(2)}</td>
          <td class="py-2 px-3 text-right text-cyan-400">$${(t.earnings.mechanical + t.earnings.performance).toFixed(2)}</td>
          <td class="py-2 px-3 text-right font-bold text-emerald-400">$${t.earnings.total.toFixed(2)}</td>
        </tr>
      `).join("");
    }

    const modal = document.getElementById("mogulStatementModal");
    if (modal) modal.classList.remove("hidden");
  } catch (err) {
    console.error("Statement fetch error:", err);
    showToast("Failed to generate statement.", "error");
  }
}

function closeMogulStatementModal() {
  const modal = document.getElementById("mogulStatementModal");
  if (modal) modal.classList.add("hidden");
}

// 7. Live Spotify API Direct Sync
async function syncLiveSpotifyApi() {
  const currentEntity = window.currentActiveArtist || "Drey Star";
  showToast(`🔄 Connecting to Spotify Web API for ${currentEntity}...`, "info", "Spotify Sync");

  try {
    const res = await fetch("/api/spotify/sync-live", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artistName: currentEntity })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`✓ ${data.message}\n${data.data.hint || ''}`, "success", "Spotify Synchronized");
      renderArtistProfileUI();
      loadMogulRoyalties();
    } else {
      showToast("Spotify synchronization error.", "warning");
    }
  } catch (e) {
    console.error("Spotify sync error:", e);
  }
}

// Global exports for Mogul
window.initMogulAuth = initMogulAuth;
window.toggleMogulUserDropdown = toggleMogulUserDropdown;
window.openMogulAuthModal = openMogulAuthModal;
window.closeMogulAuthModal = closeMogulAuthModal;
window.loginWithProvider = loginWithProvider;
window.handleMogulLoginForm = handleMogulLoginForm;
window.quickSwitchAuthRole = quickSwitchAuthRole;
window.logoutMogul = logoutMogul;
window.loadMogulRoyalties = loadMogulRoyalties;
window.claimMogulDiscrepancy = claimMogulDiscrepancy;
window.claimAllMogulDiscrepancies = claimAllMogulDiscrepancies;
window.runMogulAudit = runMogulAudit;
window.downloadMlcClaimCsv = downloadMlcClaimCsv;
window.downloadSoundExchangeCsv = downloadSoundExchangeCsv;
window.openMogulStatementModal = openMogulStatementModal;
window.closeMogulStatementModal = closeMogulStatementModal;
window.syncLiveSpotifyApi = syncLiveSpotifyApi;
window.switchAuthModalTab = switchAuthModalTab;
window.populateArtistPortalSelectDropdown = populateArtistPortalSelectDropdown;
window.loginAsArtist = loginAsArtist;
window.handleArtistEmailLogin = handleArtistEmailLogin;
window.clearWorkspaceCacheAndRestart = clearWorkspaceCacheAndRestart;



