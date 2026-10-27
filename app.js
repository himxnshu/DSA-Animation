/**
 * DSAbyHimanshu - Main Application Controller
 * Manages:
 * - Display page first (3D Showcase with central crown & clockwise orbital lines)
 * - Solved problem tracking (ONLY LC-1, LC-217, LC-242)
 * - Independent Play/Pause & Step Controls for Brute Force and Optimal
 * - Synchronized Race Mode
 * - Official LeetCode problem links
 * - Genuine Community Reviews only (no mock comments, persisted via LocalStorage)
 */

class DSAApp {
  constructor() {
    try {
      this.problems = (typeof DSA_PROBLEMS !== 'undefined' ? DSA_PROBLEMS : []).sort((a, b) => a.lcNumber - b.lcNumber);
      this.patterns = typeof DSA_PATTERNS !== 'undefined' ? DSA_PATTERNS : {};

      // Default problem is LC-1 or LC-217
      this.currentProblem = this.problems[0] || null;
      this.currentPatternId = "all";
      this.currentView = "landing"; // SHOW DISPLAY PAGE FIRST
      this.currentLang = "python";

      this.currentInput = this.currentProblem ? { ...this.currentProblem.defaultInput } : {};
      this.bruteSteps = [];
      this.optimalSteps = [];

      // Independent step tracking
      this.bruteStepIdx = 0;
      this.optimalStepIdx = 0;
      this.isBrutePlaying = false;
      this.isOptimalPlaying = false;
      this.bruteInterval = null;
      this.optimalInterval = null;
      this.playbackSpeed = 1000;

      this.visualizer = new VisualizerEngine();

      this.initDOM();
      this.initComments();
      if (this.currentProblem) {
        this.loadProblem(this.currentProblem.id);
      }
      this.bindEvents();

      // Show Display Landing Page first
      this.switchView("landing");
    } catch (err) {
      console.error("Error in DSAApp constructor:", err);
    }
  }

  initDOM() {
    // Navigation & Views
    this.landingPage = document.getElementById("landing-page");
    this.studioView = document.getElementById("studio-view");
    this.sheetView = document.getElementById("sheet-view");

    this.viewLandingBtn = document.getElementById("view-landing-btn");
    this.viewStudioBtn = document.getElementById("view-studio-btn");
    this.viewFeedbackBtn = document.getElementById("view-feedback-btn");
    this.viewSheetBtn = document.getElementById("view-sheet-btn");
    this.brandLogoBtn = document.getElementById("brand-logo-btn");

    this.btnBackToShowcase = document.getElementById("btn-back-to-showcase");
    this.btnExploreStudio = document.getElementById("btn-explore-studio");
    this.btnOpenReviews = document.getElementById("btn-open-reviews");
    this.metaLcLink = document.getElementById("meta-lc-link");

    // Email & Right Side Comment Elements
    this.emailInput = document.getElementById("comment-email");
    this.btnExportEmails = document.getElementById("btn-export-emails");
    this.emailCountBadge = document.getElementById("email-count-badge");
    this.landingLatestComment = document.getElementById("landing-latest-comment");
    this.landingReviewsCount = document.getElementById("landing-reviews-count");

    this.lcNumbersScroll = document.getElementById("lc-numbers-scroll");
    this.patternTabsBar = document.getElementById("pattern-tabs-bar");
    this.searchInput = document.getElementById("search-input");
    this.searchDropdown = document.getElementById("search-dropdown");
    this.searchBoxWrapper = document.getElementById("search-box-wrapper");

    // Code Execution Viewers directly above Visualizer Canvases (User Request)
    this.bruteCodeViewer = document.getElementById("brute-code-viewer");
    this.bruteActiveLineBadge = document.getElementById("brute-active-line-badge");
    this.bruteVarInspector = document.getElementById("brute-var-inspector");
    this.bruteComprehensionText = document.getElementById("brute-comprehension-text");

    this.optimalCodeViewer = document.getElementById("optimal-code-viewer");
    this.optimalActiveLineBadge = document.getElementById("optimal-active-line-badge");
    this.optimalVarInspector = document.getElementById("optimal-var-inspector");
    this.optimalComprehensionText = document.getElementById("optimal-comprehension-text");

    // Hero & Meta
    this.patternHeroBanner = document.getElementById("pattern-hero-banner");
    this.problemMetaCard = document.getElementById("problem-meta-card");

    // Brute Card Elements
    this.bruteCanvas = document.getElementById("brute-canvas");
    this.bruteStatusText = document.getElementById("brute-status-text");
    this.bruteComplexityBadge = document.getElementById("brute-complexity-badge");
    this.btnBrutePlay = document.getElementById("btn-brute-play");
    this.btnBrutePrev = document.getElementById("btn-brute-prev");
    this.btnBruteNext = document.getElementById("btn-brute-next");
    this.btnBruteReset = document.getElementById("btn-brute-reset");
    this.bruteCounterText = document.getElementById("brute-counter-text");
    this.bruteProgressBar = document.getElementById("brute-progress-bar");

    // Optimal Card Elements
    this.optimalCanvas = document.getElementById("optimal-canvas");
    this.optimalStatusText = document.getElementById("optimal-status-text");
    this.optimalComplexityBadge = document.getElementById("optimal-complexity-badge");
    this.btnOptimalPlay = document.getElementById("btn-optimal-play");
    this.btnOptimalPrev = document.getElementById("btn-optimal-prev");
    this.btnOptimalNext = document.getElementById("btn-optimal-next");
    this.btnOptimalReset = document.getElementById("btn-optimal-reset");
    this.optimalCounterText = document.getElementById("optimal-counter-text");
    this.optimalProgressBar = document.getElementById("optimal-progress-bar");

    // Master Sync Controls
    this.btnSyncPlay = document.getElementById("btn-sync-play");
    this.btnSyncReset = document.getElementById("btn-sync-reset");
    this.speedBtns = document.querySelectorAll(".speed-btn");

    // Explanations & Solved Example
    this.whyBruteFailsText = document.getElementById("why-brute-fails-text");
    this.howOptimalWorksText = document.getElementById("how-optimal-works-text");
    this.dryRunTableBody = document.getElementById("dry-run-table-body");
    this.dryRunTableHeader = document.getElementById("dry-run-table-header");
    this.codeContent = document.getElementById("code-content");
    this.codeLangBtns = document.querySelectorAll(".code-lang-btn");
    this.copyCodeBtn = document.getElementById("copy-code-btn");

    this.renderLCNumbersBar();
    this.renderPatternTabs();
  }

  renderLCNumbersBar() {
    if (!this.lcNumbersScroll) return;
    this.lcNumbersScroll.innerHTML = "";

    const list = this.problems.filter(p => {
      if (this.currentPatternId === "all") return true;
      return p.patternId === this.currentPatternId;
    });

    list.forEach(p => {
      const btn = document.createElement("button");
      btn.className = `lc-pill-btn ${p.id === this.currentProblem?.id ? 'active' : ''}`;
      btn.dataset.problemId = p.id;
      const diffClass = (p.difficulty || "Easy").toLowerCase();
      btn.innerHTML = `
        <span class="lc-pill-num">#${p.lcNumber}</span>
        <span class="lc-pill-title">${p.title}</span>
        <span class="lc-pill-diff diff-${diffClass}">${p.difficulty}</span>
        <a href="${p.lcUrl}" target="_blank" rel="noopener noreferrer" class="lc-pill-ext-link" title="Open ${p.title} on official LeetCode" onclick="event.stopPropagation();">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.246 2.019 5.617 1.906 7.728-.255l3.86-3.93a1.442 1.442 0 0 0-.012-2.029 1.402 1.402 0 0 0-2.012.012l-3.86 3.931c-1.127 1.155-2.928 1.216-4.13.136l-.039-.038-4.277-4.193a3.078 3.078 0 0 1-.659-.943 3.078 3.078 0 0 1-.186-.541 3.088 3.088 0 0 1-.033-1.319c.045-.252.146-.492.296-.703a3.012 3.012 0 0 1 .688-1.2l3.854-4.126 5.406-5.788c.552-.591.524-1.524-.067-2.076A1.374 1.374 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>
        </a>
      `;
      btn.addEventListener("click", () => {
        this.loadProblem(p.id);
        if (this.currentView !== "studio") {
          this.switchView("studio");
        }
      });
      this.lcNumbersScroll.appendChild(btn);
    });
  }

  renderPatternTabs() {
    if (!this.patternTabsBar) return;
    this.patternTabsBar.innerHTML = "";

    const allBtn = document.createElement("button");
    allBtn.className = `pattern-tab ${this.currentPatternId === 'all' ? 'active' : ''}`;
    allBtn.innerHTML = `<span>🌟</span> All Solved (${this.problems.length})`;
    allBtn.addEventListener("click", () => this.filterByPattern("all"));
    this.patternTabsBar.appendChild(allBtn);

    Object.values(this.patterns).forEach(pat => {
      const count = this.problems.filter(p => p.patternId === pat.id).length;
      if (count === 0) return;
      const btn = document.createElement("button");
      btn.className = `pattern-tab ${this.currentPatternId === pat.id ? 'active' : ''}`;
      btn.innerHTML = `<span>${pat.icon}</span> ${pat.name} (${count})`;
      btn.addEventListener("click", () => this.filterByPattern(pat.id));
      this.patternTabsBar.appendChild(btn);
    });
  }

  filterByPattern(patternId) {
    this.currentPatternId = patternId;
    this.renderPatternTabs();
    this.renderLCNumbersBar();

    const available = this.problems.filter(p => patternId === "all" || p.patternId === patternId);
    if (available.length > 0 && !available.some(p => p.id === this.currentProblem?.id)) {
      this.loadProblem(available[0].id);
    }

    if (this.currentView === "sheet") {
      this.renderSheetView();
    }
  }

  loadProblem(problemId, customInput = null) {
    this.pauseBrute();
    this.pauseOptimal();

    const prob = this.problems.find(p => p.id === problemId);
    if (!prob) return;

    this.currentProblem = prob;
    this.currentInput = customInput || { ...prob.defaultInput };

    // Generate Steps
    this.bruteSteps = prob.bruteForce.getSteps(this.currentInput);
    this.optimalSteps = prob.optimal.getSteps(this.currentInput);

    this.bruteStepIdx = 0;
    this.optimalStepIdx = 0;

    // Update LC pill highlights
    document.querySelectorAll(".lc-pill-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.problemId === prob.id);
    });

    // Update LeetCode link button at top of studio
    if (this.metaLcLink) {
      this.metaLcLink.href = prob.lcUrl;
      this.metaLcLink.innerHTML = `<span>🔗</span> Open LC #${prob.lcNumber} on LeetCode ↗`;
    }

    this.updateHeaderAndMeta();
    this.updateExplanationAndCode();
    this.renderBruteStep();
    this.renderOptimalStep();
  }

  updateHeaderAndMeta() {
    const prob = this.currentProblem;
    if (!prob) return;
    const pat = this.patterns[prob.patternId] || { name: "Pattern", icon: "⚡", tagline: "", punchline: "" };

    // Pattern Hero Banner
    if (this.patternHeroBanner) {
      this.patternHeroBanner.innerHTML = `
        <div class="pattern-hero-info">
          <div class="pattern-hero-title">
            <span>${pat.icon}</span>
            <span>${pat.name}</span>
          </div>
          <div class="pattern-hero-tagline">${pat.tagline}</div>
        </div>
        <div class="pattern-punchline-badge">
          <span>💡 Pattern Punchline:</span>
          <b>"${prob.punchline || pat.punchline}"</b>
        </div>
      `;
    }

    // Problem Metadata Card with direct LeetCode link
    if (this.problemMetaCard) {
      const diffClass = prob.difficulty === "Easy" ? "diff-easy" : (prob.difficulty === "Medium" ? "diff-medium" : "diff-hard");
      this.problemMetaCard.innerHTML = `
        <div class="problem-meta-top">
          <div class="problem-heading">
            <span class="problem-number-badge">LC #${prob.lcNumber}</span>
            <span class="problem-title-text">${prob.title}</span>
            <span class="difficulty-pill ${diffClass}">${prob.difficulty}</span>
            <a href="${prob.lcUrl}" target="_blank" rel="noopener noreferrer" class="dock-lc-link" title="Open ${prob.title} on official LeetCode">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle;"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.246 2.019 5.617 1.906 7.728-.255l3.86-3.93a1.442 1.442 0 0 0-.012-2.029 1.402 1.402 0 0 0-2.012.012l-3.86 3.931c-1.127 1.155-2.928 1.216-4.13.136l-.039-.038-4.277-4.193a3.078 3.078 0 0 1-.659-.943 3.078 3.078 0 0 1-.186-.541 3.088 3.088 0 0 1-.033-1.319c.045-.252.146-.492.296-.703a3.012 3.012 0 0 1 .688-1.2l3.854-4.126 5.406-5.788c.552-.591.524-1.524-.067-2.076A1.374 1.374 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>
              Solve on LeetCode ↗
            </a>
          </div>
          <div class="preset-controls">
            <label class="preset-label" for="preset-select">Preset Examples:</label>
            <select id="preset-select" class="preset-select">
              ${prob.presets.map((pr, idx) => `<option value="${idx}">${pr.name}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="problem-prompt">${prob.prompt}</div>
        <div class="problem-tags">
          ${prob.tags.map(t => `<span class="tag-pill">#${t}</span>`).join("")}
        </div>
      `;

      const sel = document.getElementById("preset-select");
      if (sel) {
        sel.addEventListener("change", (e) => {
          const presetIdx = parseInt(e.target.value, 10);
          const preset = this.currentProblem.presets[presetIdx];
          if (preset) {
            this.loadProblem(this.currentProblem.id, preset.input);
          }
        });
      }
    }

    // Complexity badges
    if (this.bruteComplexityBadge) this.bruteComplexityBadge.textContent = prob.bruteForce.timeComplexity;
    if (this.optimalComplexityBadge) this.optimalComplexityBadge.textContent = prob.optimal.timeComplexity;
  }

  updateExplanationAndCode() {
    const prob = this.currentProblem;
    if (!prob) return;

    if (this.whyBruteFailsText) {
      this.whyBruteFailsText.innerHTML = `
        <p><b>Approach:</b> ${prob.bruteForce.name}</p>
        <p style="margin-top: 8px;"><b>Complexity:</b> Time: <span class="pill-brute" style="padding: 2px 6px; border-radius: 4px;">${prob.bruteForce.timeComplexity}</span> | Space: ${prob.bruteForce.spaceComplexity}</p>
        <p style="margin-top: 8px; line-height: 1.6; color: var(--text-muted);">${prob.bruteForce.explanation}</p>
      `;
    }

    if (this.howOptimalWorksText) {
      this.howOptimalWorksText.innerHTML = `
        <p><b>Applied Pattern:</b> ${prob.optimal.name}</p>
        <p style="margin-top: 8px;"><b>Complexity:</b> Time: <span class="pill-optimal" style="padding: 2px 6px; border-radius: 4px;">${prob.optimal.timeComplexity}</span> | Space: ${prob.optimal.spaceComplexity}</p>
        <p style="margin-top: 8px; line-height: 1.6; color: var(--text-muted);">${prob.optimal.explanation}</p>
      `;
    }

    // Dry Run Table
    if (this.dryRunTableHeader && this.dryRunTableBody && prob.dryRunTable) {
      this.dryRunTableHeader.innerHTML = "";
      this.dryRunTableBody.innerHTML = "";

      const sample = prob.dryRunTable[0] || {};
      const keys = Object.keys(sample);

      const headerTr = document.createElement("tr");
      keys.forEach(k => {
        const th = document.createElement("th");
        th.textContent = k.toUpperCase();
        headerTr.appendChild(th);
      });
      this.dryRunTableHeader.appendChild(headerTr);

      prob.dryRunTable.forEach(row => {
        const tr = document.createElement("tr");
        keys.forEach(k => {
          const td = document.createElement("td");
          td.textContent = row[k];
          tr.appendChild(td);
        });
        this.dryRunTableBody.appendChild(tr);
      });
    }

    // Multi-Language Code viewer
    this.updateCodeSnippet();
  }

  updateCodeSnippet() {
    if (!this.codeContent) return;
    const code = this.currentProblem?.code[this.currentLang] || "";
    this.codeContent.textContent = code;
    this.codeLangBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === this.currentLang);
    });
  }

  // =========================================================================
  // INDEPENDENT BRUTE FORCE CONTROLS & CODE EXECUTION
  // =========================================================================
  renderVarInspector(container, varsObj) {
    if (!container) return;
    container.innerHTML = "";
    if (!varsObj) return;
    Object.entries(varsObj).forEach(([k, v]) => {
      const pill = document.createElement("span");
      pill.className = "inspector-pill";
      pill.innerHTML = `<span>${k}:</span> <b>${v}</b>`;
      container.appendChild(pill);
    });
  }

  escapeCode(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  renderBruteCode(activeLine = 1) {
    if (!this.bruteCodeViewer || !this.currentProblem) return;
    const lines = this.currentProblem.bruteForce?.codeLines || [];
    this.bruteCodeViewer.innerHTML = "";
    lines.forEach(l => {
      const row = document.createElement("div");
      const isActive = l.line === activeLine;
      row.className = `code-line-row ${isActive ? 'is-active-line' : ''}`;
      row.innerHTML = `
        <span class="code-line-num">${l.line}</span>
        <span class="code-line-text">${this.escapeCode(l.text)}</span>
        ${l.note ? `<span class="code-line-note"># ${this.escapeCode(l.note)}</span>` : ''}
      `;
      this.bruteCodeViewer.appendChild(row);
    });
    if (this.bruteActiveLineBadge) {
      this.bruteActiveLineBadge.textContent = `▶ Line ${activeLine}`;
    }
  }

  renderOptimalCode(activeLine = 1) {
    if (!this.optimalCodeViewer || !this.currentProblem) return;
    const lines = this.currentProblem.optimal?.codeLines || [];
    this.optimalCodeViewer.innerHTML = "";
    lines.forEach(l => {
      const row = document.createElement("div");
      const isActive = l.line === activeLine;
      row.className = `code-line-row ${isActive ? 'is-active-line' : ''}`;
      row.innerHTML = `
        <span class="code-line-num">${l.line}</span>
        <span class="code-line-text">${this.escapeCode(l.text)}</span>
        ${l.note ? `<span class="code-line-note"># ${this.escapeCode(l.note)}</span>` : ''}
      `;
      this.optimalCodeViewer.appendChild(row);
    });
    if (this.optimalActiveLineBadge) {
      this.optimalActiveLineBadge.textContent = `▶ Line ${activeLine}`;
    }
  }

  renderBruteStep() {
    if (!this.bruteSteps || this.bruteSteps.length === 0) return;
    const step = this.bruteSteps[this.bruteStepIdx];
    if (step) {
      this.visualizer.renderBruteStep(this.currentProblem, step);
      if (this.bruteStatusText) this.bruteStatusText.innerHTML = step.status;
      this.renderBruteCode(step.codeLine || 1);
      this.renderVarInspector(this.bruteVarInspector, step.vars);
      if (this.bruteComprehensionText && step.firstTimerExplanation) {
        this.bruteComprehensionText.innerHTML = step.firstTimerExplanation;
      }
    }
    if (this.bruteCounterText) {
      this.bruteCounterText.textContent = `Step ${this.bruteStepIdx + 1} / ${this.bruteSteps.length}`;
    }
    if (this.bruteProgressBar) {
      const pct = ((this.bruteStepIdx + 1) / this.bruteSteps.length) * 100;
      this.bruteProgressBar.style.width = `${pct}%`;
    }

    if (this.btnBrutePrev) this.btnBrutePrev.disabled = this.bruteStepIdx === 0;
    if (this.btnBruteNext) this.btnBruteNext.disabled = this.bruteStepIdx >= this.bruteSteps.length - 1;
  }

  stepBruteForward() {
    if (this.bruteStepIdx < this.bruteSteps.length - 1) {
      this.bruteStepIdx++;
      this.renderBruteStep();
    } else {
      this.pauseBrute();
    }
  }

  stepBruteBackward() {
    if (this.bruteStepIdx > 0) {
      this.bruteStepIdx--;
      this.renderBruteStep();
    }
  }

  playBrute() {
    if (this.bruteStepIdx >= this.bruteSteps.length - 1) {
      this.bruteStepIdx = 0;
    }
    this.isBrutePlaying = true;
    if (this.btnBrutePlay) {
      this.btnBrutePlay.innerHTML = `<span>⏸</span> Pause`;
      this.btnBrutePlay.classList.add("playing");
    }

    if (this.bruteInterval) clearInterval(this.bruteInterval);
    this.bruteInterval = setInterval(() => {
      if (this.bruteStepIdx < this.bruteSteps.length - 1) {
        this.stepBruteForward();
      } else {
        this.pauseBrute();
      }
    }, this.playbackSpeed);
  }

  pauseBrute() {
    this.isBrutePlaying = false;
    if (this.bruteInterval) {
      clearInterval(this.bruteInterval);
      this.bruteInterval = null;
    }
    if (this.btnBrutePlay) {
      this.btnBrutePlay.innerHTML = `<span>▶</span> Play`;
      this.btnBrutePlay.classList.remove("playing");
    }
  }

  toggleBrutePlay() {
    if (this.isBrutePlaying) this.pauseBrute();
    else this.playBrute();
  }

  resetBrute() {
    this.pauseBrute();
    this.bruteStepIdx = 0;
    this.renderBruteStep();
  }

  // =========================================================================
  // INDEPENDENT OPTIMAL CONTROLS & CODE EXECUTION
  // =========================================================================
  renderOptimalStep() {
    if (!this.optimalSteps || this.optimalSteps.length === 0) return;
    const step = this.optimalSteps[this.optimalStepIdx];
    if (step) {
      this.visualizer.renderOptimalStep(this.currentProblem, step);
      if (this.optimalStatusText) this.optimalStatusText.innerHTML = step.status;
      this.renderOptimalCode(step.codeLine || 1);
      this.renderVarInspector(this.optimalVarInspector, step.vars);
      if (this.optimalComprehensionText && step.firstTimerExplanation) {
        this.optimalComprehensionText.innerHTML = step.firstTimerExplanation;
      }
    }
    if (this.optimalCounterText) {
      this.optimalCounterText.textContent = `Step ${this.optimalStepIdx + 1} / ${this.optimalSteps.length}`;
    }
    if (this.optimalProgressBar) {
      const pct = ((this.optimalStepIdx + 1) / this.optimalSteps.length) * 100;
      this.optimalProgressBar.style.width = `${pct}%`;
    }

    if (this.btnOptimalPrev) this.btnOptimalPrev.disabled = this.optimalStepIdx === 0;
    if (this.btnOptimalNext) this.btnOptimalNext.disabled = this.optimalStepIdx >= this.optimalSteps.length - 1;
  }

  stepOptimalForward() {
    if (this.optimalStepIdx < this.optimalSteps.length - 1) {
      this.optimalStepIdx++;
      this.renderOptimalStep();
    } else {
      this.pauseOptimal();
    }
  }

  stepOptimalBackward() {
    if (this.optimalStepIdx > 0) {
      this.optimalStepIdx--;
      this.renderOptimalStep();
    }
  }

  playOptimal() {
    if (this.optimalStepIdx >= this.optimalSteps.length - 1) {
      this.optimalStepIdx = 0;
    }
    this.isOptimalPlaying = true;
    if (this.btnOptimalPlay) {
      this.btnOptimalPlay.innerHTML = `<span>⏸</span> Pause`;
      this.btnOptimalPlay.classList.add("playing");
    }

    if (this.optimalInterval) clearInterval(this.optimalInterval);
    this.optimalInterval = setInterval(() => {
      if (this.optimalStepIdx < this.optimalSteps.length - 1) {
        this.stepOptimalForward();
      } else {
        this.pauseOptimal();
      }
    }, this.playbackSpeed);
  }

  pauseOptimal() {
    this.isOptimalPlaying = false;
    if (this.optimalInterval) {
      clearInterval(this.optimalInterval);
      this.optimalInterval = null;
    }
    if (this.btnOptimalPlay) {
      this.btnOptimalPlay.innerHTML = `<span>▶</span> Play`;
      this.btnOptimalPlay.classList.remove("playing");
    }
  }

  toggleOptimalPlay() {
    if (this.isOptimalPlaying) this.pauseOptimal();
    else this.playOptimal();
  }

  resetOptimal() {
    this.pauseOptimal();
    this.optimalStepIdx = 0;
    this.renderOptimalStep();
  }

  // =========================================================================
  // SYNCHRONIZED RACE CONTROLS
  // =========================================================================
  syncPlayBoth() {
    const isEitherPlaying = this.isBrutePlaying || this.isOptimalPlaying;
    if (isEitherPlaying) {
      this.pauseBrute();
      this.pauseOptimal();
      if (this.btnSyncPlay) this.btnSyncPlay.innerHTML = `<span>⚡</span> Race Both (Sync Play)`;
    } else {
      this.playBrute();
      this.playOptimal();
      if (this.btnSyncPlay) this.btnSyncPlay.innerHTML = `<span>⏸</span> Pause Race`;
    }
  }

  syncResetBoth() {
    this.resetBrute();
    this.resetOptimal();
    if (this.btnSyncPlay) this.btnSyncPlay.innerHTML = `<span>⚡</span> Race Both (Sync Play)`;
  }

  // =========================================================================
  // COMMUNITY COMMENTS & FEEDBACK SYSTEM (GENUINE ONLY)
  // =========================================================================
  initComments() {
    this.commentsListEl = document.getElementById("comments-list");
    this.commentForm = document.getElementById("comment-form");
    this.authorInput = document.getElementById("comment-author");
    this.messageInput = document.getElementById("comment-message");
    this.verdictSelect = document.getElementById("comment-verdict");
    this.ratingStars = document.querySelectorAll(".star-rating-select .star");
    this.currentStarRating = 5;

    // Attach click and hover handlers to stars
    if (this.ratingStars && this.ratingStars.length > 0) {
      this.ratingStars.forEach((star) => {
        const val = parseInt(star.dataset.val, 10);

        star.addEventListener("click", () => {
          this.currentStarRating = val;
          this.updateStarRatingDisplay(this.currentStarRating);
        });

        star.addEventListener("mouseenter", () => {
          this.ratingStars.forEach((s) => {
            const sVal = parseInt(s.dataset.val, 10);
            s.classList.toggle("hovered", sVal <= val);
          });
        });
      });

      const starContainer = document.querySelector(".star-rating-select");
      if (starContainer) {
        starContainer.addEventListener("mouseleave", () => {
          this.ratingStars.forEach(s => s.classList.remove("hovered"));
          this.updateStarRatingDisplay(this.currentStarRating);
        });
      }
    }

    // Purge fake mock comments from localStorage and load only genuine comments
    const saved = localStorage.getItem("dsabyhimanshu_comments");
    let comments = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          comments = parsed.filter(c =>
            c && c.id !== "c-1" && c.id !== "c-2" && c.id !== "c-3" &&
            c.author !== "Aarav Sharma" && c.author !== "Priya Patel" && c.author !== "DevKunal" &&
            (!c.message || !c.message.includes("LC-75"))
          );
        }
      } catch (e) {
        comments = [];
      }
    }

    this.comments = comments;
    this.saveComments();
    this.renderComments();
    this.updateSentimentStats();
    this.updateStarRatingDisplay(5);
  }

  updateStarRatingDisplay(rating) {
    if (!this.ratingStars) return;
    this.ratingStars.forEach((s) => {
      const val = parseInt(s.dataset.val, 10);
      s.classList.toggle("selected", val <= rating);
      s.classList.remove("hovered");
    });
  }

  saveComments() {
    localStorage.setItem("dsabyhimanshu_comments", JSON.stringify(this.comments));
  }

  renderComments() {
    if (!this.commentsListEl) return;
    this.commentsListEl.innerHTML = "";

    // If no genuine comments yet, render clean empty prompt
    if (this.comments.length === 0) {
      this.commentsListEl.innerHTML = `
        <div class="empty-comments-callout">
          <div style="font-size: 32px; margin-bottom: 8px;">💬</div>
          <div style="font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 6px;">No Community Reviews Yet</div>
          <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5;">
            Only genuine feedback from learners is shown here! Be the first to share your review on the right side.
          </p>
        </div>
      `;
      if (this.landingLatestComment) {
        this.landingLatestComment.innerHTML = '<div style="font-size: 12px; color: var(--text-muted); font-style: italic;">No comments yet. Leave a review with your email!</div>';
      }
      if (this.landingReviewsCount) this.landingReviewsCount.textContent = "0 Reviews";
      if (this.emailCountBadge) this.emailCountBadge.textContent = "0";
      return;
    }

    this.comments.forEach((c) => {
      const card = document.createElement("div");
      card.className = "comment-card";
      const starsStr = "★".repeat(c.rating) + "☆".repeat(5 - c.rating);
      const isGood = c.verdict === "good";

      card.innerHTML = `
        <div class="comment-header">
          <div class="comment-author-info">
            <span class="comment-avatar">${c.author.charAt(0).toUpperCase()}</span>
            <div>
              <div class="comment-author-name">${c.author} <span class="verified-tag">✓ Verified Learner</span></div>
              <div class="comment-date">${c.date}</div>
            </div>
          </div>
          <div class="comment-verdict-badge ${isGood ? 'verdict-good' : 'verdict-improve'}">
            ${isGood ? '👍 Good' : '💡 Needs Work'}
          </div>
        </div>
        <div class="comment-stars">${starsStr}</div>
        <div class="comment-body">${c.message}</div>
        <div style="font-size: 11px; color: var(--color-cyan); margin-bottom: 8px; font-family: 'JetBrains Mono', monospace;">
          ✉ ${c.email ? c.email.replace(/(.{2})(.*)(@.*)/, "$1***$3") : "Direct to Himanshu"}
        </div>
        <div class="comment-footer">
          <button class="like-btn" data-id="${c.id}">
            ❤️ <span class="like-count">${c.likes || 0}</span>
          </button>
        </div>
      `;

      card.querySelector(".like-btn").addEventListener("click", () => {
        c.likes = (c.likes || 0) + 1;
        card.querySelector(".like-count").textContent = c.likes;
        this.saveComments();
      });

      this.commentsListEl.appendChild(card);
    });

    // Update Live Comment Preview on the Right Side of Showcase Landing Page
    if (this.landingLatestComment && this.comments.length > 0) {
      const latest = this.comments[0];
      const starsStr = "★".repeat(latest.rating) + "☆".repeat(5 - latest.rating);
      this.landingLatestComment.innerHTML = `
        <div class="landing-comment-author-row">
          <span class="landing-comment-author-name">${latest.author}</span>
          <span class="landing-comment-stars">${starsStr}</span>
        </div>
        <div style="font-size: 12px; color: var(--text-main); margin-bottom: 4px; line-height: 1.4;">"${latest.message.slice(0, 85)}${latest.message.length > 85 ? '...' : ''}"</div>
        <div style="font-size: 10px; color: var(--color-cyan); font-family: 'JetBrains Mono', monospace;">✓ Verified Learner • ${latest.date}</div>
      `;
    }

    if (this.landingReviewsCount) {
      this.landingReviewsCount.textContent = `${this.comments.length} Review${this.comments.length > 1 ? 's' : ''}`;
    }

    if (this.emailCountBadge) {
      const emailCount = this.comments.filter(c => c.email).length;
      this.emailCountBadge.textContent = emailCount;
    }
  }

  updateSentimentStats() {
    const total = this.comments.length;
    const scoreEl = document.getElementById("rating-score");
    const pctEl = document.getElementById("good-percentage");
    const countEl = document.getElementById("reviews-count");

    if (total === 0) {
      if (scoreEl) scoreEl.textContent = "5.0";
      if (pctEl) pctEl.textContent = "100%";
      if (countEl) countEl.textContent = "0 genuine reviews";
      return;
    }

    const goodCount = this.comments.filter(c => c.verdict === "good").length;
    const goodPct = Math.round((goodCount / total) * 100);
    const avgRating = (this.comments.reduce((acc, c) => acc + c.rating, 0) / total).toFixed(1);

    if (scoreEl) scoreEl.textContent = avgRating;
    if (pctEl) pctEl.textContent = `${goodPct}%`;
    if (countEl) countEl.textContent = `${total} genuine review${total > 1 ? 's' : ''}`;
  }

  addComment(author, email, message, rating, verdict) {
    const newComment = {
      id: `c-${Date.now()}`,
      author: author || "Anonymous Coder",
      email: email || "",
      rating: rating || 5,
      verdict: verdict || "good",
      message: message,
      date: "Just now",
      likes: 1
    };

    this.comments.unshift(newComment);
    this.saveComments();
    this.renderComments();
    this.updateSentimentStats();
  }

  // =========================================================================
  // EVENT BINDINGS
  // =========================================================================
  bindEvents() {
    // Brute Controls
    if (this.btnBrutePlay) this.btnBrutePlay.addEventListener("click", () => this.toggleBrutePlay());
    if (this.btnBrutePrev) this.btnBrutePrev.addEventListener("click", () => { this.pauseBrute(); this.stepBruteBackward(); });
    if (this.btnBruteNext) this.btnBruteNext.addEventListener("click", () => { this.pauseBrute(); this.stepBruteForward(); });
    if (this.btnBruteReset) this.btnBruteReset.addEventListener("click", () => this.resetBrute());

    // Optimal Controls
    if (this.btnOptimalPlay) this.btnOptimalPlay.addEventListener("click", () => this.toggleOptimalPlay());
    if (this.btnOptimalPrev) this.btnOptimalPrev.addEventListener("click", () => { this.pauseOptimal(); this.stepOptimalBackward(); });
    if (this.btnOptimalNext) this.btnOptimalNext.addEventListener("click", () => { this.pauseOptimal(); this.stepOptimalForward(); });
    if (this.btnOptimalReset) this.btnOptimalReset.addEventListener("click", () => this.resetOptimal());

    // Master Sync Race Controls
    if (this.btnSyncPlay) this.btnSyncPlay.addEventListener("click", () => this.syncPlayBoth());
    if (this.btnSyncReset) this.btnSyncReset.addEventListener("click", () => this.syncResetBoth());

    // Speed Controls
    this.speedBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.speedBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const speed = parseFloat(btn.dataset.speed);
        this.playbackSpeed = 1000 / speed;

        if (this.isBrutePlaying) {
          this.pauseBrute();
          this.playBrute();
        }
        if (this.isOptimalPlaying) {
          this.pauseOptimal();
          this.playOptimal();
        }
      });
    });

    // Language switcher
    this.codeLangBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.currentLang = btn.dataset.lang;
        this.updateCodeSnippet();
      });
    });

    // Copy code button
    if (this.copyCodeBtn) {
      this.copyCodeBtn.addEventListener("click", () => {
        const code = this.currentProblem?.code[this.currentLang] || "";
        navigator.clipboard.writeText(code).then(() => {
          const orig = this.copyCodeBtn.textContent;
          this.copyCodeBtn.textContent = "✓ Copied!";
          setTimeout(() => this.copyCodeBtn.textContent = orig, 1500);
        });
      });
    }

    // View switchers
    if (this.viewLandingBtn) this.viewLandingBtn.addEventListener("click", () => this.switchView("landing"));
    if (this.viewStudioBtn) this.viewStudioBtn.addEventListener("click", () => this.switchView("studio"));
    if (this.viewFeedbackBtn) this.viewFeedbackBtn.addEventListener("click", () => this.switchView("feedback"));
    if (this.viewSheetBtn) this.viewSheetBtn.addEventListener("click", () => this.switchView("sheet"));
    if (this.brandLogoBtn) this.brandLogoBtn.addEventListener("click", () => this.switchView("landing"));

    // Back to Showcase button inside Studio
    if (this.btnBackToShowcase) this.btnBackToShowcase.addEventListener("click", () => this.switchView("landing"));
    if (this.btnExploreStudio) this.btnExploreStudio.addEventListener("click", () => this.switchView("studio"));
    if (this.btnOpenReviews) this.btnOpenReviews.addEventListener("click", () => this.switchView("feedback"));

    // Launch animation buttons from the Showcase Landing dock & Quick problem pills
    document.querySelectorAll(".btn-launch-anim, .hero-prob-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        const pid = btn.dataset.problemId;
        if (pid) {
          this.loadProblem(pid);
        }
        this.switchView("studio");
      });
    });

    // Live Search Bar with Dropdown & Enter-key Navigation
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => this.handleSearch(e.target.value));
      this.searchInput.addEventListener("focus", (e) => this.handleSearch(e.target.value));
      this.searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.handleSearchEnter(e.target.value);
        } else if (e.key === "Escape") {
          this.closeSearchDropdown();
        }
      });
    }

    // Dismiss search dropdown on click outside
    document.addEventListener("click", (e) => {
      if (this.searchBoxWrapper && !this.searchBoxWrapper.contains(e.target)) {
        this.closeSearchDropdown();
      }
    });

    // Ensure background video plays cleanly
    const bgVideo = document.getElementById("bg-video");
    if (bgVideo) {
      bgVideo.muted = true;
      const playPromise = bgVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const playOnGesture = () => {
            bgVideo.play();
            document.removeEventListener("click", playOnGesture);
          };
          document.addEventListener("click", playOnGesture);
        });
      }
    }

    // Comment Form Submit (Captures Email & Updates Right Side Live)
    if (this.commentForm) {
      this.commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const author = this.authorInput?.value.trim();
        const email = this.emailInput?.value.trim();
        const msg = this.messageInput?.value.trim();
        const verdict = this.verdictSelect?.value || "good";
        if (!msg || !email) {
          alert("Please enter both your review and email address!");
          return;
        }

        this.addComment(author, email, msg, this.currentStarRating, verdict);
        if (this.messageInput) this.messageInput.value = "";
        if (this.emailInput) this.emailInput.value = "";
        alert("Thank you! Your review and email have been saved. Your comment is now live on the right side!");
      });
    }

    // Export Emails Button
    if (this.btnExportEmails) {
      this.btnExportEmails.addEventListener("click", () => {
        const withEmails = this.comments.filter(c => c.email);
        if (withEmails.length === 0) {
          alert("No commenter emails collected yet! As users comment with their email, they will be listed here.");
          return;
        }

        const emailList = withEmails.map(c => `"${c.author}","${c.email}","${c.rating}","${c.verdict}","${c.date}"`).join("\n");
        const csv = "Author,Email,Rating,Verdict,Date\n" + emailList;
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "dsabyhimanshu_commenter_emails.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        const plainEmails = withEmails.map(c => c.email).join(", ");
        navigator.clipboard.writeText(plainEmails);
        alert(`Exported ${withEmails.length} email(s) to 'dsabyhimanshu_commenter_emails.csv' and copied to clipboard!`);
      });
    }

    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        this.syncPlayBoth();
      } else if (e.code === "KeyB") {
        this.toggleBrutePlay();
      } else if (e.code === "KeyO") {
        this.toggleOptimalPlay();
      } else if (e.code === "KeyR") {
        this.syncResetBoth();
      }
    });
  }

  switchView(viewName) {
    this.currentView = viewName;
    document.body.classList.toggle("is-landing", viewName === "landing");
    document.body.classList.toggle("is-sheet", viewName === "sheet");

    // Reset button active states
    if (this.viewLandingBtn) this.viewLandingBtn.classList.remove("active");
    if (this.viewStudioBtn) this.viewStudioBtn.classList.remove("active");
    if (this.viewFeedbackBtn) this.viewFeedbackBtn.classList.remove("active");
    if (this.viewSheetBtn) this.viewSheetBtn.classList.remove("active");

    // Background video play/pause management
    const bgVideo = document.getElementById("bg-video");

    if (viewName === "landing") {
      this.pauseBrute();
      this.pauseOptimal();
      if (bgVideo) {
        try { bgVideo.play(); } catch (e) {}
      }
      if (this.landingPage) this.landingPage.style.display = "flex";
      if (this.studioView) this.studioView.style.display = "none";
      if (this.sheetView) this.sheetView.style.display = "none";
      if (this.viewLandingBtn) this.viewLandingBtn.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      if (bgVideo) {
        try { bgVideo.pause(); } catch (e) {}
      }
      if (viewName === "studio") {
        if (this.landingPage) this.landingPage.style.display = "none";
        if (this.studioView) this.studioView.style.display = "block";
        if (this.sheetView) this.sheetView.style.display = "none";
        if (this.viewStudioBtn) this.viewStudioBtn.classList.add("active");
        this.renderBruteStep();
        this.renderOptimalStep();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (viewName === "sheet") {
        this.pauseBrute();
        this.pauseOptimal();
        if (this.landingPage) this.landingPage.style.display = "none";
        if (this.studioView) this.studioView.style.display = "none";
        if (this.sheetView) this.sheetView.style.display = "block";
        if (this.viewSheetBtn) this.viewSheetBtn.classList.add("active");
        this.renderSheetView();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (viewName === "feedback") {
        if (this.landingPage) this.landingPage.style.display = "none";
        if (this.studioView) this.studioView.style.display = "block";
        if (this.sheetView) this.sheetView.style.display = "none";
        if (this.viewFeedbackBtn) this.viewFeedbackBtn.classList.add("active");
        const fb = document.getElementById("community-feedback");
        if (fb) {
          fb.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }

  handleSearch(query) {
    const q = (query || "").trim().toLowerCase();

    const matches = this.problems.filter(p => {
      if (!q) return true;
      const numMatch = p.lcNumber.toString().includes(q) || `lc-${p.lcNumber}`.includes(q) || `#${p.lcNumber}`.includes(q);
      const titleMatch = p.title.toLowerCase().includes(q);
      const tagMatch = p.tags && p.tags.some(t => t.toLowerCase().includes(q));
      const pat = this.patterns[p.patternId];
      const patMatch = pat ? pat.name.toLowerCase().includes(q) : false;
      return numMatch || titleMatch || tagMatch || patMatch;
    });

    // 1. Reactive feedback on Homepage Hero Problem Pills
    document.querySelectorAll(".hero-prob-pill").forEach(pill => {
      const pId = pill.dataset.problemId;
      if (!q) {
        pill.style.opacity = "1";
        pill.style.transform = "none";
        pill.style.boxShadow = "none";
        pill.style.borderColor = "";
      } else {
        const isMatched = matches.some(m => m.id === pId);
        pill.style.opacity = isMatched ? "1" : "0.25";
        pill.style.borderColor = isMatched ? "var(--color-gold)" : "";
        pill.style.boxShadow = isMatched ? "0 0 16px rgba(250, 204, 21, 0.45)" : "none";
        pill.style.transform = isMatched ? "scale(1.05)" : "none";
      }
    });

    // 2. Update LC Numbers scroll bar if active
    if (this.lcNumbersScroll) {
      this.lcNumbersScroll.innerHTML = "";
      matches.forEach(p => {
        const btn = document.createElement("button");
        btn.className = `lc-pill-btn ${p.id === this.currentProblem?.id ? 'active' : ''}`;
        btn.dataset.problemId = p.id;
        btn.innerHTML = `<span class="lc-pill-num">#${p.lcNumber}</span> <span>${p.title}</span>`;
        btn.addEventListener("click", () => {
          this.loadProblem(p.id);
          if (this.currentView !== "studio") this.switchView("studio");
          this.closeSearchDropdown();
        });
        this.lcNumbersScroll.appendChild(btn);
      });
    }

    // 3. Render floating live search dropdown popup
    this.renderSearchDropdown(matches, q);

    if (this.currentView === "sheet") {
      this.renderSheetView();
    }
  }

  renderSearchDropdown(matches, query) {
    if (!this.searchDropdown) return;
    if (!query && document.activeElement !== this.searchInput) {
      this.closeSearchDropdown();
      return;
    }

    this.searchDropdown.style.display = "flex";
    this.searchDropdown.innerHTML = "";

    const header = document.createElement("div");
    header.className = "search-dropdown-header";
    header.innerHTML = `
      <span>SOLVED PROBLEMS (${matches.length})</span>
      <span style="font-size: 10px; color: #94a3b8;">Press [Enter] to open</span>
    `;
    this.searchDropdown.appendChild(header);

    if (matches.length === 0) {
      const empty = document.createElement("div");
      empty.className = "search-dropdown-empty";
      empty.innerHTML = `No problems matching "<strong>${this.escapeCode(query)}</strong>" found.<br><span style="font-size: 11px; color: var(--color-gold);">Solved today: LC-1, LC-217, LC-242</span>`;
      this.searchDropdown.appendChild(empty);
      return;
    }

    matches.forEach((p, idx) => {
      const item = document.createElement("div");
      item.className = `search-dropdown-item ${idx === 0 ? 'selected' : ''}`;
      const pat = this.patterns[p.patternId];
      const patName = pat ? pat.name : "DSA Pattern";

      item.innerHTML = `
        <div class="search-item-left">
          <span class="search-item-num">#${p.lcNumber}</span>
          <div>
            <div class="search-item-title">${p.title}</div>
            <div class="search-item-pattern">${pat ? pat.icon + ' ' : ''}${patName}</div>
          </div>
        </div>
        <div class="search-item-right">
          <span class="search-item-diff ${(p.difficulty || 'Easy').toLowerCase()}">${p.difficulty || 'Easy'}</span>
          <a href="${p.lcUrl}" target="_blank" rel="noopener noreferrer" class="search-item-lc-link" title="Open ${p.title} on official LeetCode" onclick="event.stopPropagation();">
            LeetCode ↗
          </a>
        </div>
      `;

      item.addEventListener("click", () => {
        this.loadProblem(p.id);
        this.switchView("studio");
        this.closeSearchDropdown();
      });

      this.searchDropdown.appendChild(item);
    });
  }

  handleSearchEnter(query) {
    const q = (query || "").trim().toLowerCase();
    const matches = this.problems.filter(p => {
      if (!q) return true;
      const numMatch = p.lcNumber.toString().includes(q) || `lc-${p.lcNumber}`.includes(q) || `#${p.lcNumber}`.includes(q);
      const titleMatch = p.title.toLowerCase().includes(q);
      const tagMatch = p.tags && p.tags.some(t => t.toLowerCase().includes(q));
      return numMatch || titleMatch || tagMatch;
    });

    if (matches.length > 0) {
      this.loadProblem(matches[0].id);
      this.switchView("studio");
      this.closeSearchDropdown();
      if (this.searchInput) this.searchInput.blur();
    }
  }

  closeSearchDropdown() {
    if (this.searchDropdown) {
      this.searchDropdown.style.display = "none";
    }
  }

  renderSheetView() {
    if (!this.sheetView) return;
    this.sheetView.innerHTML = "";

    const activePatterns = this.currentPatternId === "all"
      ? Object.values(this.patterns)
      : [this.patterns[this.currentPatternId]];

    const container = document.createElement("div");
    container.className = "sheet-container";

    // Hero box header for the cheat sheet
    const heroHeader = document.createElement("div");
    heroHeader.className = "sheet-hero-header";
    heroHeader.innerHTML = `
      <div class="sheet-hero-info">
        <div class="sheet-hero-badge">
          <span>📑</span> Infographic Knowledge Base
        </div>
        <h2 class="sheet-hero-title">DSA Master <span class="accent-gold">Cheat Sheet</span></h2>
        <p class="sheet-hero-subtitle">
          Core mental models, optimal lookup patterns, and side-by-side complexity breakdowns for fast interview recall.
        </p>
      </div>
      <div class="sheet-hero-stats">
        <div class="sheet-stat-pill">
          <span class="stat-icon">👑</span>
          <div>
            <div class="stat-val">${this.problems.length} Solved</div>
            <div class="stat-lbl">Hand-Crafted</div>
          </div>
        </div>
        <div class="sheet-stat-pill">
          <span class="stat-icon">⚡</span>
          <div>
            <div class="stat-val">O(n²) ➔ O(n)</div>
            <div class="stat-lbl">Hash Speedups</div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(heroHeader);

    activePatterns.forEach(pat => {
      const patternProblems = this.problems.filter(p => p.patternId === pat.id);
      if (patternProblems.length === 0) return;

      const block = document.createElement("div");
      block.className = "sheet-pattern-block";

      block.innerHTML = `
        <div class="sheet-block-header">
          <div class="sheet-block-left">
            <div class="sheet-block-title">${pat.icon} ${pat.name}</div>
            <div class="sheet-block-tagline">${pat.tagline}</div>
          </div>
          <div class="sheet-block-count">
            <span class="sheet-count-badge">${patternProblems.length} Problems</span>
          </div>
        </div>

        <div class="sheet-cards-grid">
          ${patternProblems.map(p => `
            <div class="sheet-problem-card" data-id="${p.id}" title="Click to launch interactive visualizer in Studio">
              <div class="sheet-card-top">
                <span class="problem-number-badge">LC #${p.lcNumber}</span>
                <span class="sheet-card-title">${p.title}</span>
                <span class="difficulty-pill diff-${p.difficulty.toLowerCase()}">${p.difficulty}</span>
                <a href="${p.lcUrl}" target="_blank" rel="noopener noreferrer" class="sheet-lc-link" title="Open official LeetCode problem" onclick="event.stopPropagation()">
                  LeetCode ↗
                </a>
              </div>

              ${p.tags && p.tags.length ? `
                <div class="sheet-card-tags">
                  ${p.tags.map(t => `<span class="sheet-tag-chip">${t}</span>`).join("")}
                </div>
              ` : ""}

              <div class="sheet-prompt-box">
                <div class="sheet-prompt-label">PROBLEM STATEMENT</div>
                <div class="sheet-prompt-text">${p.prompt}</div>
              </div>

              ${p.intuition ? `
                <div class="sheet-intuition-box">
                  <div class="sheet-intuition-label">💡 CORE INTUITION</div>
                  <div class="sheet-intuition-text">${p.intuition}</div>
                </div>
              ` : ""}

              <div class="sheet-mini-comparison">
                <div class="mini-box mini-box-brute">
                  <div class="mini-badge-title">
                    <span>⚠️</span> Brute Force
                  </div>
                  <div class="mini-complexity">${p.bruteForce.timeComplexity} Time • ${p.bruteForce.spaceComplexity || "O(1)"} Space</div>
                  <div class="mini-desc">${p.bruteForce.name}</div>
                </div>

                <div class="mini-box mini-box-optimal">
                  <div class="mini-badge-title">
                    <span>⚡</span> Optimal Solution
                  </div>
                  <div class="mini-complexity">${p.optimal.timeComplexity} Time • ${p.optimal.spaceComplexity || "O(n)"} Space</div>
                  <div class="mini-desc">${p.optimal.name}</div>
                </div>
              </div>

              <div class="sheet-card-action">
                <span>Open in Visualizer Studio</span>
                <span class="action-arrow">➔</span>
              </div>
            </div>
          `).join("")}
        </div>

        <div class="sheet-footer-punchline">
          <span class="punchline-icon">💡</span>
          <div class="punchline-content">
            <span class="punchline-heading">Key Pattern Takeaway:</span>
            <span class="punchline-text">${pat.punchline}</span>
          </div>
        </div>
      `;

      block.querySelectorAll(".sheet-problem-card").forEach(card => {
        card.addEventListener("click", () => {
          this.loadProblem(card.dataset.id);
          this.switchView("studio");
        });
      });

      container.appendChild(block);
    });

    this.sheetView.appendChild(container);
  }
}

// Auto start when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.app = new DSAApp();
  });
} else {
  window.app = new DSAApp();
}
