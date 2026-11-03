/**
 * ============================================================================
 * MYSTERYBOX CORE INVESTIGATION JAVASCRIPT ENGINE (MULTI-CASE SUPPORT)
 * ============================================================================
 * Supports multiple mystery cases (Case 01, Case 02, Case 03, Case 04, Demo Case).
 * Handles investigation state, live timer, clues, evidence, suspects, timeline,
 * corkboard graph, and final solution validation per case.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    var casesModule = require('./cases.js');
    module.exports = factory(casesModule);
  } else {
    root.MysteryBox = factory(root.MysteryCases);
  }
})(typeof self !== 'undefined' ? self : this, function (MysteryCases) {
  'use strict';

  // Ensure Cases database is loaded
  if (!MysteryCases && typeof require === 'function') {
    try {
      MysteryCases = require('./cases.js');
    } catch (e) {}
  }

  // Active Case Manager
  var DEFAULT_CASE_ID = 'case1';
  var currentInMemoryCaseId = DEFAULT_CASE_ID;

  function getActiveCaseId() {
    try {
      if (typeof localStorage !== 'undefined') {
        var saved = localStorage.getItem('mb_active_case_id');
        if (saved) return saved;
      }
      return currentInMemoryCaseId || DEFAULT_CASE_ID;
    } catch (e) {
      return currentInMemoryCaseId || DEFAULT_CASE_ID;
    }
  }

  function setActiveCaseId(caseId) {
    currentInMemoryCaseId = caseId;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('mb_active_case_id', caseId);
      }
    } catch (e) {}
  }

  function getActiveCase() {
    var id = getActiveCaseId();
    if (MysteryCases && MysteryCases.CASES && MysteryCases.CASES[id]) {
      return MysteryCases.CASES[id];
    }
    if (MysteryCases && MysteryCases.CASES) {
      return MysteryCases.CASES['case1'] || Object.values(MysteryCases.CASES)[0];
    }
    return null;
  }

  // Helper safe storage methods
  function getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function setItem(key, val) {
    try {
      localStorage.setItem(key, val);
    } catch (e) {}
  }

  function removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }

  // Storage key helper scoped to active case
  function caseKey(suffix) {
    return 'mb_' + getActiveCaseId() + '_' + suffix;
  }

  // ==========================================================================
  // SECTION 1: 📝 DETECTIVE NOTES (PER-CASE STORAGE)
  // ==========================================================================
  var Notes = {
    getNotes: function (specificCaseId) {
      var cid = specificCaseId || getActiveCaseId();
      return getItem('mb_' + cid + '_notes') || getItem('mb_detective_notes') || '';
    },

    saveNotes: function (text, specificCaseId) {
      var cid = specificCaseId || getActiveCaseId();
      setItem('mb_' + cid + '_notes', text);
      setItem('mb_detective_notes', text);
    },

    clearNotes: function (specificCaseId) {
      var cid = specificCaseId || getActiveCaseId();
      removeItem('mb_' + cid + '_notes');
    },

    appendTimestampedNote: function (extraText) {
      var current = Notes.getNotes();
      var timeSecs = State.getElapsedSeconds();
      var timeStr = State.formatTime(timeSecs);
      var line = '[' + timeStr + '] ' + (extraText || 'Note added.') + '\n';
      var updated = current ? (current + '\n' + line) : line;
      Notes.saveNotes(updated);
      return updated;
    }
  };

  // ==========================================================================
  // SECTION 2: STATE MANAGER (SCOPED TO ACTIVE CASE)
  // ==========================================================================
  var State = {
    // Check if clue N of current case is solved
    isClueSolved: function (clueNum, specificCaseId) {
      var cid = specificCaseId || getActiveCaseId();
      if (cid === 'demo') {
        if (getItem('clue' + clueNum + '_solved') === 'true') return true;
      }
      return getItem('mb_' + cid + '_clue' + clueNum + '_solved') === 'true';
    },

    // Mark clue N solved
    markClueSolved: function (clueNum, specificCaseId) {
      var cid = specificCaseId || getActiveCaseId();
      setItem('mb_' + cid + '_clue' + clueNum + '_solved', 'true');
      if (cid === 'demo') {
        setItem('clue' + clueNum + '_solved', 'true');
      }
      State.recordAttempt(true);
      State.ensureTimerRunning();
    },

    // Reset a single clue
    resetClue: function (clueNum, specificCaseId) {
      var cid = specificCaseId || getActiveCaseId();
      removeItem('mb_' + cid + '_clue' + clueNum + '_solved');
      if (cid === 'demo') {
        removeItem('clue' + clueNum + '_solved');
      }
    },

    // Solved clues count for a case
    getSolvedCount: function (specificCaseId) {
      var c = specificCaseId ? (MysteryCases.CASES[specificCaseId] || getActiveCase()) : getActiveCase();
      if (!c || !c.clues) return 0;
      var count = 0;
      for (var i = 1; i <= c.clues.length; i++) {
        if (State.isClueSolved(i, c.id)) count++;
      }
      return count;
    },

    // Total clues for current case
    getTotalClues: function (specificCaseId) {
      var c = specificCaseId ? (MysteryCases.CASES[specificCaseId] || getActiveCase()) : getActiveCase();
      return (c && c.clues) ? c.clues.length : 5;
    },

    areAllCluesSolved: function (specificCaseId) {
      var total = State.getTotalClues(specificCaseId);
      return State.getSolvedCount(specificCaseId) === total;
    },

    // Timer management (scoped per case)
    ensureTimerRunning: function () {
      if (State.isCaseClosed()) return;
      var startKey = caseKey('timer_start');
      if (!getItem(startKey)) {
        setItem(startKey, Date.now().toString());
        setItem(caseKey('timer_running'), 'true');
      }
    },

    getElapsedSeconds: function () {
      var startKey = caseKey('timer_start');
      var elapsedKey = caseKey('timer_elapsed');
      var startTime = parseInt(getItem(startKey), 10);
      var savedElapsed = parseInt(getItem(elapsedKey) || '0', 10);
      if (!startTime) return savedElapsed;
      if (State.isCaseClosed() || getItem(caseKey('timer_running')) === 'false') {
        return savedElapsed;
      }
      var now = Date.now();
      return Math.floor((now - startTime) / 1000);
    },

    formatTime: function (totalSeconds) {
      var s = totalSeconds || 0;
      var mins = Math.floor(s / 60);
      var secs = s % 60;
      var pad = function (num) {
        return num < 10 ? '0' + num : num.toString();
      };
      return pad(mins) + ':' + pad(secs);
    },

    stopTimer: function () {
      var elapsed = State.getElapsedSeconds();
      setItem(caseKey('timer_elapsed'), elapsed.toString());
      setItem(caseKey('timer_running'), 'false');
    },

    // Accuracy Score
    recordAttempt: function (isCorrect) {
      var totalKey = caseKey('attempts_total');
      var corrKey = caseKey('attempts_correct');
      var total = parseInt(getItem(totalKey) || '0', 10) + 1;
      setItem(totalKey, total.toString());
      if (isCorrect) {
        var correct = parseInt(getItem(corrKey) || '0', 10) + 1;
        setItem(corrKey, correct.toString());
      }
    },

    getAccuracy: function () {
      var total = parseInt(getItem(caseKey('attempts_total')) || '0', 10);
      var correct = parseInt(getItem(caseKey('attempts_correct')) || '0', 10);
      if (total === 0) return 100;
      var acc = Math.round((correct / total) * 100);
      return Math.min(100, Math.max(30, acc));
    },

    isCaseClosed: function (specificCaseId) {
      var cid = specificCaseId || getActiveCaseId();
      return getItem('mb_' + cid + '_closed') === 'true';
    },

    closeCase: function (reportDetails) {
      State.stopTimer();
      var cid = getActiveCaseId();
      setItem('mb_' + cid + '_closed', 'true');
      if (reportDetails) {
        setItem('mb_' + cid + '_final_report', JSON.stringify(reportDetails));
      }
    },

    getFinalReport: function (specificCaseId) {
      var cid = specificCaseId || getActiveCaseId();
      var raw = getItem('mb_' + cid + '_final_report');
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    },

    resetActiveCase: function () {
      var c = getActiveCase();
      if (!c) return;
      for (var i = 1; i <= c.clues.length; i++) {
        removeItem('mb_' + c.id + '_clue' + i + '_solved');
        if (c.id === 'demo') removeItem('clue' + i + '_solved');
      }
      removeItem(caseKey('timer_start'));
      removeItem(caseKey('timer_elapsed'));
      removeItem(caseKey('timer_running'));
      removeItem(caseKey('attempts_total'));
      removeItem(caseKey('attempts_correct'));
      removeItem(caseKey('closed'));
      removeItem(caseKey('final_report'));
      removeItem(caseKey('notes'));
    },

    resetAll: function () {
      if (MysteryCases && MysteryCases.CASES) {
        Object.keys(MysteryCases.CASES).forEach(function (cid) {
          for (var i = 1; i <= 10; i++) {
            removeItem('mb_' + cid + '_clue' + i + '_solved');
            removeItem('clue' + i + '_solved');
          }
          removeItem('mb_' + cid + '_timer_start');
          removeItem('mb_' + cid + '_timer_elapsed');
          removeItem('mb_' + cid + '_timer_running');
          removeItem('mb_' + cid + '_attempts_total');
          removeItem('mb_' + cid + '_attempts_correct');
          removeItem('mb_' + cid + '_closed');
          removeItem('mb_' + cid + '_final_report');
          removeItem('mb_' + cid + '_notes');
        });
      }
      removeItem('mb_active_case_id');
      removeItem('mb_detective_notes');
    }
  };

  // ==========================================================================
  // SECTION 3: USER INTERFACE COMPONENTS
  // ==========================================================================
  var UI = {
    renderTopBar: function (opts) {
      opts = opts || {};
      var activeClueId = opts.activeClueId || 0;
      var activeCase = getActiveCase();
      var totalClues = activeCase ? activeCase.clues.length : 5;
      var solvedCount = State.getSolvedCount();
      var elapsed = State.getElapsedSeconds();
      var timeStr = State.formatTime(elapsed);
      var isCluePage = !!opts.isCluePage;
      var rootPath = isCluePage ? '../' : '';

      // Build stepper for active case's clues
      var stepperHtml = '<div class="mb-stepper">';
      for (var i = 1; i <= totalClues; i++) {
        var isSolved = State.isClueSolved(i);
        var isCurrent = activeClueId === i;
        var stepCls = 'mb-step';
        if (isSolved) stepCls += ' is-solved';
        if (isCurrent) stepCls += ' is-active';

        stepperHtml += '<a href="' + rootPath + 'index.html#clues" class="' + stepCls + '" title="Clue ' + i + '">';
        stepperHtml += '<span class="mb-step-num">' + (isSolved ? '✓' : i) + '</span>';
        stepperHtml += '<span class="mb-step-name">Clue ' + i + '</span>';
        stepperHtml += '</a>';
        if (i < totalClues) stepperHtml += '<span class="mb-step-line' + (isSolved ? ' is-done' : '') + '"></span>';
      }
      stepperHtml += '</div>';

      var bar = document.createElement('div');
      bar.className = 'mb-topbar';
      bar.innerHTML = [
        '<div class="mb-topbar-inner">',
        '  <div class="mb-topbar-brand">',
        '    <a href="' + rootPath + 'index.html" class="mb-topbar-logo">🔍 Mystery<span>Box</span></a>',
        '    <span class="mb-case-badge" id="topbarCaseBadge">' + (activeCase ? activeCase.badge : 'ACTIVE CASE') + '</span>',
        '  </div>',
        stepperHtml,
        '  <div class="mb-topbar-meta">',
        '    <div class="mb-timer-display" id="mbTimerDisplay" title="Investigation Stopwatch">⏱️ <span id="mbTimerVal">' + timeStr + '</span></div>',
        '    <div class="mb-progress-counter" title="Solved Clues">🔎 <strong>' + solvedCount + '/' + totalClues + '</strong></div>',
        '    <a href="' + rootPath + 'index.html#cases" class="btn btn-outline" style="padding:4px 10px; font-size:0.75rem; border-color:#e2e8f0; color:#ecf0f1;">🗂️ Switch Case</a>',
        '  </div>',
        '</div>'
      ].join('\n');

      return bar;
    },

    startTimerTicker: function () {
      State.ensureTimerRunning();
      var timerEl = document.getElementById('mbTimerVal');
      if (!timerEl) return;
      setInterval(function () {
        var el = document.getElementById('mbTimerVal');
        if (el) {
          el.textContent = State.formatTime(State.getElapsedSeconds());
        }
      }, 1000);
    },

    mountNotesWidget: function () {
      if (document.getElementById('mbNotesWidget')) return;

      var container = document.createElement('div');
      container.className = 'mb-notes-widget';
      container.id = 'mbNotesWidget';

      container.innerHTML = [
        '<div class="mb-notes-panel" id="mbNotesPanel">',
        '  <div class="mb-notes-header">',
        '    <span>📝 Detective Case Notes</span>',
        '    <button class="mb-notes-close-btn" id="mbNotesCloseBtn" title="Close Notes">&times;</button>',
        '  </div>',
        '  <div class="mb-notes-toolbar">',
        '    <div>',
        '      <button class="mb-notes-tool-btn" id="mbNotesTimeBtn">⏱️ Insert Time</button>',
        '      <button class="mb-notes-tool-btn" id="mbNotesClearBtn">🗑️ Clear</button>',
        '    </div>',
        '    <span class="mb-notes-status" id="mbNotesStatus">Saved ✓</span>',
        '  </div>',
        '  <textarea class="mb-notes-textarea" id="mbNotesTextarea" placeholder="Jot down suspect alibis, timestamps, inconsistencies, and clues here... (Auto-saves as you type)"></textarea>',
        '</div>',
        '<button class="mb-notes-fab" id="mbNotesFab">📝 Case Notes</button>'
      ].join('\n');

      document.body.appendChild(container);

      var fab = document.getElementById('mbNotesFab');
      var panel = document.getElementById('mbNotesPanel');
      var closeBtn = document.getElementById('mbNotesCloseBtn');
      var textarea = document.getElementById('mbNotesTextarea');
      var statusEl = document.getElementById('mbNotesStatus');
      var timeBtn = document.getElementById('mbNotesTimeBtn');
      var clearBtn = document.getElementById('mbNotesClearBtn');

      textarea.value = Notes.getNotes();

      fab.addEventListener('click', function () {
        panel.classList.toggle('is-open');
        if (panel.classList.contains('is-open')) {
          textarea.focus();
        }
      });

      closeBtn.addEventListener('click', function () {
        panel.classList.remove('is-open');
      });

      textarea.addEventListener('input', function () {
        Notes.saveNotes(textarea.value);
        statusEl.textContent = 'Saving...';
        setTimeout(function () {
          statusEl.textContent = 'Saved ✓';
        }, 300);

        var pageTextarea = document.getElementById('dashboardNotesTextarea');
        if (pageTextarea && pageTextarea !== textarea) {
          pageTextarea.value = textarea.value;
        }
      });

      timeBtn.addEventListener('click', function () {
        var elapsed = State.getElapsedSeconds();
        var timeStr = State.formatTime(elapsed);
        var tag = '\n[' + timeStr + '] ';
        textarea.value += tag;
        textarea.focus();
        Notes.saveNotes(textarea.value);
      });

      clearBtn.addEventListener('click', function () {
        if (confirm('Clear detective notes for this case?')) {
          textarea.value = '';
          Notes.clearNotes();
          statusEl.textContent = 'Cleared';
          var pageTextarea = document.getElementById('dashboardNotesTextarea');
          if (pageTextarea) pageTextarea.value = '';
        }
      });
    }
  };

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        UI.mountNotesWidget();
      });
    } else {
      UI.mountNotesWidget();
    }
  }

  // Dynamic getters so property access refers to active case
  var MB = {
    MysteryCases: MysteryCases,
    getActiveCase: getActiveCase,
    getActiveCaseId: getActiveCaseId,
    setActiveCaseId: setActiveCaseId,
    State: State,
    Notes: Notes,
    UI: UI
  };

  Object.defineProperty(MB, 'CLUES', {
    get: function () {
      var c = getActiveCase();
      return c ? c.clues : [];
    }
  });

  Object.defineProperty(MB, 'EVIDENCE', {
    get: function () {
      var c = getActiveCase();
      return c ? c.evidence : [];
    }
  });

  Object.defineProperty(MB, 'SUSPECTS', {
    get: function () {
      var c = getActiveCase();
      return c ? c.suspects : [];
    }
  });

  Object.defineProperty(MB, 'TIMELINE_EVENTS', {
    get: function () {
      var c = getActiveCase();
      return c ? c.timeline : [];
    }
  });

  Object.defineProperty(MB, 'CORKBOARD_NODES', {
    get: function () {
      var c = getActiveCase();
      return c ? c.corkboardNodes : [];
    }
  });

  Object.defineProperty(MB, 'CORKBOARD_LINKS', {
    get: function () {
      var c = getActiveCase();
      return c ? c.corkboardLinks : [];
    }
  });

  return MB;
});
