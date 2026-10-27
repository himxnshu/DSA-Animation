/**
 * Visualizer Engine
 * Renders interactive visualizations for Brute Force vs Optimal approaches.
 * Includes SVG dynamic arcs, array cells, hash maps, sets, 26-slot frequency boards,
 * water containers, stacks, and binary search ranges.
 */

class VisualizerEngine {
  constructor() {
    this.bruteCanvas = document.getElementById("brute-canvas");
    this.optimalCanvas = document.getElementById("optimal-canvas");
  }

  /**
   * Main entry to render a step for a given problem
   */
  render(problem, bruteStep, optimalStep) {
    if (bruteStep) {
      this.renderBruteStep(problem, bruteStep);
    }
    if (optimalStep) {
      this.renderOptimalStep(problem, optimalStep);
    }
  }

  // =========================================================================
  // BRUTE FORCE RENDERERS
  // =========================================================================
  renderBruteStep(problem, step) {
    if (!this.bruteCanvas) return;
    this.bruteCanvas.innerHTML = "";

    const container = document.createElement("div");
    container.className = "vis-inner-container";

    switch (problem.id) {
      case "lc-1":
      case "lc-217":
      case "lc-167":
        this.renderArrayArcs(container, step, "brute");
        break;
      case "lc-11":
        this.renderWaterContainer(container, step, "brute");
        break;
      case "lc-15":
        this.renderThreeSumBoxes(container, step, "brute");
        break;
      case "lc-20":
        this.renderStringReplacement(container, step);
        break;
      case "lc-121":
        this.renderStockBars(container, step, "brute");
        break;
      case "lc-125":
        this.renderPalindromeBrute(container, step);
        break;
      case "lc-242":
        this.renderAnagramBrute(container, step);
        break;
      case "lc-49":
        this.renderGroupAnagramsBrute(container, step);
        break;
      case "lc-128":
        this.renderLongestConsecutiveBrute(container, step);
        break;
      case "lc-238":
        this.renderProductExceptSelfBrute(container, step);
        break;
      case "lc-704":
        this.renderLinearSearch(container, step);
        break;
      case "lc-75":
        this.renderSortColorsBrute(container, step);
        break;
      case "lc-739":
        this.renderDailyTemperaturesBrute(container, step);
        break;
      default:
        this.renderGenericBrute(container, step);
    }

    this.bruteCanvas.appendChild(container);
  }

  // =========================================================================
  // OPTIMAL RENDERERS
  // =========================================================================
  renderOptimalStep(problem, step) {
    if (!this.optimalCanvas) return;
    this.optimalCanvas.innerHTML = "";

    const container = document.createElement("div");
    container.className = "vis-inner-container";

    switch (problem.id) {
      case "lc-1":
        this.renderTwoSumOptimal(container, step);
        break;
      case "lc-11":
        this.renderWaterContainer(container, step, "optimal");
        break;
      case "lc-15":
        this.renderThreeSumBoxes(container, step, "optimal");
        break;
      case "lc-20":
        this.renderStackVisual(container, step);
        break;
      case "lc-49":
        this.renderGroupAnagramsOptimal(container, step);
        break;
      case "lc-128":
        this.renderLongestConsecutiveOptimal(container, step);
        break;
      case "lc-238":
        this.renderProductExceptSelfOptimal(container, step);
        break;
      case "lc-75":
        this.renderSortColorsOptimal(container, step);
        break;
      case "lc-121":
        this.renderStockBars(container, step, "optimal");
        break;
      case "lc-125":
        this.renderPalindromeOptimal(container, step);
        break;
      case "lc-167":
        this.renderTwoPointersOptimal(container, step);
        break;
      case "lc-217":
        this.renderSetOptimal(container, step);
        break;
      case "lc-242":
        this.renderFrequencyArrayOptimal(container, step);
        break;
      case "lc-704":
        this.renderBinarySearchOptimal(container, step);
        break;
      case "lc-739":
        this.renderDailyTemperaturesOptimal(container, step);
        break;
      default:
        this.renderGenericOptimal(container, step);
    }

    this.optimalCanvas.appendChild(container);
  }

  // -------------------------------------------------------------------------
  // ARRAY WITH ARCS (LC-1, LC-217, etc.)
  // -------------------------------------------------------------------------
  renderArrayArcs(container, step, mode) {
    const wrapper = document.createElement("div");
    wrapper.className = "array-arcs-wrapper";

    const nums = step.nums || step.numbers || [];
    const arrayRow = document.createElement("div");
    arrayRow.className = "array-row";
    arrayRow.id = `${mode}-array-row`;

    nums.forEach((val, idx) => {
      const cell = document.createElement("div");
      cell.className = "array-cell";
      cell.id = `${mode}-cell-${idx}`;

      const isI = step.i === idx;
      const isJ = step.j === idx;
      const isMatch = step.isMatch || step.isDup || (step.type === "done" && step.result && step.result.includes(idx));

      if (isMatch) {
        cell.classList.add("matched");
      } else if (isI) {
        cell.classList.add("active-i");
      } else if (isJ) {
        cell.classList.add("active-j");
      }

      cell.innerHTML = `
        <span class="val">${val}</span>
        <span class="idx">${idx}</span>
        ${isI ? '<span class="pointer-tag tag-i">i</span>' : ''}
        ${isJ ? '<span class="pointer-tag tag-j">j</span>' : ''}
      `;
      arrayRow.appendChild(cell);
    });

    // SVG arc layer over the cells
    const svgOverlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgOverlay.setAttribute("class", "arcs-svg");
    svgOverlay.id = `${mode}-arcs-svg`;

    wrapper.appendChild(svgOverlay);
    wrapper.appendChild(arrayRow);
    container.appendChild(wrapper);

    // After elements are in DOM, calculate arc coordinates
    setTimeout(() => {
      this.drawSvgArc(svgOverlay, arrayRow, step.i, step.j, step.isMatch || step.isDup);
    }, 10);

    // Info badge
    const infoBadge = document.createElement("div");
    infoBadge.className = "step-stats-badge";
    if (step.checks !== undefined) {
      infoBadge.innerHTML = `<span>Pair Checks: <b>${step.checks}</b></span> ${step.currentSum !== undefined ? `<span>Current Sum: <b>${step.currentSum}</b></span>` : ''}`;
      container.appendChild(infoBadge);
    }
  }

  drawSvgArc(svg, row, i, j, isMatch) {
    if (!svg || !row || i === undefined || j === undefined || i < 0 || j < 0) return;
    svg.innerHTML = "";

    const cellI = row.querySelector(`#brute-cell-${i}`) || row.children[i];
    const cellJ = row.querySelector(`#brute-cell-${j}`) || row.children[j];
    if (!cellI || !cellJ) return;

    const rowRect = row.getBoundingClientRect();
    const rectI = cellI.getBoundingClientRect();
    const rectJ = cellJ.getBoundingClientRect();

    const x1 = rectI.left + rectI.width / 2 - rowRect.left;
    const x2 = rectJ.left + rectJ.width / 2 - rowRect.left;
    const y = 35; // Top baseline

    const distance = Math.abs(x2 - x1);
    const arcHeight = Math.min(30 + distance * 0.25, 60);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = `M ${x1} ${y} Q ${(x1 + x2) / 2} ${y - arcHeight} ${x2} ${y}`;
    path.setAttribute("d", d);
    path.setAttribute("class", isMatch ? "arc-line match" : "arc-line");
    svg.appendChild(path);

    // Indicator bubble in the middle of arc
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", (x1 + x2) / 2);
    text.setAttribute("y", y - arcHeight + 6);
    text.setAttribute("class", "arc-text");
    text.textContent = isMatch ? "✓ MATCH" : "vs";
    svg.appendChild(text);
  }

  // -------------------------------------------------------------------------
  // TWO SUM OPTIMAL (LC-1)
  // -------------------------------------------------------------------------
  renderTwoSumOptimal(container, step) {
    const nums = step.nums || [];

    // Array Row
    const arrayRow = document.createElement("div");
    arrayRow.className = "array-row";

    nums.forEach((val, idx) => {
      const cell = document.createElement("div");
      cell.className = "array-cell";

      const isCurrent = step.idx === idx;
      const isMatched = (step.type === "done" && (step.idx === idx || step.matchedIdx === idx));

      if (isMatched) {
        cell.classList.add("matched");
      } else if (isCurrent) {
        cell.classList.add("active-optimal");
      }

      cell.innerHTML = `
        <span class="val">${val}</span>
        <span class="idx">${idx}</span>
        ${isCurrent ? '<span class="pointer-tag tag-opt">current</span>' : ''}
        ${isMatched ? '<span class="pointer-tag tag-match">✓</span>' : ''}
      `;
      arrayRow.appendChild(cell);
    });

    container.appendChild(arrayRow);

    // Target and Complement Card
    const formulaCard = document.createElement("div");
    formulaCard.className = "formula-card";
    if (step.currentVal !== undefined) {
      formulaCard.innerHTML = `
        <div class="formula-item">Current: <span class="badge badge-amber">${step.currentVal}</span></div>
        <div class="formula-op">Need (target - current):</div>
        <div class="formula-item"><span class="badge ${step.found ? 'badge-green' : 'badge-slate'}">${step.complement}</span></div>
        <div class="formula-status">${step.found ? '🎉 FOUND IN MAP!' : '🔍 Not yet in map'}</div>
      `;
    } else {
      formulaCard.innerHTML = `<span class="dimmed">Scanning array from left to right...</span>`;
    }
    container.appendChild(formulaCard);

    // Seen Hash Map Display
    const mapContainer = document.createElement("div");
    mapContainer.className = "hashmap-container";
    const mapEntries = Object.entries(step.map || {});

    mapContainer.innerHTML = `
      <div class="hashmap-header">
        <span class="hashmap-title">🗂️ seen Map (num → index):</span>
        <span class="hashmap-size">${mapEntries.length} items</span>
      </div>
      <div class="hashmap-grid">
        ${mapEntries.length === 0 ? '<div class="empty-map-notice">{ } Empty hash map</div>' : ''}
        ${mapEntries.map(([k, v]) => `
          <div class="hashmap-entry ${Number(k) === step.complement ? 'entry-matched' : ''}">
            <span class="hm-key">${k}</span>
            <span class="hm-arrow">→</span>
            <span class="hm-val">${v}</span>
          </div>
        `).join("")}
      </div>
    `;
    container.appendChild(mapContainer);
  }

  // -------------------------------------------------------------------------
  // CONTAINS DUPLICATE OPTIMAL (LC-217)
  // -------------------------------------------------------------------------
  renderSetOptimal(container, step) {
    const nums = step.nums || [];

    const arrayRow = document.createElement("div");
    arrayRow.className = "array-row";

    nums.forEach((val, idx) => {
      const cell = document.createElement("div");
      cell.className = "array-cell";
      const isCurrent = step.idx === idx;
      const isDup = step.alreadyInSet && isCurrent;

      if (isDup) cell.classList.add("matched");
      else if (isCurrent) cell.classList.add("active-optimal");

      cell.innerHTML = `
        <span class="val">${val}</span>
        <span class="idx">${idx}</span>
        ${isCurrent ? '<span class="pointer-tag tag-opt">current</span>' : ''}
      `;
      arrayRow.appendChild(cell);
    });
    container.appendChild(arrayRow);

    // Set View
    const setContainer = document.createElement("div");
    setContainer.className = "hashmap-container";
    const setList = step.set || [];

    setContainer.innerHTML = `
      <div class="hashmap-header">
        <span class="hashmap-title">🛡️ seen Set:</span>
        <span class="hashmap-size">${setList.length} unique elements</span>
      </div>
      <div class="hashmap-grid">
        ${setList.length === 0 ? '<div class="empty-map-notice">Set is empty { }</div>' : ''}
        ${setList.map(v => `
          <div class="set-entry ${v === step.val && step.alreadyInSet ? 'entry-matched' : ''}">
            ${v}
          </div>
        `).join("")}
      </div>
      ${step.alreadyInSet ? `<div class="dup-alert">🚨 Duplicate <b>${step.val}</b> detected immediately! Return True.</div>` : ''}
    `;
    container.appendChild(setContainer);
  }

  // -------------------------------------------------------------------------
  // VALID ANAGRAM OPTIMAL (LC-242) - 26-Slot Frequency Array
  // -------------------------------------------------------------------------
  renderFrequencyArrayOptimal(container, step) {
    const board = document.createElement("div");
    board.className = "freq-board";

    const counts = step.counts || new Array(26).fill(0);
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");

    const grid = document.createElement("div");
    grid.className = "freq-grid";

    letters.forEach((char, idx) => {
      const count = counts[idx];
      const slot = document.createElement("div");
      slot.className = "freq-slot";
      if (count > 0) slot.classList.add("slot-positive");
      else if (count < 0) slot.classList.add("slot-negative");
      else slot.classList.add("slot-zero");

      if (step.charS === char || step.charT === char) {
        slot.classList.add("slot-active");
      }

      slot.innerHTML = `
        <span class="slot-letter">${char}</span>
        <span class="slot-count">${count}</span>
      `;
      grid.appendChild(slot);
    });

    board.appendChild(grid);

    const banner = document.createElement("div");
    banner.className = "freq-status-banner";
    if (step.type === "done") {
      banner.innerHTML = step.isAnagram
        ? '<span class="status-success">✅ Every slot is 0 → Perfectly Valid Anagram!</span>'
        : '<span class="status-fail">❌ Non-zero slot remains → Not an Anagram!</span>';
    } else if (step.charS && step.charT) {
      banner.innerHTML = `Letter from s: <b>+${step.charS}</b> | Letter from t: <b>-${step.charT}</b>`;
    } else {
      banner.textContent = "Scanning both strings simultaneously...";
    }
    board.appendChild(banner);

    container.appendChild(board);
  }

  renderAnagramBrute(container, step) {
    const div = document.createElement("div");
    div.className = "anagram-brute-box";

    if (step.s && step.t) {
      div.innerHTML = `
        <div class="str-line">String s: <span class="str-token">${step.s}</span></div>
        <div class="str-line">String t mutable list:</div>
        <div class="char-tags-row">
          ${(step.remaining || step.t.split("")).map(c => `<span class="char-pill">${c}</span>`).join("")}
        </div>
      `;
    } else if (step.char) {
      div.innerHTML = `
        <div class="str-line">Searching & removing: <span class="badge badge-amber">${step.char}</span></div>
        <div class="char-tags-row">
          ${step.remaining.map(c => `<span class="char-pill">${c}</span>`).join("")}
        </div>
      `;
    }
    container.appendChild(div);
  }

  // -------------------------------------------------------------------------
  // CONTAINER WITH MOST WATER (LC-11)
  // -------------------------------------------------------------------------
  renderWaterContainer(container, step, mode) {
    const heights = step.heights || [];
    const maxH = Math.max(...heights, 10);

    const chart = document.createElement("div");
    chart.className = "water-chart";

    const left = mode === "brute" ? step.i : step.left;
    const right = mode === "brute" ? step.j : step.right;

    heights.forEach((h, idx) => {
      const col = document.createElement("div");
      col.className = "water-col";

      const barHeightPercent = (h / maxH) * 100;
      const isLeft = idx === left;
      const isRight = idx === right;
      const isInWater = left !== undefined && right !== undefined && idx >= left && idx <= right && left < right;

      const bar = document.createElement("div");
      bar.className = "water-bar";
      if (isLeft) bar.classList.add("bar-left");
      if (isRight) bar.classList.add("bar-right");
      bar.style.height = `${barHeightPercent}%`;

      bar.innerHTML = `<span class="bar-val">${h}</span>`;

      col.appendChild(bar);

      const label = document.createElement("div");
      label.className = "col-label";
      label.innerHTML = `
        <span class="col-idx">${idx}</span>
        ${isLeft ? '<span class="pointer-tag tag-l">L</span>' : ''}
        ${isRight ? '<span class="pointer-tag tag-r">R</span>' : ''}
      `;
      col.appendChild(label);
      chart.appendChild(col);
    });

    container.appendChild(chart);

    // Live Metrics Bar
    const metrics = document.createElement("div");
    metrics.className = "water-metrics";
    if (step.width !== undefined && step.minH !== undefined) {
      metrics.innerHTML = `
        <div class="metric-item">Width: <b>${step.width}</b></div>
        <div class="metric-item">Min Height: <b>${step.minH}</b></div>
        <div class="metric-item">Current Area: <b class="highlight-val">${step.currentArea}</b></div>
        <div class="metric-item">Max Area Seen: <b class="max-val">${step.maxArea}</b></div>
      `;
    }
    container.appendChild(metrics);
  }

  // -------------------------------------------------------------------------
  // 3SUM VISUALIZER (LC-15)
  // -------------------------------------------------------------------------
  renderThreeSumBoxes(container, step, mode) {
    const nums = step.nums || [];
    const arrayRow = document.createElement("div");
    arrayRow.className = "array-row";

    nums.forEach((val, idx) => {
      const cell = document.createElement("div");
      cell.className = "array-cell";

      const isI = step.i === idx;
      const isLeft = step.left === idx || (mode === "brute" && step.j === idx);
      const isRight = step.right === idx || (mode === "brute" && step.k === idx);

      if (isI) cell.classList.add("cell-i");
      if (isLeft) cell.classList.add("cell-left");
      if (isRight) cell.classList.add("cell-right");

      cell.innerHTML = `
        <span class="val">${val}</span>
        <span class="idx">${idx}</span>
        ${isI ? '<span class="pointer-tag tag-i">i</span>' : ''}
        ${isLeft ? '<span class="pointer-tag tag-l">L</span>' : ''}
        ${isRight ? '<span class="pointer-tag tag-r">R</span>' : ''}
      `;
      arrayRow.appendChild(cell);
    });

    container.appendChild(arrayRow);

    // Triplets Found Bag
    const bag = document.createElement("div");
    bag.className = "triplets-bag";
    const list = step.triplets || [];
    bag.innerHTML = `
      <div class="triplets-title">Triplets Found (${list.length}):</div>
      <div class="triplets-list">
        ${list.length === 0 ? '<span class="dimmed">No triplets yet</span>' : ''}
        ${list.map(t => `<span class="triplet-chip">[${t.join(", ")}]</span>`).join("")}
      </div>
    `;
    container.appendChild(bag);
  }

  // -------------------------------------------------------------------------
  // VALID PARENTHESES (LC-20) - String Replacement & Dynamic Stack
  // -------------------------------------------------------------------------
  renderStringReplacement(container, step) {
    const box = document.createElement("div");
    box.className = "string-replace-box";
    box.innerHTML = `
      <div class="replace-title">Pass: <b>${step.pass !== undefined ? step.pass : 0}</b></div>
      <div class="current-str-pill">${step.str || "(empty string)"}</div>
    `;
    container.appendChild(box);
  }

  renderStackVisual(container, step) {
    const stackArea = document.createElement("div");
    stackArea.className = "stack-vis-area";

    const stream = document.createElement("div");
    stream.className = "char-stream";
    (step.chars || []).forEach((c, i) => {
      const pill = document.createElement("span");
      pill.className = `stream-pill ${step.idx === i ? 'active' : ''} ${step.idx > i ? 'consumed' : ''}`;
      pill.textContent = c;
      stream.appendChild(pill);
    });
    stackArea.appendChild(stream);

    // The physical Stack
    const stackBucket = document.createElement("div");
    stackBucket.className = "stack-bucket";

    const stackItems = step.stack || [];
    if (stackItems.length === 0) {
      stackBucket.innerHTML = '<div class="stack-empty-label">Stack Empty [ ]</div>';
    } else {
      stackItems.forEach((c, idx) => {
        const item = document.createElement("div");
        item.className = "stack-item";
        item.innerHTML = `<span>${c}</span><span class="stack-idx">#${idx}</span>`;
        stackBucket.prepend(item); // top on top
      });
    }

    stackArea.appendChild(stackBucket);
    container.appendChild(stackArea);
  }

  // -------------------------------------------------------------------------
  // STOCK PRICES (LC-121)
  // -------------------------------------------------------------------------
  renderStockBars(container, step, mode) {
    const prices = step.prices || [];
    const maxP = Math.max(...prices, 10);

    const chart = document.createElement("div");
    chart.className = "stock-chart";

    const buyIdx = mode === "brute" ? step.i : step.minPriceDay;
    const sellIdx = mode === "brute" ? step.j : step.idx;

    prices.forEach((p, idx) => {
      const col = document.createElement("div");
      col.className = "stock-col";

      const hPercent = (p / maxP) * 100;
      const isBuy = idx === buyIdx;
      const isSell = idx === sellIdx;

      const bar = document.createElement("div");
      bar.className = "stock-bar";
      if (isBuy) bar.classList.add("bar-buy");
      if (isSell) bar.classList.add("bar-sell");
      bar.style.height = `${hPercent}%`;
      bar.innerHTML = `<span class="stock-price">$${p}</span>`;
      col.appendChild(bar);

      const label = document.createElement("div");
      label.className = "col-label";
      label.innerHTML = `
        <span class="day-label">D${idx}</span>
        ${isBuy ? '<span class="pointer-tag tag-buy">BUY</span>' : ''}
        ${isSell ? '<span class="pointer-tag tag-sell">SELL</span>' : ''}
      `;
      col.appendChild(label);
      chart.appendChild(col);
    });

    container.appendChild(chart);

    const stats = document.createElement("div");
    stats.className = "stock-stats";
    stats.innerHTML = `
      <div class="stat-pill">Min Price Seen: <b>$${step.minPrice !== undefined ? step.minPrice : '-'}</b></div>
      <div class="stat-pill">Max Profit: <b class="highlight-green">$${step.maxProfit !== undefined ? step.maxProfit : 0}</b></div>
    `;
    container.appendChild(stats);
  }

  // -------------------------------------------------------------------------
  // VALID PALINDROME (LC-125)
  // -------------------------------------------------------------------------
  renderPalindromeBrute(container, step) {
    const box = document.createElement("div");
    box.className = "palindrome-brute-box";
    box.innerHTML = `
      <div class="pal-step">Original: <code>${step.raw || '-'}</code></div>
      ${step.filtered ? `<div class="pal-step">Filtered: <code>${step.filtered}</code></div>` : ''}
      ${step.reversed ? `<div class="pal-step">Reversed: <code>${step.reversed}</code></div>` : ''}
    `;
    container.appendChild(box);
  }

  renderPalindromeOptimal(container, step) {
    const s = step.s || "";
    const row = document.createElement("div");
    row.className = "char-row-pal";

    for (let i = 0; i < s.length; i++) {
      const char = s[i];
      const cell = document.createElement("div");
      cell.className = "pal-cell";

      const isL = step.left === i;
      const isR = step.right === i;

      if (isL) cell.classList.add("cell-left");
      if (isR) cell.classList.add("cell-right");

      cell.innerHTML = `
        <span class="pal-char">${char === " " ? "␣" : char}</span>
        <span class="pal-idx">${i}</span>
        ${isL ? '<span class="pointer-tag tag-l">L</span>' : ''}
        ${isR ? '<span class="pointer-tag tag-r">R</span>' : ''}
      `;
      row.appendChild(cell);
    }
    container.appendChild(row);
  }

  // -------------------------------------------------------------------------
  // TWO SUM II (LC-167)
  // -------------------------------------------------------------------------
  renderTwoPointersOptimal(container, step) {
    const numbers = step.numbers || [];
    const row = document.createElement("div");
    row.className = "array-row";

    numbers.forEach((val, idx) => {
      const cell = document.createElement("div");
      cell.className = "array-cell";

      const isL = step.left === idx;
      const isR = step.right === idx;
      const isMatch = step.type === "match" && (isL || isR);

      if (isMatch) cell.classList.add("matched");
      else if (isL) cell.classList.add("cell-left");
      else if (isR) cell.classList.add("cell-right");

      cell.innerHTML = `
        <span class="val">${val}</span>
        <span class="idx">${idx + 1}</span>
        ${isL ? '<span class="pointer-tag tag-l">L</span>' : ''}
        ${isR ? '<span class="pointer-tag tag-r">R</span>' : ''}
      `;
      row.appendChild(cell);
    });
    container.appendChild(row);

    if (step.sum !== undefined) {
      const sumCard = document.createElement("div");
      sumCard.className = "formula-card";
      sumCard.innerHTML = `
        <div class="formula-item">Sum: <b>${step.sum}</b> vs Target: <b>${step.target}</b></div>
        <div class="formula-status">${step.sum === step.target ? '🎯 MATCH!' : (step.sum < step.target ? 'Too small → Move Left rightwards' : 'Too large → Move Right leftwards')}</div>
      `;
      container.appendChild(sumCard);
    }
  }

  // -------------------------------------------------------------------------
  // GROUP ANAGRAMS (LC-49)
  // -------------------------------------------------------------------------
  renderGroupAnagramsBrute(container, step) {
    const box = document.createElement("div");
    box.className = "groups-display";
    const groups = step.groups || [];
    box.innerHTML = `
      <div class="groups-title">Grouped Anagrams:</div>
      ${groups.map(g => `<div class="group-pill-row">${g.map(w => `<span class="word-tag">${w}</span>`).join("")}</div>`).join("")}
    `;
    container.appendChild(box);
  }

  renderGroupAnagramsOptimal(container, step) {
    const box = document.createElement("div");
    box.className = "groups-display";
    const map = step.map || {};

    box.innerHTML = `
      <div class="groups-title">Signature Hash Map (signature → [words]):</div>
      <div class="signature-grid">
        ${Object.entries(map).map(([sig, words]) => `
          <div class="sig-group-card">
            <div class="sig-header">🔑 Key: <code>"${sig}"</code></div>
            <div class="sig-words">${words.map(w => `<span class="word-tag">${w}</span>`).join("")}</div>
          </div>
        `).join("")}
      </div>
    `;
    container.appendChild(box);
  }

  // -------------------------------------------------------------------------
  // BINARY SEARCH (LC-704)
  // -------------------------------------------------------------------------
  renderLinearSearch(container, step) {
    const nums = step.nums || [];
    const row = document.createElement("div");
    row.className = "array-row";

    nums.forEach((val, idx) => {
      const cell = document.createElement("div");
      cell.className = "array-cell";
      if (idx === step.idx) {
        cell.classList.add(step.isMatch ? "matched" : "active-i");
      }
      cell.innerHTML = `
        <span class="val">${val}</span>
        <span class="idx">${idx}</span>
      `;
      row.appendChild(cell);
    });
    container.appendChild(row);
  }

  renderBinarySearchOptimal(container, step) {
    const nums = step.nums || [];
    const row = document.createElement("div");
    row.className = "array-row";

    nums.forEach((val, idx) => {
      const cell = document.createElement("div");
      cell.className = "array-cell";

      const inRange = step.low !== undefined && step.high !== undefined && idx >= step.low && idx <= step.high;
      const isMid = idx === step.mid;
      const isLow = idx === step.low;
      const isHigh = idx === step.high;
      const isMatch = isMid && val === step.target;

      if (!inRange && step.low !== undefined) {
        cell.classList.add("eliminated");
      } else if (isMatch) {
        cell.classList.add("matched");
      } else if (isMid) {
        cell.classList.add("cell-mid");
      }

      cell.innerHTML = `
        <span class="val">${val}</span>
        <span class="idx">${idx}</span>
        ${isMid ? '<span class="pointer-tag tag-mid">MID</span>' : ''}
        ${isLow ? '<span class="pointer-tag tag-l">LOW</span>' : ''}
        ${isHigh ? '<span class="pointer-tag tag-r">HIGH</span>' : ''}
      `;
      row.appendChild(cell);
    });
    container.appendChild(row);

    if (step.mid !== undefined && step.mid >= 0) {
      const midInfo = document.createElement("div");
      midInfo.className = "formula-card";
      midInfo.innerHTML = `
        <div>low = <b>${step.low}</b>, high = <b>${step.high}</b> → mid = <b>${step.mid}</b> (val = <b>${step.val}</b>)</div>
      `;
      container.appendChild(midInfo);
    }
  }

  // -------------------------------------------------------------------------
  // DAILY TEMPERATURES (LC-739)
  // -------------------------------------------------------------------------
  renderDailyTemperaturesBrute(container, step) {
    const temps = step.temperatures || [];
    const ans = step.ans || [];
    const row = document.createElement("div");
    row.className = "array-row";

    temps.forEach((t, idx) => {
      const cell = document.createElement("div");
      cell.className = "array-cell temp-cell";
      if (idx === step.i) cell.classList.add("active-i");
      if (idx === step.j) cell.classList.add("active-j");

      cell.innerHTML = `
        <span class="val">${t}°</span>
        <span class="idx">Day ${idx}</span>
        <span class="ans-badge">Ans: ${ans[idx]}</span>
      `;
      row.appendChild(cell);
    });
    container.appendChild(row);
  }

  renderDailyTemperaturesOptimal(container, step) {
    const temps = step.temperatures || [];
    const ans = step.ans || [];
    const stack = step.stack || [];

    const row = document.createElement("div");
    row.className = "array-row";

    temps.forEach((t, idx) => {
      const cell = document.createElement("div");
      cell.className = "array-cell temp-cell";
      if (idx === step.currIdx) cell.classList.add("active-optimal");
      if (idx === step.resolvedIdx) cell.classList.add("matched");

      cell.innerHTML = `
        <span class="val">${t}°</span>
        <span class="idx">Day ${idx}</span>
        <span class="ans-badge">Ans: ${ans[idx]}</span>
      `;
      row.appendChild(cell);
    });
    container.appendChild(row);

    // Monotonic Stack Display
    const stackBox = document.createElement("div");
    stackBox.className = "hashmap-container";
    stackBox.innerHTML = `
      <div class="hashmap-header">
        <span class="hashmap-title">📉 Monotonic Decreasing Stack (unresolved day indices):</span>
        <span>${stack.length} days waiting</span>
      </div>
      <div class="stack-items-row">
        ${stack.length === 0 ? '<span class="dimmed">Stack is empty</span>' : ''}
        ${stack.map(idx => `
          <div class="stack-day-chip ${idx === step.resolvedIdx ? 'resolving' : ''}">
            Day ${idx} (${temps[idx]}°)
          </div>
        `).join("")}
      </div>
    `;
    container.appendChild(stackBox);
  }

  // -------------------------------------------------------------------------
  // SORT COLORS (LC-75)
  // -------------------------------------------------------------------------
  renderSortColorsBrute(container, step) {
    const nums = step.nums || [];
    const colorNames = { 0: "Red", 1: "White", 2: "Blue" };
    const colorClasses = { 0: "color-0-red", 1: "color-1-white", 2: "color-2-blue" };

    const row = document.createElement("div");
    row.className = "array-row";

    nums.forEach((val, idx) => {
      const cell = document.createElement("div");
      cell.className = `array-cell sort-color-cell ${colorClasses[val] || ""}`;

      const isI = step.i === idx;
      const isJ = step.j === idx;
      const isSwap = step.type === "swap" && (isI || isJ);

      if (isSwap) cell.classList.add("matched");
      else if (isI) cell.classList.add("active-i");
      else if (isJ) cell.classList.add("active-j");

      cell.innerHTML = `
        <span class="val">${val}</span>
        <span class="idx">${idx}</span>
        <span class="color-tag">${colorNames[val]}</span>
        ${isI ? '<span class="pointer-tag tag-i">i</span>' : ''}
        ${isJ ? '<span class="pointer-tag tag-j">j</span>' : ''}
      `;
      row.appendChild(cell);
    });

    container.appendChild(row);

    const stats = document.createElement("div");
    stats.className = "step-stats-badge";
    stats.innerHTML = `
      <span>Checks: <b>${step.checks !== undefined ? step.checks : 0}</b></span>
      <span>Swaps: <b>${step.swaps !== undefined ? step.swaps : 0}</b></span>
    `;
    container.appendChild(stats);
  }

  renderSortColorsOptimal(container, step) {
    const nums = step.nums || [];
    const colorNames = { 0: "Red", 1: "White", 2: "Blue" };
    const colorClasses = { 0: "color-0-red", 1: "color-1-white", 2: "color-2-blue" };

    const row = document.createElement("div");
    row.className = "array-row";

    nums.forEach((val, idx) => {
      const cell = document.createElement("div");
      cell.className = `array-cell sort-color-cell ${colorClasses[val] || ""}`;

      const isLow = step.low === idx;
      const isMid = step.mid === idx;
      const isHigh = step.high === idx;

      if (isMid) cell.classList.add("cell-mid");
      if (isLow) cell.classList.add("cell-left");
      if (isHigh) cell.classList.add("cell-right");

      cell.innerHTML = `
        <span class="val">${val}</span>
        <span class="idx">${idx}</span>
        <span class="color-tag">${colorNames[val]}</span>
        ${isLow ? '<span class="pointer-tag tag-l">LOW</span>' : ''}
        ${isMid ? '<span class="pointer-tag tag-mid">MID</span>' : ''}
        ${isHigh ? '<span class="pointer-tag tag-r">HIGH</span>' : ''}
      `;
      row.appendChild(cell);
    });

    container.appendChild(row);

    // Dutch National Flag 3-Way Partition Range Visualizer
    const partitionCard = document.createElement("div");
    partitionCard.className = "dnf-partition-bar";
    partitionCard.innerHTML = `
      <div class="dnf-range range-red">
        <span class="dnf-pill pill-red">0s (Red)</span>
        <span class="dnf-bound">[0 .. ${step.low !== undefined ? Math.max(0, step.low - 1) : 0}]</span>
      </div>
      <div class="dnf-range range-white">
        <span class="dnf-pill pill-white">1s (White)</span>
        <span class="dnf-bound">[${step.low !== undefined ? step.low : 0} .. ${step.mid !== undefined ? Math.max(0, step.mid - 1) : 0}]</span>
      </div>
      <div class="dnf-range range-mid">
        <span class="dnf-pill pill-mid">Scanning: mid = ${step.mid !== undefined ? step.mid : 0}</span>
      </div>
      <div class="dnf-range range-blue">
        <span class="dnf-pill pill-blue">2s (Blue)</span>
        <span class="dnf-bound">[${step.high !== undefined ? step.high + 1 : nums.length} .. ${nums.length - 1}]</span>
      </div>
    `;
    container.appendChild(partitionCard);

    const stats = document.createElement("div");
    stats.className = "step-stats-badge";
    stats.innerHTML = `
      <span>Checks: <b>${step.checks !== undefined ? step.checks : 0}</b></span>
      <span>Swaps: <b>${step.swaps !== undefined ? step.swaps : 0}</b></span>
    `;
    container.appendChild(stats);
  }

  // -------------------------------------------------------------------------
  // LONGEST CONSECUTIVE SEQUENCE (LC-128)
  // -------------------------------------------------------------------------
  renderLongestConsecutiveBrute(container, step) {
    const nums = step.nums || [];
    const row = document.createElement("div");
    row.className = "array-row";

    nums.forEach((val, idx) => {
      const cell = document.createElement("div");
      cell.className = "array-cell";
      if (idx === step.activeIdx) cell.classList.add("active-i");
      cell.innerHTML = `
        <span class="val">${val}</span>
        <span class="idx">${idx}</span>
        ${idx === step.activeIdx ? '<span class="pointer-tag tag-i">TEST</span>' : ''}
      `;
      row.appendChild(cell);
    });
    container.appendChild(row);

    const stats = document.createElement("div");
    stats.className = "step-stats-badge";
    stats.innerHTML = `
      <span>Testing Num: <b>${step.currentNum !== undefined ? step.currentNum : "-"}</b></span>
      <span>Current Streak: <b style="color: var(--color-cyan);">${step.streak || 0}</b></span>
      <span>Max Longest: <b style="color: var(--color-gold);">${step.longest || 0}</b></span>
    `;
    container.appendChild(stats);
  }

  renderLongestConsecutiveOptimal(container, step) {
    const setArray = step.setArray || [];
    const setBox = document.createElement("div");
    setBox.className = "hashset-container";

    setBox.innerHTML = `
      <div class="hashset-header">
        <span class="hashset-title">📦 Hash Set (Instant O(1) Lookups):</span>
        <span>Size: ${setArray.length}</span>
      </div>
      <div class="hashset-pills-grid">
        ${setArray.map(val => {
          const isCurrent = step.currentNum === val;
          return `<span class="set-chip ${isCurrent ? 'active' : ''}">${val}</span>`;
        }).join("")}
      </div>
    `;
    container.appendChild(setBox);

    // Sequence chain display
    const chainBox = document.createElement("div");
    chainBox.className = "consecutive-chain-box";
    const chain = step.streakChain || [];

    chainBox.innerHTML = `
      <div class="chain-header">
        <span>Current Streak Sequence:</span>
        <span class="chain-len-badge">Length: <b>${step.length || (chain.length > 0 ? chain.length : 0)}</b></span>
      </div>
      <div class="chain-items-row">
        ${chain.length === 0 
          ? `<span class="dimmed">${step.type === 'skip' ? `⏩ Skipped ${step.currentNum} (${step.currentNum - 1} is already in set)` : 'No active streak chain'}</span>` 
          : chain.map((num, i) => `
            <span class="chain-node ${i === chain.length - 1 ? 'latest' : ''}">${num}</span>
            ${i < chain.length - 1 ? '<span class="chain-arrow">➔</span>' : ''}
          `).join("")}
      </div>
      <div class="global-longest-footer">
        🏆 Global Longest Streak: <b style="color: var(--color-gold); font-size: 16px;">${step.longest || 0}</b>
      </div>
    `;
    container.appendChild(chainBox);
  }

  // -------------------------------------------------------------------------
  // PRODUCT OF ARRAY EXCEPT SELF (LC-238)
  // -------------------------------------------------------------------------
  renderProductExceptSelfBrute(container, step) {
    const nums = step.nums || [];
    const ans = step.ans || [];

    const row = document.createElement("div");
    row.className = "array-row";

    nums.forEach((val, idx) => {
      const cell = document.createElement("div");
      cell.className = "array-cell";
      const isI = step.i === idx;
      const isJ = step.j === idx;

      if (isI) cell.classList.add("active-i");
      else if (isJ) cell.classList.add("active-j");

      cell.innerHTML = `
        <span class="val">${val}</span>
        <span class="idx">${idx}</span>
        ${isI ? '<span class="pointer-tag tag-i" style="background:#ef4444;">EXCLUDE</span>' : ''}
        ${isJ ? '<span class="pointer-tag tag-j">×</span>' : ''}
      `;
      row.appendChild(cell);
    });
    container.appendChild(row);

    const stats = document.createElement("div");
    stats.className = "step-stats-badge";
    stats.innerHTML = `
      <span>Target Index: <b>i = ${step.i !== undefined ? step.i : "-"}</b></span>
      <span>Running Product: <b style="color: var(--color-cyan);">${step.vars?.prod || "-"}</b></span>
    `;
    container.appendChild(stats);

    // Evolving Answer Array
    const ansRow = document.createElement("div");
    ansRow.className = "array-row";
    ansRow.style.marginTop = "14px";
    nums.forEach((_, idx) => {
      const cell = document.createElement("div");
      cell.className = "array-cell";
      const val = ans[idx];
      if (val !== undefined) cell.classList.add("matched");
      cell.innerHTML = `
        <span class="val">${val !== undefined ? val : "?"}</span>
        <span class="idx">ans[${idx}]</span>
      `;
      ansRow.appendChild(cell);
    });
    container.appendChild(ansRow);
  }

  renderProductExceptSelfOptimal(container, step) {
    const nums = step.nums || [];
    const res = step.res || [];

    const passHeader = document.createElement("div");
    passHeader.className = "pass-header-badge";
    passHeader.innerHTML = `<span>🔄 ${step.pass || "Processing"}</span>`;
    container.appendChild(passHeader);

    // Input numbers row
    const row = document.createElement("div");
    row.className = "array-row";

    nums.forEach((val, idx) => {
      const cell = document.createElement("div");
      cell.className = "array-cell";
      const isI = step.i === idx;
      if (isI) cell.classList.add("matched");

      cell.innerHTML = `
        <span class="val">${val}</span>
        <span class="idx">nums[${idx}]</span>
        ${isI ? '<span class="pointer-tag tag-i">i</span>' : ''}
      `;
      row.appendChild(cell);
    });
    container.appendChild(row);

    // Accumulators Bar
    const accumCard = document.createElement("div");
    accumCard.className = "step-stats-badge";
    accumCard.innerHTML = `
      <span>Prefix (Left): <b style="color: #38bdf8;">${step.vars?.["new prefix"] || step.vars?.prefix || "-"}</b></span>
      <span>Postfix (Right): <b style="color: #34d399;">${step.vars?.["new postfix"] || step.vars?.postfix || "-"}</b></span>
    `;
    container.appendChild(accumCard);

    // Result array row
    const resRow = document.createElement("div");
    resRow.className = "array-row";
    resRow.style.marginTop = "14px";

    res.forEach((val, idx) => {
      const cell = document.createElement("div");
      cell.className = "array-cell";
      const isI = step.i === idx;
      if (isI) cell.classList.add("active-i");
      else if (val !== 1 || step.type === "done") cell.classList.add("matched");

      cell.innerHTML = `
        <span class="val">${val}</span>
        <span class="idx">res[${idx}]</span>
      `;
      resRow.appendChild(cell);
    });
    container.appendChild(resRow);
  }

  renderGenericBrute(container, step) {
    container.innerHTML = `<div class="status-callout">${step.status || "Running Brute Force..."}</div>`;
  }

  renderGenericOptimal(container, step) {
    container.innerHTML = `<div class="status-callout">${step.status || "Running Optimal Solution..."}</div>`;
  }
}

window.VisualizerEngine = VisualizerEngine;
