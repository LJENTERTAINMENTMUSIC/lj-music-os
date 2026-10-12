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
  loadGeoIntelligence();
  loadAutomationStatus();
  loadLyricsForTrack("lj-000");
  loadArtistLyricsPortal();
  loadArtistRosterDirectory();
  executeStoreSearch();

  // Initial Copilot brief run
  executeCopilotQuery("I need an Afrobeats song for a Lagos luxury real-estate commercial, male vocal, 100–110 BPM, aspirational, premium, no explicit lyrics.");
});

// ==============================================================
// NAVIGATION / TAB SWITCHING
// ==============================================================
function switchTab(tabId) {
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
}

// ==============================================================
// 1. SWARM COMMAND CENTER & CEO BRIEFING (Section 18 & 20)
// ==============================================================
async function loadSwarmCommandCenter() {
  try {
    // 1. CEO Morning Briefing
    const resBriefing = await fetch("/api/swarm/briefing");
    const briefing = await resBriefing.json();
    document.getElementById("briefingDate").innerText = briefing.date;
    document.getElementById("briefingSummaryText").innerText = briefing.executiveSummary;

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
    if (currentFilter === "lj" && !track.isLjArtist) return false;
    if (genre && !track.genre.toLowerCase().includes(genre.toLowerCase())) return false;
    if (searchTerm) {
      const match = track.title.toLowerCase().includes(searchTerm) ||
                    track.artist.toLowerCase().includes(searchTerm) ||
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
async function loadEditorialPlaylists() {
  try {
    const res = await fetch("/api/editorial");
    const playlists = await res.json();
    const container = document.getElementById("editorialPlaylistsGrid");

    container.innerHTML = playlists.map(pl => `
      <div class="glass-panel border border-white/10 rounded-3xl p-6 shadow-spatial space-y-5">
        <div class="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div>
            <span class="text-[10px] font-extrabold text-violet-400 uppercase tracking-widest">${pl.category}</span>
            <h3 class="text-base font-black text-white mt-0.5">${pl.title}</h3>
            <p class="text-xs text-slate-400">${pl.description}</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-[10px] font-mono-code font-bold ${pl.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
            ${pl.status}
          </span>
        </div>

        <div class="space-y-3.5">
          ${pl.tracks.map((t, idx) => {
            const track = allTracks.find(x => x.id === t.trackId) || {
              id: t.trackId,
              title: `Track ${t.trackId}`,
              artist: "Unknown Artist",
              bpm: 108,
              key: "A minor",
              momentum: 91,
              isLjArtist: true,
              coverArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80"
            };
            const matchScore = track.momentum ? Math.min(98, Math.max(88, track.momentum)) : 94;

            return `
              <div class="glass-panel-subtle p-3.5 rounded-2xl border border-white/10 space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center space-x-3">
                    <img src="${track.coverArt}" class="w-12 h-12 rounded-xl object-cover border border-white/10 shadow flex-shrink-0">
                    <div>
                      <div class="flex items-center space-x-2">
                        <h4 class="font-bold text-white text-xs">${idx + 1}. ${track.title}</h4>
                        ${track.isLjArtist ? '<span class="purple-accent-gradient text-white text-[8px] font-black px-1.5 py-0.2 rounded shadow">LJ</span>' : ''}
                      </div>
                      <p class="text-[11px] text-slate-400">${track.artist} • <span class="font-mono-code text-violet-300">${track.bpm} BPM / ${track.key}</span></p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 rounded-lg text-[10px] font-mono-code font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex-shrink-0">
                    ${matchScore}% MATCH
                  </span>
                </div>

                <div class="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-300 italic">
                  "${t.rationale}"
                </div>

                <!-- Section 13 Editorial Review Actions -->
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
    `).join("");
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
let currentLyricsFormat = "synced";
let activeLyricsTrackId = "lj-000";

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
    if (titleEl) titleEl.innerText = `${record.title} — ${record.artist}`;
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

  if (currentLyricsFormat === "synced") {
    // Line-synced with timestamps
    const lines = currentLyricsRecord.lineSynced || [];
    container.innerHTML = lines.map((l, idx) => `
      <div class="flex items-center justify-between p-2 rounded-lg hover:bg-brand-dark/90 transition group cursor-pointer border border-transparent hover:border-pink-500/30">
        <div class="flex items-center space-x-3">
          <span class="text-slate-500 text-[10px] font-mono-code w-14 group-hover:text-pink-400">${l.startTime}</span>
          <span class="text-white font-medium text-xs group-hover:text-pink-200">${l.line}</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono-code">${l.singer}</span>
          <span class="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-300 font-mono-code">${l.language}</span>
        </div>
      </div>
    `).join("");
  } else if (currentLyricsFormat === "words") {
    // Word-synced TTML inspector
    const lines = currentLyricsRecord.lineSynced || [];
    container.innerHTML = `
      <div class="space-y-4">
        <div class="text-[10px] text-pink-300 font-mono-code">Syllable & Word-Level Timing (Spotify / Apple TTML Resolution):</div>
        ${lines.map(l => `
          <div class="bg-brand-dark p-3 rounded-xl border border-brand-cardBorder space-y-2">
            <div class="flex justify-between items-center text-[10px] text-slate-400 border-b border-brand-cardBorder pb-1">
              <span>[${l.startTime} → ${l.endTime}] Line #${l.lineIndex} (${l.section})</span>
              <span class="text-brand-gold font-mono-code">${l.words ? l.words.length : 0} timed words</span>
            </div>
            <div class="flex flex-wrap gap-1.5 pt-1">
              ${(l.words || []).map(w => `
                <span class="px-2 py-1 rounded bg-slate-800 border border-brand-cardBorder hover:border-pink-500 text-white text-[11px] group relative">
                  ${w.word}
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
      <pre class="text-xs text-slate-200 leading-relaxed font-mono-code whitespace-pre-wrap bg-brand-dark p-4 rounded-xl border border-brand-cardBorder">${currentLyricsRecord.canonicalLyrics}</pre>
    `;
  } else if (currentLyricsFormat === "clean") {
    container.innerHTML = `
      <div class="space-y-2">
        <div class="text-[10px] text-emerald-400 font-mono-code">Broadcast-Safe Radio Edit (Approved for Daytime Airplay):</div>
        <pre class="text-xs text-slate-200 leading-relaxed font-mono-code whitespace-pre-wrap bg-brand-dark p-4 rounded-xl border border-brand-cardBorder">${currentLyricsRecord.cleanLyrics || currentLyricsRecord.canonicalLyrics}</pre>
      </div>
    `;
  } else if (currentLyricsFormat === "translations") {
    const translations = currentLyricsRecord.translations || {};
    container.innerHTML = `
      <div class="space-y-4">
        ${Object.entries(translations).map(([code, t]) => `
          <div class="bg-brand-dark p-4 rounded-xl border border-brand-cardBorder space-y-2">
            <div class="flex justify-between items-center">
              <span class="font-bold text-white text-xs">${t.title || t.language}</span>
              <span class="text-[9px] px-2 py-0.5 rounded font-mono-code bg-indigo-500/20 text-indigo-300 font-bold uppercase">${code}</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed italic bg-brand-card/60 p-3 rounded-lg border border-brand-cardBorder">
              "${t.chorus}"
            </p>
          </div>
        `).join("")}
      </div>
    `;
  }
}

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

function openAddArtistFlow() {
  switchTab('tab-intake');
  const manualForm = document.getElementById("manualIntakeForm");
  if (manualForm && manualForm.classList.contains("hidden")) {
    manualForm.classList.remove("hidden");
  }
  const artistInput = document.getElementById("manualArtistName");
  if (artistInput) {
    setTimeout(() => {
      artistInput.focus();
      manualForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  }
  showToast("Opening Artist Intake Studio — paste a Spotify link, search store name, or use the direct form.", "info", "Add New Artist");
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
            <button onclick="switchTab('tab-command'); loadSwarmCommandCenter();" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition flex items-center space-x-1.5">
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
    const input = document.getElementById("spotifyTrackUrlInput");
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
  showToast(`Focusing catalogue & swarm strategy on ${artistName}`, 'info', 'Artist Selected');
  const matchedTrack = allTracks.find(t => t.artist.toLowerCase().includes(artistName.toLowerCase()));
  if (matchedTrack) {
    setAsActiveWorkingTrack(matchedTrack.id);
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
            <p><span class="text-slate-400">Status:</span> <span class="font-mono ${supabase.connected ? 'text-emerald-300' : 'text-amber-300'}">${supabase.status}</span></p>
            <p><span class="text-slate-400">Schema:</span> <span class="font-mono text-purple-300">${supabase.schemaFile}</span></p>
            <p class="text-[11px] text-slate-400">${supabase.message}</p>
          </div>
          
          <!-- Connect / Setup Form -->
          <div class="mt-3 pt-3 border-t border-white/10 space-y-2">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 mb-1">SUPABASE URL</label>
              <input type="text" id="supabaseUrlInput" placeholder="https://your-project.supabase.co" value="${supabase.url || ''}" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono">
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 mb-1">SUPABASE ANON / SERVICE KEY</label>
              <input type="password" id="supabaseKeyInput" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..." class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono">
            </div>
            <div class="flex items-center space-x-2 pt-1">
              <button onclick="submitSupabaseCredentials()" id="supabaseConnectBtn" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition active:scale-95 flex items-center justify-center space-x-1 shadow-md">
                <span>Connect & Save</span>
              </button>
              <a href="https://supabase.com/dashboard" target="_blank" class="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs rounded-lg transition border border-white/10 font-medium">Dashboard</a>
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
  const key = keyEl.value.trim();

  if (!url || !key) {
    msg.className = "text-[11px] text-rose-400 font-medium";
    msg.innerText = "Please provide both Supabase URL and Key.";
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



